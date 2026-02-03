/**
 * LILMOD - Audio Library / Podcast
 * 
 * Spotify podcast episodes
 */

import { useState, useEffect, useRef } from 'react';
import { Headphones, ExternalLink, Clock, Calendar, Loader2, RefreshCw } from 'lucide-react';
import { SOCIAL_LINKS } from '@/lib/constants';
import { 
  fetchSpotifyEpisodes, 
  fetchSpotifyShow, 
  formatDuration, 
  formatReleaseDate,
  type SpotifyEpisode,
  type SpotifyShow 
} from '@/services/spotifyService';

const AudioLibrary = () => {
  const [episodes, setEpisodes] = useState<SpotifyEpisode[]>([]);
  const [show, setShow] = useState<SpotifyShow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [eps, sh] = await Promise.all([
        fetchSpotifyEpisodes(6),
        fetchSpotifyShow()
      ]);
      setEpisodes(eps);
      setShow(sh);
    } catch (err) {
      setError("Impossible de charger les épisodes");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section ref={sectionRef} id="audio" className="section-padding bg-white">
      <div className="container-custom">
        {/* Header */}
        <div className={`flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10 transition-all duration-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
          <div>
            <h2 className="section-title">Nos Podcasts</h2>
            <p className="section-subtitle">Écoutez nos cours en format audio sur Spotify</p>
          </div>
          <div className="flex gap-3">
            <button onClick={loadData} disabled={loading} className="btn-outline text-sm">
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Actualiser
            </button>
            <a href={SOCIAL_LINKS.spotify} target="_blank" rel="noopener noreferrer" className="btn-primary text-sm bg-green-500 hover:bg-green-600">
              <Headphones className="w-4 h-4" />
              Spotify
            </a>
          </div>
        </div>

        {/* Spotify Embed */}
        <div className={`mb-10 transition-all duration-400 delay-100 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <iframe 
            src="https://open.spotify.com/embed/show/5oJ8bkMtw0hR1iRxomrSRR?theme=0" 
            width="100%" 
            height="232" 
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
            loading="lazy"
            className="rounded-xl"
          />
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-neutral-400 animate-spin" />
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="text-center py-16">
            <p className="text-red-500 mb-4">{error}</p>
            <button onClick={loadData} className="btn-primary">Réessayer</button>
          </div>
        )}

        {/* Episodes Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {episodes.map((ep, i) => (
              <a
                key={ep.id}
                href={ep.external_urls.spotify}
                target="_blank"
                rel="noopener noreferrer"
                className={`group card p-4 transition-all duration-400 hover:-translate-y-1 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
                style={{ transitionDelay: `${100 + i * 50}ms` }}
              >
                <div className="flex gap-4">
                  {ep.images?.[0] && (
                    <img src={ep.images[0].url} alt="" className="w-16 h-16 rounded-lg object-cover bg-neutral-100 flex-shrink-0" />
                  )}
                  <div className="min-w-0">
                    <h4 className="font-medium text-neutral-900 text-sm line-clamp-2 mb-1 group-hover:text-green-600 transition-colors">
                      {ep.name}
                    </h4>
                    <div className="flex items-center gap-3 text-xs text-neutral-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDuration(ep.duration_ms)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatReleaseDate(ep.release_date)}
                      </span>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default AudioLibrary;
