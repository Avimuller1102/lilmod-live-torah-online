
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
      <section className="py-20 px-8 bg-gradient-to-br from-blue-50 via-white to-amber-50 relative overflow-hidden">
        {/* Motifs décoratifs inspirés de l'étude juive */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-32 h-32 border-2 border-[#5878ad] rounded-full"></div>
          <div className="absolute bottom-32 right-32 w-40 h-40 border-2 border-[#f49923] rounded-full"></div>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 border-2 border-[#8390a1] rounded-full"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          {/* En-tête avec branding renforcé */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-8">
              <img 
                src="/lovable-uploads/22a26f48-309c-4e16-8aaa-8f01984d9135.png" 
                alt="LILMOD - Torah Mitzion" 
                className="h-16 md:h-20 drop-shadow-lg"
              />
            </div>
            
            <div className="w-24 h-1 bg-gradient-to-r from-[#5878ad] via-[#f49923] to-[#8390a1] mx-auto mb-8 rounded-full"></div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-[#5878ad] mb-6 leading-tight">
              <span className="flex items-center justify-center gap-3 mb-2">
                <BookOpen className="w-10 h-10 text-[#f49923]" />
                BIBLIOTHÈQUE D'ÉTUDE
              </span>
              <span className="text-2xl md:text-3xl font-semibold text-gray-700">
                Votre portail vers la sagesse juive
              </span>
            </h2>
            
            <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
              Découvrez l'univers de l'étude juive avec nos meilleurs enseignants. 
              <br className="hidden md:block" />
              <span className="font-semibold text-[#5878ad]">Une Torah vivante, accessible partout dans le monde</span>
            </p>
          </div>

          {/* Barre de recherche améliorée */}
          <div className="max-w-3xl mx-auto mb-12">
            <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-[#5878ad]/20">
              <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-[#5878ad] w-6 h-6" />
              <input
                type="text"
                placeholder="Rechercher un cours, un rabbin, une paracha..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-16 pr-6 py-6 rounded-2xl border-0 focus:ring-2 focus:ring-[#5878ad] outline-none transition-all bg-transparent text-lg text-center font-medium placeholder-gray-500"
              />
            </div>
          </div>

          {loading && (
            <div className="flex justify-center items-center py-20">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#5878ad]"></div>
                <Users className="absolute inset-0 m-auto w-6 h-6 text-[#f49923]" />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Séparateur décoratif */}
      <section className="py-8 bg-gradient-to-r from-[#5878ad] via-[#f49923] to-[#8390a1]">
        <div className="max-w-7xl mx-auto px-8">
          <div className="h-px bg-white/30"></div>
        </div>
      </section>

      {/* Section YouTube - Design unifié */}
      <section id="videos" className="py-24 px-8 bg-gradient-to-br from-red-50 to-white relative" style={{ scrollMarginTop: '6rem' }}>
        {/* Motif de fond spécifique YouTube */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 right-10 w-64 h-64 bg-red-500 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            {/* Titre attractif avec hiérarchie */}
            <div className="flex items-center justify-center mb-6">
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mr-4 shadow-lg">
                <Youtube className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">
                  NOS DERNIERS SHIOURIM
                </h2>
                <p className="text-lg font-semibold text-red-600">Vidéos & Lives Torah</p>
              </div>
            </div>
            
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Rejoignez nos cours en direct et replays. Une communauté d'apprentissage qui grandit chaque jour.
            </p>
          </div>
          
          {!loading && (
            <>
              {/* Grille uniforme pour les vidéos */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16">
                {filteredVideos.map((video) => (
                  <Card 
                    key={video.id} 
                    className="group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border-0 bg-white shadow-lg overflow-hidden rounded-xl"
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
                        {/* Hiérarchie typographique claire */}
                        <h4 className="font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-red-500 transition-colors text-base leading-tight">
                          {video.title}
                        </h4>
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-semibold text-[#5878ad]">LILMOD</span>
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
              
              <div className="text-center">
                <a 
                  href="https://www.youtube.com/@Lilmodfr/videos" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Youtube className="w-5 h-5 mr-3" />
                  <span className="text-white">Découvrir tous nos shiourim</span>
                </a>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Séparateur décoratif majeur */}
      <section className="py-16 bg-gradient-to-br from-[#5878ad] to-[#8390a1] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-repeat" style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
          }}></div>
        </div>
        <div className="max-w-7xl mx-auto px-8 text-center relative z-10">
          <div className="w-32 h-1 bg-white/50 mx-auto mb-8 rounded-full"></div>
          <h3 className="text-2xl font-bold text-white mb-4">
            מתחברים לתורה • מתחברים לעם ישראל
          </h3>
          <p className="text-white/90 text-lg max-w-2xl mx-auto">
            "כל המלמד תורה לבן חברו - מעלה עליו הכתוב כאילו ילדו"
          </p>
        </div>
      </section>

      {/* Section Spotify - Design unifié */}
      <section id="podcasts" className="py-24 px-8 bg-gradient-to-br from-green-50 to-white relative" style={{ scrollMarginTop: '6rem' }}>
        {/* Motif de fond spécifique Spotify */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute bottom-10 left-10 w-64 h-64 bg-green-500 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            {/* Titre attractif avec hiérarchie */}
            <div className="flex items-center justify-center mb-6">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mr-4 shadow-lg">
                <Headphones className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">
                  TORAH EN AUDIO
                </h2>
                <p className="text-lg font-semibold text-green-600">Podcasts & Écoutes spirituelles</p>
              </div>
            </div>
            
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Emportez l'étude partout avec vous. Écoutez nos rabbanim lors de vos déplacements.
            </p>
          </div>
          
          {!loading && (
            <>
              {/* Grille uniforme pour les podcasts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16">
                {filteredEpisodes.map((episode) => (
                  <Card 
                    key={episode.id} 
                    className="group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border-0 bg-white shadow-lg overflow-hidden rounded-xl"
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
                        {/* Hiérarchie typographique claire */}
                        <h4 className="font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-green-500 transition-colors text-base leading-tight">
                          {episode.title}
                        </h4>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="font-bold text-green-600 text-xs uppercase tracking-wide">{episode.teacher}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-semibold text-[#5878ad]">PODCAST</span>
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
                  className="inline-flex items-center bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Headphones className="w-5 h-5 mr-3" />
                  <span className="text-white">Tous nos podcasts Torah</span>
                </a>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Section finale - Linktree avec branding */}
      <section className="py-20 px-8 bg-gradient-to-br from-[#f49923] to-[#8390a1] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 border-4 border-white rounded-full"></div>
        </div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="mb-8">
            <h3 className="text-3xl font-bold text-white mb-4">
              כל הקישורים שלנו במקום אחד
            </h3>
            <p className="text-white/90 text-lg">
              Accédez à tous nos contenus, événements et moyens de contact
            </p>
          </div>
          
          <a 
            href="https://linktr.ee/lilmod.torahmitzion" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center bg-white hover:bg-gray-100 text-[#5878ad] px-12 py-6 rounded-2xl font-bold transition-all shadow-2xl hover:shadow-3xl transform hover:scale-105 text-xl"
          >
            <svg className="w-6 h-6 mr-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            כל הקישורים שלנו
          </a>
        </div>
      </section>
    </>
  );
};

export default CombinedContentLibrary;
