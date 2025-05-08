
/**
 * Service pour récupérer les vidéos YouTube
 */

export type YouTubeVideo = {
  id: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
  channelTitle: string;
};

// Fonction pour récupérer les dernières vidéos de la chaîne YouTube
export const fetchLatestYouTubeVideos = async (
  maxResults: number = 6
): Promise<YouTubeVideo[]> => {
  try {
    // Dans un environnement réel, vous devriez utiliser une clé API YouTube
    // et appeler l'API YouTube Data v3
    console.log("Fetching latest YouTube videos...");
    
    // Pour l'instant, nous retournons des données simulées
    // Dans une version finale, remplacez ceci par un appel API réel
    return [
      {
        id: "video1",
        title: "Paracha de la semaine- TAZRIA METSORA",
        thumbnail: "https://picsum.photos/id/30/400/225",
        publishedAt: "2023-05-02",
        channelTitle: "Rav Ben Ichay"
      },
      {
        id: "video2",
        title: "Étude du Kol Ator du Gaon de Vilna",
        thumbnail: "https://picsum.photos/id/60/400/225",
        publishedAt: "2023-04-28",
        channelTitle: "Rav Menahem Akerman"
      },
      {
        id: "video3",
        title: "Ouverture midrashique sur Yom Hatsmaout",
        thumbnail: "https://picsum.photos/id/65/400/225",
        publishedAt: "2023-04-27",
        channelTitle: "Rav Elie KLING"
      },
      {
        id: "video4",
        title: "#israel #soldier #torah",
        thumbnail: "https://picsum.photos/id/1005/400/225",
        publishedAt: "2023-04-25",
        channelTitle: "Rav Avi Goldberg"
      },
      {
        id: "video5",
        title: "RELATIONS DISAPORA ET ISRAËL",
        thumbnail: "https://picsum.photos/id/328/400/225",
        publishedAt: "2023-04-24",
        channelTitle: "Rav Saadia Morali"
      },
      {
        id: "video6",
        title: "Etude de texte du Rav Kook",
        thumbnail: "https://picsum.photos/id/514/400/225",
        publishedAt: "2023-04-24",
        channelTitle: "Rav Yossef Ben-Shoushan"
      }
    ];
  } catch (error) {
    console.error("Error fetching YouTube videos:", error);
    return [];
  }
};

// Pour une version complète avec API key, voici comment le code pourrait être:
/*
export const fetchLatestYouTubeVideos = async (
  channelId: string = "UCxxxxxxxxxxx", // ID de la chaîne YouTube LILMOD
  maxResults: number = 6
): Promise<YouTubeVideo[]> => {
  try {
    const API_KEY = "YOUR_YOUTUBE_API_KEY"; // Remplacer par votre clé API YouTube
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=${maxResults}&order=date&type=video&key=${API_KEY}`
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
      channelTitle: item.snippet.channelTitle
    }));
  } catch (error) {
    console.error("Error fetching YouTube videos:", error);
    return [];
  }
};
*/
