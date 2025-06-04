
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
    <section className="py-20 px-8 bg-gradient-to-br from-blue-50 to-indigo-50">
      
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            RECHERCHE (Rabbanim, Cours..)
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            Découvrez tous nos enseignements en un seul endroit. Recherchez par enseignant, sujet ou période.
          </p>
        </div>

        {/* Barre de recherche */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher un cours, un rabbin, un sujet..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-white shadow-sm text-lg"
            />
          </div>
        </div>

        {/* Onglets de filtrage */}
        <div className="flex justify-center mb-12">
          <div className="bg-white rounded-2xl p-2 shadow-lg border border-gray-100">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                activeTab === 'all'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              Tout
            </button>
            <button
              onClick={() => setActiveTab('videos')}
              className={`px-6 py-3 rounded-xl font-medium transition-all ml-2 ${
                activeTab === 'videos'
                  ? 'bg-red-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <Youtube className="w-5 h-5 inline mr-2" />
              Vidéos YouTube
            </button>
            <button
              onClick={() => setActiveTab('audio')}
              className={`px-6 py-3 rounded-xl font-medium transition-all ml-2 ${
                activeTab === 'audio'
                  ? 'bg-green-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <Headphones className="w-5 h-5 inline mr-2" />
              Podcasts Spotify
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
          </div>
        ) : (
          <div className="space-y-16">
            {/* Section Vidéos YouTube */}
            {(activeTab === 'all' || activeTab === 'videos') && (
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-3xl font-bold text-gray-900 flex items-center">
                    <Youtube className="w-8 h-8 text-red-500 mr-3" />
                    Dernières Vidéos YouTube
                  </h3>
                  <a 
                    href="https://www.youtube.com/@Lilmodfr/videos" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <Youtube className="w-5 h-5 mr-2" />
                    Voir toutes les vidéos
                  </a>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredVideos.map((video) => (
                    <Card 
                      key={video.id} 
                      className="group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl border-0 bg-white shadow-lg"
                      onClick={() => openYouTubeVideo(video)}
                    >
                      <CardContent className="p-0">
                        <div className="relative">
                          <img 
                            src={video.thumbnail} 
                            alt={video.title}
                            className="w-full h-48 object-cover rounded-t-lg"
                          />
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all rounded-t-lg flex items-center justify-center">
                            <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-all transform scale-75 group-hover:scale-100" />
                          </div>
                          <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-sm font-medium">
                            {video.duration}
                          </div>
                        </div>
                        <div className="p-4">
                          <h4 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-red-500 transition-colors">
                            {video.title}
                          </h4>
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <span className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
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
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-3xl font-bold text-gray-900 flex items-center">
                    <Headphones className="w-8 h-8 text-green-500 mr-3" />
                    Derniers Podcasts Spotify
                  </h3>
                  <a 
                    href="https://open.spotify.com/show/5oJ8bkMtw0hR1iRxomrSRR" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <Headphones className="w-5 h-5 mr-2" />
                    Écouter sur Spotify
                  </a>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredEpisodes.map((episode) => (
                    <Card 
                      key={episode.id} 
                      className="group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl border-0 bg-white shadow-lg"
                      onClick={() => openSpotifyEpisode(episode)}
                    >
                      <CardContent className="p-0">
                        <div className="relative">
                          <img 
                            src={episode.imageUrl} 
                            alt={episode.title}
                            className="w-full h-48 object-cover rounded-t-lg"
                          />
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all rounded-t-lg flex items-center justify-center">
                            <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-all transform scale-75 group-hover:scale-100" />
                          </div>
                          <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-sm font-medium">
                            {episode.duration}
                          </div>
                        </div>
                        <div className="p-4">
                          <h4 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-500 transition-colors">
                            {episode.title}
                          </h4>
                          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                            <span className="font-medium text-green-600">{episode.teacher}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="w-4 h-4 mr-1" />
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

        {/* Liens vers les plateformes */}
        <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-6">
          <a 
            href="https://www.youtube.com/@Lilmodfr/videos" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-xl font-medium transition-all shadow-lg hover:shadow-xl transform hover:scale-105 w-full sm:w-auto"
          >
            <Youtube className="w-6 h-6 mr-3" />
            Toutes nos vidéos YouTube
          </a>
          
          <a 
            href="https://open.spotify.com/show/5oJ8bkMtw0hR1iRxomrSRR" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl font-medium transition-all shadow-lg hover:shadow-xl transform hover:scale-105 w-full sm:w-auto"
          >
            <Headphones className="w-6 h-6 mr-3" />
            Tous nos podcasts Spotify
          </a>
          
          <a 
            href="https://linktr.ee/lilmod.torahmitzion" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center border-2 border-orange-500 bg-orange-50 hover:bg-orange-500 hover:text-white text-orange-500 px-8 py-4 rounded-xl font-medium transition-all shadow-lg hover:shadow-xl transform hover:scale-105 w-full sm:w-auto"
          >
            <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24">
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
