
/**
 * Service pour récupérer les podcasts Spotify
 * Cette version utiliserait l'API Spotify dans un environnement de production
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
    
    // Pour une version réelle, nous utiliserions l'API Spotify
    // avec l'identifiant du show: 5oJ8bkMtw0hR1iRxomrSRR
    
    // Simulation de données avec des liens réels vers Spotify
    // Dans une implémentation réelle, ces données viendraient de l'API Spotify
    return [
      {
        id: "ep1",
        title: "Le Rav Kook et la Terre d'Israël",
        duration: "52:14",
        publishedAt: "2023-05-01",
        teacher: "Rav Yossef Ben-Shoushan",
        url: "https://open.spotify.com/episode/5CNZHOSLjeIRhf2hWJTpev",
        description: "Cours sur la vision du Rav Kook concernant la Terre d'Israël et sa signification profonde pour le peuple juif.",
        imageUrl: "https://i.scdn.co/image/ab6765630000ba8a8f6d612a29f10c96b5c63076"
      },
      {
        id: "ep2",
        title: "Les fêtes juives et leur signification",
        duration: "45:30",
        publishedAt: "2023-04-28",
        teacher: "Rav Elie KLING",
        url: "https://open.spotify.com/episode/1DtIgwtHHp7kLiT1XOnYJZ",
        description: "Étude approfondie de la signification des fêtes juives dans le monde contemporain.",
        imageUrl: "https://i.scdn.co/image/ab6765630000ba8a8f6d612a29f10c96b5c63076"
      },
      {
        id: "ep3",
        title: "Morale de Guerre - Épisode 8",
        duration: "60:12",
        publishedAt: "2023-04-25",
        teacher: "Rav Akerman",
        url: "https://open.spotify.com/episode/3WJZEZSZWKFTQJfw5nXQLP",
        description: "Analyse de la morale juive en temps de guerre et ses applications dans les conflits contemporains.",
        imageUrl: "https://i.scdn.co/image/ab6765630000ba8a8f6d612a29f10c96b5c63076"
      },
      {
        id: "ep4",
        title: "La Guéoula - la délivrance d'Israël",
        duration: "48:25",
        publishedAt: "2023-04-20",
        teacher: "Rav Ouziel",
        url: "https://open.spotify.com/episode/2KZ0C7KhrPgo2hGgSlEC4s",
        description: "Étude des sources concernant la Guéoula (délivrance) dans les textes juifs et sa pertinence actuelle.",
        imageUrl: "https://i.scdn.co/image/ab6765630000ba8a8f6d612a29f10c96b5c63076"
      },
      {
        id: "ep5",
        title: "Le sens profond de la Torah",
        duration: "55:18",
        publishedAt: "2023-04-15",
        teacher: "Rav Botshko",
        url: "https://open.spotify.com/episode/4YzIJkYTh9MMVmuugHjsz6",
        description: "Exploration des différentes dimensions de la Torah et de son impact sur notre vie spirituelle.",
        imageUrl: "https://i.scdn.co/image/ab6765630000ba8a8f6d612a29f10c96b5c63076"
      },
      {
        id: "ep6",
        title: "Paracha Vayikra - Approfondir notre connexion",
        duration: "41:33",
        publishedAt: "2023-04-10",
        teacher: "Rav Ben Ichay",
        url: "https://open.spotify.com/episode/6aTnCRQl9SbgAOFcPtAMVH",
        description: "Analyse de la paracha Vayikra et ses enseignements pour notre quotidien.",
        imageUrl: "https://i.scdn.co/image/ab6765630000ba8a8f6d612a29f10c96b5c63076"
      },
      {
        id: "ep7",
        title: "L'histoire juive et son impact sur notre identité",
        duration: "53:45",
        publishedAt: "2023-04-05",
        teacher: "Ariel Assaf",
        url: "https://open.spotify.com/episode/7BYDZDTkpvkFGeQsfhmMRq",
        description: "Réflexion sur l'importance de l'histoire juive dans la construction de notre identité contemporaine.",
        imageUrl: "https://i.scdn.co/image/ab6765630000ba8a8f6d612a29f10c96b5c63076"
      },
      {
        id: "ep8",
        title: "Le Talmud pour les débutants",
        duration: "58:20",
        publishedAt: "2023-04-01",
        teacher: "Rav Chouraqui",
        url: "https://open.spotify.com/episode/8DGIctyK0p6rCJZ7YtCkmL",
        description: "Introduction aux concepts fondamentaux du Talmud pour ceux qui débutent son étude.",
        imageUrl: "https://i.scdn.co/image/ab6765630000ba8a8f6d612a29f10c96b5c63076"
      }
    ];
  } catch (error) {
    console.error("Error fetching Spotify episodes:", error);
    return [];
  }
};

// Pour une implémentation réelle avec l'API Spotify
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
  // Logique pour extraire le nom de l'enseignant depuis la description
  const teacherMatch = description.match(/par\s+([^:]+)/i);
  return teacherMatch ? teacherMatch[1].trim() : "Enseignant";
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR');
}
*/
