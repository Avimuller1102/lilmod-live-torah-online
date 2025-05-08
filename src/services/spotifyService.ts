
/**
 * Service pour récupérer les podcasts Spotify
 */

export type SpotifyEpisode = {
  id: string;
  title: string;
  duration: string;
  publishedAt: string;
  teacher: string;
};

// Fonction pour récupérer les derniers épisodes du podcast Spotify
export const fetchLatestSpotifyEpisodes = async (
  maxResults: number = 4
): Promise<SpotifyEpisode[]> => {
  try {
    // Dans un environnement réel, vous devriez utiliser l'API Spotify
    console.log("Fetching latest Spotify episodes...");
    
    // Pour l'instant, nous retournons des données simulées
    // Dans une version finale, remplacez ceci par un appel API réel
    return [
      {
        id: "ep1",
        title: "Le Rav Kook et la Terre d'Israël",
        duration: "52:14",
        publishedAt: "2023-05-01",
        teacher: "Rav Yossef Ben-Shoushan"
      },
      {
        id: "ep2",
        title: "Les fêtes juives et leur signification contemporaine",
        duration: "45:30",
        publishedAt: "2023-04-28",
        teacher: "Rav Elie KLING"
      },
      {
        id: "ep3",
        title: "Morale de Guerre - Épisode 8",
        duration: "60:12",
        publishedAt: "2023-04-25",
        teacher: "Rav Akerman"
      },
      {
        id: "ep4",
        title: "La Guéoula - la délivrance d'Israël",
        duration: "48:25",
        publishedAt: "2023-04-20",
        teacher: "Mariacha Drai"
      }
    ];
  } catch (error) {
    console.error("Error fetching Spotify episodes:", error);
    return [];
  }
};

// Pour une version complète avec API Spotify, voici comment le code pourrait être:
/*
export const fetchLatestSpotifyEpisodes = async (
  showId: string = "5oJ8bkMtw0hR1iRxomrSRR", 
  maxResults: number = 4
): Promise<SpotifyEpisode[]> => {
  try {
    // Il faudrait d'abord obtenir un token d'accès Spotify
    // puis faire la requête pour récupérer les épisodes
    const ACCESS_TOKEN = await getSpotifyAccessToken();
    
    const response = await fetch(
      `https://api.spotify.com/v1/shows/${showId}/episodes?limit=${maxResults}`,
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
      teacher: extractTeacherFromDescription(item.description)
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

// Fonction pour formater une durée en millisecondes en format "mm:ss"
function formatDuration(durationMs: number): string {
  const minutes = Math.floor(durationMs / 60000);
  const seconds = Math.floor((durationMs % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Fonction pour extraire le nom de l'enseignant depuis la description
function extractTeacherFromDescription(description: string): string {
  // Logique pour extraire le nom de l'enseignant
  // Cela dépend du format de la description
  return "Enseignant";
}

// Fonction pour formater une date
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR');
}
*/
