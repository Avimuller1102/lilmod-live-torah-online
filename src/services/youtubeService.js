
/**
 * Service pour récupérer les vidéos YouTube
 */

// Fonction pour récupérer les dernières vidéos de la chaîne YouTube
export const fetchLatestYouTubeVideos = async (maxResults = 8) => {
  try {
    console.log("Fetching latest YouTube videos...");
    
    // En production, il faudrait utiliser l'API YouTube pour obtenir les données en temps réel
    // Cette version simule les données des dernières vidéos de la chaîne
    
    return [
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
        title: "Rav Ben Ichay- Paracha de la semaine- TAZRIA METSORA- \"Comment être un peuple influent\"- 02.05.25",
        thumbnail: "/placeholder.svg",
        publishedAt: "2025-05-02",
        channelTitle: "Rav Ben Ichay",
        url: "https://www.youtube.com/watch?v=1zpHJ1MQpA8",
        duration: "57:04"
      },
      {
        id: "RmSB1hBHokk",
        title: "Rav Menahem Akerman- 📖 Étude du Kol Ator du Gaon de Vilna- YOM HATSMAOUT- 28.04.25",
        thumbnail: "/placeholder.svg",
        publishedAt: "2025-04-28",
        channelTitle: "Rav Menahem Akerman",
        url: "https://www.youtube.com/watch?v=RmSB1hBHokk",
        duration: "52:25"
      },
      {
        id: "ysdO3MHp3xw",
        title: "Rav Elie KLING- Ouverture midrashique sur Yom Hatsmaout # Chir hachirim- 27.04.25",
        thumbnail: "/placeholder.svg",
        publishedAt: "2025-04-27",
        channelTitle: "Rav Elie KLING",
        url: "https://www.youtube.com/watch?v=ysdO3MHp3xw",
        duration: "1:01:43"
      },
      {
        id: "PVCo4Q6Xelo",
        title: "Rav Yossef Ben-Shoushan- Etude de texte du Rav Kook- 24.04.25",
        thumbnail: "/placeholder.svg",
        publishedAt: "2025-04-24",
        channelTitle: "Rav Yossef Ben-Shoushan",
        url: "https://www.youtube.com/watch?v=PVCo4Q6Xelo",
        duration: "45:30"
      }
    ];
  } catch (error) {
    console.error("Error in YouTube service:", error);
    return [];
  }
};

// Fonction qui pourrait être utilisée pour une implémentation réelle avec l'API YouTube
/*
export const fetchRealTimeYouTubeVideos = async (maxResults = 8) => {
  try {
    const channelId = "UCPmcgKv8vaN9TR7uEGBLPgw"; // ID de la chaîne LILMOD
    const youtubeApiKey = 'YOUR_API_KEY'; // À remplacer par votre clé API YouTube
    
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=${maxResults}&order=date&type=video&key=${youtubeApiKey}`
    );
    
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des données YouTube');
    }
    
    const data = await response.json();
    const videoIds = data.items.map(item => item.id.videoId).join(',');
    
    // Récupérer les détails des vidéos (durée, etc.)
    const detailsResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoIds}&key=${youtubeApiKey}`
    );
    
    if (!detailsResponse.ok) {
      throw new Error('Erreur lors de la récupération des détails des vidéos');
    }
    
    const detailsData = await detailsResponse.json();
    
    return data.items.map((item, index) => {
      const details = detailsData.items[index];
      const duration = details ? details.contentDetails.duration : '00:00';
      
      return {
        id: item.id.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.medium.url,
        publishedAt: item.snippet.publishedAt,
        channelTitle: item.snippet.channelTitle,
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        duration: formatYouTubeDuration(duration)
      };
    });
  } catch (error) {
    console.error("Error fetching YouTube videos:", error);
    return [];
  }
};

// Formater la durée YouTube (PT1H30M15S -> 1:30:15)
function formatYouTubeDuration(duration) {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  
  if (!match) return "00:00";
  
  const hours = match[1] ? match[1] + ':' : '';
  const minutes = match[2] ? (hours && match[2].length === 1 ? '0' + match[2] : match[2]) : '00';
  const seconds = match[3] ? (match[3].length === 1 ? '0' + match[3] : match[3]) : '00';
  
  return hours + minutes + ':' + seconds;
}
*/

