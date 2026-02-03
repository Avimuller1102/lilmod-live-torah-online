/**
 * LILMOD - Video Gallery
 * 
 * YouTube videos with clean design
 */

import { useState, useEffect, useRef } from 'react';
import { Play, Youtube, Clock, Loader2, RefreshCw, X } from 'lucide-react';
import { SOCIAL_LINKS } from '@/lib/constants';
import { fetchLatestYouTubeVideos, type YouTubeVideo } from '@/services/youtubeService';

const VideoGallery = () => {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetched = await fetchLatestYouTubeVideos(8);
      setVideos(fetched);
    } catch (err) {
      setError("Impossible de charger les vidéos");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Aujourd'hui";
    if (diffDays === 1) return "Hier";
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
  };

  useEffect(() => {
    document.body.style.overflow = selectedVideo ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [selectedVideo]);

  return (
    <section ref={sectionRef} id="videos" className="section-padding bg-white">
      <div className="container-custom">
        {/* Header */}
        <div className={`flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10 transition-all duration-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
          <div>
            <h2 className="section-title">Nos Vidéos</h2>
            <p className="section-subtitle">Plus de 2500 cours disponibles sur YouTube</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={loadVideos}
              disabled={loading}
              className="btn-outline text-sm"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Actualiser
            </button>
            <a href={SOCIAL_LINKS.youtube} target="_blank" rel="noopener noreferrer" className="btn-primary text-sm bg-red-500 hover:bg-red-600">
              <Youtube className="w-4 h-4" />
              YouTube
            </a>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-neutral-400 animate-spin" />
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="text-center py-20">
            <p className="text-red-500 mb-4">{error}</p>
            <button onClick={loadVideos} className="btn-primary">Réessayer</button>
          </div>
        )}

        {/* Video Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {videos.map((video, i) => (
              <div
                key={video.id}
                className={`group card overflow-hidden cursor-pointer transition-all duration-400 hover:-translate-y-1 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
                style={{ transitionDelay: `${i * 50}ms` }}
                onClick={() => setSelectedVideo(video.id)}
              >
                {/* Thumbnail */}
                <div className="relative aspect-video bg-neutral-100 overflow-hidden">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                      <Play className="w-5 h-5 text-primary-600 ml-0.5" />
                    </div>
                  </div>
                  <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/70 text-white text-xs rounded">
                    {video.duration}
                  </span>
                </div>
                {/* Info */}
                <div className="p-4">
                  <h4 className="font-medium text-neutral-900 line-clamp-2 mb-2 text-sm">
                    {video.title}
                  </h4>
                  <div className="flex items-center gap-1 text-xs text-neutral-500">
                    <Clock className="w-3 h-3" />
                    {formatDate(video.publishedAt)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90" onClick={() => setSelectedVideo(null)}>
          <button onClick={() => setSelectedVideo(null)} className="absolute top-4 right-4 text-white hover:text-red-400">
            <X className="w-8 h-8" />
          </button>
          <div className="w-full max-w-5xl aspect-video bg-black rounded-xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <iframe
              src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default VideoGallery;
