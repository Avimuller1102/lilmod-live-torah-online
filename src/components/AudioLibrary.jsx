
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { PlayCircle, ExternalLink, Clock } from 'lucide-react';
import { fetchLatestSpotifyEpisodes } from '../services/spotifyService';
import { useToast } from '@/components/ui/use-toast';

const AudioLibrary = () => {
  const { toast } = useToast();
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getEpisodes = async () => {
      try {
        setLoading(true);
        const latestEpisodes = await fetchLatestSpotifyEpisodes();
        setEpisodes(latestEpisodes);
      } catch (error) {
        console.error("Failed to fetch episodes:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les épisodes Spotify. Veuillez réessayer plus tard.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    getEpisodes();
    
    // Actualiser les épisodes tous les jours
    const refreshInterval = setInterval(() => {
      getEpisodes();
    }, 24 * 60 * 60 * 1000); // 24 heures
    
    return () => clearInterval(refreshInterval);
  }, [toast]);

  // Fonction pour ouvrir l'épisode Spotify
  const openSpotifyEpisode = (episode) => {
    if (episode.url) {
      window.open(episode.url, '_blank');
    } else {
      window.open(`https://open.spotify.com/show/5oJ8bkMtw0hR1iRxomrSRR`, '_blank');
    }
  };

  return (
    <section id="audio" className="bg-lilmod-navy py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 md:mb-0">LES COURS AUDIO</h2>
          <a 
            href="https://open.spotify.com/show/5oJ8bkMtw0hR1iRxomrSRR" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md transition-all duration-300 transform hover:scale-105"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
            Notre chaîne Spotify
          </a>
        </div>
        
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-8 rounded-r">
          <div className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-green-600 mt-1 mr-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
            <div>
              <h3 className="font-bold text-green-600 mb-1">LILMOD sur Spotify</h3>
              <p className="text-gray-700">Écoutez tous nos cours audio sur Spotify, n'importe où et n'importe quand. Abonnez-vous pour être notifié des nouvelles publications.</p>
              <div className="mt-3">
                <a 
                  href="https://open.spotify.com/show/5oJ8bkMtw0hR1iRxomrSRR" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-green-600 hover:underline font-medium flex items-center"
                >
                  S'abonner à notre podcast
                  <ExternalLink className="h-4 w-4 ml-1" />
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lilmod-gold"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {episodes.map((episode) => (
              <Card key={episode.id} 
                className="bg-white/10 backdrop-blur-md border-none text-white hover:bg-white/20 transition-all duration-300 overflow-hidden cursor-pointer transform hover:scale-102"
                onClick={() => openSpotifyEpisode(episode)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg md:text-xl text-white">{episode.title}</h3>
                      <div className="text-lilmod-gold mt-1 font-medium">{episode.teacher}</div>
                      
                      <div className="flex items-center mt-2 text-sm text-gray-300">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{episode.duration}</span>
                        <span className="mx-2">•</span>
                        <span>{new Date(episode.publishedAt).toLocaleDateString('fr-FR')}</span>
                      </div>
                      
                      {episode.description && (
                        <p className="mt-3 text-sm text-gray-300 line-clamp-2">{episode.description}</p>
                      )}
                    </div>
                    <div className="ml-4">
                      <PlayCircle className="w-12 h-12 text-lilmod-gold hover:text-white transition-colors" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        <div className="mt-12 text-center">
          <a 
            href="https://open.spotify.com/show/5oJ8bkMtw0hR1iRxomrSRR" 
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-lilmod-gold hover:bg-yellow-500 text-lilmod-navy px-6 py-3 rounded-md font-medium transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
          >
            Explorer tous les cours audio
          </a>
        </div>
      </div>
    </section>
  );
};

export default AudioLibrary;
