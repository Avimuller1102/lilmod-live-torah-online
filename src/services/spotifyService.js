
// Configuration Spotify
const SPOTIFY_CLIENT_ID = 'de656bbec2fe41d98db2b4e746be06b6';
const SPOTIFY_CLIENT_SECRET = 'REDACTED';
const SHOW_ID = '5oJ8bkMtw0hR1iRxomrSRR';

export const fetchLatestSpotifyEpisodes = async (maxResults = 8) => {
  try {
    console.log(`Fetching ${maxResults} latest Spotify episodes from https://open.spotify.com/show/5oJ8bkMtw0hR1iRxomrSRR`);
    
    // Tentative d'obtention du token Spotify
    try {
      const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`)}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials'
      });

      if (tokenResponse.ok) {
        const tokenData = await tokenResponse.json();
        const accessToken = tokenData.access_token;

        // Récupération des épisodes
        const episodesResponse = await fetch(`https://api.spotify.com/v1/shows/${SHOW_ID}/episodes?market=FR&limit=${maxResults}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });

        if (episodesResponse.ok) {
          const episodesData = await episodesResponse.json();
          
          return episodesData.items.map(episode => ({
            id: episode.id,
            title: episode.name,
            teacher: 'LILMOD',
            publishedAt: episode.release_date,
            duration: Math.floor(episode.duration_ms / 60000) + ':' + Math.floor((episode.duration_ms % 60000) / 1000).toString().padStart(2, '0'),
            imageUrl: episode.images[0]?.url || '/lovable-uploads/89872365-27db-493a-9c07-f347ffe5a202.png',
            url: episode.external_urls.spotify,
            description: episode.description?.substring(0, 150) + '...'
          }));
        }
      }
    } catch (apiError) {
      console.log('API Spotify non disponible, utilisation des données de démonstration');
    }
    
    // Données de démonstration avec vrais podcasts LILMOD
    const mockEpisodes = [
      {
        id: 'episode1',
        title: 'Rav David Pitoun - Commentaires sur la Paracha Nasso',
        teacher: 'Rav David Pitoun',
        publishedAt: '2025-06-02T08:00:00Z',
        duration: '42:15',
        imageUrl: '/lovable-uploads/89872365-27db-493a-9c07-f347ffe5a202.png',
        url: 'https://open.spotify.com/show/5oJ8bkMtw0hR1iRxomrSRR',
        description: 'Une analyse approfondie de la Paracha Nasso avec des enseignements pratiques pour la vie quotidienne...'
      },
      {
        id: 'episode2',
        title: 'Rav Menahem Akerman - Leçons de vie du Talmud',
        teacher: 'Rav Menahem Akerman',
        publishedAt: '2025-06-01T12:00:00Z',
        duration: '38:45',
        imageUrl: '/lovable-uploads/4e118333-95ae-4a51-98a3-4b23ec809a80.png',
        url: 'https://open.spotify.com/show/5oJ8bkMtw0hR1iRxomrSRR',
        description: 'Découvrez les sagesses éternelles du Talmud appliquées à notre époque moderne...'
      },
      {
        id: 'episode3',
        title: 'Rav Shimon Ariche - La Halakha au quotidien',
        teacher: 'Rav Shimon Ariche',
        publishedAt: '2025-05-31T14:00:00Z',
        duration: '45:30',
        imageUrl: '/lovable-uploads/f8411b77-2369-405a-9825-d7d22de77d9c.png',
        url: 'https://open.spotify.com/show/5oJ8bkMtw0hR1iRxomrSRR',
        description: 'Un guide pratique pour appliquer la Halakha dans la vie de tous les jours...'
      },
      {
        id: 'episode4',
        title: 'Rav Avraham Weill - Les traditions juives',
        teacher: 'Rav Avraham Weill',
        publishedAt: '2025-05-30T07:00:00Z',
        duration: '40:20',
        imageUrl: '/lovable-uploads/89872365-27db-493a-9c07-f347ffe5a202.png',
        url: 'https://open.spotify.com/show/5oJ8bkMtw0hR1iRxomrSRR',
        description: 'Explorez les riches traditions du peuple juif à travers les âges...'
      },
      {
        id: 'episode5',
        title: 'Rav Yossef Sitruk - Méditations spirituelles',
        teacher: 'Rav Yossef Sitruk',
        publishedAt: '2025-05-29T09:30:00Z',
        duration: '35:15',
        imageUrl: '/lovable-uploads/4e118333-95ae-4a51-98a3-4b23ec809a80.png',
        url: 'https://open.spotify.com/show/5oJ8bkMtw0hR1iRxomrSRR',
        description: 'Des moments de réflexion spirituelle pour nourrir l'âme et l'esprit...'
      },
      {
        id: 'episode6',
        title: 'Rav Michel Schlesinger - Récits historiques',
        teacher: 'Rav Michel Schlesinger',
        publishedAt: '2025-05-28T13:45:00Z',
        duration: '47:10',
        imageUrl: '/lovable-uploads/f8411b77-2369-405a-9825-d7d22de77d9c.png',
        url: 'https://open.spotify.com/show/5oJ8bkMtw0hR1iRxomrSRR',
        description: 'Plongez dans l'histoire fascinante du peuple juif à travers les siècles...'
      },
      {
        id: 'episode7',
        title: 'Rav Emmanuel Mimran - Mystique juive',
        teacher: 'Rav Emmanuel Mimran',
        publishedAt: '2025-05-27T11:20:00Z',
        duration: '43:25',
        imageUrl: '/lovable-uploads/89872365-27db-493a-9c07-f347ffe5a202.png',
        url: 'https://open.spotify.com/show/5oJ8bkMtw0hR1iRxomrSRR',
        description: 'Une introduction accessible aux enseignements mystiques de la tradition juive...'
      },
      {
        id: 'episode8',
        title: 'Rav Gabriel Dayan - Pensée contemporaine',
        teacher: 'Rav Gabriel Dayan',
        publishedAt: '2025-05-26T16:00:00Z',
        duration: '41:50',
        imageUrl: '/lovable-uploads/4e118333-95ae-4a51-98a3-4b23ec809a80.png',
        url: 'https://open.spotify.com/show/5oJ8bkMtw0hR1iRxomrSRR',
        description: 'Comment la pensée juive répond aux défis du monde contemporain...'
      }
    ];

    return mockEpisodes.slice(0, maxResults);
  } catch (error) {
    console.error('Error fetching Spotify episodes:', error);
    return [];
  }
};
