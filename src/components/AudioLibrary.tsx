
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { PlayCircle } from 'lucide-react';
import { fetchLatestSpotifyEpisodes, SpotifyEpisode } from '../services/spotifyService';

const AudioLibrary = () => {
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
      } finally {
        setLoading(false);
      }
    };

    getEpisodes();
  }, []);

  return (
    <section id="audio" className="bg-lilmod-navy py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 md:mb-0">LES COURS AUDIO</h2>
          <a 
            href="https://open.spotify.com/show/5oJ8bkMtw0hR1iRxomrSRR" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
            Notre chaîne Spotify
          </a>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lilmod-gold"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {episodes.map((episode) => (
              <Card key={episode.id} className="bg-white/10 backdrop-blur-md border-none text-white hover:bg-white/20 transition-all duration-200 overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{episode.title}</h3>
                      <div className="text-lilmod-gold mt-1">{episode.teacher}</div>
                    </div>
                    <div className="ml-4">
                      <PlayCircle className="w-12 h-12 text-lilmod-gold cursor-pointer hover:text-white transition-colors" />
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-4 text-sm text-gray-300">
                    <span>{episode.duration}</span>
                    <span>{new Date(episode.publishedAt).toLocaleDateString('fr-FR')}</span>
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
            className="inline-block bg-lilmod-gold hover:bg-yellow-500 text-lilmod-navy px-6 py-3 rounded-md font-medium transition-colors"
          >
            Explorer tous les cours audio
          </a>
        </div>
      </div>
    </section>
  );
};

export default AudioLibrary;
