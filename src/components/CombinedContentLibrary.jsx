
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Play, Clock, Calendar, Youtube, Headphones, Filter } from 'lucide-react';
import { fetchLatestYouTubeVideos } from '../services/youtubeService';
import { fetchLatestSpotifyEpisodes } from '../services/spotifyService';
import { useToast } from '@/components/ui/use-toast';

const CombinedContentLibrary = () => {
  const { toast } = useToast();
  const [videos, setVideos] = useState([]);
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

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
    <section className="py-24 px-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-8xl mx-auto">
        
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8">
            RECHERCHE (Rabbanim, Cours..)
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-12 rounded-full"></div>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Découvrez tous nos enseignements en un seul endroit. Recherchez par enseignant, sujet ou période.
          </p>
        </div>

        {/* Barre de recherche améliorée */}
        <div className="max-w-3xl mx-auto mb-16">
          <div className="relative">
            <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
            <input
              type="text"
              placeholder="Rechercher un cours, un rabbin, un sujet..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-16 pr-6 py-6 rounded-3xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-200 outline-none transition-all bg-white shadow-xl text-lg"
            />
            <Filter className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
          </div>
        </div>

        {/* Onglets de filtrage redesignés */}
        <div className="flex justify-center mb-16">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-3 shadow-2xl border border-gray-100">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-8 py-4 rounded-2xl font-bold transition-all ${
                activeTab === 'all'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <span className="text-lg">Tout</span>
            </button>
            <button
              onClick={() => setActiveTab('videos')}
              className={`px-8 py-4 rounded-2xl font-bold transition-all ml-3 ${
                activeTab === 'videos'
                  ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <Youtube className="w-6 h-6 inline mr-3" />
              <span className="text-lg">Vidéos YouTube</span>
            </button>
            <button
              onClick={() => setActiveTab('audio')}
              className={`px-8 py-4 rounded-2xl font-bold transition-all ml-3 ${
                activeTab === 'audio'
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <Headphones className="w-6 h-6 inline mr-3" />
              <span className="text-lg">Podcasts Spotify</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-32">
            <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-blue-500"></div>
          </div>
        ) : (
          <div className="space-y-24">
            {/* Section Vidéos YouTube */}
            {(activeTab === 'all' || activeTab === 'videos') && (
              <div>
                <div className="flex items-center justify-between mb-12">
                  <h3 className="text-4xl font-bold text-gray-900 flex items-center">
                    <Youtube className="w-10 h-10 text-red-500 mr-4" />
                    Dernières Vidéos YouTube
                  </h3>
                  <a 
                    href="https://www.youtube.com/@Lilmodfr/videos" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-xl hover:shadow-2xl transform hover:scale-105"
                  >
                    <Youtube className="w-6 h-6 mr-3" />
                    Voir toutes les vidéos
                  </a>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {filteredVideos.map((video) => (
                    <Card 
                      key={video.id} 
                      className="group cursor-pointer transform transition-all duration-500 hover:scale-105 hover:shadow-2xl border-0 bg-white/95 backdrop-blur-xl shadow-xl overflow-hidden rounded-3xl"
                      onClick={() => openYouTubeVideo(video)}
                    >
                      <CardContent className="p-0">
                        <div className="relative">
                          <img 
                            src={video.thumbnail} 
                            alt={video.title}
                            className="w-full h-52 object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:from-black/80 transition-all flex items-center justify-center">
                            <Play className="w-16 h-16 text-white opacity-0 group-hover:opacity-100 transition-all transform scale-75 group-hover:scale-100" />
                          </div>
                          <div className="absolute bottom-3 right-3 bg-black/90 text-white px-3 py-2 rounded-xl text-sm font-bold">
                            {video.duration}
                          </div>
                        </div>
                        <div className="p-6">
                          <h4 className="font-bold text-gray-900 mb-4 line-clamp-2 group-hover:text-red-500 transition-colors text-lg">
                            {video.title}
                          </h4>
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <span className="flex items-center">
                              <Calendar className="w-4 h-4 mr-2" />
                              {formatDate(video.publishedAt)}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Section Podcasts Spotify */}
            {(activeTab === 'all' || activeTab === 'audio') && (
              <div>
                <div className="flex items-center justify-between mb-12">
                  <h3 className="text-4xl font-bold text-gray-900 flex items-center">
                    <Headphones className="w-10 h-10 text-green-500 mr-4" />
                    Derniers Podcasts Spotify
                  </h3>
                  <a 
                    href="https://open.spotify.com/show/5oJ8bkMtw0hR1iRxomrSRR" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-xl hover:shadow-2xl transform hover:scale-105"
                  >
                    <Headphones className="w-6 h-6 mr-3" />
                    Écouter sur Spotify
                  </a>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {filteredEpisodes.map((episode) => (
                    <Card 
                      key={episode.id} 
                      className="group cursor-pointer transform transition-all duration-500 hover:scale-105 hover:shadow-2xl border-0 bg-white/95 backdrop-blur-xl shadow-xl overflow-hidden rounded-3xl"
                      onClick={() => openSpotifyEpisode(episode)}
                    >
                      <CardContent className="p-0">
                        <div className="relative">
                          <img 
                            src={episode.imageUrl} 
                            alt={episode.title}
                            className="w-full h-52 object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:from-black/80 transition-all flex items-center justify-center">
                            <Play className="w-16 h-16 text-white opacity-0 group-hover:opacity-100 transition-all transform scale-75 group-hover:scale-100" />
                          </div>
                          <div className="absolute bottom-3 right-3 bg-black/90 text-white px-3 py-2 rounded-xl text-sm font-bold">
                            {episode.duration}
                          </div>
                        </div>
                        <div className="p-6">
                          <h4 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-500 transition-colors text-lg">
                            {episode.title}
                          </h4>
                          <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                            <span className="font-bold text-green-600">{episode.teacher}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="w-4 h-4 mr-2" />
                            {formatDate(episode.publishedAt)}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Liens vers les plateformes redesignés */}
        <div className="mt-24 flex flex-col sm:flex-row items-center justify-center gap-8">
          <a 
            href="https://www.youtube.com/@Lilmodfr/videos" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-10 py-5 rounded-2xl font-bold transition-all shadow-xl hover:shadow-2xl transform hover:scale-105 w-full sm:w-auto"
          >
            <Youtube className="w-7 h-7 mr-4" />
            Toutes nos vidéos YouTube
          </a>
          
          <a 
            href="https://open.spotify.com/show/5oJ8bkMtw0hR1iRxomrSRR" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-10 py-5 rounded-2xl font-bold transition-all shadow-xl hover:shadow-2xl transform hover:scale-105 w-full sm:w-auto"
          >
            <Headphones className="w-7 h-7 mr-4" />
            Tous nos podcasts Spotify
          </a>
          
          <a 
            href="https://linktr.ee/lilmod.torahmitzion" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center border-3 border-orange-500 bg-gradient-to-r from-orange-50 to-amber-50 hover:from-orange-500 hover:to-amber-500 hover:text-white text-orange-600 px-10 py-5 rounded-2xl font-bold transition-all shadow-xl hover:shadow-2xl transform hover:scale-105 w-full sm:w-auto"
          >
            <svg className="w-7 h-7 mr-4" fill="currentColor" viewBox="0 0 24 24">
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
