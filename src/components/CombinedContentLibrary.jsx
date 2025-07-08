
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
      {/* Section principale avec recherche - Espacement augmenté */}
      <section className="py-32 px-8 bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-8">
          <div className="absolute top-20 left-20 w-40 h-40 bg-indigo-400 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-32 right-32 w-56 h-56 bg-slate-400 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-blue-300 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-24">
            <div className="flex items-center justify-center mb-12">
              <BookOpen className="w-12 h-12 text-orange-600 mr-4" />
              <h2 className="text-5xl md:text-6xl font-bold font-serif">
                <span className="bg-gradient-to-r from-slate-800 via-orange-600 to-indigo-800 bg-clip-text text-transparent">
                  BIBLIOTHÈQUE D'ÉTUDE
                </span>
              </h2>
            </div>
            
            <div className="w-32 h-1 bg-gradient-to-r from-orange-500 via-slate-600 to-indigo-600 mx-auto mb-12 rounded-full"></div>
            
            <p className="text-2xl md:text-3xl font-bold text-slate-700 mb-8 leading-tight">
              Votre portail vers la sagesse juive
            </p>
            
            <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed font-medium">
              Découvrez l'univers de l'étude juive avec nos meilleurs enseignants.
              <br className="hidden md:block" />
              <span className="font-semibold text-orange-700">Une Torah vivante, accessible partout dans le monde</span>
            </p>
          </div>

          {/* Barre de recherche améliorée */}
          <div className="max-w-4xl mx-auto mb-20">
            <div className="relative bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-slate-200/50">
              <Search className="absolute left-8 top-1/2 transform -translate-y-1/2 text-orange-600 w-7 h-7" />
              <input
                type="text"
                placeholder="Rechercher un cours, un Rav, une Paracha..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-20 pr-8 py-8 rounded-3xl border-0 focus:ring-2 focus:ring-orange-600 outline-none transition-all bg-transparent text-xl text-center font-medium placeholder-slate-500"
              />
            </div>
          </div>

          {loading && (
            <div className="flex justify-center items-center py-24">
              <div className="relative">
                <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-orange-600"></div>
                <Users className="absolute inset-0 m-auto w-8 h-8 text-slate-500" />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Séparateur professionnel avec plus d'espace */}
      <div className="py-16 bg-gradient-to-r from-transparent via-slate-300 to-transparent">
        <div className="w-full h-1 bg-gradient-to-r from-transparent via-slate-400 to-transparent"></div>
      </div>

      {/* Section YouTube avec plus d'espacement */}
      <section id="videos" className="py-40 px-8 bg-gradient-to-br from-red-50 via-white to-slate-50 relative" style={{ scrollMarginTop: '6rem' }}>
        <div className="absolute inset-0 opacity-8">
          <div className="absolute top-10 right-10 w-80 h-80 bg-red-400 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-64 h-64 bg-orange-300 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-24">
            <div className="flex items-center justify-center mb-10">
              <div className="w-20 h-20 bg-gradient-to-r from-red-600 to-orange-500 rounded-3xl flex items-center justify-center mr-8 shadow-2xl">
                <Youtube className="w-10 h-10 text-white" />
              </div>
              <div className="text-left">
                <h2 className="text-5xl md:text-6xl font-bold text-slate-800 mb-4 font-serif">
                  NOS DERNIERS SHIOURIM
                </h2>
                <p className="text-2xl font-medium text-red-600">Les shiourim qui transforment votre quotidien</p>
              </div>
            </div>
            
            <p className="text-slate-600 max-w-3xl mx-auto text-xl font-medium leading-relaxed">
              Rejoignez nos cours en direct et replays. Une communauté d'apprentissage qui grandit chaque jour.
            </p>
          </div>
          
          {!loading && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 mb-24">
                {filteredVideos.map((video) => (
                  <Card 
                    key={video.id} 
                    className="group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border-0 bg-white shadow-xl overflow-hidden rounded-3xl"
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
                          <Play className="w-16 h-16 text-white opacity-0 group-hover:opacity-100 transition-all transform scale-75 group-hover:scale-100" />
                        </div>
                        <div className="absolute bottom-4 right-4 bg-red-600/90 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          {video.duration}
                        </div>
                      </div>
                      <div className="p-6">
                        <h4 className="font-bold text-slate-800 mb-4 line-clamp-2 group-hover:text-red-600 transition-colors text-lg leading-tight">
                          {video.title}
                        </h4>
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-semibold text-orange-600">LILMOD</span>
                          <div className="flex items-center text-slate-500">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span className="font-medium">{formatDate(video.publishedAt)}</span>
                          </div>
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
                  className="inline-flex items-center bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white px-12 py-6 rounded-3xl font-bold transition-all shadow-2xl hover:shadow-3xl transform hover:scale-105 text-xl"
                >
                  <Youtube className="w-8 h-8 mr-4" />
                  <span className="text-white">Découvrir tous nos shiourim</span>
                </a>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Grande séparation entre sections */}
      <section className="py-32 bg-gradient-to-r from-indigo-800 via-slate-900 to-blue-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-repeat" style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
          }}></div>
        </div>
        <div className="max-w-7xl mx-auto px-8 text-center relative z-10">
          <div className="w-40 h-2 bg-white/50 mx-auto mb-16 rounded-full"></div>
          <h3 className="text-5xl md:text-7xl font-bold text-orange-200 mb-12 leading-relaxed font-serif">
            מתחברים לתורה • מתחברים לעם ישראל
          </h3>
          <p className="text-white/90 text-2xl md:text-3xl max-w-4xl mx-auto mb-8 font-medium">
            Nous connecter à la Torah • Nous connecter au peuple d'Israël
          </p>
        </div>
      </section>

      {/* Section Spotify avec espacement amélioré */}
      <section id="podcasts" className="py-40 px-8 bg-gradient-to-br from-green-50 via-white to-slate-50 relative" style={{ scrollMarginTop: '6rem' }}>
        <div className="absolute inset-0 opacity-8">
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-green-400 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-20 right-20 w-64 h-64 bg-blue-300 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-24">
            <div className="flex items-center justify-center mb-10">
              <div className="w-20 h-20 bg-gradient-to-r from-green-600 to-blue-500 rounded-3xl flex items-center justify-center mr-8 shadow-2xl">
                <Headphones className="w-10 h-10 text-white" />
              </div>
              <div className="text-left">
                <h2 className="text-5xl md:text-6xl font-bold text-slate-800 mb-4 font-serif">
                  TORAH EN AUDIO
                </h2>
                <p className="text-2xl font-medium text-green-600">La Torah dans vos oreilles, partout où vous allez</p>
              </div>
            </div>
            
            <p className="text-slate-600 max-w-3xl mx-auto text-xl font-medium leading-relaxed">
              Emportez l'étude partout avec vous. Écoutez nos rabbanim lors de vos déplacements.
            </p>
          </div>
          
          {!loading && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 mb-24">
                {filteredEpisodes.map((episode) => (
                  <Card 
                    key={episode.id} 
                    className="group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border-0 bg-white shadow-xl overflow-hidden rounded-3xl"
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
                          <Play className="w-16 h-16 text-white opacity-0 group-hover:opacity-100 transition-all transform scale-75 group-hover:scale-100" />
                        </div>
                        <div className="absolute bottom-4 right-4 bg-green-600/90 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          {episode.duration}
                        </div>
                      </div>
                      <div className="p-6">
                        <h4 className="font-bold text-slate-800 mb-4 line-clamp-2 group-hover:text-green-600 transition-colors text-lg leading-tight">
                          {episode.title}
                        </h4>
                        <div className="flex items-center justify-between text-sm mb-3">
                          <span className="font-bold text-green-600 text-sm uppercase tracking-wide">{episode.teacher}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-semibold text-orange-600">PODCAST</span>
                          <div className="flex items-center text-slate-500">
                            <Calendar className="w-4 h-4 mr-2" />
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
                  className="inline-flex items-center bg-gradient-to-r from-green-600 to-blue-500 hover:from-green-700 hover:to-blue-600 text-white px-12 py-6 rounded-3xl font-bold transition-all shadow-2xl hover:shadow-3xl transform hover:scale-105 text-xl"
                >
                  <Headphones className="w-8 h-8 mr-4" />
                  <span className="text-white">Tous nos podcasts Torah</span>
                </a>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Séparateur final avec espacement */}
      <div className="py-16 bg-gradient-to-r from-transparent via-slate-300 to-transparent">
        <div className="w-full h-1 bg-gradient-to-r from-transparent via-slate-400 to-transparent"></div>
      </div>
    </>
  );
};

export default CombinedContentLibrary;
