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
      className="section-padding section-band"
    >

      <div className="container-custom relative">
        <div
          className={`mx-auto mb-12 max-w-3xl text-center transition-all duration-500 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
          }`}
        >
          <span className="eyebrow">
            <Plane className="h-3.5 w-3.5" aria-hidden="true" />
            Témoignages d'Alya
          </span>
          <h2 id="temoignages-title" className="section-title mt-5">
            Ils ont franchi le pas.
          </h2>
          <p className="section-subtitle mx-auto">
            Des étudiants de LILMOD racontent comment les cours les ont accompagnés
            jusqu'à leur installation en Israël.
          </p>
        </div>

        <ul className="carousel-lg lg:grid-cols-3 lg:gap-6">
          {TESTIMONIALS.map((testimonial, index) => (
            <li
              key={testimonial.id}
              className={`transition-all duration-500 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
              }`}
              style={{ transitionDelay: `${120 + index * 90}ms` }}
            >
              <figure className="flex h-full flex-col rounded-2xl border border-neutral-200/80 bg-white p-6 text-neutral-800 shadow-[0_24px_60px_-40px_rgba(16,36,61,0.45)] md:p-8">
                <Quote className="h-8 w-8 text-accent-400" aria-hidden="true" />
                <p className="mt-4 font-display text-lg font-semibold leading-snug text-primary-900 md:text-xl">
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
          <p className="text-neutral-600">Vous aussi, LILMOD a compté dans votre parcours ?</p>
          <a href="#contact" className="btn-accent">
            Partager mon témoignage
          </a>
          <a
            href={SOCIAL_LINKS.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-accent-700 underline-offset-4 hover:underline"
          >
            Ou rejoignez la communauté sur WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
