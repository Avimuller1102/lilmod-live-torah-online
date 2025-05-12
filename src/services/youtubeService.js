
/**
 * Service pour récupérer les vidéos YouTube
 */

// Fonction pour récupérer les dernières vidéos de la chaîne YouTube
export const fetchLatestYouTubeVideos = async (maxResults = 8) => {
  try {
    console.log("Fetching latest YouTube videos...");
    
    const channelId = "UCPmcgKv8vaN9TR7uEGBLPgw"; // ID de la chaîne LILMOD
    const youtubeUrl = "https://www.youtube.com/@Lilmodfr/videos";
    
    // En production, il faudrait utiliser l'API YouTube pour obtenir les données en temps réel
    // Cette version simule les données avec les dernières vidéos fournies
    
    return [
      {
        id: "video1",
        title: "Rav Yossef Ben-Shoushan - Étude de Orot Hatechouva - 08/05/2025",
        thumbnail: "/placeholder.svg",
        publishedAt: "2025-05-11",
        channelTitle: "Rav Yossef Ben-Shoushan",
        url: "https://www.youtube.com/watch?v=2OOAvik_LLc"
      },
      {
        id: "video2",
        title: "Rav Yehuda Ben-Ichay - Paracha Ahare Mot-Kedochim - Tout peut s'arranger - 09/05/2025",
        thumbnail: "/placeholder.svg",
        publishedAt: "2025-05-09",
        channelTitle: "Rav Yehuda Ben-Ichay",
        url: "https://www.youtube.com/watch?v=TkqoOoCymYc"
      },
      {
        id: "video3",
        title: "HBG-Dr Gross-Étude de la paracha-Aharei moth-Quedoshim-09/05/2025",
        thumbnail: "/placeholder.svg",
        publishedAt: "2025-05-09",
        channelTitle: "Dr Gross",
        url: "https://www.youtube.com/watch?v=DPwMMHsvFiI"
      },
      {
        id: "video4",
        title: "Rav Akerman - Étude du Kol Hator - Épisode 18 - 05/05/2025",
        thumbnail: "/placeholder.svg",
        publishedAt: "2025-05-07",
        channelTitle: "Rav Akerman",
        url: "https://www.youtube.com/watch?v=eY3HfnV5Ruc"
      },
      {
        id: "video5",
        title: "Rav Ben Ichay- Paracha de la semaine- TAZRIA METSORA- \"Comment être un peuple influent\"- 02.05.25",
        thumbnail: "/placeholder.svg",
        publishedAt: "2025-05-02",
        channelTitle: "Rav Ben Ichay",
        url: "https://www.youtube.com/watch?v=1zpHJ1MQpA8"
      },
      {
        id: "video6",
        title: "Rav Menahem Akerman- 📖 Étude du Kol Ator du Gaon de Vilna- YOM HATSMAOUT- 28.04.25",
        thumbnail: "/placeholder.svg",
        publishedAt: "2025-04-28",
        channelTitle: "Rav Menahem Akerman",
        url: "https://www.youtube.com/watch?v=RmSB1hBHokk"
      },
      {
        id: "video7",
        title: "Rav Elie KLING- Ouverture midrashique sur Yom Hatsmaout # Chir hachirim- 27.04.25",
        thumbnail: "/placeholder.svg",
        publishedAt: "2025-04-27",
        channelTitle: "Rav Elie KLING",
        url: "https://www.youtube.com/watch?v=ysdO3MHp3xw"
      },
      {
        id: "video8",
        title: "Rav Yossef Ben-Shoushan- Etude de texte du Rav Kook- 24.04.25",
        thumbnail: "/placeholder.svg",
        publishedAt: "2025-04-24",
        channelTitle: "Rav Yossef Ben-Shoushan",
        url: "https://www.youtube.com/watch?v=PVCo4Q6Xelo"
      }
    ];
  } catch (error) {
    console.error("Error in YouTube service:", error);
    return [];
  }
};
