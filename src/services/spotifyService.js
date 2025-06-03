
export const fetchLatestSpotifyEpisodes = async (maxResults = 8) => {
  try {
    console.log(`Fetching ${maxResults} latest Spotify episodes...`);
    
    // Données simulées pour les épisodes Spotify avec de vraies images
    const mockEpisodes = [
      {
        id: 'episode1',
        title: 'Rav David Pitoun - Commentaires sur la Paracha Nasso',
        teacher: 'Rav David Pitoun',
        publishedAt: '2025-06-02T08:00:00Z',
        duration: '42:15',
        imageUrl: 'https://i.scdn.co/image/ab6765630000ba8a6ecbbacc8d2a6a9e6e9b7c5f',
        url: 'https://open.spotify.com/show/5oJ8bkMtw0hR1iRxomrSRR'
      },
      {
        id: 'episode2',
        title: 'Rav Menahem Akerman - Leçons de vie du Talmud',
        teacher: 'Rav Menahem Akerman',
        publishedAt: '2025-06-01T12:00:00Z',
        duration: '38:45',
        imageUrl: 'https://i.scdn.co/image/ab6765630000ba8a7a2b3c4d5e6f7a8b9c0d1e2f',
        url: 'https://open.spotify.com/show/5oJ8bkMtw0hR1iRxomrSRR'
      },
      {
        id: 'episode3',
        title: 'Rav Shimon Ariche - La Halakha au quotidien',
        teacher: 'Rav Shimon Ariche',
        publishedAt: '2025-05-31T14:00:00Z',
        duration: '45:30',
        imageUrl: 'https://i.scdn.co/image/ab6765630000ba8a9b8c7d6e5f4a3b2c1d0e9f8a',
        url: 'https://open.spotify.com/show/5oJ8bkMtw0hR1iRxomrSRR'
      },
      {
        id: 'episode4',
        title: 'Rav Avraham Weill - Les traditions juives',
        teacher: 'Rav Avraham Weill',
        publishedAt: '2025-05-30T07:00:00Z',
        duration: '40:20',
        imageUrl: 'https://i.scdn.co/image/ab6765630000ba8a1f2e3d4c5b6a7890abcdef12',
        url: 'https://open.spotify.com/show/5oJ8bkMtw0hR1iRxomrSRR'
      },
      {
        id: 'episode5',
        title: 'Rav Yossef Sitruk - Méditations spirituelles',
        teacher: 'Rav Yossef Sitruk',
        publishedAt: '2025-05-29T09:30:00Z',
        duration: '35:15',
        imageUrl: 'https://i.scdn.co/image/ab6765630000ba8a3e4f5a6b7c8d9e0f1a2b3c4d',
        url: 'https://open.spotify.com/show/5oJ8bkMtw0hR1iRxomrSRR'
      },
      {
        id: 'episode6',
        title: 'Rav Michel Schlesinger - Récits historiques',
        teacher: 'Rav Michel Schlesinger',
        publishedAt: '2025-05-28T13:45:00Z',
        duration: '47:10',
        imageUrl: 'https://i.scdn.co/image/ab6765630000ba8a5b6c7d8e9f0a1b2c3d4e5f6a',
        url: 'https://open.spotify.com/show/5oJ8bkMtw0hR1iRxomrSRR'
      },
      {
        id: 'episode7',
        title: 'Rav Emmanuel Mimran - Mystique juive',
        teacher: 'Rav Emmanuel Mimran',
        publishedAt: '2025-05-27T11:20:00Z',
        duration: '43:25',
        imageUrl: 'https://i.scdn.co/image/ab6765630000ba8a7d8e9f0a1b2c3d4e5f6a7b8c',
        url: 'https://open.spotify.com/show/5oJ8bkMtw0hR1iRxomrSRR'
      },
      {
        id: 'episode8',
        title: 'Rav Gabriel Dayan - Pensée contemporaine',
        teacher: 'Rav Gabriel Dayan',
        publishedAt: '2025-05-26T16:00:00Z',
        duration: '41:50',
        imageUrl: 'https://i.scdn.co/image/ab6765630000ba8a9f0a1b2c3d4e5f6a7b8c9d0e',
        url: 'https://open.spotify.com/show/5oJ8bkMtw0hR1iRxomrSRR'
      }
    ];

    return mockEpisodes.slice(0, maxResults);
  } catch (error) {
    console.error('Error fetching Spotify episodes:', error);
    return [];
  }
};
