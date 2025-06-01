
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
          fetchLatestYouTubeVideos(12),
          fetchLatestSpotifyEpisodes(12)
        ]);

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

        combinedContent.sort((a, b) => 
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        );

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
    if (item.source === 'youtube') {
      window.open(item.url, '_blank');
    } else {
      window.open(item.url, '_blank');
    }
  };

  return (
    <section id="content-library" className="py-20 px-4 bg-gradient-to-br from-gray-50 via-white to-amber-50/30">
      <div className="max-w-8xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-lilmod-navy mb-6">
            <span className="relative">
              BIBLIOTHÈQUE DE CONTENUS
              <span className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-32 h-1.5 bg-gradient-to-r from-lilmod-gold to-amber-400 rounded-full"></span>
            </span>
          </h2>
          <p className="text-gray-600 text-xl max-w-3xl mx-auto leading-relaxed">
            Découvrez tous nos enseignements en un seul endroit. Recherchez par enseignant, sujet ou période.
          </p>
        </div>

        <div className="mb-12">
          <SearchAndFilter 
            onSearch={handleSearch}
            onFilter={handleFilter}
            teachers={teachers}
          />
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="relative">
              <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-lilmod-gold"></div>
              <div className="absolute inset-0 rounded-full border-4 border-lilmod-gold/20"></div>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
              {filteredContent.map((item) => (
                <Card 
                  key={`${item.source}-${item.id}`}
                  className="group border-0 shadow-lg hover:shadow-2xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:translate-y-[-8px] bg-white rounded-2xl"
                  onClick={() => openContent(item)}
                >
                  <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden relative">
                    {/* Source Badge */}
                    <div className="absolute top-3 left-3 z-10">
                      {item.source === 'youtube' ? (
                        <div className="bg-gradient-to-r from-red-600 to-red-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center shadow-lg">
                          <Youtube className="w-3 h-3 mr-1" />
                          YouTube
                        </div>
                      ) : (
                        <div className="bg-gradient-to-r from-green-600 to-green-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center shadow-lg">
                          <Headphones className="w-3 h-3 mr-1" />
                          Spotify
                        </div>
                      )}
                    </div>

                    {/* Thumbnail */}
                    {item.source === 'youtube' && item.thumbnail ? (
                      <img 
                        src={item.thumbnail} 
                        alt={item.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : item.source === 'spotify' && item.imageUrl ? (
                      <img 
                        src={item.imageUrl} 
                        alt={item.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-lilmod-navy to-lilmod-blue">
                        {item.source === 'youtube' ? (
                          <Youtube className="w-16 h-16 text-white" />
                        ) : (
                          <Headphones className="w-16 h-16 text-white" />
                        )}
                      </div>
                    )}

                    {/* Duration Badge */}
                    <div className="absolute bottom-3 right-3">
                      <div className="bg-black/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {item.duration}
                      </div>
                    </div>

                    {/* Play Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/50 transition-opacity duration-300">
                      <div className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center transform scale-90 group-hover:scale-100 transition-transform duration-300 shadow-2xl">
                        <Play className="w-10 h-10 text-lilmod-navy fill-current ml-1" />
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <h3 className="font-bold text-gray-800 line-clamp-2 min-h-[3rem] mb-3 text-lg group-hover:text-lilmod-navy transition-colors">
                      {item.title}
                    </h3>
                    
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold text-lilmod-blue bg-lilmod-blue/10 px-3 py-1 rounded-full">{item.teacher}</span>
                      <div className="flex items-center text-gray-500 text-xs">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(item.publishedAt).toLocaleDateString('fr-FR')}
                      </div>
                    </div>

                    {item.description && (
                      <p className="text-sm text-gray-600 line-clamp-2 mb-4 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between text-xs pt-3 border-t border-gray-100">
                      <span className="text-gray-500 font-medium">
                        {item.source === 'youtube' ? 'Regarder sur YouTube' : 'Écouter sur Spotify'}
                      </span>
                      <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-lilmod-gold transition-colors" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredContent.length === 0 && (
              <div className="text-center py-20">
                <div className="text-gray-400 mb-6">
                  <Search className="w-24 h-24 mx-auto" />
                </div>
                <h3 className="text-2xl font-bold text-gray-600 mb-4">Aucun contenu trouvé</h3>
                <p className="text-gray-500 text-lg">Essayez de modifier vos critères de recherche ou vos filtres.</p>
              </div>
            )}
          </>
        )}

        <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-6">
          <a 
            href="https://www.youtube.com/@Lilmodfr" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group inline-flex items-center justify-center bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 w-full sm:w-auto"
          >
            <Youtube className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
            Voir toutes les vidéos
          </a>
          <a 
            href="https://open.spotify.com/show/5oJ8bkMtw0hR1iRxomrSRR" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group inline-flex items-center justify-center bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 w-full sm:w-auto"
          >
            <Headphones className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
            Tous les podcasts
          </a>
        </div>
      </div>
    </section>
  );
};

export default CombinedContentLibrary;
