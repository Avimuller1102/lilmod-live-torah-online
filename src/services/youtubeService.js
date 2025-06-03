
const YOUTUBE_API_KEY = 'REDACTED';
const CHANNEL_ID = 'UCLilmodChannelId';

export const fetchLatestYouTubeVideos = async (maxResults = 8) => {
  try {
    console.log(`Fetching ${maxResults} latest YouTube videos...`);
    
    // Données simulées pour les vidéos YouTube
    const mockVideos = [
      {
        id: 'video1',
        title: 'Rav David Pitoun - Les secrets de la Paracha Nasso',
        channelTitle: 'LILMOD',
        publishedAt: '2025-06-02T10:00:00Z',
        duration: '45:30',
        thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
      },
      {
        id: 'video2',
        title: 'Rav Menahem Akerman - Éthique et Morale dans le Talmud',
        channelTitle: 'LILMOD',
        publishedAt: '2025-06-01T14:30:00Z',
        duration: '38:15',
        thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
      },
      {
        id: 'video3',
        title: 'Rav Shimon Ariche - Comprendre la Halakha moderne',
        channelTitle: 'LILMOD',
        publishedAt: '2025-05-31T16:00:00Z',
        duration: '52:20',
        thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
      },
      {
        id: 'video4',
        title: 'Rav Avraham Weill - Les fêtes juives expliquées',
        channelTitle: 'LILMOD',
        publishedAt: '2025-05-30T09:15:00Z',
        duration: '41:45',
        thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
      },
      {
        id: 'video5',
        title: 'Rav Yossef Sitruk - La prière au quotidien',
        channelTitle: 'LILMOD',
        publishedAt: '2025-05-29T11:30:00Z',
        duration: '36:10',
        thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
      },
      {
        id: 'video6',
        title: 'Rav Michel Schlesinger - Histoire du peuple juif',
        channelTitle: 'LILMOD',
        publishedAt: '2025-05-28T15:45:00Z',
        duration: '49:55',
        thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
      },
      {
        id: 'video7',
        title: 'Rav Emmanuel Mimran - La Kabbale accessible',
        channelTitle: 'LILMOD',
        publishedAt: '2025-05-27T13:20:00Z',
        duration: '44:30',
        thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
      },
      {
        id: 'video8',
        title: 'Rav Gabriel Dayan - Philosophie juive contemporaine',
        channelTitle: 'LILMOD',
        publishedAt: '2025-05-26T17:00:00Z',
        duration: '39:25',
        thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
      }
    ];

    return mockVideos.slice(0, maxResults);
  } catch (error) {
    console.error('Error fetching YouTube videos:', error);
    return [];
  }
};
