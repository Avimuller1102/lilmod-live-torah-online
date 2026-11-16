/**
 * Service YouTube — sans clé API.
 *
 * Les dernières vidéos sont lues dans le flux RSS public de la chaîne par la
 * fonction Netlify `youtube-latest`. Si la fonction n'est pas disponible
 * (déploiement par glisser-déposer, panne réseau…), le composant affiche le
 * lecteur officiel YouTube de la playlist « Uploads », qui est toujours à jour.
 */

export type YouTubeVideo = {
  id: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
  channelTitle: string;
  url: string;
  duration: string;
  description?: string;
};

export const YOUTUBE_CHANNEL_ID = "UCL_BSX_zC9p8QjPjqMrpt9Q";

/** Playlist automatique de toutes les vidéos publiées par la chaîne (UC… → UU…). */
export const YOUTUBE_UPLOADS_PLAYLIST_ID = YOUTUBE_CHANNEL_ID.replace(/^UC/, "UU");

export const YOUTUBE_UPLOADS_EMBED_URL =
  `https://www.youtube-nocookie.com/embed/videoseries?list=${YOUTUBE_UPLOADS_PLAYLIST_ID}&rel=0`;

export const fetchLatestYouTubeVideos = async (maxResults: number = 8): Promise<YouTubeVideo[]> => {
  try {
    const response = await fetch(`/.netlify/functions/youtube-latest?limit=${maxResults}`, {
      headers: { Accept: "application/json" },
    });
    if (!response.ok) return [];
    if (!response.headers.get("content-type")?.includes("application/json")) return [];

    const data = await response.json();
    return Array.isArray(data.videos) ? data.videos.slice(0, maxResults) : [];
  } catch {
    return [];
  }
};
