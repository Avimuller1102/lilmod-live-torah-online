
/**
 * Service pour récupérer les vidéos YouTube avec l'API officielle
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

const API_KEY = "REDACTED";
const CHANNEL_ID = "UCL_BSX_zC9p8QjPjqMrpt9Q";

export const fetchLatestYouTubeVideos = async (maxResults: number = 8): Promise<YouTubeVideo[]> => {
  try {
    console.log("Fetching latest YouTube videos from API...");
    
    // Appel à l'API YouTube Data v3
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=${maxResults}&type=video`;
    
    const response = await fetch(searchUrl);
    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    const videos: YouTubeVideo[] = [];
    
    for (const item of data.items) {
      if (item.id?.videoId) {
        // Récupérer les détails de la vidéo pour obtenir la durée
        const videoDetailsUrl = `https://www.googleapis.com/youtube/v3/videos?key=${API_KEY}&id=${item.id.videoId}&part=contentDetails`;
        const detailsResponse = await fetch(videoDetailsUrl);
        const detailsData = await detailsResponse.json();
        
        let duration = "N/A";
        if (detailsData.items?.[0]?.contentDetails?.duration) {
          duration = formatDuration(detailsData.items[0].contentDetails.duration);
        }
        
        videos.push({
          id: item.id.videoId,
          title: item.snippet.title,
          thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url || "/placeholder.svg",
          publishedAt: item.snippet.publishedAt,
          channelTitle: item.snippet.channelTitle,
          url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
          duration,
          description: item.snippet.description
        });
      }
    }
    
    return videos;
  } catch (error) {
    console.error("Error fetching YouTube videos:", error);
    
    // Fallback vers les données statiques en cas d'erreur
    return [
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
        title: "Rav Ben Ichay - Paracha de la semaine - TAZRIA METSORA - \"Comment être un peuple influent\"",
        thumbnail: "https://i.ytimg.com/vi/1zpHJ1MQpA8/hqdefault.jpg",
        publishedAt: "2025-05-02",
        channelTitle: "Rav Ben Ichay",
        url: "https://www.youtube.com/watch?v=1zpHJ1MQpA8",
        duration: "57:04"
      }
    ];
  }
};

// Fonction pour formater la durée ISO 8601 en format lisible
function formatDuration(duration: string): string {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return "N/A";
  
  const hours = (match[1] || "").replace('H', '');
  const minutes = (match[2] || "").replace('M', '');
  const seconds = (match[3] || "").replace('S', '');
  
  let formatted = "";
  if (hours) formatted += `${hours}:`;
  formatted += `${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
  
  return formatted;
}
