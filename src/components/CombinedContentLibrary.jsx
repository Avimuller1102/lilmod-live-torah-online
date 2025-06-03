
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Youtube, ExternalLink, Play, Calendar, Clock, Headphones, Search } from 'lucide-react';
import { fetchLatestYouTubeVideos } from '../services/youtubeService';
import { fetchLatestSpotifyEpisodes } from '../services/spotifyService';
import SearchAndFilter from './SearchAndFilter';
import { useToast } from '@/hooks/use-toast';

const CombinedContentLibrary = () => {
  const { toast } = useToast();
  const [allContent, setAllContent] = useState([]);
  const [filteredContent, setFilteredContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        const [videos, episodes] = await Promise.all([
          fetchLatestYouTubeVideos(8),
          fetchLatestSpotifyEpisodes(8)
        ]);

        // D'abord les vidéos YouTube (8), puis les épisodes Spotify (8)
        const combinedContent = [
          ...videos.map(video => ({
            ...video,
            source: 'youtube',
            teacher: extractTeacherFromTitle(video.title)
          })),
          ...episodes.map(episode => ({
            ...episode,
            source: 'spotify',
            teacher: episode.teacher || extractTeacherFromTitle(episode.title)
          }))
        ];

        setAllContent(combinedContent);
        setFilteredContent(combinedContent);

        const uniqueTeachers = [...new Set(combinedContent.map(item => item.teacher))];
        setTeachers(uniqueTeachers.filter(Boolean));

      } catch (error) {
        console.error("Failed to load content:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger le contenu. Veuillez réessayer plus tard.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadContent();
    
    const refreshInterval = setInterval(() => {
      loadContent();
    }, 60 * 60 * 1000);
    
    return () => clearInterval(refreshInterval);
  }, [toast]);

  const extractTeacherFromTitle = (title) => {
    const match = title.match(/^(Rav\s+[^-]+|Dr\s+[^-]+|Rabbi\s+[^-]+)/i);
    return match ? match[1].trim() : 'LILMOD';
  };

  const handleSearch = (query) => {
    if (!query.trim()) {
      setFilteredContent(allContent);
      return;
    }

    const filtered = allContent.filter(item =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.teacher.toLowerCase().includes(query.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(query.toLowerCase()))
    );
    setFilteredContent(filtered);
  };

  const handleFilter = (filters) => {
    let filtered = [...allContent];

    if (filters.teacher) {
      filtered = filtered.filter(item => item.teacher === filters.teacher);
    }

    if (filters.source !== 'all') {
      filtered = filtered.filter(item => item.source === filters.source);
    }

    if (filters.dateRange !== 'all') {
      const now = new Date();
      const cutoffDate = new Date();
      
      switch (filters.dateRange) {
        case 'week':
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          cutoffDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      filtered = filtered.filter(item => 
        new Date(item.publishedAt) >= cutoffDate
      );
    }

    setFilteredContent(filtered);
  };

  const openContent = (item) => {
    window.open(item.url, '_blank');
  };

  return (
    <section id="content-library" className="py-24 px-8 bg-gradient-to-br from-white via-amber-50/20 to-orange-50/20">
      <div className="max-w-8xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-6">
            <span className="relative">
              RECHERCHE (Rabbanim, Cours..)
              <span className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-32 h-1.5 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full"></span>
            </span>
          </h2>
          <p className="text-gray-600 text-xl max-w-4xl mx-auto leading-relaxed mt-8">
            Découvrez tous nos enseignements en un seul endroit. Recherchez par enseignant, sujet ou période.
          </p>
        </div>

        <div className="mb-20">
          <SearchAndFilter 
            onSearch={handleSearch}
            onFilter={handleFilter}
            teachers={teachers}
          />
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-32">
            <div className="relative">
              <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-orange-400"></div>
              <div className="absolute inset-0 rounded-full border-4 border-orange-200/30"></div>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
              {filteredContent.map((item) => (
                <Card 
                  key={`${item.source}-${item.id}`}
                  className="group border-0 shadow-xl hover:shadow-2xl overflow-hidden cursor-pointer transform transition-all duration-500 hover:translate-y-[-12px] bg-white rounded-3xl"
                  onClick={() => openContent(item)}
                >
                  <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden relative">
                    {/* Badge de source */}
                    <div className="absolute top-4 left-4 z-10">
                      {item.source === 'youtube' ? (
                        <div className="bg-gradient-to-r from-red-600 to-red-500 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center shadow-lg">
                          <Youtube className="w-4 h-4 mr-2" />
                          YouTube
                        </div>
                      ) : (
                        <div className="bg-gradient-to-r from-green-600 to-green-500 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center shadow-lg">
                          <Headphones className="w-4 h-4 mr-2" />
                          Spotify
                        </div>
                      )}
                    </div>

                    {/* Image/Miniature */}
                    {item.source === 'youtube' && item.thumbnail ? (
                      <img 
                        src={item.thumbnail} 
                        alt={item.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : item.source === 'spotify' && item.imageUrl ? (
                      <img 
                        src={item.imageUrl} 
                        alt={item.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-500 to-amber-500">
                        {item.source === 'youtube' ? (
                          <Youtube className="w-20 h-20 text-white" />
                        ) : (
                          <Headphones className="w-20 h-20 text-white" />
                        )}
                      </div>
                    )}

                    {/* Badge de durée */}
                    <div className="absolute bottom-4 right-4">
                      <div className="bg-black/80 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-bold flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        {item.duration}
                      </div>
                    </div>

                    {/* Overlay de lecture */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/50 transition-opacity duration-300">
                      <div className="w-24 h-24 rounded-full bg-white/90 flex items-center justify-center transform scale-90 group-hover:scale-100 transition-transform duration-300 shadow-2xl">
                        <Play className="w-12 h-12 text-orange-600 fill-current ml-1" />
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="p-8">
                    <h3 className="font-bold text-gray-800 line-clamp-2 min-h-[4rem] mb-6 text-xl group-hover:text-orange-600 transition-colors leading-tight">
                      {item.title}
                    </h3>
                    
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-sm font-bold text-orange-600 bg-orange-100 px-4 py-2 rounded-full">{item.teacher}</span>
                      <div className="flex items-center text-gray-500 text-sm">
                        <Calendar className="w-4 h-4 mr-2" />
                        {new Date(item.publishedAt).toLocaleDateString('fr-FR')}
                      </div>
                    </div>

                    {item.description && (
                      <p className="text-sm text-gray-600 line-clamp-2 mb-6 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between text-sm pt-4 border-t border-gray-100">
                      <span className="text-gray-500 font-semibold">
                        {item.source === 'youtube' ? 'Regarder sur YouTube' : 'Écouter sur Spotify'}
                      </span>
                      <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredContent.length === 0 && (
              <div className="text-center py-32">
                <div className="text-gray-400 mb-8">
                  <Search className="w-32 h-32 mx-auto" />
                </div>
                <h3 className="text-3xl font-bold text-gray-600 mb-6">Aucun contenu trouvé</h3>
                <p className="text-gray-500 text-xl">Essayez de modifier vos critères de recherche ou vos filtres.</p>
              </div>
            )}
          </>
        )}

        <div className="mt-24 flex flex-col sm:flex-row items-center justify-center gap-8">
          <a 
            href="https://www.youtube.com/@Lilmodfr" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group inline-flex items-center justify-center bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white px-12 py-6 rounded-2xl font-bold transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 w-full sm:w-auto text-lg"
          >
            <Youtube className="w-8 h-8 mr-4 group-hover:scale-110 transition-transform" />
            Voir toutes les vidéos
          </a>
          <a 
            href="https://open.spotify.com/show/5oJ8bkMtw0hR1iRxomrSRR" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group inline-flex items-center justify-center bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white px-12 py-6 rounded-2xl font-bold transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 w-full sm:w-auto text-lg"
          >
            <Headphones className="w-8 h-8 mr-4 group-hover:scale-110 transition-transform" />
            Tous les podcasts
          </a>
        </div>
      </div>
    </section>
  );
};

export default CombinedContentLibrary;
