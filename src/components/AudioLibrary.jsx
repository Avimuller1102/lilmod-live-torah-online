
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
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
    
    // Actualiser les épisodes toutes les 6 heures
    const refreshInterval = setInterval(() => {
      getEpisodes();
    }, 6 * 60 * 60 * 1000);
    
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
          <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4 md:mb-0 font-serif">LES COURS AUDIO</h2>
          <a 
            href="https://open.spotify.com/show/5oJ8bkMtw0hR1iRxomrSRR" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md transition-all duration-300 transform hover:scale-105 shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
            Notre podcast Spotify
          </a>
        </div>
        
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-8 rounded-r shadow-sm">
          <div className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-green-600 mt-1 mr-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
            <div>
              <h3 className="font-bold text-green-600 mb-1">LILMOD sur Spotify</h3>
              <p className="text-gray-700 font-sans">Écoutez tous nos cours audio sur Spotify, n'importe où et n'importe quand. Abonnez-vous pour être notifié des nouvelles publications.</p>
              <div className="mt-3">
                <a 
                  href="https://open.spotify.com/show/5oJ8bkMtw0hR1iRxomrSRR" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-green-600 hover:underline font-medium flex items-center"
                >
                  S'abonner à notre podcast
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 ml-1">
                    <path fillRule="evenodd" d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z" clipRule="evenodd" />
                    <path fillRule="evenodd" d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z" clipRule="evenodd" />
                  </svg>
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
                className="bg-white/10 backdrop-blur-md border-none text-white hover:bg-white/20 transition-all duration-300 overflow-hidden cursor-pointer transform hover:translate-y-[-2px] shadow-md hover:shadow-lg"
                onClick={() => openSpotifyEpisode(episode)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg md:text-xl text-white font-serif">{episode.title}</h3>
                      <div className="text-lilmod-gold mt-1 font-medium">{episode.teacher}</div>
                      
                      <div className="flex items-center mt-2 text-sm text-gray-300">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
                        </svg>
                        <span>{episode.duration}</span>
                        <span className="mx-2">•</span>
                        <span>{new Date(episode.publishedAt).toLocaleDateString('fr-FR')}</span>
                      </div>
                      
                      {episode.description && (
                        <p className="mt-3 text-sm text-gray-300 line-clamp-2 font-sans">{episode.description}</p>
                      )}
                    </div>
                    <div className="ml-4">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 text-lilmod-gold hover:text-white transition-colors">
                        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm14.024-.983a1.125 1.125 0 010 1.966l-5.603 3.113A1.125 1.125 0 019 15.113V8.887c0-.857.921-1.4 1.671-.983l5.603 3.113z" clipRule="evenodd" />
                      </svg>
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
            className="inline-block bg-lilmod-gold hover:bg-yellow-500 text-lilmod-navy px-6 py-3 rounded-md font-medium transition-colors shadow-lg hover:shadow-xl transform hover:translate-y-[-1px] transition-all duration-300 font-sans"
          >
            Explorer tous les cours audio
          </a>
        </div>
      </div>
    </section>
  );
};

export default AudioLibrary;
