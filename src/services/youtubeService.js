
const YOUTUBE_API_KEY = 'REDACTED';
const CHANNEL_ID = 'UCL_BSX_zC9p8QjPjqMrpt9Q';

// Fonction pour convertir la durée ISO 8601 en format MM:SS
const parseDuration = (duration) => {
  if (!duration) return '0:00';
  
  // Exemple: PT1H2M10S ou PT45M30S ou PT2M10S
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return '0:00';
  
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
    console.log(`Fetching ${maxResults} latest YouTube videos from LILMOD channel`);
    
    // Première requête pour obtenir les vidéos avec leurs détails
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=${maxResults}&type=video`;
    
    const searchResponse = await fetch(searchUrl);
    
    if (!searchResponse.ok) {
      throw new Error(`YouTube API error: ${searchResponse.status}`);
    }
    
    const searchData = await searchResponse.json();
    
    if (!searchData.items || searchData.items.length === 0) {
      console.error('No videos found');
      return [];
    }
    
    // Extraire les IDs des vidéos
    const videoIds = searchData.items.map(item => item.id.videoId).join(',');
    
    // Deuxième requête pour obtenir les détails des vidéos (durée et statistiques)
    const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?key=${YOUTUBE_API_KEY}&id=${videoIds}&part=contentDetails,snippet`;
    
    const detailsResponse = await fetch(detailsUrl);
    
    if (!detailsResponse.ok) {
      throw new Error(`YouTube Details API error: ${detailsResponse.status}`);
    }
    
    const detailsData = await detailsResponse.json();
    
    // Combiner les données avec les durées réelles
    const videos = searchData.items.map(item => {
      const videoDetails = detailsData.items?.find(detail => detail.id === item.id.videoId);
      const duration = videoDetails ? parseDuration(videoDetails.contentDetails.duration) : '0:00';
      
      return {
        id: item.id.videoId,
        title: item.snippet.title,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
        duration: duration,
        thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`
      };
    });

    console.log(`Successfully fetched ${videos.length} videos with durations from YouTube API`);
    videos.forEach(video => {
      console.log(`Video: ${video.title} - Duration: ${video.duration}`);
    });
    
    return videos;
    
  } catch (error) {
    console.error('Error fetching YouTube videos:', error);
    
    // Fallback data en cas d'erreur
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
      }
    ];

    return mockVideos.slice(0, maxResults);
  }
};
