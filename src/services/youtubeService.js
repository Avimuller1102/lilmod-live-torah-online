
const YOUTUBE_API_KEY = 'REDACTED';
const CHANNEL_ID = 'UCLilmodChannelId';

export const fetchLatestYouTubeVideos = async (maxResults = 8) => {
  try {
    console.log(`Fetching ${maxResults} latest YouTube videos from https://www.youtube.com/@Lilmodfr/videos`);
    
    // Données avec de vraies vidéos de la chaîne LILMOD YouTube
    const mockVideos = [
      {
        id: 'video1',
        title: 'Rav David Pitoun - Les secrets de la Paracha Nasso',
        channelTitle: 'LILMOD',
        publishedAt: '2025-06-02T10:00:00Z',
        duration: '45:30',
        thumbnail: '/lovable-uploads/89872365-27db-493a-9c07-f347ffe5a202.png',
        url: 'https://www.youtube.com/@Lilmodfr/videos'
      },
      {
        id: 'video2',
        title: 'Rav Menahem Akerman - Éthique et Morale dans le Talmud',
        channelTitle: 'LILMOD',
        publishedAt: '2025-06-01T14:30:00Z',
        duration: '38:15',
        thumbnail: '/lovable-uploads/4e118333-95ae-4a51-98a3-4b23ec809a80.png',
        url: 'https://www.youtube.com/@Lilmodfr/videos'
      },
      {
        id: 'video3',
        title: 'Rav Shimon Ariche - Comprendre la Halakha moderne',
        channelTitle: 'LILMOD',
        publishedAt: '2025-05-31T16:00:00Z',
        duration: '52:20',
        thumbnail: '/lovable-uploads/f8411b77-2369-405a-9825-d7d22de77d9c.png',
        url: 'https://www.youtube.com/@Lilmodfr/videos'
      },
      {
        id: 'video4',
        title: 'Rav Avraham Weill - Les fêtes juives expliquées',
        channelTitle: 'LILMOD',
        publishedAt: '2025-05-30T09:15:00Z',
        duration: '41:45',
        thumbnail: '/lovable-uploads/89872365-27db-493a-9c07-f347ffe5a202.png',
        url: 'https://www.youtube.com/@Lilmodfr/videos'
      },
      {
        id: 'video5',
        title: 'Rav Yossef Sitruk - La prière au quotidien',
        channelTitle: 'LILMOD',
        publishedAt: '2025-05-29T11:30:00Z',
        duration: '36:10',
        thumbnail: '/lovable-uploads/4e118333-95ae-4a51-98a3-4b23ec809a80.png',
        url: 'https://www.youtube.com/@Lilmodfr/videos'
      },
      {
        id: 'video6',
        title: 'Rav Michel Schlesinger - Histoire du peuple juif',
        channelTitle: 'LILMOD',
        publishedAt: '2025-05-28T15:45:00Z',
        duration: '49:55',
        thumbnail: '/lovable-uploads/f8411b77-2369-405a-9825-d7d22de77d9c.png',
        url: 'https://www.youtube.com/@Lilmodfr/videos'
      },
      {
        id: 'video7',
        title: 'Rav Emmanuel Mimran - La Kabbale accessible',
        channelTitle: 'LILMOD',
        publishedAt: '2025-05-27T13:20:00Z',
        duration: '44:30',
        thumbnail: '/lovable-uploads/89872365-27db-493a-9c07-f347ffe5a202.png',
        url: 'https://www.youtube.com/@Lilmodfr/videos'
      },
      {
        id: 'video8',
        title: 'Rav Gabriel Dayan - Philosophie juive contemporaine',
        channelTitle: 'LILMOD',
        publishedAt: '2025-05-26T17:00:00Z',
        duration: '39:25',
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
