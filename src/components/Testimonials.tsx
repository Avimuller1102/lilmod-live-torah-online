/**
 * LILMOD - Témoignages d'Alya
 */

import { useEffect, useRef, useState } from 'react';
import { MapPin, Plane, Quote } from 'lucide-react';
import { SOCIAL_LINKS, TESTIMONIALS } from '@/lib/constants';

const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

/** Typographie française : espaces insécables avant ! ? : ; » et après «. */
const frenchTypography = (text: string) =>
  text.replace(/\s+([!?:;»])/g, '\u202f$1').replace(/«\s+/g, '«\u202f');

const quoted = (text: string) => frenchTypography(`« ${text} »`);

const Testimonials = () => {
  const sectionRef = useRef<HTMLElement>(null);
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
    <section
      ref={sectionRef}
      id="temoignages"
      aria-labelledby="temoignages-title"
      className="section-padding relative overflow-hidden bg-primary-900 text-white"
    >
      <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-accent-500/15 blur-[110px]" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-blue-400/10 blur-[110px]" aria-hidden="true" />

      <div className="container-custom relative">
        <div
          className={`mx-auto mb-12 max-w-3xl text-center transition-all duration-500 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
          }`}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-accent-300/30 bg-accent-400/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-accent-200">
            <Plane className="h-3.5 w-3.5" aria-hidden="true" />
            Témoignages d'Alya
          </span>
          <h2 id="temoignages-title" className="mt-5 text-3xl font-black leading-tight text-white md:text-5xl">
            Ils ont franchi le pas.
          </h2>
          <p className="mt-5 text-lg leading-8 text-blue-100/80">
            Des étudiants de LILMOD racontent comment les cours les ont accompagnés
            jusqu'à leur installation en Israël.
          </p>
        </div>

        <ul className="grid gap-6 lg:grid-cols-3">
          {TESTIMONIALS.map((testimonial, index) => (
            <li
              key={testimonial.id}
              className={`transition-all duration-500 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
              }`}
              style={{ transitionDelay: `${120 + index * 90}ms` }}
            >
              <figure className="flex h-full flex-col rounded-lg border border-white/10 bg-white p-7 text-neutral-800 shadow-2xl shadow-black/20 md:p-8">
                <Quote className="h-9 w-9 text-accent-400" aria-hidden="true" />
                <p className="mt-4 font-display text-xl font-bold leading-snug text-primary-900">
                  {quoted(testimonial.highlight)}
                </p>
                <blockquote className="mt-4 flex-1 text-[15px] leading-7 text-neutral-600">
                  <p>{quoted(testimonial.quote)}</p>
                </blockquote>
                <figcaption className="mt-7 flex items-center gap-4 border-t border-neutral-100 pt-6">
                  <span
                    className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent-400 to-accent-600 font-display text-base font-bold text-white"
                    aria-hidden="true"
                  >
                    {initials(testimonial.name)}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-bold text-neutral-950">{testimonial.name}</span>
                    <span className="mt-0.5 flex flex-wrap items-center gap-x-1.5 text-sm text-neutral-500">
                      {testimonial.age} ans
                      <span aria-hidden="true">·</span>
                      <MapPin className="h-3.5 w-3.5 text-accent-600" aria-hidden="true" />
                      {testimonial.city} → Israël
                    </span>
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>

        <div
          className={`mt-12 flex flex-col items-center gap-4 text-center transition-all delay-300 duration-500 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <p className="text-blue-100/80">Vous aussi, LILMOD a compté dans votre parcours ?</p>
          <a href="#contact" className="btn-accent">
            Partager mon témoignage
          </a>
          <a
            href={SOCIAL_LINKS.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-accent-200 underline-offset-4 hover:underline"
          >
            Ou rejoignez la communauté sur WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
