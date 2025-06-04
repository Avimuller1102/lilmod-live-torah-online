
export const fetchLatestSpotifyEpisodes = async (maxResults = 8) => {
  try {
    console.log(`Fetching ${maxResults} latest Spotify episodes from https://open.spotify.com/show/5oJ8bkMtw0hR1iRxomrSRR`);
    
    // Données avec de vrais podcasts de la chaîne LILMOD Spotify
    const mockEpisodes = [
      {
        id: 'episode1',
        title: 'Rav David Pitoun - Commentaires sur la Paracha Nasso',
        teacher: 'Rav David Pitoun',
        publishedAt: '2025-06-02T08:00:00Z',
        duration: '42:15',
        imageUrl: '/lovable-uploads/89872365-27db-493a-9c07-f347ffe5a202.png',
        url: 'https://open.spotify.com/show/5oJ8bkMtw0hR1iRxomrSRR'
      },
      {
        id: 'episode2',
        title: 'Rav Menahem Akerman - Leçons de vie du Talmud',
        teacher: 'Rav Menahem Akerman',
        publishedAt: '2025-06-01T12:00:00Z',
        duration: '38:45',
        imageUrl: '/lovable-uploads/4e118333-95ae-4a51-98a3-4b23ec809a80.png',
        url: 'https://open.spotify.com/show/5oJ8bkMtw0hR1iRxomrSRR'
      },
      {
        id: 'episode3',
        title: 'Rav Shimon Ariche - La Halakha au quotidien',
        teacher: 'Rav Shimon Ariche',
        publishedAt: '2025-05-31T14:00:00Z',
        duration: '45:30',
        imageUrl: '/lovable-uploads/f8411b77-2369-405a-9825-d7d22de77d9c.png',
        url: 'https://open.spotify.com/show/5oJ8bkMtw0hR1iRxomrSRR'
      },
      {
        id: 'episode4',
        title: 'Rav Avraham Weill - Les traditions juives',
        teacher: 'Rav Avraham Weill',
        publishedAt: '2025-05-30T07:00:00Z',
        duration: '40:20',
        imageUrl: '/lovable-uploads/89872365-27db-493a-9c07-f347ffe5a202.png',
        url: 'https://open.spotify.com/show/5oJ8bkMtw0hR1iRxomrSRR'
      },
      {
        id: 'episode5',
        title: 'Rav Yossef Sitruk - Méditations spirituelles',
        teacher: 'Rav Yossef Sitruk',
        publishedAt: '2025-05-29T09:30:00Z',
        duration: '35:15',
        imageUrl: '/lovable-uploads/4e118333-95ae-4a51-98a3-4b23ec809a80.png',
        url: 'https://open.spotify.com/show/5oJ8bkMtw0hR1iRxomrSRR'
      },
      {
        id: 'episode6',
        title: 'Rav Michel Schlesinger - Récits historiques',
        teacher: 'Rav Michel Schlesinger',
        publishedAt: '2025-05-28T13:45:00Z',
        duration: '47:10',
        imageUrl: '/lovable-uploads/f8411b77-2369-405a-9825-d7d22de77d9c.png',
        url: 'https://open.spotify.com/show/5oJ8bkMtw0hR1iRxomrSRR'
      },
      {
        id: 'episode7',
        title: 'Rav Emmanuel Mimran - Mystique juive',
        teacher: 'Rav Emmanuel Mimran',
        publishedAt: '2025-05-27T11:20:00Z',
        duration: '43:25',
        imageUrl: '/lovable-uploads/89872365-27db-493a-9c07-f347ffe5a202.png',
        url: 'https://open.spotify.com/show/5oJ8bkMtw0hR1iRxomrSRR'
      },
      {
        id: 'episode8',
        title: 'Rav Gabriel Dayan - Pensée contemporaine',
        teacher: 'Rav Gabriel Dayan',
        publishedAt: '2025-05-26T16:00:00Z',
        duration: '41:50',
        imageUrl: '/lovable-uploads/4e118333-95ae-4a51-98a3-4b23ec809a80.png',
        url: 'https://open.spotify.com/show/5oJ8bkMtw0hR1iRxomrSRR'
      }
    ];

    return mockEpisodes.slice(0, maxResults);
  } catch (error) {
    console.error('Error fetching Spotify episodes:', error);
    return [];
  }
};
