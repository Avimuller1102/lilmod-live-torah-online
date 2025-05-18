
/**
 * Service pour récupérer les vidéos YouTube
 */

export type YouTubeVideo = {
  id: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
  channelTitle: string;
  url?: string;
  duration?: string;
};

// Fonction pour récupérer les dernières vidéos de la chaîne YouTube
export const fetchLatestYouTubeVideos = async (
  maxResults: number = 8
): Promise<YouTubeVideo[]> => {
  try {
    console.log("Fetching latest YouTube videos...");
    
    // Les données sont basées sur les vidéos réelles de la chaîne LILMOD au 18/05/2025
    
    return [
      {
        id: "332BeipF0Xw",
        title: "Rav Ben Ichay - Paracha Emor - Ce que Rabbi Chimon et son fils ont-ils vu la veille de Shabbat",
        thumbnail: "/placeholder.svg",
        publishedAt: "2025-05-17",
        channelTitle: "Rav Ben Ichay",
        url: "https://www.youtube.com/watch?v=332BeipF0Xw",
        duration: "59:17"
      },
      {
        id: "0Cz8-gbYvnI",
        title: "Rav Akerman - Étude du Kol Hator - Épisode 21",
        thumbnail: "/placeholder.svg",
        publishedAt: "2025-05-15",
        channelTitle: "Rav Akerman",
        url: "https://www.youtube.com/watch?v=0Cz8-gbYvnI",
        duration: "43:22"
      },
      {
        id: "8weKcRJIoB0",
        title: "Rav Yossef Ben-Shoushan - Étude des Orot du Rav Kook - 14/05/2025",
        thumbnail: "/placeholder.svg",
        publishedAt: "2025-05-14",
        channelTitle: "Rav Yossef Ben-Shoushan",
        url: "https://www.youtube.com/watch?v=8weKcRJIoB0",
        duration: "46:14"
      },
      {
        id: "2OOAvik_LLc",
        title: "Rav Yossef Ben-Shoushan - Étude de Orot Hatechouva - 08/05/2025",
        thumbnail: "/placeholder.svg",
        publishedAt: "2025-05-11",
        channelTitle: "Rav Yossef Ben-Shoushan",
        url: "https://www.youtube.com/watch?v=2OOAvik_LLc",
        duration: "38:00"
      },
      {
        id: "TkqoOoCymYc",
        title: "Rav Yehuda Ben-Ichay - Paracha Ahare Mot-Kedochim - Tout peut s'arranger - 09/05/2025",
        thumbnail: "/placeholder.svg",
        publishedAt: "2025-05-09",
        channelTitle: "Rav Yehuda Ben-Ichay",
        url: "https://www.youtube.com/watch?v=TkqoOoCymYc",
        duration: "1:04:11"
      },
      {
        id: "DPwMMHsvFiI",
        title: "HBG-Dr Gross-Étude de la paracha-Aharei moth-Quedoshim-09/05/2025",
        thumbnail: "/placeholder.svg",
        publishedAt: "2025-05-09",
        channelTitle: "Dr Gross",
        url: "https://www.youtube.com/watch?v=DPwMMHsvFiI",
        duration: "56:51"
      },
      {
        id: "eY3HfnV5Ruc",
        title: "Rav Akerman - Étude du Kol Hator - Épisode 18 - 05/05/2025",
        thumbnail: "/placeholder.svg",
        publishedAt: "2025-05-07",
        channelTitle: "Rav Akerman",
        url: "https://www.youtube.com/watch?v=eY3HfnV5Ruc",
        duration: "35:15"
      },
      {
        id: "1zpHJ1MQpA8",
        title: "Rav Ben Ichay - Paracha de la semaine - TAZRIA METSORA - \"Comment être un peuple influent\" - 02.05.25",
        thumbnail: "/placeholder.svg",
        publishedAt: "2025-05-02",
        channelTitle: "Rav Ben Ichay",
        url: "https://www.youtube.com/watch?v=1zpHJ1MQpA8",
        duration: "57:04"
      }
    ];
  } catch (error) {
    console.error("Error fetching YouTube videos:", error);
    return [];
  }
};

// Pour une implémentation réelle avec l'API YouTube:
/*
export const fetchLatestYouTubeVideos = async (
  maxResults: number = 8
): Promise<YouTubeVideo[]> => {
  try {
    const API_KEY = "YOUR_YOUTUBE_API_KEY";
    const CHANNEL_ID = "UCPmcgKv8vaN9TR7uEGBLPgw"; // ID chaîne LILMOD
    
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&maxResults=${maxResults}&order=date&type=video&key=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch YouTube data');
    }
    
    const data = await response.json();
    const videoIds = data.items.map((item: any) => item.id.videoId).join(',');
    
    // Récupérer les détails des vidéos (durée, etc.)
    const detailsResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoIds}&key=${API_KEY}`
    );
    
    if (!detailsResponse.ok) {
      throw new Error('Failed to fetch video details');
    }
    
    const detailsData = await detailsResponse.json();
    
    return data.items.map((item: any, index: number) => {
      const details = detailsData.items[index];
      const duration = details ? formatDuration(details.contentDetails.duration) : "00:00";
      
      return {
        id: item.id.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.high.url,
        publishedAt: item.snippet.publishedAt.split('T')[0],
        channelTitle: item.snippet.channelTitle,
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        duration
      };
    });
  } catch (error) {
    console.error("Error fetching YouTube videos:", error);
    return [];
  }
};

function formatDuration(duration: string): string {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  
  if (!match) return "00:00";
  
  const hours = match[1] ? match[1] + ':' : '';
  const minutes = match[2] ? (hours && match[2].length === 1 ? '0' + match[2] : match[2]) : '00';
  const seconds = match[3] ? (match[3].length === 1 ? '0' + match[3] : match[3]) : '00';
  
  return hours + minutes + ':' + seconds;
}
*/
