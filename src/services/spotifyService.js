
export const fetchLatestSpotifyEpisodes = async (maxResults = 8) => {
  try {
    console.log(`Fetching ${maxResults} latest Spotify episodes...`);
    
    // Données simulées pour les épisodes Spotify
    const mockEpisodes = [
      {
        id: 'episode1',
        title: 'Rav David Pitoun - Les mystères de la Paracha',
        description: 'Une exploration profonde des enseignements cachés dans la Torah',
        publishedAt: '2025-06-02T08:00:00Z',
        duration: '42:15',
        url: 'https://open.spotify.com/episode/episode1',
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
        teacher: 'Rav David Pitoun'
      },
      {
        id: 'episode2',
        title: 'Rav Menahem Akerman - Éthique talmudique',
        description: 'Les principes moraux dans la tradition juive',
        publishedAt: '2025-06-01T12:00:00Z',
        duration: '35:40',
        url: 'https://open.spotify.com/episode/episode2',
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
        teacher: 'Rav Menahem Akerman'
      },
      {
        id: 'episode3',
        title: 'Rav Shimon Ariche - Halakha pratique',
        description: 'Application de la loi juive dans la vie moderne',
        publishedAt: '2025-05-31T14:30:00Z',
        duration: '48:20',
        url: 'https://open.spotify.com/episode/episode3',
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
        teacher: 'Rav Shimon Ariche'
      },
      {
        id: 'episode4',
        title: 'Rav Avraham Weill - Fêtes et traditions',
        description: 'Le sens profond des célébrations juives',
        publishedAt: '2025-05-30T10:15:00Z',
        duration: '39:50',
        url: 'https://open.spotify.com/episode/episode4',
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
        teacher: 'Rav Avraham Weill'
      },
      {
        id: 'episode5',
        title: 'Rav Yossef Sitruk - Spiritualité quotidienne',
        description: 'Intégrer la spiritualité dans nos vies',
        publishedAt: '2025-05-29T16:45:00Z',
        duration: '33:25',
        url: 'https://open.spotify.com/episode/episode5',
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
        teacher: 'Rav Yossef Sitruk'
      },
      {
        id: 'episode6',
        title: 'Rav Michel Schlesinger - Histoire et mémoire',
        description: 'Les leçons de l\'histoire juive',
        publishedAt: '2025-05-28T11:20:00Z',
        duration: '46:35',
        url: 'https://open.spotify.com/episode/episode6',
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
        teacher: 'Rav Michel Schlesinger'
      },
      {
        id: 'episode7',
        title: 'Rav Emmanuel Mimran - Mystique et Kabbale',
        description: 'Introduction aux enseignements mystiques',
        publishedAt: '2025-05-27T09:30:00Z',
        duration: '41:15',
        url: 'https://open.spotify.com/episode/episode7',
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
        teacher: 'Rav Emmanuel Mimran'
      },
      {
        id: 'episode8',
        title: 'Rav Gabriel Dayan - Philosophie et modernité',
        description: 'La pensée juive face aux défis contemporains',
        publishedAt: '2025-05-26T15:10:00Z',
        duration: '37:45',
        url: 'https://open.spotify.com/episode/episode8',
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
        teacher: 'Rav Gabriel Dayan'
      }
    ];

    return mockEpisodes.slice(0, maxResults);
  } catch (error) {
    console.error('Error fetching Spotify episodes:', error);
    return [];
  }
};
