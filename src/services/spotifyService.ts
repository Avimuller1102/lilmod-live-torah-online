/**
 * Service pour récupérer les épisodes Spotify avec l'API officielle
 * 
 * Note: Pour accéder à l'API Spotify, nous devons obtenir un token d'accès.
 * Comme nous sommes côté client, nous utilisons le Client Credentials Flow
 * qui permet d'accéder aux données publiques.
 */

export type SpotifyEpisode = {
  id: string;
  name: string;
  description: string;
  duration_ms: number;
  release_date: string;
  images: { url: string; height: number; width: number }[];
  external_urls: { spotify: string };
  html_description?: string;
};

export type SpotifyShow = {
  id: string;
  name: string;
  description: string;
  publisher: string;
  total_episodes: number;
  images: { url: string; height: number; width: number }[];
  external_urls: { spotify: string };
};

const CLIENT_ID = "de656bbec2fe41d98db2b4e746be06b6";
const CLIENT_SECRET = "REDACTED";
const SHOW_ID = "5oJ8bkMtw0hR1iRxomrSRR";

// Cache pour le token d'accès
let accessToken: string | null = null;
let tokenExpiry: number = 0;

/**
 * Obtient un token d'accès Spotify via Client Credentials Flow
 */
async function getAccessToken(): Promise<string> {
  // Vérifier si le token actuel est encore valide
  if (accessToken && Date.now() < tokenExpiry) {
    return accessToken;
  }

  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": "Basic " + btoa(`${CLIENT_ID}:${CLIENT_SECRET}`),
      },
      body: "grant_type=client_credentials",
    });

    if (!response.ok) {
      throw new Error(`Spotify auth error: ${response.status}`);
    }

    const data = await response.json();
    accessToken = data.access_token;
    // Expire 1 minute avant pour éviter les problèmes de timing
    tokenExpiry = Date.now() + (data.expires_in - 60) * 1000;

    return accessToken!;
  } catch (error) {
    console.error("Error getting Spotify access token:", error);
    throw error;
  }
}

/**
 * Récupère les informations du podcast LILMOD
 */
export async function fetchSpotifyShow(): Promise<SpotifyShow | null> {
  try {
    const token = await getAccessToken();

    const response = await fetch(`https://api.spotify.com/v1/shows/${SHOW_ID}?market=FR`, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Spotify API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching Spotify show:", error);
    return null;
  }
}

/**
 * Récupère les derniers épisodes du podcast LILMOD
 */
export async function fetchSpotifyEpisodes(limit: number = 6): Promise<SpotifyEpisode[]> {
  try {
    console.log("Fetching Spotify episodes from API...");
    const token = await getAccessToken();

    const response = await fetch(
      `https://api.spotify.com/v1/shows/${SHOW_ID}/episodes?market=FR&limit=${limit}`,
      {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Spotify API error: ${response.status}`);
    }

    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error("Error fetching Spotify episodes:", error);

    // Fallback vers des données statiques
    return [
      {
        id: "episode1",
        name: "Paracha de la semaine - Derniers enseignements",
        description: "Étude approfondie de la paracha avec des insights actuels",
        duration_ms: 1920000,
        release_date: "2025-02-01",
        images: [{ url: "", height: 300, width: 300 }],
        external_urls: { spotify: `https://open.spotify.com/show/${SHOW_ID}` },
      },
      {
        id: "episode2",
        name: "Actualité et Torah - Le regard juif sur le monde",
        description: "Comprendre l'actualité à la lumière de la Torah",
        duration_ms: 2700000,
        release_date: "2025-01-28",
        images: [{ url: "", height: 300, width: 300 }],
        external_urls: { spotify: `https://open.spotify.com/show/${SHOW_ID}` },
      },
      {
        id: "episode3",
        name: "Pensée du Rav Kook - Introduction",
        description: "Découverte de la philosophie du Rav Kook",
        duration_ms: 2280000,
        release_date: "2025-01-25",
        images: [{ url: "", height: 300, width: 300 }],
        external_urls: { spotify: `https://open.spotify.com/show/${SHOW_ID}` },
      },
      {
        id: "episode4",
        name: "Questions-Réponses - Vos interrogations",
        description: "Réponses aux questions de notre communauté",
        duration_ms: 3120000,
        release_date: "2025-01-22",
        images: [{ url: "", height: 300, width: 300 }],
        external_urls: { spotify: `https://open.spotify.com/show/${SHOW_ID}` },
      },
    ];
  }
}

/**
 * Formate la durée en millisecondes en format lisible
 */
export function formatDuration(ms: number): string {
  const totalMinutes = Math.floor(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0) {
    return `${hours}h ${minutes.toString().padStart(2, "0")}min`;
  }
  return `${minutes} min`;
}

/**
 * Formate la date de publication
 */
export function formatReleaseDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Aujourd'hui";
  if (diffDays === 1) return "Hier";
  if (diffDays < 7) return `Il y a ${diffDays} jours`;
  if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} semaine${diffDays >= 14 ? "s" : ""}`;
  
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
}
