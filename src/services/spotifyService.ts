/**
 * Spotify public data for the static site.
 *
 * Spotify's Client Credentials flow requires a secret, so production loads
 * the latest show episodes through a Netlify function. The public embed remains
 * visible even without credentials.
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

const SHOW_ID = "5oJ8bkMtw0hR1iRxomrSRR";
const SHOW_URL = `https://open.spotify.com/show/${SHOW_ID}`;

const STATIC_EPISODES: SpotifyEpisode[] = [
  {
    id: "paracha",
    name: "Paracha de la semaine",
    description: "Une lecture actuelle et accessible de la paracha, en lien avec Israël et la vie quotidienne.",
    duration_ms: 3600000,
    release_date: "2026-01-01",
    images: [],
    external_urls: { spotify: SHOW_URL },
  },
  {
    id: "rav-kook",
    name: "Pensée du Rav Kook",
    description: "Étude des grands textes du Rav Kook pour comprendre le retour d'Israël sur sa terre.",
    duration_ms: 2700000,
    release_date: "2026-01-01",
    images: [],
    external_urls: { spotify: SHOW_URL },
  },
  {
    id: "kol-hator",
    name: "Étude du Kol Hator",
    description: "Une série de fond sur la Guéoula, ses étapes et sa résonance dans notre époque.",
    duration_ms: 3000000,
    release_date: "2026-01-01",
    images: [],
    external_urls: { spotify: SHOW_URL },
  },
  {
    id: "questions",
    name: "Questions-réponses",
    description: "Des réponses claires aux questions de la communauté francophone.",
    duration_ms: 2400000,
    release_date: "2026-01-01",
    images: [],
    external_urls: { spotify: SHOW_URL },
  },
  {
    id: "histoire",
    name: "Histoire juive",
    description: "Comprendre les grands moments de l'histoire juive avec des repères précis.",
    duration_ms: 3300000,
    release_date: "2026-01-01",
    images: [],
    external_urls: { spotify: SHOW_URL },
  },
  {
    id: "actualite",
    name: "Actualité et Torah",
    description: "Un regard juif sur l'actualité, depuis Jérusalem.",
    duration_ms: 3000000,
    release_date: "2026-01-01",
    images: [],
    external_urls: { spotify: SHOW_URL },
  },
];

export async function fetchSpotifyShow(): Promise<SpotifyShow | null> {
  return null;
}

export async function fetchSpotifyEpisodes(limit: number = 6): Promise<SpotifyEpisode[]> {
  const liveEpisodes = await fetchFromServerless(limit);
  if (liveEpisodes.length > 0) {
    return liveEpisodes;
  }

  return STATIC_EPISODES.slice(0, limit);
}

async function fetchFromServerless(limit: number): Promise<SpotifyEpisode[]> {
  try {
    const response = await fetch(`/.netlify/functions/spotify-latest?limit=${limit}`);
    if (!response.ok) return [];

    const data = await response.json();
    return Array.isArray(data.episodes) ? data.episodes : [];
  } catch {
    return [];
  }
}

export function formatDuration(ms: number): string {
  const totalMinutes = Math.floor(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0) {
    return `${hours}h ${minutes.toString().padStart(2, "0")}min`;
  }
  return `${minutes} min`;
}

export function formatReleaseDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
}
