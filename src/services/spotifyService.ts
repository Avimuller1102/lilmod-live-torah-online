
/**
 * Service pour récupérer les podcasts Spotify
 */

export type SpotifyEpisode = {
  id: string;
  title: string;
  duration: string;
  publishedAt: string;
  teacher: string;
  url: string;
  description?: string;
  imageUrl?: string;
};

// Fonction pour récupérer les derniers épisodes du podcast Spotify
export const fetchLatestSpotifyEpisodes = async (
  maxResults: number = 8
): Promise<SpotifyEpisode[]> => {
  try {
    console.log("Fetching latest Spotify episodes...");
    
    // En production, utiliser l'API Spotify avec l'ID du show: 5oJ8bkMtw0hR1iRxomrSRR
    // Cette version simule les données mais avec des titres plus précis
    
    return [
      {
        id: "ep1",
        title: "Cours sur le Guide des Égarés - partie 3",
        duration: "52:14",
        publishedAt: "2025-05-10",
        teacher: "Rav Botschko",
        url: "https://open.spotify.com/episode/5CNZHOSLjeIRhf2hWJTpev",
        description: "Étude approfondie du Guide des Égarés du Rambam, troisième partie.",
        imageUrl: "https://i.scdn.co/image/ab6765630000ba8a8f6d612a29f10c96b5c63076"
      },
      {
        id: "ep2",
        title: "Paracha Ki Tétsé - Les lois spirituelles",
        duration: "45:30",
        publishedAt: "2025-05-08",
        teacher: "Rav Elie KLING",
        url: "https://open.spotify.com/episode/1DtIgwtHHp7kLiT1XOnYJZ",
        description: "Analyse des lois spirituelles dans la paracha Ki Tétsé.",
        imageUrl: "https://i.scdn.co/image/ab6765630000ba8a8f6d612a29f10c96b5c63076"
      },
      {
        id: "ep3",
        title: "Réflexion sur la Guéoula - Épisode 8",
        duration: "60:12",
        publishedAt: "2025-05-06",
        teacher: "Rav Chouraqui",
        url: "https://open.spotify.com/episode/3WJZEZSZWKFTQJfw5nXQLP",
        description: "Huitième volet de notre série sur la Guéoula et ses implications contemporaines.",
        imageUrl: "https://i.scdn.co/image/ab6765630000ba8a8f6d612a29f10c96b5c63076"
      },
      {
        id: "ep4",
        title: "Le Rambam et la science moderne",
        duration: "48:25",
        publishedAt: "2025-05-04",
        teacher: "Rav Ouziel",
        url: "https://open.spotify.com/episode/2KZ0C7KhrPgo2hGgSlEC4s",
        description: "Exploration des parallèles entre les enseignements du Rambam et la science moderne.",
        imageUrl: "https://i.scdn.co/image/ab6765630000ba8a8f6d612a29f10c96b5c63076"
      },
      {
        id: "ep5",
        title: "L'histoire du peuple juif à travers les âges",
        duration: "55:18",
        publishedAt: "2025-05-02",
        teacher: "Ariel Assaf",
        url: "https://open.spotify.com/episode/4YzIJkYTh9MMVmuugHjsz6",
        description: "Panorama historique du peuple juif et de ses contributions au monde.",
        imageUrl: "https://i.scdn.co/image/ab6765630000ba8a8f6d612a29f10c96b5c63076"
      },
      {
        id: "ep6",
        title: "La Kabbale pour les débutants - Introduction",
        duration: "41:33",
        publishedAt: "2025-04-30",
        teacher: "Rav Ben Ichay",
        url: "https://open.spotify.com/episode/6aTnCRQl9SbgAOFcPtAMVH",
        description: "Introduction aux concepts fondamentaux de la Kabbale pour les débutants.",
        imageUrl: "https://i.scdn.co/image/ab6765630000ba8a8f6d612a29f10c96b5c63076"
      },
      {
        id: "ep7",
        title: "L'identité juive à l'ère moderne",
        duration: "53:45",
        publishedAt: "2025-04-28",
        teacher: "Georges Spira",
        url: "https://open.spotify.com/episode/7BYDZDTkpvkFGeQsfhmMRq",
        description: "Réflexion sur les défis de l'identité juive dans le monde contemporain.",
        imageUrl: "https://i.scdn.co/image/ab6765630000ba8a8f6d612a29f10c96b5c63076"
      },
      {
        id: "ep8",
        title: "Les prophètes et leur message contemporain",
        duration: "58:20",
        publishedAt: "2025-04-26",
        teacher: "Rav Fizson",
        url: "https://open.spotify.com/episode/8DGIctyK0p6rCJZ7YtCkmL",
        description: "Étude des textes prophétiques et leur pertinence dans notre monde moderne.",
        imageUrl: "https://i.scdn.co/image/ab6765630000ba8a8f6d612a29f10c96b5c63076"
      }
    ];
  } catch (error) {
    console.error("Error fetching Spotify episodes:", error);
    return [];
  }
};

// Implémentation réelle avec l'API Spotify (à activer en production)
/*
export const fetchLatestSpotifyEpisodes = async (
  maxResults: number = 8
): Promise<SpotifyEpisode[]> => {
  try {
    const ACCESS_TOKEN = await getSpotifyAccessToken();
    const SHOW_ID = "5oJ8bkMtw0hR1iRxomrSRR"; // ID du show LILMOD
    
    const response = await fetch(
      `https://api.spotify.com/v1/shows/${SHOW_ID}/episodes?limit=${maxResults}`,
      {
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`
        }
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch Spotify data');
    }
    
    const data = await response.json();
    
    return data.items.map((item: any) => ({
      id: item.id,
      title: item.name,
      duration: formatDuration(item.duration_ms),
      publishedAt: formatDate(item.release_date),
      teacher: extractTeacherFromDescription(item.description),
      url: item.external_urls.spotify,
      description: item.description,
      imageUrl: item.images[0]?.url
    }));
  } catch (error) {
    console.error("Error fetching Spotify episodes:", error);
    return [];
  }
};

// Fonction pour obtenir un token d'accès Spotify
async function getSpotifyAccessToken() {
  const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
  const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
  
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)
    },
    body: 'grant_type=client_credentials'
  });
  
  const data = await response.json();
  return data.access_token;
}

// Fonctions utilitaires pour le formatage des données Spotify
function formatDuration(durationMs: number): string {
  const minutes = Math.floor(durationMs / 60000);
  const seconds = Math.floor((durationMs % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function extractTeacherFromDescription(description: string): string {
  const teacherMatch = description.match(/par\s+([^:]+)/i);
  return teacherMatch ? teacherMatch[1].trim() : "Enseignant";
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR');
}
*/
