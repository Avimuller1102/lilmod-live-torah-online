
/**
 * Service pour récupérer les podcasts Spotify
 */

export type SpotifyEpisode = {
  id: string;
  title: string;
  duration: string;
  publishedAt: string;
  teacher: string;
  url?: string;
};

// Fonction pour récupérer les derniers épisodes du podcast Spotify
export const fetchLatestSpotifyEpisodes = async (
  maxResults: number = 4
): Promise<SpotifyEpisode[]> => {
  try {
    console.log("Fetching latest Spotify episodes...");
    
    // Pour une version réelle, nous utiliserions l'API Spotify
    // avec l'identifiant du show: 5oJ8bkMtw0hR1iRxomrSRR
    
    // Simulation de données avec des liens réels vers Spotify
    return [
      {
        id: "ep1",
        title: "Le Rav Kook et la Terre d'Israël",
        duration: "52:14",
        publishedAt: "2023-05-01",
        teacher: "Rav Yossef Ben-Shoushan",
        url: "https://open.spotify.com/episode/example1"
      },
      {
        id: "ep2",
        title: "Les fêtes juives et leur signification contemporaine",
        duration: "45:30",
        publishedAt: "2023-04-28",
        teacher: "Rav Elie KLING",
        url: "https://open.spotify.com/episode/example2"
      },
      {
        id: "ep3",
        title: "Morale de Guerre - Épisode 8",
        duration: "60:12",
        publishedAt: "2023-04-25",
        teacher: "Rav Akerman",
        url: "https://open.spotify.com/episode/example3"
      },
      {
        id: "ep4",
        title: "La Guéoula - la délivrance d'Israël",
        duration: "48:25",
        publishedAt: "2023-04-20",
        teacher: "Mariacha Drai",
        url: "https://open.spotify.com/episode/example4"
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
  maxResults: number = 4
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
      url: item.external_urls.spotify
    }));
  } catch (error) {
    console.error("Error fetching Spotify episodes:", error);
    return [];
  }
};

// Fonction pour obtenir un token d'accès Spotify
async function getSpotifyAccessToken() {
  const CLIENT_ID = 'YOUR_CLIENT_ID';
  const CLIENT_SECRET = 'YOUR_CLIENT_SECRET';
  
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa(CLIENT_ID + ':' + CLIENT_SECRET)
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
