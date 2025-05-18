
/**
 * Service pour récupérer les vidéos YouTube
 */

// Fonction pour récupérer les dernières vidéos de la chaîne YouTube
export const fetchLatestYouTubeVideos = async (maxResults = 8) => {
  try {
    console.log("Fetching latest YouTube videos...");
    
    // Cette version simule les données des dernières vidéos de la chaîne
    // Les données sont basées sur les vidéos réelles de la chaîne LILMOD
    
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
        title: "Rav Ben Ichay - Paracha de la semaine - TAZRIA METSORA - \"Comment être un peuple influent\"",
        thumbnail: "/placeholder.svg",
        publishedAt: "2025-05-02",
        channelTitle: "Rav Ben Ichay",
        url: "https://www.youtube.com/watch?v=1zpHJ1MQpA8",
        duration: "57:04"
      }
    ];
  } catch (error) {
    console.error("Error in YouTube service:", error);
    return [];
  }
};
