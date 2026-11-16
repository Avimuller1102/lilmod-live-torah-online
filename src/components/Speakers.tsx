/**
 * LILMOD - Speakers Section
 * 
 * Clean grid of speakers
 */

import { useState, useEffect, useRef } from 'react';
import { X, Youtube } from 'lucide-react';
import { useDialog } from '@/hooks/useDialog';
import { IMAGES, SPEAKERS, SOCIAL_LINKS } from '@/lib/constants';

type Speaker = typeof SPEAKERS[number];

const speakerSearchUrl = (speaker: Speaker) =>
  `${SOCIAL_LINKS.youtube}/search?query=${encodeURIComponent(speaker.searchQuery)}`;

const SpeakerModal = ({ speaker, onClose }: { speaker: Speaker | null; onClose: () => void }) => {
  const dialogRef = useDialog<HTMLDivElement>(Boolean(speaker), onClose);
  if (!speaker) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="speaker-dialog-title"
        tabIndex={-1}
        className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl animate-scale-in focus:outline-none"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-200"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
        <div className="p-6">
          <div className="mb-4 flex items-center gap-4 pr-10">
            <img
              src={speaker.image}
              alt=""
              width={80}
              height={80}
              className="h-20 w-20 rounded-xl bg-neutral-100 object-cover"
              onError={(event) => {
                event.currentTarget.src = IMAGES.logo;
              }}
            />
            <div>
              <h3 id="speaker-dialog-title" className="text-xl font-bold text-neutral-900">{speaker.name}</h3>
              <p className="text-sm text-accent-700">{speaker.specialty}</p>
            </div>
          </div>
          <p className="mb-6 text-sm leading-6 text-neutral-600">{speaker.bio}</p>
          <a
            href={speakerSearchUrl(speaker)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary w-full bg-red-600 hover:bg-red-700"
          >
            <Youtube className="h-4 w-4" aria-hidden="true" />
            Voir ses cours sur YouTube
          </a>
        </div>
      </div>
    </div>
  );
};

const Speakers = () => {
  const [selectedSpeaker, setSelectedSpeaker] = useState<Speaker | null>(null);
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


  return (
    <section ref={sectionRef} id="speakers" className="section-padding bg-white">
      <div className="container-custom">
        {/* Header */}
        <div className={`text-center mb-12 transition-all duration-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
          <span className="eyebrow">Intervenants</span>
          <h2 className="section-title mt-5">Des voix solides, des approches complémentaires.</h2>
          <p className="section-subtitle mx-auto">Des Rabbanim et experts enseignant depuis Israël.</p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {SPEAKERS.map((speaker, i) => (
            <button
              key={speaker.id}
              type="button"
              onClick={() => setSelectedSpeaker(speaker)}
              aria-haspopup="dialog"
              aria-label={`${speaker.name} – ${speaker.specialty}`}
              className={`group text-center transition-all duration-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
              style={{ transitionDelay: `${i * 50}ms` }}
            >
              <div className="relative mb-3">
                <div className="premium-card-3d aspect-square rounded-lg overflow-hidden bg-neutral-100 shadow-sm ring-1 ring-neutral-200 group-hover:shadow-lg transition-shadow">
                  <img
                    src={speaker.image}
                    alt=""
                    width={240}
                    height={240}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    decoding="async"
                    onError={(event) => {
                      event.currentTarget.src = IMAGES.logo;
                    }}
                  />
                </div>
              </div>
              <h3 className="font-medium text-neutral-900 text-sm">{speaker.name}</h3>
              <p className="mt-0.5 text-xs text-neutral-500">{speaker.specialty}</p>
            </button>
          ))}
        </div>

        {/* CTA */}
        <div className={`text-center mt-12 transition-all duration-400 delay-200 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <a
            href={SOCIAL_LINKS.youtube + '/playlists'}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline"
          >
            <Youtube className="w-4 h-4" />
            Voir toutes les playlists
          </a>
        </div>
      </div>

      <SpeakerModal speaker={selectedSpeaker} onClose={() => setSelectedSpeaker(null)} />
    </section>
  );
};

export default Speakers;
