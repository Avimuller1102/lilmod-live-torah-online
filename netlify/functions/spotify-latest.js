const SHOW_ID = "5oJ8bkMtw0hR1iRxomrSRR";

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "public, max-age=900, s-maxage=900",
};

export const handler = async (event) => {
  const limit = Math.min(Number(event.queryStringParameters?.limit || 6), 12);
  const errors = [];

  try {
    const apiEpisodes = await fetchFromSpotifyApi(limit);
    if (apiEpisodes.length > 0) {
      return jsonResponse({ episodes: apiEpisodes, source: "spotify-api" });
    }
  } catch (error) {
    errors.push(error.message || "Spotify API unavailable");
  }

  try {
    const embedEpisodes = await fetchFromSpotifyEmbedToken(limit);
    if (embedEpisodes.length > 0) {
      return jsonResponse({ episodes: embedEpisodes, source: "spotify-embed-token" });
    }
  } catch (error) {
    errors.push(error.message || "Spotify embed token unavailable");
  }

  try {
    const publicEpisodes = await fetchFromPublicSpotifyPage(limit);
    if (publicEpisodes.length > 0) {
      return jsonResponse({ episodes: publicEpisodes, source: "spotify-public-page" });
    }
  } catch (error) {
    errors.push(error.message || "Spotify public page unavailable");
  }

  try {
    const embeddedEpisode = await fetchFromSpotifyOEmbed();
    if (embeddedEpisode) {
      return jsonResponse({ episodes: [embeddedEpisode], source: "spotify-oembed" });
    }
  } catch (error) {
    errors.push(error.message || "Spotify oEmbed unavailable");
  }

  return {
    statusCode: 502,
    headers,
    body: JSON.stringify({
      error: "Unable to load Spotify episodes",
      details: errors,
    }),
  };
};

async function fetchFromSpotifyApi(limit) {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Spotify credentials are not configured");
  }

  const token = await getAccessToken(clientId, clientSecret);
  const response = await fetch(`https://api.spotify.com/v1/shows/${SHOW_ID}/episodes?market=FR&limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Spotify API error: ${response.status}`);
  }

  const data = await response.json();
  return data.items || [];
}

async function getAccessToken(clientId, clientSecret) {
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    throw new Error(`Spotify auth error: ${response.status}`);
  }

  const data = await response.json();
  return data.access_token;
}

async function fetchFromSpotifyEmbedToken(limit) {
  const token = await getEmbedAccessToken();
  const response = await fetch(`https://api.spotify.com/v1/shows/${SHOW_ID}/episodes?market=FR&limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Spotify embed API error: ${response.status}`);
  }

  const data = await response.json();
  return data.items || [];
}

async function getEmbedAccessToken() {
  const response = await fetch(`https://open.spotify.com/embed/show/${SHOW_ID}`, {
    headers: {
      "Accept-Language": "fr-FR,fr;q=0.9,en;q=0.8",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36",
    },
  });

  if (!response.ok) {
    throw new Error(`Spotify embed page error: ${response.status}`);
  }

  const html = await response.text();
  const nextData = matchFirst(html, /<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/);
  if (!nextData) {
    throw new Error("Spotify embed token is missing");
  }

  const data = JSON.parse(nextData);
  const token = data?.props?.pageProps?.state?.settings?.session?.accessToken;
  if (!token) {
    throw new Error("Spotify embed token is empty");
  }

  return token;
}

async function fetchFromPublicSpotifyPage(limit) {
  const response = await fetch(`https://open.spotify.com/show/${SHOW_ID}`, {
    headers: {
      "Accept-Language": "fr-FR,fr;q=0.9,en;q=0.8",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36",
    },
  });

  if (!response.ok) {
    throw new Error(`Spotify public page error: ${response.status}`);
  }

  const html = await response.text();
  const blocks = html
    .match(/data-testid="episode-\d+"[\s\S]*?(?=<hr class=|data-testid="episode-\d+"|<\/main>|$)/g)
    ?.slice(0, limit);

  if (!blocks?.length) {
    throw new Error("Spotify public page contains no parsable episodes");
  }

  return blocks.map(parseEpisodeBlock).filter(Boolean);
}

function parseEpisodeBlock(block) {
  const episodeId = matchFirst(block, /href="\/episode\/([^"?]+)(?:\?[^"]*)?"/);
  const titleHtml = matchFirst(block, /data-testid="episodeTitle"[^>]*>([\s\S]*?)<\/h4>/);
  const imageUrl = matchFirst(block, /<img[^>]+data-testid="entity-image"[^>]+src="([^"]+)"/) || matchFirst(block, /<img[^>]+src="([^"]+)"/);

  if (!episodeId || !titleHtml) {
    return null;
  }

  const afterTitle = block.slice(block.indexOf(titleHtml) + titleHtml.length);
  const descriptionHtml = matchFirst(afterTitle, /<p[^>]*>([\s\S]*?)<\/p>/);
  const releaseDate = findReleaseDate(block);

  return {
    id: episodeId,
    name: cleanHtml(titleHtml),
    description: truncate(cleanHtml(descriptionHtml || "Épisode officiel LILMOD sur Spotify."), 260),
    duration_ms: 0,
    release_date: releaseDate,
    images: imageUrl ? [{ url: imageUrl, height: 300, width: 300 }] : [],
    external_urls: {
      spotify: `https://open.spotify.com/episode/${episodeId}`,
    },
  };
}

async function fetchFromSpotifyOEmbed() {
  const showUrl = `https://open.spotify.com/show/${SHOW_ID}`;
  const response = await fetch(`https://open.spotify.com/oembed?url=${encodeURIComponent(showUrl)}`);

  if (!response.ok) {
    throw new Error(`Spotify oEmbed error: ${response.status}`);
  }

  const data = await response.json();
  if (!data?.title) return null;

  return {
    id: SHOW_ID,
    name: cleanHtml(data.title),
    description: "Épisode officiel LILMOD récupéré depuis Spotify.",
    duration_ms: 0,
    release_date: "",
    images: data.thumbnail_url ? [{ url: data.thumbnail_url, height: data.thumbnail_height || 300, width: data.thumbnail_width || 300 }] : [],
    external_urls: {
      spotify: showUrl,
    },
  };
}

function findReleaseDate(block) {
  const text = cleanHtml(block);
  const match = text.match(/\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2}(?:,\s+\d{4})?\b/);
  if (!match) return "";

  const dateText = match[0];
  const date = new Date(/\d{4}/.test(dateText) ? dateText : `${dateText}, ${new Date().getFullYear()}`);
  return Number.isNaN(date.getTime()) ? dateText : date.toISOString().slice(0, 10);
}

function matchFirst(value, regex) {
  return value.match(regex)?.[1] || "";
}

function cleanHtml(value) {
  return decodeHtml(String(value || "").replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();
}

function decodeHtml(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function truncate(value, maxLength) {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength - 1).trim()}…`;
}

function jsonResponse(body) {
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(body),
  };
}
