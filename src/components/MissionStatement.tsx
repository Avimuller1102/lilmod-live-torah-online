/**
 * LILMOD - Mission Statement
 */

import { useEffect, useRef, useState } from 'react';
import { BookOpen, MapPin, Users } from 'lucide-react';

const pillars = [
  {
    icon: Users,
    hebrew: "עם",
    french: "Un Peuple",
    text: "Une communauté francophone qui étudie ensemble, en direct et en replay.",
  },
  {
    icon: BookOpen,
    hebrew: "תורה",
    french: "Une Torah",
    text: "Des textes étudiés avec exigence, clarté et fidélité à la tradition.",
  },
  {
    icon: MapPin,
    hebrew: "ארץ",
    french: "Une Terre",
    text: "Un enseignement enraciné à Jérusalem, tourné vers Israël et la diaspora.",
  },
];

const MissionStatement = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="mission" className="section-band py-16 md:py-20">
      <div className="container-custom">
        <div className="grid items-end gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className={`transition-all duration-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}>
            <span className="eyebrow">עם ישראל חי</span>
            <h2 className="section-title mt-5 text-balance">
              Une plateforme pensée pour apprendre, pas seulement regarder.
            </h2>
            <p className="section-subtitle">
              LILMOD relie les étudiants francophones aux enseignants d'Israël avec
              une programmation régulière, des archives accessibles et un lien vivant
              avec la communauté.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {pillars.map((pillar, index) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.french}
                  className={`card p-5 transition-all duration-500 hover:-translate-y-1 ${
                    isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
                  }`}
                  style={{ transitionDelay: `${index * 80}ms` }}
                >
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-primary-50 text-primary-700">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="mb-2 text-4xl font-black text-accent-600">{pillar.hebrew}</div>
                  <h3 className="text-lg font-bold text-neutral-950">{pillar.french}</h3>
                  <p className="mt-3 text-sm leading-6 text-neutral-600">{pillar.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionStatement;
