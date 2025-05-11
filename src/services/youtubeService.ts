
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
};

// Fonction pour récupérer les dernières vidéos de la chaîne YouTube
export const fetchLatestYouTubeVideos = async (
  maxResults: number = 7
): Promise<YouTubeVideo[]> => {
  try {
    console.log("Fetching latest YouTube videos...");
    
    // Dans une version réelle avec l'API YouTube, utiliser ce channelId
    const channelId = "UCPmcgKv8vaN9TR7uEGBLPgw"; // ID de la chaîne LILMOD
    
    // En production, il faudrait utiliser l'API YouTube pour obtenir les données en temps réel
    // Cette version simule les données mais pourrait être remplacée par un appel API réel
    
    return [
      {
        id: "video1",
        title: "La Paracha Bechala'h - Le récit de la mer",
        thumbnail: "/placeholder.svg",
        publishedAt: "2025-05-09",
        channelTitle: "Rav Ben Ichay",
        url: "https://www.youtube.com/watch?v=example1"
      },
      {
        id: "video2",
        title: "Étude du Kol Hator du Gaon de Vilna",
        thumbnail: "/placeholder.svg", 
        publishedAt: "2025-05-08",
        channelTitle: "Rav Menahem Akerman",
        url: "https://www.youtube.com/watch?v=example2"
      },
      {
        id: "video3",
        title: "Ouverture midrashique sur Yom Hatsmaout",
        thumbnail: "/placeholder.svg",
        publishedAt: "2025-05-07",
        channelTitle: "Rav Elie KLING",
        url: "https://www.youtube.com/watch?v=example3"
      },
      {
        id: "video4",
        title: "La Torah et l'armée - Perspectives contemporaines",
        thumbnail: "/placeholder.svg",
        publishedAt: "2025-05-06",
        channelTitle: "Rav Avi Goldberg",
        url: "https://www.youtube.com/watch?v=example4"
      },
      {
        id: "video5",
        title: "RELATIONS DIASPORA ET ISRAËL",
        thumbnail: "/placeholder.svg",
        publishedAt: "2025-05-05",
        channelTitle: "Rav Saadia Morali",
        url: "https://www.youtube.com/watch?v=example5"
      },
      {
        id: "video6",
        title: "Étude de texte du Rav Kook",
        thumbnail: "/placeholder.svg", 
        publishedAt: "2025-05-04",
        channelTitle: "Rav Yossef Ben-Shoushan",
        url: "https://www.youtube.com/watch?v=example6"
      },
      {
        id: "video7",
        title: "Le sens du calendrier juif",
        thumbnail: "/placeholder.svg",
        publishedAt: "2025-05-03",
        channelTitle: "Ariel Assaf",
        url: "https://www.youtube.com/watch?v=example7"
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
  maxResults: number = 7
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
    
    return data.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.high.url,
      publishedAt: item.snippet.publishedAt,
      channelTitle: item.snippet.channelTitle,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`
    }));
  } catch (error) {
    console.error("Error fetching YouTube videos:", error);
    return [];
  }
};
*/
