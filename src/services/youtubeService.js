
/**
 * Service pour récupérer les vidéos YouTube avec la vraie API
 */

// Configuration de l'API YouTube
const API_KEY = "REDACTED";
const CHANNEL_ID = "UCL_BSX_zC9p8QjPjqMrpt9Q";

// Fonction pour récupérer les dernières vidéos de la chaîne YouTube
export const fetchLatestYouTubeVideos = async (maxResults = 8) => {
  try {
    console.log("Fetching latest YouTube videos...");
    
    const url = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=${maxResults}&type=video`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.items) {
      console.warn("No items found in YouTube API response");
      return [];
    }

    // Transformer les données pour correspondre au format attendu
    const videos = data.items
      .filter(item => item.id && item.id.videoId)
      .slice(0, 8) // Limiter à 8 vidéos
      .map(item => ({
        id: item.id.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.high ? item.snippet.thumbnails.high.url : item.snippet.thumbnails.default.url,
        publishedAt: item.snippet.publishedAt,
        channelTitle: item.snippet.channelTitle,
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        duration: "N/A", // L'API search ne fournit pas la durée
        description: item.snippet.description
      }));

    console.log(`Fetched ${videos.length} YouTube videos`);
    return videos;

  } catch (error) {
    console.error("Error in YouTube service:", error);
    
    // Fallback vers des données statiques en cas d'erreur (limité à 8)
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
