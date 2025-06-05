
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Play, Clock, Calendar, Youtube, Headphones } from 'lucide-react';
import { fetchLatestYouTubeVideos } from '../services/youtubeService';
import { fetchLatestSpotifyEpisodes } from '../services/spotifyService';
import { useToast } from '@/components/ui/use-toast';

const CombinedContentLibrary = () => {
  const { toast } = useToast();
  const [videos, setVideos] = useState([]);
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const getContent = async () => {
      try {
        setLoading(true);
        const [latestVideos, latestEpisodes] = await Promise.all([
          fetchLatestYouTubeVideos(8),
          fetchLatestSpotifyEpisodes(8)
        ]);
        setVideos(latestVideos);
        setEpisodes(latestEpisodes);
      } catch (error) {
        console.error("Failed to fetch content:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger le contenu. Veuillez réessayer plus tard.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    getContent();
  }, [toast]);

  const filteredVideos = videos.filter(video =>
    video.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredEpisodes = episodes.filter(episode =>
    episode.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    episode.teacher.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openYouTubeVideo = (video) => {
    window.open(video.url, '_blank');
  };

  const openSpotifyEpisode = (episode) => {
    window.open(episode.url, '_blank');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <section className="py-20 px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center mb-16">
          <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-12 rounded-full"></div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            RECHERCHE (Rabbanim, Cours..)
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Découvrez tous nos enseignements en un seul endroit. Recherchez par enseignant, sujet ou période.
          </p>
        </div>

        {/* Barre de recherche centrée */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="relative">
            <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher un cours, un rabbin, un sujet..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-5 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-200 outline-none transition-all bg-white shadow-lg text-base text-center font-medium"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
          </div>
        ) : (
          <div className="space-y-20">
            {/* Section Vidéos YouTube */}
            <div>
              <div className="flex items-center justify-center mb-12">
                <h3 className="text-3xl font-bold text-gray-900 flex items-center">
                  <Youtube className="w-8 h-8 text-red-500 mr-3" />
                  Dernières Vidéos YouTube
                </h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4 mb-10">
                {filteredVideos.map((video) => (
                  <Card 
                    key={video.id} 
                    className="group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl border-0 bg-white shadow-lg overflow-hidden rounded-xl"
                    onClick={() => openYouTubeVideo(video)}
                  >
                    <CardContent className="p-0">
                      <div className="relative">
                        <img 
                          src={video.thumbnail} 
                          alt={video.title}
                          className="w-full h-32 object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:from-black/80 transition-all flex items-center justify-center">
                          <Play className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-all transform scale-75 group-hover:scale-100" />
                        </div>
                        <div className="absolute bottom-2 right-2 bg-black/90 text-white px-2 py-1 rounded-lg text-xs font-bold">
                          {video.duration}
                        </div>
                      </div>
                      <div className="p-3">
                        <h4 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-red-500 transition-colors text-sm">
                          {video.title}
                        </h4>
                        <div className="flex items-center text-xs text-gray-600">
                          <Calendar className="w-3 h-3 mr-1" />
                          {formatDate(video.publishedAt)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="text-center">
                <a 
                  href="https://www.youtube.com/@Lilmodfr/videos" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Youtube className="w-5 h-5 mr-3" />
                  <span className="text-white">Toutes nos vidéos YouTube</span>
                </a>
              </div>
            </div>

            {/* Section Podcasts Spotify */}
            <div>
              <div className="flex items-center justify-center mb-12">
                <h3 className="text-3xl font-bold text-gray-900 flex items-center">
                  <Headphones className="w-8 h-8 text-green-500 mr-3" />
                  Derniers Podcasts Spotify
                </h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4 mb-10">
                {filteredEpisodes.map((episode) => (
                  <Card 
                    key={episode.id} 
                    className="group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl border-0 bg-white shadow-lg overflow-hidden rounded-xl"
                    onClick={() => openSpotifyEpisode(episode)}
                  >
                    <CardContent className="p-0">
                      <div className="relative">
                        <img 
                          src={episode.imageUrl} 
                          alt={episode.title}
                          className="w-full h-32 object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:from-black/80 transition-all flex items-center justify-center">
                          <Play className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-all transform scale-75 group-hover:scale-100" />
                        </div>
                        <div className="absolute bottom-2 right-2 bg-black/90 text-white px-2 py-1 rounded-lg text-xs font-bold">
                          {episode.duration}
                        </div>
                      </div>
                      <div className="p-3">
                        <h4 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-500 transition-colors text-sm">
                          {episode.title}
                        </h4>
                        <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                          <span className="font-bold text-green-600">{episode.teacher}</span>
                        </div>
                        <div className="flex items-center text-xs text-gray-600">
                          <Calendar className="w-3 h-3 mr-1" />
                          {formatDate(episode.publishedAt)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="text-center">
                <a 
                  href="https://open.spotify.com/show/5oJ8bkMtw0hR1iRxomrSRR" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Headphones className="w-5 h-5 mr-3" />
                  <span className="text-white">Tous nos podcasts Spotify</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Lien vers Linktree */}
        <div className="mt-20 flex justify-center">
          <a 
            href="https://linktr.ee/lilmod.torahmitzion" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            Tous nos liens
          </a>
        </div>
      </div>
    </section>
  );
};

export default CombinedContentLibrary;
