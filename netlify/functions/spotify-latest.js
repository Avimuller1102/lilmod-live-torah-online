const SHOW_ID = "5oJ8bkMtw0hR1iRxomrSRR";

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "public, max-age=900, s-maxage=900",
};

export const handler = async (event) => {
  try {
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return {
        statusCode: 501,
        headers,
        body: JSON.stringify({ error: "Spotify credentials are not configured" }),
      };
    }

    const limit = Math.min(Number(event.queryStringParameters?.limit || 6), 12);
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

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ episodes: data.items || [] }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message || "Unable to load Spotify episodes" }),
    };
  }
};

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
