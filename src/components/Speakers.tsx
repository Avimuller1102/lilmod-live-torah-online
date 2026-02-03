/**
 * LILMOD - Speakers Section
 * 
 * Clean grid of speakers
 */

import { useState, useEffect, useRef } from 'react';
import { X, Youtube, ExternalLink } from 'lucide-react';
import { SPEAKERS, SOCIAL_LINKS } from '@/lib/constants';

type Speaker = typeof SPEAKERS[number];

const SpeakerModal = ({ speaker, onClose }: { speaker: Speaker | null; onClose: () => void }) => {
  if (!speaker) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-scale-in" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 bg-neutral-100 hover:bg-neutral-200 rounded-full flex items-center justify-center">
          <X className="w-4 h-4" />
        </button>

        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <img
              src={speaker.image}
              alt={speaker.name}
              className="w-20 h-20 rounded-xl object-cover bg-neutral-100"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(speaker.name)}&size=80&background=3B5998&color=fff`;
              }}
            />
            <div>
              <h3 className="text-xl font-bold text-neutral-900">{speaker.name}</h3>
              <p className="text-accent-600 text-sm">{speaker.specialty}</p>
            </div>
          </div>
          
          <p className="text-neutral-600 text-sm mb-6">{speaker.bio}</p>

          <a
            href={speaker.youtubePlaylist}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary w-full bg-red-500 hover:bg-red-600"
          >
            <Youtube className="w-4 h-4" />
            Voir ses cours
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

  useEffect(() => {
    document.body.style.overflow = selectedSpeaker ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [selectedSpeaker]);

  return (
    <section ref={sectionRef} id="speakers" className="section-padding bg-neutral-50">
      <div className="container-custom">
        {/* Header */}
        <div className={`text-center mb-12 transition-all duration-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
          <h2 className="section-title">Nos Intervenants</h2>
          <p className="section-subtitle mx-auto">Des Rabbanim et experts enseignant depuis Israël</p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {SPEAKERS.map((speaker, i) => (
            <button
              key={speaker.id}
              onClick={() => setSelectedSpeaker(speaker)}
              className={`group text-center transition-all duration-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
              style={{ transitionDelay: `${i * 50}ms` }}
            >
              <div className="relative mb-3">
                <div className="aspect-square rounded-xl overflow-hidden bg-neutral-100 shadow-sm group-hover:shadow-lg transition-shadow">
                  <img
                    src={speaker.image}
                    alt={speaker.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(speaker.name)}&size=200&background=3B5998&color=fff`;
                    }}
                  />
                </div>
              </div>
              <h3 className="font-medium text-neutral-900 text-sm">{speaker.name}</h3>
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
