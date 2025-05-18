
/**
 * Service pour récupérer les podcasts Spotify
 */

// Fonction pour récupérer les derniers épisodes du podcast Spotify
export const fetchLatestSpotifyEpisodes = async (maxResults = 8) => {
  try {
    console.log("Fetching latest Spotify episodes...");
    
    // Les données sont basées sur les épisodes réels du podcast LILMOD sur Spotify au 18/05/2025
    // Les liens de partage sont des liens directs vers chaque épisode
    
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

// Fonction qui pourrait être utilisée pour une implémentation réelle avec l'API Spotify
/*
export const fetchRealTimeSpotifyEpisodes = async (maxResults = 8) => {
  try {
    // Pour une utilisation avec l'API Spotify, ces valeurs doivent être configurées
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    const showId = "5oJ8bkMtw0hR1iRxomrSRR";
    
    // Obtenir un token d'accès
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(`${clientId}:${clientSecret}`)
      },
      body: 'grant_type=client_credentials'
    });
    
    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;
    
    // Récupérer les épisodes
    const episodesResponse = await fetch(
      `https://api.spotify.com/v1/shows/${showId}/episodes?limit=${maxResults}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    if (!episodesResponse.ok) {
      throw new Error('Erreur lors de la récupération des épisodes Spotify');
    }
    
    const data = await episodesResponse.json();
    
    return data.items.map(item => {
      return {
        id: item.id,
        title: item.name,
        duration: formatSpotifyDuration(item.duration_ms),
        publishedAt: new Date(item.release_date).toISOString().split('T')[0],
        teacher: extractTeacherFromName(item.name),
        url: item.external_urls.spotify,
        description: item.description,
        imageUrl: item.images[0]?.url
      };
    });
    
  } catch (error) {
    console.error("Error in Spotify service:", error);
    return [];
  }
};

// Formater la durée Spotify (millisecondes -> MM:SS)
function formatSpotifyDuration(durationMs) {
  const minutes = Math.floor(durationMs / 60000);
  const seconds = Math.floor((durationMs % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Extraire le nom de l'enseignant du titre
function extractTeacherFromName(name) {
  const match = name.match(/^(Rav|Dr\.|Rabbi)\s+([^\s-]+(\s+[^\s-]+)?)/i);
  return match ? match[0] : "Enseignant";
}
*/
