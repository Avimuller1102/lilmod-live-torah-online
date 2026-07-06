const CHANNEL_ID = "UCL_BSX_zC9p8QjPjqMrpt9Q";

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "public, max-age=900, s-maxage=900",
};

export const handler = async (event) => {
  try {
    const limit = Math.min(Number(event.queryStringParameters?.limit || 8), 12);
    const response = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`);

    if (!response.ok) {
      throw new Error(`YouTube feed error: ${response.status}`);
    }

    const xml = await response.text();
    const videos = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)]
      .slice(0, limit)
      .map((match) => parseEntry(match[1]))
      .filter(Boolean);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ videos }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message || "Unable to load YouTube feed" }),
    };
  }
};

function parseEntry(entry) {
  const id = text(entry, /<yt:videoId>(.*?)<\/yt:videoId>/);
  if (!id) return null;

  return {
    id,
    title: decodeXml(text(entry, /<title>([\s\S]*?)<\/title>/)),
    thumbnail: attr(entry, /<media:thumbnail[^>]*url="([^"]+)"/) || `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
    publishedAt: text(entry, /<published>(.*?)<\/published>/),
    channelTitle: decodeXml(text(entry, /<author>[\s\S]*?<name>(.*?)<\/name>[\s\S]*?<\/author>/)) || "LILMOD",
    url: `https://www.youtube.com/watch?v=${id}`,
    duration: "YouTube",
    description: decodeXml(text(entry, /<media:description>([\s\S]*?)<\/media:description>/)),
  };
}

function text(value, pattern) {
  return value.match(pattern)?.[1]?.trim() || "";
}

function attr(value, pattern) {
  return value.match(pattern)?.[1]?.trim() || "";
}

function decodeXml(value) {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();
}
