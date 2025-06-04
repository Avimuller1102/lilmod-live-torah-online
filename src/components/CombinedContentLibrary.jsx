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
    <section id="recherche" className="py-20 px-8 bg-gradient-to-br from-white via-amber-50/20 to-orange-50/20">
      
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
            RECHERCHE (Rabbanim, Cours..)
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-amber-500 mx-auto mb-8 rounded-full"></div>
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
            Découvrez tous nos enseignements en un seul endroit. Recherchez par enseignant, sujet ou période.
          </p>
          
          <div className="relative max-w-3xl mx-auto mb-16">
            <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
            <Input
              type="text"
              placeholder="Rechercher par nom d'intervenant, sujet de cours..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-16 pr-8 py-6 text-lg rounded-2xl border-2 border-orange-200 focus:border-orange-400 bg-white/90 backdrop-blur-sm shadow-lg focus:shadow-xl transition-all duration-300"
            />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 w-full max-w-2xl mx-auto mb-16 bg-white/95 backdrop-blur-sm rounded-2xl p-2 shadow-lg">
            <TabsTrigger 
              value="all" 
              className="rounded-xl font-semibold text-base py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white transition-all duration-300"
            >
              Tout ({allContent.length})
            </TabsTrigger>
            <TabsTrigger 
              value="videos" 
              className="rounded-xl font-semibold text-base py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-red-600 data-[state=active]:text-white transition-all duration-300"
            >
              <Youtube className="w-4 h-4 mr-2" />
              Vidéos ({filteredVideos.length})
            </TabsTrigger>
            <TabsTrigger 
              value="audio" 
              className="rounded-xl font-semibold text-base py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-green-600 data-[state=active]:text-white transition-all duration-300"
            >
              <Headphones className="w-4 h-4 mr-2" />
              Audio ({filteredEpisodes.length})
            </TabsTrigger>
          </TabsList>

          {loading ? (
            <div className="flex justify-center items-center py-32">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500"></div>
            </div>
          ) : (
            <>
              <TabsContent value="all" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {filteredVideos.map((video) => (
                    <Card 
                      key={`video-${video.id}`}
                      className="group cursor-pointer bg-white border-2 border-orange-100 hover:border-orange-300 shadow-lg hover:shadow-2xl transform transition-all duration-300 hover:scale-105 rounded-2xl overflow-hidden"
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
                            <Youtube className="w-12 h-12 text-red-400" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="absolute top-3 right-3 bg-red-600 text-white px-2 py-1 rounded-lg text-sm font-medium flex items-center">
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
                        <h3 className="font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-orange-600 transition-colors text-base leading-tight">
                          {video.title}
                        </h3>
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span className="font-medium">{video.channelTitle}</span>
                          <div className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            <span>{new Date(video.publishedAt).toLocaleDateString('fr-FR')}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {filteredEpisodes.map((episode) => (
                    <Card 
                      key={`episode-${episode.id}`}
                      className="group cursor-pointer bg-white border-2 border-orange-100 hover:border-orange-300 shadow-lg hover:shadow-2xl transform transition-all duration-300 hover:scale-105 rounded-2xl overflow-hidden"
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
                            <Headphones className="w-12 h-12 text-green-400" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="absolute top-3 right-3 bg-green-600 text-white px-2 py-1 rounded-lg text-sm font-medium flex items-center">
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
                        <h3 className="font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-orange-600 transition-colors text-base leading-tight">
                          {episode.title}
                        </h3>
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span className="font-medium">{episode.teacher}</span>
                          <div className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
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
                      className="group cursor-pointer bg-white border-2 border-orange-100 hover:border-orange-300 shadow-lg hover:shadow-2xl transform transition-all duration-300 hover:scale-105 rounded-2xl overflow-hidden"
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
                            <Youtube className="w-12 h-12 text-red-400" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="absolute top-3 right-3 bg-red-600 text-white px-2 py-1 rounded-lg text-sm font-medium flex items-center">
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
                        <h3 className="font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-orange-600 transition-colors text-base leading-tight">
                          {video.title}
                        </h3>
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span className="font-medium">{video.channelTitle}</span>
                          <div className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
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
                      className="group cursor-pointer bg-white border-2 border-orange-100 hover:border-orange-300 shadow-lg hover:shadow-2xl transform transition-all duration-300 hover:scale-105 rounded-2xl overflow-hidden"
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
                            <Headphones className="w-12 h-12 text-green-400" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="absolute top-3 right-3 bg-green-600 text-white px-2 py-1 rounded-lg text-sm font-medium flex items-center">
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
                        <h3 className="font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-orange-600 transition-colors text-base leading-tight">
                          {episode.title}
                        </h3>
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span className="font-medium">{episode.teacher}</span>
                          <div className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
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

        <div className="mt-20 flex flex-col sm:flex-row items-center justify-center gap-6">
          <a 
            href="https://www.youtube.com/@Lilmodfr/videos" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl"
          >
            <Youtube className="w-6 h-6 mr-3" />
            Voir toutes nos vidéos
            <ExternalLink className="w-5 h-5 ml-3" />
          </a>
          <a 
            href="https://open.spotify.com/show/5oJ8bkMtw0hR1iRxomrSRR" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl"
          >
            <Headphones className="w-6 h-6 mr-3" />
            Écouter sur Spotify
            <ExternalLink className="w-5 h-5 ml-3" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default CombinedContentLibrary;
