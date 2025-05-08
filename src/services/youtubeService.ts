
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
  maxResults: number = 6
): Promise<YouTubeVideo[]> => {
  try {
    console.log("Fetching latest YouTube videos...");
    
    // Nous définissons ici les vidéos pour le moment, mais dans une version réelle,
    // nous utiliserions l'API YouTube avec les identifiants suivants
    const channelId = "UCPmcgKv8vaN9TR7uEGBLPgw"; // ID de la chaîne LILMOD
    
    // Simulation de données avec des liens réels vers YouTube
    return [
      {
        id: "video1",
        title: "Paracha de la semaine- TAZRIA METSORA",
        thumbnail: "/lovable-uploads/89872365-27db-493a-9c07-f347ffe5a202.png",
        publishedAt: "2023-05-02",
        channelTitle: "Rav Ben Ichay",
        url: "https://www.youtube.com/watch?v=example1"
      },
      {
        id: "video2",
        title: "Étude du Kol Ator du Gaon de Vilna",
        thumbnail: "/lovable-uploads/89872365-27db-493a-9c07-f347ffe5a202.png", 
        publishedAt: "2023-04-28",
        channelTitle: "Rav Menahem Akerman",
        url: "https://www.youtube.com/watch?v=example2"
      },
      {
        id: "video3",
        title: "Ouverture midrashique sur Yom Hatsmaout",
        thumbnail: "/lovable-uploads/89872365-27db-493a-9c07-f347ffe5a202.png",
        publishedAt: "2023-04-27",
        channelTitle: "Rav Elie KLING",
        url: "https://www.youtube.com/watch?v=example3"
      },
      {
        id: "video4",
        title: "#israel #soldier #torah",
        thumbnail: "/lovable-uploads/89872365-27db-493a-9c07-f347ffe5a202.png",
        publishedAt: "2023-04-25",
        channelTitle: "Rav Avi Goldberg",
        url: "https://www.youtube.com/watch?v=example4"
      },
      {
        id: "video5",
        title: "RELATIONS DISAPORA ET ISRAËL",
        thumbnail: "/lovable-uploads/89872365-27db-493a-9c07-f347ffe5a202.png",
        publishedAt: "2023-04-24",
        channelTitle: "Rav Saadia Morali",
        url: "https://www.youtube.com/watch?v=example5"
      },
      {
        id: "video6",
        title: "Etude de texte du Rav Kook",
        thumbnail: "/lovable-uploads/89872365-27db-493a-9c07-f347ffe5a202.png", 
        publishedAt: "2023-04-24",
        channelTitle: "Rav Yossef Ben-Shoushan",
        url: "https://www.youtube.com/watch?v=example6"
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
  maxResults: number = 6
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
