import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from '@/components/ui/input';
import { Search, Play, Youtube, Headphones, Clock, Calendar, ExternalLink } from 'lucide-react';
import { fetchLatestYouTubeVideos } from '../services/youtubeService';
import { fetchLatestSpotifyEpisodes } from '../services/spotifyService';
import { useToast } from '@/components/ui/use-toast';

const CombinedContentLibrary = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [videos, setVideos] = useState([]);
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getContent = async () => {
      try {
        setLoading(true);
        // Récupérer exactement 8 vidéos YouTube et 8 épisodes Spotify
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

  // Fonction de filtrage
  const filterContent = (content, type) => {
    if (!searchTerm) return content;
    return content.filter(item => 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.teacher && item.teacher.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.channelTitle && item.channelTitle.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  const filteredVideos = filterContent(videos, 'video');
  const filteredEpisodes = filterContent(episodes, 'episode');
  const allContent = [...filteredVideos, ...filteredEpisodes];

  const openYouTubeVideo = (video) => {
    window.open(video.url || `https://www.youtube.com/watch?v=${video.id}`, '_blank');
  };

  const openSpotifyEpisode = (episode) => {
    window.open(episode.url, '_blank');
  };

  return (
    <section id="recherche" className="py-24 px-6 bg-gradient-to-br from-white via-amber-50/30 to-orange-50/30">
      <div className="max-w-7xl mx-auto">
        {/* En-tête avec titre modifié */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 bg-clip-text text-transparent">
              RECHERCHE
            </span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            (Rabbanim, Cours..)
          </p>
          
          {/* Barre de recherche */}
          <div className="relative max-w-2xl mx-auto mb-12">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
            <Input
              type="text"
              placeholder="Rechercher par nom d'intervenant, sujet de cours..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-6 py-4 text-lg rounded-2xl border-2 border-orange-200 focus:border-orange-400 bg-white/80 backdrop-blur-sm shadow-lg"
            />
          </div>
        </div>

        {/* Onglets */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 w-full max-w-2xl mx-auto mb-12 bg-white/90 backdrop-blur-sm rounded-2xl p-2 shadow-lg">
            <TabsTrigger 
              value="all" 
              className="rounded-xl font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white"
            >
              Tout ({allContent.length})
            </TabsTrigger>
            <TabsTrigger 
              value="videos" 
              className="rounded-xl font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-red-600 data-[state=active]:text-white"
            >
              <Youtube className="w-4 h-4 mr-2" />
              Vidéos ({filteredVideos.length})
            </TabsTrigger>
            <TabsTrigger 
              value="audio" 
              className="rounded-xl font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-green-600 data-[state=active]:text-white"
            >
              <Headphones className="w-4 h-4 mr-2" />
              Audio ({filteredEpisodes.length})
            </TabsTrigger>
          </TabsList>

          {loading ? (
            <div className="flex justify-center items-center py-24">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500"></div>
            </div>
          ) : (
            <>
              <TabsContent value="all" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {/* D'abord toutes les vidéos YouTube (8 max) */}
                  {filteredVideos.map((video) => (
                    <Card 
                      key={`video-${video.id}`}
                      className="group cursor-pointer bg-white/90 backdrop-blur-sm border-2 border-orange-100 hover:border-orange-300 shadow-lg hover:shadow-2xl transform transition-all duration-300 hover:scale-105 rounded-2xl overflow-hidden"
                      onClick={() => openYouTubeVideo(video)}
                    >
                      <div className="aspect-video bg-gradient-to-br from-red-50 to-red-100 relative overflow-hidden">
                        {video.thumbnail ? (
                          <img 
                            src={video.thumbnail} 
                            alt={video.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Youtube className="w-16 h-16 text-red-400" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="absolute top-3 right-3 bg-red-600 text-white px-2 py-1 rounded-lg text-xs font-medium flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {video.duration}
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="w-16 h-16 rounded-full bg-red-600/90 flex items-center justify-center">
                            <Play className="w-8 h-8 text-white fill-current ml-1" />
                          </div>
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <div className="flex items-center mb-3">
                          <Youtube className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" />
                          <span className="text-sm font-medium text-red-600">YouTube</span>
                        </div>
                        <h3 className="font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-orange-600 transition-colors">
                          {video.title}
                        </h3>
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span className="font-medium">{video.channelTitle}</span>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            <span>{new Date(video.publishedAt).toLocaleDateString('fr-FR')}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {/* Ensuite tous les épisodes Spotify (8 max) */}
                  {filteredEpisodes.map((episode) => (
                    <Card 
                      key={`episode-${episode.id}`}
                      className="group cursor-pointer bg-white/90 backdrop-blur-sm border-2 border-orange-100 hover:border-orange-300 shadow-lg hover:shadow-2xl transform transition-all duration-300 hover:scale-105 rounded-2xl overflow-hidden"
                      onClick={() => openSpotifyEpisode(episode)}
                    >
                      <div className="aspect-video bg-gradient-to-br from-green-50 to-green-100 relative overflow-hidden">
                        {episode.imageUrl ? (
                          <img 
                            src={episode.imageUrl} 
                            alt={episode.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Headphones className="w-16 h-16 text-green-400" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="absolute top-3 right-3 bg-green-600 text-white px-2 py-1 rounded-lg text-xs font-medium flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {episode.duration}
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="w-16 h-16 rounded-full bg-green-600/90 flex items-center justify-center">
                            <Play className="w-8 h-8 text-white fill-current ml-1" />
                          </div>
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <div className="flex items-center mb-3">
                          <Headphones className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                          <span className="text-sm font-medium text-green-600">Spotify</span>
                        </div>
                        <h3 className="font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-orange-600 transition-colors">
                          {episode.title}
                        </h3>
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span className="font-medium">{episode.teacher}</span>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            <span>{new Date(episode.publishedAt).toLocaleDateString('fr-FR')}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="videos" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {filteredVideos.map((video) => (
                    
                    <Card 
                      key={video.id}
                      className="group cursor-pointer bg-white/90 backdrop-blur-sm border-2 border-orange-100 hover:border-orange-300 shadow-lg hover:shadow-2xl transform transition-all duration-300 hover:scale-105 rounded-2xl overflow-hidden"
                      onClick={() => openYouTubeVideo(video)}
                    >
                      <div className="aspect-video bg-gradient-to-br from-red-50 to-red-100 relative overflow-hidden">
                        {video.thumbnail ? (
                          <img 
                            src={video.thumbnail} 
                            alt={video.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Youtube className="w-16 h-16 text-red-400" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="absolute top-3 right-3 bg-red-600 text-white px-2 py-1 rounded-lg text-xs font-medium flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {video.duration}
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="w-16 h-16 rounded-full bg-red-600/90 flex items-center justify-center">
                            <Play className="w-8 h-8 text-white fill-current ml-1" />
                          </div>
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <div className="flex items-center mb-3">
                          <Youtube className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" />
                          <span className="text-sm font-medium text-red-600">YouTube</span>
                        </div>
                        <h3 className="font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-orange-600 transition-colors">
                          {video.title}
                        </h3>
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span className="font-medium">{video.channelTitle}</span>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            <span>{new Date(video.publishedAt).toLocaleDateString('fr-FR')}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="audio" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {filteredEpisodes.map((episode) => (
                    
                    <Card 
                      key={episode.id}
                      className="group cursor-pointer bg-white/90 backdrop-blur-sm border-2 border-orange-100 hover:border-orange-300 shadow-lg hover:shadow-2xl transform transition-all duration-300 hover:scale-105 rounded-2xl overflow-hidden"
                      onClick={() => openSpotifyEpisode(episode)}
                    >
                      <div className="aspect-video bg-gradient-to-br from-green-50 to-green-100 relative overflow-hidden">
                        {episode.imageUrl ? (
                          <img 
                            src={episode.imageUrl} 
                            alt={episode.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Headphones className="w-16 h-16 text-green-400" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="absolute top-3 right-3 bg-green-600 text-white px-2 py-1 rounded-lg text-xs font-medium flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {episode.duration}
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="w-16 h-16 rounded-full bg-green-600/90 flex items-center justify-center">
                            <Play className="w-8 h-8 text-white fill-current ml-1" />
                          </div>
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <div className="flex items-center mb-3">
                          <Headphones className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                          <span className="text-sm font-medium text-green-600">Spotify</span>
                        </div>
                        <h3 className="font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-orange-600 transition-colors">
                          {episode.title}
                        </h3>
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span className="font-medium">{episode.teacher}</span>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            <span>{new Date(episode.publishedAt).toLocaleDateString('fr-FR')}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </>
          )}
        </Tabs>

        {/* Liens vers les plateformes */}
        <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-6">
          <a 
            href="https://www.youtube.com/@Lilmodfr" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl"
          >
            <Youtube className="w-6 h-6 mr-3" />
            Voir toutes nos vidéos
            <ExternalLink className="w-4 h-4 ml-2" />
          </a>
          <a 
            href="https://open.spotify.com/show/5oJ8bkMtw0hR1iRxomrSRR" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl"
          >
            <Headphones className="w-6 h-6 mr-3" />
            Écouter sur Spotify
            <ExternalLink className="w-4 h-4 ml-2" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default CombinedContentLibrary;
