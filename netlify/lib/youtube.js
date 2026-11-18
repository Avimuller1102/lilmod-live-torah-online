/**
 * Import des vidéos YouTube de la chaîne LILMOD.
 * - Sans clé : flux RSS public (15 dernières vidéos de la chaîne ou d'une playlist).
 *   Une synchronisation horaire accumule les vidéos : l'archive grandit sans rien perdre.
 * - Avec YOUTUBE_API_KEY (variable d'environnement côté serveur, jamais dans le
 *   navigateur) : import complet de toutes les vidéos de la chaîne.
 */
export const CHANNEL_ID = 'UCL_BSX_zC9p8QjPjqMrpt9Q';
export const UPLOADS_PLAYLIST = CHANNEL_ID.replace(/^UC/, 'UU');

const decode = (s) =>
  String(s || '')
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim();
const pick = (s, re) => s.match(re)?.[1] || '';

export function parseFeed(xml) {
  return [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)]
    .map(([, e]) => {
      const id = pick(e, /<yt:videoId>(.*?)<\/yt:videoId>/);
      if (!id) return null;
      return {
        id,
        title: decode(pick(e, /<title>([\s\S]*?)<\/title>/)),
        publishedAt: pick(e, /<published>(.*?)<\/published>/),
        thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
        description: decode(pick(e, /<media:description>([\s\S]*?)<\/media:description>/)).slice(0, 2000),
        url: `https://www.youtube.com/watch?v=${id}`,
        source: 'youtube',
      };
    })
    .filter(Boolean);
}

export async function fetchFeed({ channelId = CHANNEL_ID, playlistId = '' } = {}) {
  const url = playlistId
    ? `https://www.youtube.com/feeds/videos.xml?playlist_id=${encodeURIComponent(playlistId)}`
    : `https://www.youtube.com/feeds/videos.xml?channel_id=${encodeURIComponent(channelId)}`;
  const res = await fetch(url, { headers: { Accept: 'application/atom+xml' } });
  if (!res.ok) throw new Error(`Flux YouTube indisponible (${res.status})`);
  return parseFeed(await res.text());
}

function isoDuration(d) {
  const m = String(d || '').match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return '';
  const [h, mi, s] = [m[1], m[2], m[3]].map((x) => Number(x || 0));
  return h ? `${h}:${String(mi).padStart(2, '0')}:${String(s).padStart(2, '0')}` : `${mi}:${String(s).padStart(2, '0')}`;
}

/** Import complet via l'API officielle YouTube Data v3 (nécessite YOUTUBE_API_KEY). */
export async function fetchAllWithApi({ apiKey, playlistId = UPLOADS_PLAYLIST, maxPages = 80 }) {
  const out = [];
  let pageToken = '';
  for (let page = 0; page < maxPages; page++) {
    const params = new URLSearchParams({ part: 'snippet,contentDetails', maxResults: '50', playlistId, key: apiKey });
    if (pageToken) params.set('pageToken', pageToken);
    const res = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?${params}`);
    if (!res.ok) throw new Error(`API YouTube : ${res.status}`);
    const data = await res.json();
    const ids = [];
    for (const item of data.items || []) {
      const id = item.contentDetails?.videoId;
      if (!id || item.snippet?.title === 'Private video' || item.snippet?.title === 'Deleted video') continue;
      ids.push(id);
      out.push({
        id,
        title: item.snippet.title,
        publishedAt: item.contentDetails.videoPublishedAt || item.snippet.publishedAt,
        thumbnail: item.snippet.thumbnails?.high?.url || `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
        description: String(item.snippet.description || '').slice(0, 2000),
        url: `https://www.youtube.com/watch?v=${id}`,
        source: 'youtube',
      });
    }
    if (ids.length) {
      const det = await fetch(`https://www.googleapis.com/youtube/v3/videos?${new URLSearchParams({ part: 'contentDetails', id: ids.join(','), key: apiKey })}`);
      if (det.ok) {
        const d = await det.json();
        const durations = Object.fromEntries((d.items || []).map((i) => [i.id, isoDuration(i.contentDetails?.duration)]));
        for (const v of out) if (durations[v.id]) v.duration = durations[v.id];
      }
    }
    pageToken = data.nextPageToken;
    if (!pageToken) break;
  }
  return out;
}
