
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ExternalLink, Clock, Headphones } from 'lucide-react';
import { fetchLatestSpotifyEpisodes, SpotifyEpisode } from '../services/spotifyService';
import { useToast } from '@/components/ui/use-toast';

const AudioLibrary = () => {
  const { toast } = useToast();
  const [episodes, setEpisodes] = useState<SpotifyEpisode[]>([]);
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
    
    // Actualiser les épisodes toutes les heures
    const refreshInterval = setInterval(() => {
      getEpisodes();
    }, 60 * 60 * 1000);
    
    return () => clearInterval(refreshInterval);
  }, [toast]);

  // Fonction pour ouvrir l'épisode Spotify
  const openSpotifyEpisode = (episode: SpotifyEpisode) => {
    if (episode.url) {
      window.open(episode.url, '_blank');
    } else {
      window.open(`https://open.spotify.com/show/5oJ8bkMtw0hR1iRxomrSRR`, '_blank');
    }
  };

  return (
    <section id="audio" className="py-16 px-4 bg-gradient-to-br from-lilmod-navy to-slate-900">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
              <span className="relative">
                LES COURS AUDIO
                <span className="absolute -bottom-2 left-0 w-24 h-1 bg-gradient-to-r from-green-400 to-green-500"></span>
              </span>
            </h2>
            <p className="text-gray-300 max-w-xl mt-2">Écoutez nos cours où que vous soyez sur Spotify</p>
          </div>
          <a 
            href="https://open.spotify.com/show/5oJ8bkMtw0hR1iRxomrSRR" 
            target="_blank" 
            rel="noopener noreferrer"
            className="mt-6 md:mt-0 flex items-center text-white bg-green-600 hover:bg-green-700 px-5 py-2.5 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:translate-y-[-2px]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
            Notre chaîne Spotify
          </a>
        </div>
        
        <div className="glass-card mb-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl overflow-hidden">
          <div className="p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
              <Headphones className="w-10 h-10 md:w-12 md:h-12 text-white" />
            </div>
            
            <div className="flex-1">
              <h3 className="font-bold text-xl md:text-2xl text-white mb-2">LILMOD sur Spotify</h3>
              <p className="text-white mb-4">Écoutez tous nos cours audio sur Spotify, n'importe où et n'importe quand. Abonnez-vous pour être notifié des nouvelles publications.</p>
              <div className="flex flex-wrap gap-3">
                <a 
                  href="https://open.spotify.com/show/5oJ8bkMtw0hR1iRxomrSRR" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
                >
                  S'abonner au podcast
                  <ExternalLink className="h-4 w-4 ml-2" />
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-400"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {episodes.map((episode) => (
              <Card key={episode.id} 
                className="bg-white/10 backdrop-blur-lg border-none text-white hover:bg-white/15 transition-all duration-300 overflow-hidden cursor-pointer transform hover:translate-y-[-3px] hover:shadow-lg"
                onClick={() => openSpotifyEpisode(episode)}
              >
                <div className="h-2 bg-gradient-to-r from-green-600 to-green-400"></div>
                <CardContent className="p-5">
                  <div className="mb-3 flex justify-between items-start">
                    <div className="bg-green-600/90 text-white rounded-full h-10 w-10 flex items-center justify-center shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                      </svg>
                    </div>
                    <span className="text-sm flex items-center text-amber-400 font-medium">
                      <Clock className="w-3 h-3 mr-1" />
                      {episode.duration}
                    </span>
                  </div>
                  
                  <h3 className="font-bold text-lg text-white mb-2 line-clamp-2">{episode.title}</h3>
                  <div className="text-amber-400 text-sm font-medium mb-2">{episode.teacher}</div>
                  
                  {episode.description && (
                    <p className="text-sm text-gray-300 line-clamp-2 mb-3">{episode.description}</p>
                  )}
                  
                  <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-white/10">
                    <span>{new Date(episode.publishedAt).toLocaleDateString('fr-FR')}</span>
                    <div className="flex items-center text-green-500">
                      <span>Écouter sur Spotify</span>
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default AudioLibrary;
