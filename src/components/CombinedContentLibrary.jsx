
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
      {/* Section principale avec recherche */}
      <section className="py-24 px-8 bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-32 h-32 border-2 border-indigo-600 rounded-full"></div>
          <div className="absolute bottom-32 right-32 w-40 h-40 border-2 border-slate-500 rounded-full"></div>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 border-2 border-blue-400 rounded-full"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <div className="flex items-center justify-center mb-10">
              <img 
                src="/lovable-uploads/f633489f-70d3-45ce-bfcf-5b9aced172df.png" 
                alt="LILMOD - Torah Mitzion" 
                className="h-20 md:h-24 drop-shadow-lg"
              />
            </div>
            
            <div className="w-24 h-1 bg-gradient-to-r from-indigo-600 via-slate-500 to-blue-600 mx-auto mb-10 rounded-full"></div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-8 leading-tight font-serif">
              <span className="flex items-center justify-center gap-4 mb-4">
                <BookOpen className="w-12 h-12 text-indigo-600" />
                <span className="bg-gradient-to-r from-slate-800 to-indigo-800 bg-clip-text text-transparent">
                  BIBLIOTHÈQUE D'ÉTUDE
                </span>
              </span>
              <span className="text-2xl md:text-3xl font-medium text-slate-600">
                Votre portail vers la sagesse juive
              </span>
            </h2>
            
            <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed font-medium">
              Découvrez l'univers de l'étude juive avec nos meilleurs enseignants. 
              <br className="hidden md:block" />
              <span className="font-semibold text-indigo-700">Une Torah vivante, accessible partout dans le monde</span>
            </p>
          </div>

          {/* Barre de recherche */}
          <div className="max-w-3xl mx-auto mb-16">
            <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border-2 border-slate-200/50">
              <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-indigo-600 w-6 h-6" />
              <input
                type="text"
                placeholder="Rechercher un cours, un rabbin, une paracha..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-16 pr-6 py-6 rounded-2xl border-0 focus:ring-2 focus:ring-indigo-600 outline-none transition-all bg-transparent text-lg text-center font-medium placeholder-slate-500"
              />
            </div>
          </div>

          {loading && (
            <div className="flex justify-center items-center py-20">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
                <Users className="absolute inset-0 m-auto w-6 h-6 text-slate-500" />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Séparateur professionnel */}
      <div className="w-full h-1 bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>

      {/* Section YouTube */}
      <section id="videos" className="py-28 px-8 bg-gradient-to-br from-red-50 via-white to-slate-50 relative" style={{ scrollMarginTop: '6rem' }}>
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 right-10 w-64 h-64 bg-red-500 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <div className="flex items-center justify-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-red-500 rounded-2xl flex items-center justify-center mr-6 shadow-xl">
                <Youtube className="w-8 h-8 text-white" />
              </div>
              <div className="text-left">
                <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-2 font-serif">
                  NOS DERNIERS SHIOURIM
                </h2>
                <p className="text-xl font-medium text-red-600">Les shiourim qui transforment votre quotidien</p>
              </div>
            </div>
            
            <p className="text-slate-600 max-w-2xl mx-auto text-lg font-medium">
              Rejoignez nos cours en direct et replays. Une communauté d'apprentissage qui grandit chaque jour.
            </p>
          </div>
          
          {!loading && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-20">
                {filteredVideos.map((video) => (
                  <Card 
                    key={video.id} 
                    className="group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border-0 bg-white shadow-lg overflow-hidden rounded-2xl"
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
                      <div className="p-5">
                        <h4 className="font-bold text-slate-800 mb-3 line-clamp-2 group-hover:text-red-600 transition-colors text-base leading-tight">
                          {video.title}
                        </h4>
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-semibold text-indigo-600">LILMOD</span>
                          <div className="flex items-center text-slate-500">
                            <Calendar className="w-3 h-3 mr-1" />
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
                  className="inline-flex items-center bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white px-10 py-5 rounded-2xl font-bold transition-all shadow-xl hover:shadow-2xl transform hover:scale-105 text-lg"
                >
                  <Youtube className="w-6 h-6 mr-4" />
                  <span className="text-white">Découvrir tous nos shiourim</span>
                </a>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Séparateur élégant */}
      <section className="py-20 bg-gradient-to-r from-indigo-700 via-slate-800 to-blue-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-repeat" style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
          }}></div>
        </div>
        <div className="max-w-7xl mx-auto px-8 text-center relative z-10">
          <div className="w-32 h-1 bg-white/50 mx-auto mb-12 rounded-full"></div>
          <h3 className="text-4xl md:text-6xl font-bold text-blue-200 mb-8 leading-relaxed font-serif">
            מתחברים לתורה • מתחברים לעם ישראל
          </h3>
          <p className="text-white/90 text-xl md:text-2xl max-w-3xl mx-auto mb-6 font-medium">
            Nous connecter à la Torah • Nous connecter au peuple d'Israël
          </p>
        </div>
      </section>

      {/* Section Spotify */}
      <section id="podcasts" className="py-28 px-8 bg-gradient-to-br from-green-50 via-white to-slate-50 relative" style={{ scrollMarginTop: '6rem' }}>
        <div className="absolute inset-0 opacity-5">
          <div className="absolute bottom-10 left-10 w-64 h-64 bg-green-500 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <div className="flex items-center justify-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-green-500 rounded-2xl flex items-center justify-center mr-6 shadow-xl">
                <Headphones className="w-8 h-8 text-white" />
              </div>
              <div className="text-left">
                <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-2 font-serif">
                  TORAH EN AUDIO
                </h2>
                <p className="text-xl font-medium text-green-600">La Torah dans vos oreilles, partout où vous allez</p>
              </div>
            </div>
            
            <p className="text-slate-600 max-w-2xl mx-auto text-lg font-medium">
              Emportez l'étude partout avec vous. Écoutez nos rabbanim lors de vos déplacements.
            </p>
          </div>
          
          {!loading && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-20">
                {filteredEpisodes.map((episode) => (
                  <Card 
                    key={episode.id} 
                    className="group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border-0 bg-white shadow-lg overflow-hidden rounded-2xl"
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
                      <div className="p-5">
                        <h4 className="font-bold text-slate-800 mb-3 line-clamp-2 group-hover:text-green-600 transition-colors text-base leading-tight">
                          {episode.title}
                        </h4>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="font-bold text-green-600 text-xs uppercase tracking-wide">{episode.teacher}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-semibold text-indigo-600">PODCAST</span>
                          <div className="flex items-center text-slate-500">
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
                  className="inline-flex items-center bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white px-10 py-5 rounded-2xl font-bold transition-all shadow-xl hover:shadow-2xl transform hover:scale-105 text-lg"
                >
                  <Headphones className="w-6 h-6 mr-4" />
                  <span className="text-white">Tous nos podcasts Torah</span>
                </a>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Séparateur final */}
      <div className="w-full h-1 bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
    </>
  );
};

export default CombinedContentLibrary;
