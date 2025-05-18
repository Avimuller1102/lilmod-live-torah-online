
/**
 * Service pour récupérer les podcasts Spotify
 */

// Fonction pour récupérer les derniers épisodes du podcast Spotify
export const fetchLatestSpotifyEpisodes = async (maxResults = 8) => {
  try {
    console.log("Fetching latest Spotify episodes...");
    
    // Les données sont basées sur les épisodes réels du podcast LILMOD sur Spotify
    // Les liens sont directement extraits de la page Spotify
    
    return [
      {
        id: "21oUMyupW707IPG2ZN3dGs",
        title: "Rav Ben Ichay - Paracha Emor - Ce que Rabbi Chimon et son fils ont-ils vu la veille de Shabbat",
        duration: "59:17",
        publishedAt: "2025-05-17",
        teacher: "Rav Ben Ichay",
        url: "https://open.spotify.com/episode/21oUMyupW707IPG2ZN3dGs",
        description: "Étude approfondie de la paracha Emor et du lien avec Rabbi Chimon bar Yohaï",
        imageUrl: "https://i.scdn.co/image/ab6765630000ba8a8f6d612a29f10c96b5c63076"
      },
      {
        id: "5zJHV3pTZT3NL9iphpNW8r",
        title: "Rav Akerman - Étude du Kol Hator - Épisode 21",
        duration: "43:22",
        publishedAt: "2025-05-15",
        teacher: "Rav Akerman",
        url: "https://open.spotify.com/episode/5zJHV3pTZT3NL9iphpNW8r",
        description: "Suite de l'étude du Kol Hator du Gaon de Vilna",
        imageUrl: "https://i.scdn.co/image/ab6765630000ba8a8f6d612a29f10c96b5c63076"
      },
      {
        id: "7eS2DsIMPgRduXYs9QWe1D",
        title: "Rav Yossef Ben-Shoushan - Étude des Orot du Rav Kook",
        duration: "46:14",
        publishedAt: "2025-05-14",
        teacher: "Rav Yossef Ben-Shoushan",
        url: "https://open.spotify.com/episode/7eS2DsIMPgRduXYs9QWe1D",
        description: "Étude approfondie des écrits du Rav Kook sur la Techouva",
        imageUrl: "https://i.scdn.co/image/ab6765630000ba8a8f6d612a29f10c96b5c63076"
      },
      {
        id: "2tYl3hi71dojU3Bi3dgJh8",
        title: "Rav Yossef Ben-Shoushan - Étude de Orot Hatechouva",
        duration: "38:00",
        publishedAt: "2025-05-11",
        teacher: "Rav Yossef Ben-Shoushan",
        url: "https://open.spotify.com/episode/2tYl3hi71dojU3Bi3dgJh8",
        description: "Étude approfondie de Orot Hatechouva du Rav Kook",
        imageUrl: "https://i.scdn.co/image/ab6765630000ba8a8f6d612a29f10c96b5c63076"
      },
      {
        id: "4nAAiPLwH97VcWfvsc1BTj",
        title: "Rav Yehuda Ben-Ichay - Paracha Ahare Mot-Kedochim - Tout peut s'arranger",
        duration: "1:04:11",
        publishedAt: "2025-05-09",
        teacher: "Rav Yehuda Ben-Ichay",
        url: "https://open.spotify.com/episode/4nAAiPLwH97VcWfvsc1BTj",
        description: "Étude de la paracha de la semaine",
        imageUrl: "https://i.scdn.co/image/ab6765630000ba8a8f6d612a29f10c96b5c63076"
      },
      {
        id: "3LQhkE8ecpyKldMgSY41ak",
        title: "Dr Gross - Étude de la paracha - Aharei moth-Quedoshim",
        duration: "56:51",
        publishedAt: "2025-05-09",
        teacher: "Dr Gross",
        url: "https://open.spotify.com/episode/3LQhkE8ecpyKldMgSY41ak",
        description: "Étude hebdomadaire de la paracha avec Dr Gross",
        imageUrl: "https://i.scdn.co/image/ab6765630000ba8a8f6d612a29f10c96b5c63076"
      },
      {
        id: "0vWlZpJqNYBr9Ur9NiF3mW",
        title: "Rav Akerman - Étude du Kol Hator - Épisode 18",
        duration: "35:15",
        publishedAt: "2025-05-07",
        teacher: "Rav Akerman",
        url: "https://open.spotify.com/episode/0vWlZpJqNYBr9Ur9NiF3mW",
        description: "Suite de l'étude du Kol Hator du Gaon de Vilna",
        imageUrl: "https://i.scdn.co/image/ab6765630000ba8a8f6d612a29f10c96b5c63076"
      },
      {
        id: "6UGVIkV3B8XkRJCZ5ttLMO",
        title: "Rav Ben Ichay - Paracha TAZRIA METSORA - Comment être un peuple influent",
        duration: "57:04",
        publishedAt: "2025-05-02",
        teacher: "Rav Ben Ichay",
        url: "https://open.spotify.com/episode/6UGVIkV3B8XkRJCZ5ttLMO",
        description: "Analyse de la paracha de la semaine",
        imageUrl: "https://i.scdn.co/image/ab6765630000ba8a8f6d612a29f10c96b5c63076"
      }
    ];
  } catch (error) {
    console.error("Error in Spotify service:", error);
    return [];
  }
};
