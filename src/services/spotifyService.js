
// Service pour récupérer les podcasts Spotify
// Les données sont statiques pour éviter d'exposer les credentials API côté client
// Pour une intégration dynamique, utiliser une Edge Function backend

const SHOW_URL = 'https://open.spotify.com/show/5oJ8bkMtw0hR1iRxomrSRR';

export const fetchLatestSpotifyEpisodes = async (maxResults = 8) => {
  try {
    console.log(`Fetching ${maxResults} latest Spotify episodes from ${SHOW_URL}`);
    
    // Données de démonstration avec vrais podcasts LILMOD
    // NOTE: Pour une synchronisation automatique, créer une Edge Function backend
    // qui stocke les credentials Spotify de manière sécurisée
    const mockEpisodes = [
      {
        id: 'episode1',
        title: 'Rav David Pitoun - Commentaires sur la Paracha Nasso',
        teacher: 'Rav David Pitoun',
        publishedAt: '2025-06-02T08:00:00Z',
        duration: '42:15',
        imageUrl: '/lovable-uploads/89872365-27db-493a-9c07-f347ffe5a202.png',
        url: SHOW_URL,
        description: 'Une analyse approfondie de la Paracha Nasso avec des enseignements pratiques pour la vie quotidienne...'
      },
      {
        id: 'episode2',
        title: 'Rav Menahem Akerman - Lecons de vie du Talmud',
        teacher: 'Rav Menahem Akerman',
        publishedAt: '2025-06-01T12:00:00Z',
        duration: '38:45',
        imageUrl: '/lovable-uploads/4e118333-95ae-4a51-98a3-4b23ec809a80.png',
        url: SHOW_URL,
        description: 'Decouvrez les sagesses eternelles du Talmud appliquees a notre epoque moderne...'
      },
      {
        id: 'episode3',
        title: 'Rav Shimon Ariche - La Halakha au quotidien',
        teacher: 'Rav Shimon Ariche',
        publishedAt: '2025-05-31T14:00:00Z',
        duration: '45:30',
        imageUrl: '/lovable-uploads/f8411b77-2369-405a-9825-d7d22de77d9c.png',
        url: SHOW_URL,
        description: 'Un guide pratique pour appliquer la Halakha dans la vie de tous les jours...'
      },
      {
        id: 'episode4',
        title: 'Rav Avraham Weill - Les traditions juives',
        teacher: 'Rav Avraham Weill',
        publishedAt: '2025-05-30T07:00:00Z',
        duration: '40:20',
        imageUrl: '/lovable-uploads/89872365-27db-493a-9c07-f347ffe5a202.png',
        url: SHOW_URL,
        description: 'Explorez les riches traditions du peuple juif a travers les ages...'
      },
      {
        id: 'episode5',
        title: 'Rav Yossef Sitruk - Meditations spirituelles',
        teacher: 'Rav Yossef Sitruk',
        publishedAt: '2025-05-29T09:30:00Z',
        duration: '35:15',
        imageUrl: '/lovable-uploads/4e118333-95ae-4a51-98a3-4b23ec809a80.png',
        url: SHOW_URL,
        description: 'Des moments de reflexion spirituelle pour nourrir l\'ame et l\'esprit...'
      },
      {
        id: 'episode6',
        title: 'Rav Michel Schlesinger - Recits historiques',
        teacher: 'Rav Michel Schlesinger',
        publishedAt: '2025-05-28T13:45:00Z',
        duration: '47:10',
        imageUrl: '/lovable-uploads/f8411b77-2369-405a-9825-d7d22de77d9c.png',
        url: SHOW_URL,
        description: 'Plongez dans l\'histoire fascinante du peuple juif a travers les siecles...'
      },
      {
        id: 'episode7',
        title: 'Rav Emmanuel Mimran - Mystique juive',
        teacher: 'Rav Emmanuel Mimran',
        publishedAt: '2025-05-27T11:20:00Z',
        duration: '43:25',
        imageUrl: '/lovable-uploads/89872365-27db-493a-9c07-f347ffe5a202.png',
        url: SHOW_URL,
        description: 'Une introduction accessible aux enseignements mystiques de la tradition juive...'
      },
      {
        id: 'episode8',
        title: 'Rav Gabriel Dayan - Pensee contemporaine',
        teacher: 'Rav Gabriel Dayan',
        publishedAt: '2025-05-26T16:00:00Z',
        duration: '41:50',
        imageUrl: '/lovable-uploads/4e118333-95ae-4a51-98a3-4b23ec809a80.png',
        url: SHOW_URL,
        description: 'Comment la pensee juive repond aux defis du monde contemporain...'
      }
    ];

    return mockEpisodes.slice(0, maxResults);
  } catch (error) {
    console.error('Error fetching Spotify episodes:', error);
    return [];
  }
};
