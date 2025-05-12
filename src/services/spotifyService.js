
/**
 * Service pour récupérer les podcasts Spotify
 */

// Fonction pour récupérer les derniers épisodes du podcast Spotify
export const fetchLatestSpotifyEpisodes = async (maxResults = 8) => {
  try {
    console.log("Fetching latest Spotify episodes...");
    
    const showUrl = "https://open.spotify.com/show/5oJ8bkMtw0hR1iRxomrSRR";
    
    // En production, utiliser l'API Spotify avec l'ID du show: 5oJ8bkMtw0hR1iRxomrSRR
    // Cette version simule les données mais correspond aux épisodes réels
    
    return [
      {
        id: "ep1",
        title: "Rav Yossef Ben-Shoushan - Étude de Orot Hatechouva",
        duration: "38:00",
        publishedAt: "2025-05-11",
        teacher: "Rav Yossef Ben-Shoushan",
        url: `${showUrl}/episode1`,
        description: "Étude approfondie de Orot Hatechouva du Rav Kook",
        imageUrl: "https://i.scdn.co/image/ab6765630000ba8a8f6d612a29f10c96b5c63076"
      },
      {
        id: "ep2",
        title: "Paracha Ahare Mot-Kedochim - Tout peut s'arranger",
        duration: "1:04:11",
        publishedAt: "2025-05-09",
        teacher: "Rav Yehuda Ben-Ichay",
        url: `${showUrl}/episode2`,
        description: "Étude de la paracha de la semaine",
        imageUrl: "https://i.scdn.co/image/ab6765630000ba8a8f6d612a29f10c96b5c63076"
      },
      {
        id: "ep3",
        title: "Étude de la paracha - Aharei moth-Quedoshim",
        duration: "56:51",
        publishedAt: "2025-05-09",
        teacher: "Dr Gross",
        url: `${showUrl}/episode3`,
        description: "Étude hebdomadaire de la paracha avec Dr Gross",
        imageUrl: "https://i.scdn.co/image/ab6765630000ba8a8f6d612a29f10c96b5c63076"
      },
      {
        id: "ep4",
        title: "Étude du Kol Hator - Épisode 18",
        duration: "35:15",
        publishedAt: "2025-05-05",
        teacher: "Rav Akerman",
        url: `${showUrl}/episode4`,
        description: "Suite de l'étude du Kol Hator du Gaon de Vilna",
        imageUrl: "https://i.scdn.co/image/ab6765630000ba8a8f6d612a29f10c96b5c63076"
      },
      {
        id: "ep5",
        title: "Paracha TAZRIA METSORA - Comment être un peuple influent",
        duration: "57:04",
        publishedAt: "2025-05-02",
        teacher: "Rav Ben Ichay",
        url: `${showUrl}/episode5`,
        description: "Analyse de la paracha de la semaine",
        imageUrl: "https://i.scdn.co/image/ab6765630000ba8a8f6d612a29f10c96b5c63076"
      },
      {
        id: "ep6",
        title: "Étude du Kol Ator du Gaon de Vilna - YOM HATSMAOUT",
        duration: "52:25",
        publishedAt: "2025-04-28",
        teacher: "Rav Menahem Akerman",
        url: `${showUrl}/episode6`,
        description: "Étude spéciale pour Yom Hatsmaout",
        imageUrl: "https://i.scdn.co/image/ab6765630000ba8a8f6d612a29f10c96b5c63076"
      },
      {
        id: "ep7",
        title: "Ouverture midrashique sur Yom Hatsmaout - Chir hachirim",
        duration: "1:01:43",
        publishedAt: "2025-04-27",
        teacher: "Rav Elie KLING",
        url: `${showUrl}/episode7`,
        description: "Lecture midrashique pour Yom Hatsmaout",
        imageUrl: "https://i.scdn.co/image/ab6765630000ba8a8f6d612a29f10c96b5c63076"
      },
      {
        id: "ep8",
        title: "Etude de texte du Rav Kook",
        duration: "45:30",
        publishedAt: "2025-04-24",
        teacher: "Rav Yossef Ben-Shoushan",
        url: `${showUrl}/episode8`,
        description: "Étude des textes du Rav Kook et leur pertinence",
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

