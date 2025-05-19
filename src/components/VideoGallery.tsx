
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Youtube, ExternalLink, Play, Calendar, Clock } from 'lucide-react';
import { fetchLatestYouTubeVideos, YouTubeVideo } from '../services/youtubeService';
import { useToast } from '@/components/ui/use-toast';

const VideoGallery = () => {
  const { toast } = useToast();
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getVideos = async () => {
      try {
        setLoading(true);
        const latestVideos = await fetchLatestYouTubeVideos();
        setVideos(latestVideos);
      } catch (error) {
        console.error("Failed to fetch videos:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les vidéos YouTube. Veuillez réessayer plus tard.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    getVideos();
    
    // Actualiser les vidéos toutes les heures
    const refreshInterval = setInterval(() => {
      getVideos();
    }, 60 * 60 * 1000);
    
    return () => clearInterval(refreshInterval);
  }, [toast]);

  // Fonction pour ouvrir la vidéo YouTube
  const openYouTubeVideo = (video: YouTubeVideo) => {
    if (video.url) {
      window.open(video.url, '_blank');
    } else {
      window.open(`https://www.youtube.com/watch?v=${video.id}`, '_blank');
    }
  };

  return (
    <section id="videos" className="py-16 px-4 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 flex flex-col md:flex-row items-center justify-between">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-lilmod-navy mb-2">
              <span className="relative">
                NOS DERNIÈRES VIDÉOS
                <span className="absolute -bottom-2 left-0 w-24 h-1 bg-gradient-to-r from-red-500 to-red-400"></span>
              </span>
            </h2>
            <p className="text-gray-600 max-w-xl mt-2">Retrouvez nos cours en vidéo et restez à jour avec les nouveaux enseignements</p>
          </div>
          <a 
            href="https://www.youtube.com/@Lilmodfr" 
            target="_blank" 
            rel="noopener noreferrer"
            className="mt-6 md:mt-0 inline-flex items-center bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg transition-colors shadow-md hover:shadow-lg"
          >
            <Youtube className="w-5 h-5 mr-2" />
            Notre chaîne YouTube
          </a>
        </div>
        
        <div className="bg-gradient-to-r from-red-50 to-amber-50 rounded-xl shadow-md border border-red-100 overflow-hidden mb-10">
          <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-red-600 to-red-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
              <Youtube className="w-10 h-10 md:w-12 md:h-12 text-white" />
            </div>
            
            <div className="flex-1">
              <h3 className="font-bold text-xl md:text-2xl text-lilmod-navy mb-2">LILMOD sur YouTube</h3>
              <p className="text-gray-700 mb-4">Retrouvez tous nos cours sur notre chaîne YouTube et abonnez-vous pour ne manquer aucun contenu. Des cours de Torah en français, accessibles à tous, partout dans le monde.</p>
              <div className="flex flex-wrap gap-3">
                <a 
                  href="https://www.youtube.com/@Lilmodfr" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
                >
                  Visiter la chaîne YouTube
                  <ExternalLink className="h-4 w-4 ml-2" />
                </a>
                <a 
                  href="https://www.youtube.com/@Lilmodfr/playlists" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md transition-colors"
                >
                  Voir les playlists
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lilmod-blue"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {videos.map((video) => (
              <Card 
                key={video.id} 
                className="border border-gray-200 shadow-md hover:shadow-xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:translate-y-[-3px] bg-white"
                onClick={() => openYouTubeVideo(video)}
              >
                <div className="aspect-video bg-gray-100 overflow-hidden relative">
                  {video.thumbnail && video.thumbnail !== "/placeholder.svg" ? (
                    <img 
                      src={video.thumbnail} 
                      alt={video.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Youtube className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-3">
                    <div className="flex items-center space-x-2">
                      <div className="bg-red-600 text-white px-2 py-1 rounded text-xs font-medium flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {video.duration}
                      </div>
                    </div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-black/40 transition-opacity duration-300">
                    <div className="w-16 h-16 rounded-full bg-red-600 bg-opacity-90 flex items-center justify-center">
                      <Play className="w-8 h-8 text-white fill-current ml-1" />
                    </div>
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <h3 className="font-bold text-gray-800 line-clamp-2 min-h-[2.5rem]">{video.title}</h3>
                  
                  <div className="flex items-center justify-between mt-3 text-sm">
                    <span className="text-gray-600">{video.channelTitle}</span>
                    <div className="flex items-center text-lilmod-blue">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{new Date(video.publishedAt).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a 
            href="https://www.youtube.com/@Lilmodfr" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center bg-gradient-to-r from-lilmod-blue to-blue-600 hover:from-lilmod-blue hover:to-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors shadow-md hover:shadow-lg w-full sm:w-auto"
          >
            Voir toutes les vidéos
          </a>
          <a 
            href="https://open.spotify.com/show/5oJ8bkMtw0hR1iRxomrSRR" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white px-6 py-3 rounded-md font-medium transition-colors shadow-md hover:shadow-lg w-full sm:w-auto"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
            Écouter sur Spotify
          </a>
        </div>
      </div>
    </section>
  );
};

export default VideoGallery;
