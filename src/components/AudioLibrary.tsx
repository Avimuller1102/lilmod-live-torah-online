/**
 * LILMOD - Audio Library / Podcast
 */

import { useEffect, useRef, useState } from 'react';
import { Calendar, Clock, ExternalLink, Headphones } from 'lucide-react';
import { IMAGES, SOCIAL_LINKS } from '@/lib/constants';
import {
  fetchSpotifyEpisodes,
  formatDuration,
  formatReleaseDate,
  type SpotifyEpisode,
} from '@/services/spotifyService.ts';

const AudioLibrary = () => {
  const [episodes, setEpisodes] = useState<SpotifyEpisode[]>([]);
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
    fetchSpotifyEpisodes(6).then(setEpisodes);
  }, []);

  return (
    <section ref={sectionRef} id="audio" className="section-padding section-band">
      <div className="container-custom">
        <div className={`mb-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end transition-all duration-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}>
          <div>
            <span className="eyebrow">Podcasts</span>
            <h2 className="section-title mt-5">Écouter LILMOD partout.</h2>
            <p className="section-subtitle">
              Retrouvez les cours en audio sur Spotify pour continuer l'étude en déplacement.
            </p>
          </div>
          <div className="flex justify-start lg:justify-end">
            <a href={SOCIAL_LINKS.spotify} target="_blank" rel="noopener noreferrer" className="btn-primary bg-green-600 hover:bg-green-700">
              <Headphones className="h-4 w-4" />
              Ouvrir Spotify
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className={`mb-8 overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm transition-all delay-100 duration-400 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <iframe
            src="https://open.spotify.com/embed/show/5oJ8bkMtw0hR1iRxomrSRR?theme=0"
            width="100%"
            height="232"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            title="Podcast LILMOD sur Spotify"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {episodes.map((episode, index) => (
            <a
              key={episode.id}
              href={episode.external_urls.spotify}
              target="_blank"
              rel="noopener noreferrer"
              className={`group card premium-card-3d holo-sheen p-4 transition-all duration-400 hover:-translate-y-1 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
              }`}
              style={{ transitionDelay: `${100 + index * 50}ms` }}
            >
              <div className="flex gap-4">
                <img
                  src={episode.images?.[0]?.url || IMAGES.logo}
                  alt=""
                  className="h-16 w-16 flex-shrink-0 rounded-lg bg-neutral-100 object-cover"
                />
                <div className="min-w-0">
                  <h4 className="line-clamp-2 text-sm font-bold text-neutral-950 transition-colors group-hover:text-green-700">
                    {episode.name}
                  </h4>
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-neutral-500">{episode.description}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-neutral-500">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDuration(episode.duration_ms)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatReleaseDate(episode.release_date)}
                    </span>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AudioLibrary;
