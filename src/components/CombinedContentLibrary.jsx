import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Play, Clock, Calendar, Youtube, Headphones, BookOpen, Users } from 'lucide-react';
import { fetchLatestYouTubeVideos } from '../services/youtubeService';
import { fetchLatestSpotifyEpisodes } from '../services/spotifyService';
import { useToast } from '@/hooks/use-toast';

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
    <>
      {/* Section principale avec recherche - Atmosphère Torah */}
      <section className="py-32 px-8 bg-gradient-to-br from-blue-50 via-white to-amber-50 relative overflow-hidden">
        {/* Motifs décoratifs inspirés de l'étude juive - Bulles améliorées */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-40 h-40 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-32 right-32 w-56 h-56 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-gradient-to-br from-blue-300 to-indigo-400 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-gradient-to-br from-orange-300 to-yellow-400 rounded-full blur-lg animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          {/* En-tête avec branding renforcé */}
          <div className="text-center mb-24">            
            <div className="w-32 h-1 bg-gradient-to-r from-blue-600 via-amber-500 to-orange-500 mx-auto mb-12 rounded-full"></div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
              <span className="flex items-center justify-center gap-3 mb-4">
                <BookOpen className="w-12 h-12 text-amber-500" />
                <span className="text-blue-600">BIBLIOTHÈQUE</span> <span className="text-orange-500">D'ÉTUDE</span>
              </span>
              
              <span className="text-2xl md:text-3xl font-semibold text-gray-700 block mt-4">
                Votre portail vers la sagesse juive
              </span>
            </h2>
            
            <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
              Découvrez l'univers de l'étude juive avec nos meilleurs enseignants. 
              <br className="hidden md:block" />
              <span className="font-semibold text-blue-600">Une Torah vivante, accessible partout dans le monde</span>
            </p>
          </div>

          {/* Barre de recherche améliorée */}
          <div className="max-w-3xl mx-auto mb-20">
            <div className="relative bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-blue-200/50">
              <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-blue-600 w-6 h-6" />
              <input
                type="text"
                placeholder="Rechercher un cours, un Rav, une Paracha..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-16 pr-6 py-6 rounded-2xl border-0 focus:ring-2 focus:ring-blue-600 outline-none transition-all bg-transparent text-lg text-center font-medium placeholder-gray-500"
              />
            </div>
          </div>

          {loading && (
            <div className="flex justify-center items-center py-20">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
                <Users className="absolute inset-0 m-auto w-6 h-6 text-amber-500" />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Section YouTube - Avec fond amélioré et espace ajouté */}
      <section id="videos" className="py-32 px-8 bg-gradient-to-br from-red-50 via-pink-50 to-orange-50 relative overflow-hidden" style={{ scrollMarginTop: '6rem' }}>
        {/* Bulles décoratives pour YouTube */}
        <div className="absolute inset-0 opacity-8">
          <div className="absolute top-16 right-16 w-48 h-48 bg-gradient-to-br from-red-400 to-pink-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-36 h-36 bg-gradient-to-br from-orange-400 to-red-500 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
          <div className="absolute top-1/3 left-1/3 w-28 h-28 bg-gradient-to-tl from-pink-300 to-red-400 rounded-full blur-xl animate-pulse" style={{ animationDelay: '0.8s' }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-24">
            <div className="flex items-center justify-center mb-8">
              <div className="w-14 h-14 bg-gradient-to-br from-red-600 to-red-500 rounded-full flex items-center justify-center mr-4 shadow-xl">
                <Youtube className="w-7 h-7 text-white" />
              </div>
              <div className="text-left">
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                  <span className="text-red-600">NOS DERNIERS</span> <span className="text-orange-600">CHIOURIM</span>
                </h2>
                
                <p className="text-xl font-semibold text-red-500 mt-4">Les chiourim qui transforment votre quotidien</p>
              </div>
            </div>
            
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Rejoignez nos cours en direct et replays. Une communauté d'apprentissage qui grandit chaque jour.
            </p>
          </div>
          
          {!loading && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-24">
                {filteredVideos.map((video) => (
                  <Card 
                    key={video.id} 
                    className="group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border-0 bg-white/95 backdrop-blur-sm shadow-lg overflow-hidden rounded-xl"
                    onClick={() => openYouTubeVideo(video)}
                  >
                    <CardContent className="p-0">
                      <div className="relative aspect-video">
                        <img 
                          src={video.thumbnail} 
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent group-hover:from-black/80 transition-all flex items-center justify-center">
                          <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-all transform scale-75 group-hover:scale-100" />
                        </div>
                        <div className="absolute bottom-3 right-3 bg-red-600/90 text-white px-3 py-1 rounded-lg text-sm font-bold flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {video.duration}
                        </div>
                      </div>
                      <div className="p-4">
                        <h4 className="font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-red-500 transition-colors text-base leading-tight">
                          {video.title}
                        </h4>
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-semibold text-blue-600">LILMOD</span>
                          <div className="flex items-center text-gray-500">
                            <Calendar className="w-3 h-3 mr-1" />
                            <span className="font-medium">{formatDate(video.publishedAt)}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="text-center mb-32">
                <a 
                  href="https://www.youtube.com/@Lilmodfr/videos" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white px-10 py-5 rounded-xl font-bold transition-all shadow-xl hover:shadow-2xl transform hover:scale-105"
                >
                  <Youtube className="w-6 h-6 mr-3" />
                  <span className="text-white">Découvrir tous nos chiourim</span>
                </a>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Séparateur décoratif avec beaucoup plus d'espace */}
      <section className="py-64 bg-gradient-to-br from-blue-600 to-blue-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-repeat" style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
          }}></div>
        </div>
        <div className="max-w-7xl mx-auto px-8 text-center relative z-10">
          <div className="w-32 h-1 bg-white/50 mx-auto mb-16 rounded-full"></div>
          <p className="text-white/90 text-2xl md:text-3xl max-w-3xl mx-auto mb-8 font-medium">
            Nous connecter à la Torah • Nous connecter au peuple d'Israël
          </p>
          <div className="w-16 h-1 bg-amber-400 mx-auto rounded-full"></div>
        </div>
      </section>

      {/* Section Spotify - Avec fond amélioré et plus d'espace avant */}
      <section id="podcasts" className="py-32 px-8 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative overflow-hidden" style={{ scrollMarginTop: '6rem' }}>
        {/* Bulles décoratives pour Spotify */}
        <div className="absolute inset-0 opacity-8">
          <div className="absolute bottom-16 left-16 w-44 h-44 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-teal-400 to-green-500 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1.2s' }}></div>
          <div className="absolute top-2/3 right-1/3 w-28 h-28 bg-gradient-to-tl from-emerald-300 to-green-400 rounded-full blur-xl animate-pulse" style={{ animationDelay: '0.7s' }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-24">
            <div className="flex items-center justify-center mb-8">
              <div className="w-14 h-14 bg-gradient-to-br from-green-600 to-green-500 rounded-full flex items-center justify-center mr-4 shadow-xl">
                <Headphones className="w-7 h-7 text-white" />
              </div>
              <div className="text-left">
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                  <span className="text-green-600">TORAH</span> <span className="text-green-600">EN</span> <span className="text-green-600">AUDIO</span>
                </h2>
                
                <p className="text-xl font-semibold text-green-500 mt-4">La Torah dans vos oreilles, partout où vous allez</p>
              </div>
            </div>
            
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Emportez l'étude partout avec vous. Écoutez nos rabbanim lors de vos déplacements.
            </p>
          </div>
          
          {!loading && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-24">
                {filteredEpisodes.map((episode) => (
                  <Card 
                    key={episode.id} 
                    className="group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border-0 bg-white/95 backdrop-blur-sm shadow-lg overflow-hidden rounded-xl"
                    onClick={() => openSpotifyEpisode(episode)}
                  >
                    <CardContent className="p-0">
                      <div className="relative aspect-video">
                        <img 
                          src={episode.imageUrl} 
                          alt={episode.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent group-hover:from-black/80 transition-all flex items-center justify-center">
                          <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-all transform scale-75 group-hover:scale-100" />
                        </div>
                        <div className="absolute bottom-3 right-3 bg-green-600/90 text-white px-3 py-1 rounded-lg text-sm font-bold flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {episode.duration}
                        </div>
                      </div>
                      <div className="p-4">
                        <h4 className="font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-green-500 transition-colors text-base leading-tight">
                          {episode.title}
                        </h4>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="font-bold text-green-600 text-xs uppercase tracking-wide">{episode.teacher}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-semibold text-blue-600">PODCAST</span>
                          <div className="flex items-center text-gray-500">
                            <Calendar className="w-3 h-3 mr-1" />
                            <span className="font-medium">{formatDate(episode.publishedAt)}</span>
                          </div>
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
                  className="inline-flex items-center bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white px-10 py-5 rounded-xl font-bold transition-all shadow-xl hover:shadow-2xl transform hover:scale-105"
                >
                  <Headphones className="w-6 h-6 mr-3" />
                  <span className="text-white">Tous nos podcasts Torah</span>
                </a>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default CombinedContentLibrary;
