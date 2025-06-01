
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

        // Trier par date de publication (plus récent en premier)
        combinedContent.sort((a, b) => 
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        );

        setAllContent(combinedContent);
        setFilteredContent(combinedContent);

        // Extraire la liste unique des enseignants
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
    
    // Actualiser le contenu toutes les heures
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
    <section id="content-library" className="py-16 px-4 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-lilmod-navy mb-3">
            <span className="relative">
              BIBLIOTHÈQUE DE CONTENUS
              <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-lilmod-blue to-blue-400"></span>
            </span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Découvrez tous nos enseignements en un seul endroit. Recherchez par enseignant, sujet ou période.
          </p>
        </div>

        <SearchAndFilter 
          onSearch={handleSearch}
          onFilter={handleFilter}
          teachers={teachers}
        />
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lilmod-blue"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredContent.map((item) => (
                <Card 
                  key={`${item.source}-${item.id}`}
                  className="border border-gray-200 shadow-md hover:shadow-xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:translate-y-[-3px] bg-white"
                  onClick={() => openContent(item)}
                >
                  <div className="aspect-video bg-gray-100 overflow-hidden relative">
                    {/* Source Badge */}
                    <div className="absolute top-2 left-2 z-10">
                      {item.source === 'youtube' ? (
                        <div className="bg-red-600 text-white px-2 py-1 rounded text-xs font-medium flex items-center">
                          <Youtube className="w-3 h-3 mr-1" />
                          YouTube
                        </div>
                      ) : (
                        <div className="bg-green-600 text-white px-2 py-1 rounded text-xs font-medium flex items-center">
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
                        className="w-full h-full object-cover"
                      />
                    ) : item.source === 'spotify' && item.imageUrl ? (
                      <img 
                        src={item.imageUrl} 
                        alt={item.title} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-lilmod-navy to-lilmod-blue">
                        {item.source === 'youtube' ? (
                          <Youtube className="w-12 h-12 text-white" />
                        ) : (
                          <Headphones className="w-12 h-12 text-white" />
                        )}
                      </div>
                    )}

                    {/* Duration Badge */}
                    <div className="absolute bottom-2 right-2">
                      <div className="bg-black/80 text-white px-2 py-1 rounded text-xs font-medium flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {item.duration}
                      </div>
                    </div>

                    {/* Play Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-black/40 transition-opacity duration-300">
                      <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                        <Play className="w-8 h-8 text-lilmod-navy fill-current ml-1" />
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="p-4">
                    <h3 className="font-bold text-gray-800 line-clamp-2 min-h-[2.5rem] mb-2">
                      {item.title}
                    </h3>
                    
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-lilmod-blue">{item.teacher}</span>
                      <div className="flex items-center text-gray-500 text-xs">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(item.publishedAt).toLocaleDateString('fr-FR')}
                      </div>
                    </div>

                    {item.description && (
                      <p className="text-xs text-gray-600 line-clamp-2 mb-3">
                        {item.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">
                        {item.source === 'youtube' ? 'Regarder sur YouTube' : 'Écouter sur Spotify'}
                      </span>
                      <ExternalLink className="w-3 h-3 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredContent.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-xl font-bold text-gray-600 mb-2">Aucun contenu trouvé</h3>
                <p className="text-gray-500">Essayez de modifier vos critères de recherche ou vos filtres.</p>
              </div>
            )}
          </>
        )}

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a 
            href="https://www.youtube.com/@Lilmodfr" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white px-6 py-3 rounded-md font-medium transition-colors shadow-md hover:shadow-lg w-full sm:w-auto"
          >
            <Youtube className="w-5 h-5 mr-2" />
            Voir toutes les vidéos
          </a>
          <a 
            href="https://open.spotify.com/show/5oJ8bkMtw0hR1iRxomrSRR" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white px-6 py-3 rounded-md font-medium transition-colors shadow-md hover:shadow-lg w-full sm:w-auto"
          >
            <Headphones className="w-5 h-5 mr-2" />
            Tous les podcasts
          </a>
        </div>
      </div>
    </section>
  );
};

export default CombinedContentLibrary;
