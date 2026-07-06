
/**
 * Service pour récupérer les vidéos YouTube.
 *
 * En production Netlify, le site lit le flux public YouTube côté fonction
 * serverless pour afficher les derniers uploads sans exposer de clé.
 * Si la fonction est absente, on utilise l'API YouTube avec une clé Vite
 * optionnelle, puis un fallback éditorial.
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

type YouTubeSearchItem = {
  id?: { videoId?: string };
  snippet: {
    title: string;
    thumbnails?: {
      default?: { url: string };
      medium?: { url: string };
      high?: { url: string };
    };
    publishedAt: string;
    channelTitle: string;
    description?: string;
  };
};

type YouTubeDetailsItem = {
  id: string;
  contentDetails?: {
    duration?: string;
  };
};

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const CHANNEL_ID = "UCL_BSX_zC9p8QjPjqMrpt9Q";

const FALLBACK_VIDEOS: YouTubeVideo[] = [
  {
    id: "332BeipF0Xw",
    title: "Rav Ben Ichay - Paracha Emor - Ce que Rabbi Chimon et son fils ont-ils vu la veille de Shabbat",
    thumbnail: "https://i.ytimg.com/vi/332BeipF0Xw/hqdefault.jpg",
    publishedAt: "2025-05-17",
    channelTitle: "Rav Ben Ichay",
    url: "https://www.youtube.com/watch?v=332BeipF0Xw",
    duration: "59:17"
  },
  {
    id: "0Cz8-gbYvnI",
    title: "Rav Akerman - Étude du Kol Hator - Épisode 21",
    thumbnail: "https://i.ytimg.com/vi/0Cz8-gbYvnI/hqdefault.jpg",
    publishedAt: "2025-05-15",
    channelTitle: "Rav Akerman",
    url: "https://www.youtube.com/watch?v=0Cz8-gbYvnI",
    duration: "43:22"
  },
  {
    id: "8weKcRJIoB0",
    title: "Rav Yossef Ben-Shoushan - Étude des Orot du Rav Kook - 14/05/2025",
    thumbnail: "https://i.ytimg.com/vi/8weKcRJIoB0/hqdefault.jpg",
    publishedAt: "2025-05-14",
    channelTitle: "Rav Yossef Ben-Shoushan",
    url: "https://www.youtube.com/watch?v=8weKcRJIoB0",
    duration: "46:14"
  },
  {
    id: "2OOAvik_LLc",
    title: "Rav Yossef Ben-Shoushan - Étude de Orot Hatechouva - 08/05/2025",
    thumbnail: "https://i.ytimg.com/vi/2OOAvik_LLc/hqdefault.jpg",
    publishedAt: "2025-05-11",
    channelTitle: "Rav Yossef Ben-Shoushan",
    url: "https://www.youtube.com/watch?v=2OOAvik_LLc",
    duration: "38:00"
  },
  {
    id: "TkqoOoCymYc",
    title: "Rav Yehuda Ben-Ichay - Paracha Ahare Mot-Kedochim - Tout peut s'arranger - 09/05/2025",
    thumbnail: "https://i.ytimg.com/vi/TkqoOoCymYc/hqdefault.jpg",
    publishedAt: "2025-05-09",
    channelTitle: "Rav Yehuda Ben-Ichay",
    url: "https://www.youtube.com/watch?v=TkqoOoCymYc",
    duration: "1:04:11"
  },
  {
    id: "DPwMMHsvFiI",
    title: "HBG-Dr Gross-Étude de la paracha-Aharei moth-Quedoshim-09/05/2025",
    thumbnail: "https://i.ytimg.com/vi/DPwMMHsvFiI/hqdefault.jpg",
    publishedAt: "2025-05-09",
    channelTitle: "Dr Gross",
    url: "https://www.youtube.com/watch?v=DPwMMHsvFiI",
    duration: "56:51"
  },
  {
    id: "eY3HfnV5Ruc",
    title: "Rav Akerman - Étude du Kol Hator - Épisode 18 - 05/05/2025",
    thumbnail: "https://i.ytimg.com/vi/eY3HfnV5Ruc/hqdefault.jpg",
    publishedAt: "2025-05-07",
    channelTitle: "Rav Akerman",
    url: "https://www.youtube.com/watch?v=eY3HfnV5Ruc",
    duration: "35:15"
  },
  {
    id: "1zpHJ1MQpA8",
    title: "Rav Ben Ichay - Paracha de la semaine - TAZRIA METSORA - Comment être un peuple influent",
    thumbnail: "https://i.ytimg.com/vi/1zpHJ1MQpA8/hqdefault.jpg",
    publishedAt: "2025-05-02",
    channelTitle: "Rav Ben Ichay",
    url: "https://www.youtube.com/watch?v=1zpHJ1MQpA8",
    duration: "57:04"
  }
];

export const fetchLatestYouTubeVideos = async (maxResults: number = 8): Promise<YouTubeVideo[]> => {
  const serverlessVideos = await fetchFromServerless(maxResults);
  if (serverlessVideos.length > 0) {
    return serverlessVideos;
  }

  if (!API_KEY) {
    return FALLBACK_VIDEOS.slice(0, maxResults);
  }

  try {
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=${maxResults}&type=video`;

    const response = await fetch(searchUrl);
    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }

    const data = await response.json();
    const videoItems = ((data.items || []) as YouTubeSearchItem[]).filter((item) => item.id?.videoId);
    const ids = videoItems.map((item) => item.id?.videoId).join(",");

    const durationById = new Map<string, string>();
    if (ids) {
      const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?key=${API_KEY}&id=${ids}&part=contentDetails`;
      const detailsResponse = await fetch(detailsUrl);
      if (detailsResponse.ok) {
        const detailsData = await detailsResponse.json();
        for (const item of (detailsData.items || []) as YouTubeDetailsItem[]) {
          durationById.set(item.id, formatDuration(item.contentDetails?.duration || ""));
        }
      }
    }

    return videoItems.map((item) => ({
      id: item.id?.videoId || "",
      title: decodeHtml(item.snippet.title),
      thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url || "/placeholder.svg",
      publishedAt: item.snippet.publishedAt,
      channelTitle: item.snippet.channelTitle,
      url: `https://www.youtube.com/watch?v=${item.id?.videoId}`,
      duration: durationById.get(item.id?.videoId || "") || "Cours",
      description: item.snippet.description
    }));
  } catch (error) {
    console.error("Error fetching YouTube videos:", error);
    return FALLBACK_VIDEOS.slice(0, maxResults);
  }
};

async function fetchFromServerless(maxResults: number): Promise<YouTubeVideo[]> {
  try {
    const response = await fetch(`/.netlify/functions/youtube-latest?limit=${maxResults}`);
    if (!response.ok) return [];

    const data = await response.json();
    return Array.isArray(data.videos) ? data.videos : [];
  } catch {
    return [];
  }
}

// Fonction pour formater la durée ISO 8601 en format lisible
function formatDuration(duration: string): string {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return "Cours";

  const hours = (match[1] || "").replace('H', '');
  const minutes = (match[2] || "").replace('M', '');
  const seconds = (match[3] || "").replace('S', '');

  let formatted = "";
  if (hours) formatted += `${hours}:`;
  formatted += `${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;

  return formatted;
}

function decodeHtml(value: string): string {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = value;
  return textarea.value;
}
