
/**
 * Service pour récupérer les podcasts Spotify avec l'API
 */

// Configuration Spotify
const CLIENT_ID = 'de656bbec2fe41d98db2b4e746be06b6';
const CLIENT_SECRET = 'REDACTED';
const SHOW_ID = '5oJ8bkMtw0hR1iRxomrSRR';

// Fonction pour obtenir le token d'accès Spotify
const getSpotifyToken = async () => {
  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Error getting Spotify token:', error);
    throw error;
  }
};

// Fonction pour récupérer les derniers épisodes du podcast Spotify
export const fetchLatestSpotifyEpisodes = async (maxResults = 8) => {
  try {
    console.log("Fetching latest Spotify episodes...");
    
    const accessToken = await getSpotifyToken();
    
    const apiUrl = `https://api.spotify.com/v1/shows/${SHOW_ID}/episodes?market=FR&limit=${maxResults}`;
    
    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.items) {
      console.warn("No items found in Spotify API response");
      return [];
    }

    // Transformer les données pour correspondre au format attendu
    const episodes = data.items.slice(0, 8).map(episode => ({
      id: episode.id,
      title: episode.name,
      duration: episode.duration_ms ? formatDuration(episode.duration_ms) : 'N/A',
      publishedAt: episode.release_date,
      teacher: extractTeacherFromTitle(episode.name),
      url: episode.external_urls.spotify,
      description: episode.description ? episode.description.substring(0, 150) + '...' : '',
      imageUrl: episode.images && episode.images.length > 0 ? episode.images[0].url : null
    }));

    console.log(`Fetched ${episodes.length} Spotify episodes`);
    return episodes;

  } catch (error) {
    console.error("Error in Spotify service:", error);
    
    // Fallback vers des données statiques en cas d'erreur (limité à 8)
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
  }
};

// Fonction utilitaire pour formater la durée depuis millisecondes
const formatDuration = (durationMs) => {
  const totalSeconds = Math.floor(durationMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  } else {
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
};

// Fonction utilitaire pour extraire le nom de l'enseignant
const extractTeacherFromTitle = (title) => {
  const match = title.match(/^(Rav\s+[^-]+|Dr\s+[^-]+|Rabbi\s+[^-]+)/i);
  return match ? match[1].trim() : 'LILMOD';
};
