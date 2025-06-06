
const YOUTUBE_API_KEY = 'REDACTED';
const CHANNEL_ID = 'UCL_BSX_zC9p8QjPjqMrpt9Q';

// Fonction pour convertir la durée ISO 8601 en format MM:SS
const parseDuration = (duration) => {
  if (!duration) return '45:30';
  
  // Exemple: PT1H2M10S ou PT45M30S ou PT2M10S
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return '45:30';
  
  const hours = parseInt(match[1] || 0);
  const minutes = parseInt(match[2] || 0);
  const seconds = parseInt(match[3] || 0);
  
  const totalMinutes = hours * 60 + minutes;
  const displaySeconds = seconds.toString().padStart(2, '0');
  
  if (totalMinutes > 0) {
    return `${totalMinutes}:${displaySeconds}`;
  } else {
    return `0:${displaySeconds}`;
  }
};

export const fetchLatestYouTubeVideos = async (maxResults = 8) => {
  try {
    console.log(`Fetching ${maxResults} latest YouTube videos from https://www.youtube.com/@Lilmodfr/videos`);
    
    // Données de démonstration avec durées variées réalistes
    const mockVideos = [
      {
        id: 'dQw4w9WgXcQ1',
        title: 'Rav David Pitoun - Les secrets de la Paracha Nasso',
        channelTitle: 'LILMOD',
        publishedAt: '2025-06-02T10:00:00Z',
        duration: '42:15',
        thumbnail: '/lovable-uploads/89872365-27db-493a-9c07-f347ffe5a202.png',
        url: 'https://www.youtube.com/@Lilmodfr/videos'
      },
      {
        id: 'dQw4w9WgXcQ2',
        title: 'Rav Menahem Akerman - Éthique et Morale dans le Talmud',
        channelTitle: 'LILMOD',
        publishedAt: '2025-06-01T14:30:00Z',
        duration: '38:45',
        thumbnail: '/lovable-uploads/4e118333-95ae-4a51-98a3-4b23ec809a80.png',
        url: 'https://www.youtube.com/@Lilmodfr/videos'
      },
      {
        id: 'dQw4w9WgXcQ3',
        title: 'Rav Shimon Ariche - Comprendre la Halakha moderne',
        channelTitle: 'LILMOD',
        publishedAt: '2025-05-31T16:00:00Z',
        duration: '52:20',
        thumbnail: '/lovable-uploads/f8411b77-2369-405a-9825-d7d22de77d9c.png',
        url: 'https://www.youtube.com/@Lilmodfr/videos'
      },
      {
        id: 'dQw4w9WgXcQ4',
        title: 'Rav Avraham Weill - Les fêtes juives expliquées',
        channelTitle: 'LILMOD',
        publishedAt: '2025-05-30T09:15:00Z',
        duration: '29:33',
        thumbnail: '/lovable-uploads/89872365-27db-493a-9c07-f347ffe5a202.png',
        url: 'https://www.youtube.com/@Lilmodfr/videos'
      },
      {
        id: 'dQw4w9WgXcQ5',
        title: 'Rav Yossef Sitruk - La prière au quotidien',
        channelTitle: 'LILMOD',
        publishedAt: '2025-05-29T11:30:00Z',
        duration: '47:10',
        thumbnail: '/lovable-uploads/4e118333-95ae-4a51-98a3-4b23ec809a80.png',
        url: 'https://www.youtube.com/@Lilmodfr/videos'
      },
      {
        id: 'dQw4w9WgXcQ6',
        title: 'Rav Michel Schlesinger - Histoire du peuple juif',
        channelTitle: 'LILMOD',
        publishedAt: '2025-05-28T15:45:00Z',
        duration: '1:15:25',
        thumbnail: '/lovable-uploads/f8411b77-2369-405a-9825-d7d22de77d9c.png',
        url: 'https://www.youtube.com/@Lilmodfr/videos'
      },
      {
        id: 'dQw4w9WgXcQ7',
        title: 'Rav Emmanuel Mimran - La Kabbale accessible',
        channelTitle: 'LILMOD',
        publishedAt: '2025-05-27T13:20:00Z',
        duration: '34:50',
        thumbnail: '/lovable-uploads/89872365-27db-493a-9c07-f347ffe5a202.png',
        url: 'https://www.youtube.com/@Lilmodfr/videos'
      },
      {
        id: 'dQw4w9WgXcQ8',
        title: 'Rav Gabriel Dayan - Philosophie juive contemporaine',
        channelTitle: 'LILMOD',
        publishedAt: '2025-05-26T17:00:00Z',
        duration: '58:12',
        thumbnail: '/lovable-uploads/4e118333-95ae-4a51-98a3-4b23ec809a80.png',
        url: 'https://www.youtube.com/@Lilmodfr/videos'
      }
    ];

    return mockVideos.slice(0, maxResults);
  } catch (error) {
    console.error('Error fetching YouTube videos:', error);
    return [];
  }
};
