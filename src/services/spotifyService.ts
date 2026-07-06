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

export async function fetchSpotifyShow(): Promise<SpotifyShow | null> {
  return null;
}

export async function fetchSpotifyEpisodes(limit: number = 6): Promise<SpotifyEpisode[]> {
  const liveEpisodes = await fetchFromServerless(limit);
  if (liveEpisodes.length > 0) {
    return liveEpisodes;
  }

  return [];
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
  if (!ms || ms <= 0) {
    return "Audio Spotify";
  }

  const totalMinutes = Math.floor(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0) {
    return `${hours}h ${minutes.toString().padStart(2, "0")}min`;
  }
  return `${minutes} min`;
}

export function formatReleaseDate(dateString: string): string {
  if (!dateString) {
    return "Récent";
  }

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
}
