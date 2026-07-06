import { fetchSpotifyEpisodes } from "./spotifyService.ts";

export const fetchLatestSpotifyEpisodes = async (maxResults = 8) => {
  const episodes = await fetchSpotifyEpisodes(maxResults);

  return episodes.map((episode) => ({
    id: episode.id,
    title: episode.name,
    teacher: "LILMOD",
    publishedAt: episode.release_date,
    duration: `${Math.floor(episode.duration_ms / 60000)} min`,
    imageUrl: episode.images?.[0]?.url || "/lovable-uploads/ef1966f8-ad71-4e6c-ac5f-613ab18d578c.png",
    url: episode.external_urls.spotify,
    description: episode.description,
  }));
};
