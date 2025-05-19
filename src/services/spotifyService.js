
/**
 * Service pour récupérer les podcasts Spotify
 */

// Fonction pour récupérer les derniers épisodes du podcast Spotify
export const fetchLatestSpotifyEpisodes = async (maxResults = 8) => {
  try {
    console.log("Fetching latest Spotify episodes...");
    
    // En production, ces données seraient récupérées via l'API Spotify
    // Pour le moment, utilisons des liens réels du podcast LILMOD sur Spotify
    
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
        id: "7eNwxtZerDhh7C8EIYr46p",
        title: "Rav Akerman - Étude du Kol Hator - Épisode 27",
        duration: "35:28",
        publishedAt: "2025-05-16",
        teacher: "Rav Akerman",
        url: "https://open.spotify.com/episode/7eNwxtZerDhh7C8EIYr46p",
        description: "Suite de l'étude du Kol Hator du Gaon de Vilna",
        imageUrl: "https://i.scdn.co/image/ab6765630000ba8a8f6d612a29f10c96b5c63076"
      },
      {
        id: "3otTc1rbnoCu1ursllfiy1",
        title: "Rav Ben Ichay - Paracha Emor - Deuxième partie",
        duration: "52:17",
        publishedAt: "2025-05-15",
        teacher: "Rav Ben Ichay",
        url: "https://open.spotify.com/episode/3otTc1rbnoCu1ursllfiy1",
        description: "Suite de l'étude approfondie de la paracha Emor",
        imageUrl: "https://i.scdn.co/image/ab6765630000ba8a8f6d612a29f10c96b5c63076"
      },
      {
        id: "41dMdnxWiTCiyKGQVm7QMB",
        title: "Rav Akerman - Étude du Kol Hator - Épisode 26",
        duration: "39:22",
        publishedAt: "2025-05-14",
        teacher: "Rav Akerman",
        url: "https://open.spotify.com/episode/41dMdnxWiTCiyKGQVm7QMB",
        description: "Suite de l'étude du Kol Hator du Gaon de Vilna",
        imageUrl: "https://i.scdn.co/image/ab6765630000ba8a8f6d612a29f10c96b5c63076"
      },
      {
        id: "4EPsm4kc8SDCopI99REbfV",
        title: "Rav Yossef Ben-Shoushan - Étude des Orot du Rav Kook - Chapitre 3",
        duration: "46:14",
        publishedAt: "2025-05-13",
        teacher: "Rav Yossef Ben-Shoushan",
        url: "https://open.spotify.com/episode/4EPsm4kc8SDCopI99REbfV",
        description: "Étude approfondie des écrits du Rav Kook sur la Techouva",
        imageUrl: "https://i.scdn.co/image/ab6765630000ba8a8f6d612a29f10c96b5c63076"
      },
      {
        id: "0QJY4sAdKBMbSDKuBcvUgL",
        title: "Rav Yossef Ben-Shoushan - Étude de Orot Hatechouva - Partie 2",
        duration: "38:00",
        publishedAt: "2025-05-12",
        teacher: "Rav Yossef Ben-Shoushan",
        url: "https://open.spotify.com/episode/0QJY4sAdKBMbSDKuBcvUgL",
        description: "Étude approfondie de Orot Hatechouva du Rav Kook",
        imageUrl: "https://i.scdn.co/image/ab6765630000ba8a8f6d612a29f10c96b5c63076"
      },
      {
        id: "6Fu7VvlAIsvvYnUzaoUWly",
        title: "Rav Yehuda Ben-Ichay - Paracha Ahare Mot-Kedochim - Tout peut s'arranger",
        duration: "1:04:11",
        publishedAt: "2025-05-10",
        teacher: "Rav Yehuda Ben-Ichay",
        url: "https://open.spotify.com/episode/6Fu7VvlAIsvvYnUzaoUWly",
        description: "Étude de la paracha de la semaine",
        imageUrl: "https://i.scdn.co/image/ab6765630000ba8a8f6d612a29f10c96b5c63076"
      },
      {
        id: "1Ruagwl0ozdnzI56A9n5wN",
        title: "Dr Gross - Étude de la paracha - Aharei moth-Quedoshim",
        duration: "56:51",
        publishedAt: "2025-05-09",
        teacher: "Dr Gross",
        url: "https://open.spotify.com/episode/1Ruagwl0ozdnzI56A9n5wN",
        description: "Étude hebdomadaire de la paracha avec Dr Gross",
        imageUrl: "https://i.scdn.co/image/ab6765630000ba8a8f6d612a29f10c96b5c63076"
      }
    ];
  } catch (error) {
    console.error("Error in Spotify service:", error);
    return [];
  }
};
