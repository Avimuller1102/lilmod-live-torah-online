/**
 * LILMOD - About Section
 */

import { useEffect, useRef, useState } from 'react';
import { Archive, CalendarDays, MessageCircle, Radio, ShieldCheck, Users } from 'lucide-react';
import { SITE_CONFIG, SOCIAL_LINKS } from '@/lib/constants';

const metrics = [
  { icon: CalendarDays, stat: "2015", label: "année de lancement" },
  { icon: Radio, stat: "+10", label: "cours live / semaine" },
  { icon: Archive, stat: "+2500", label: "cours disponibles" },
  { icon: Users, stat: "+20", label: "intervenants" },
];

const promises = [
  "Un enseignement en français clair, vivant et fidèle aux sources.",
  "Des lives réguliers avec possibilité de suivre le rythme de la semaine.",
  "Des replays faciles à retrouver pour étudier à son moment.",
];

const About = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="about" className="section-padding bg-white">
      <div className="container-custom">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div className={`transition-all duration-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}>
            <span className="eyebrow">À propos</span>
            <h2 className="section-title mt-5 text-balance">
              LILMOD rend l'étude accessible sans l'appauvrir.
            </h2>
            <div className="space-y-5 text-lg leading-8 text-neutral-600">
              <p>
                <strong className="font-bold text-primary-800">LILMOD by Torah Mitzion</strong> diffuse en live depuis {SITE_CONFIG.foundedYear}
                {' '}un message juif adapté à l'époque du retour d'Israël sur sa terre.
              </p>
              <p>
                Le site rassemble les directs, les replays, les podcasts et les liens utiles
                pour que chaque étudiant puisse passer facilement de l'envie d'apprendre à une
                vraie habitude d'étude.
              </p>
            </div>

            <div className="mt-8 space-y-3">
              {promises.map((promise) => (
                <div key={promise} className="flex gap-3 rounded-lg bg-neutral-50 p-4">
                  <ShieldCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent-600" />
                  <span className="text-sm font-medium leading-6 text-neutral-700">{promise}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href={SOCIAL_LINKS.whatsapp} target="_blank" rel="noopener noreferrer" className="btn-primary">
                <MessageCircle className="h-5 w-5" />
                Recevoir le programme
              </a>
              <a href="#videos" className="btn-outline">
                Explorer les replays
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {metrics.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className={`card p-5 md:p-6 transition-all duration-500 hover:-translate-y-1 ${
                    isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
                  } ${index === 0 ? 'bg-primary-900 text-white' : ''}`}
                  style={{ transitionDelay: `${index * 70}ms` }}
                >
                  <div className={`mb-7 flex h-12 w-12 items-center justify-center rounded-lg ${index === 0 ? 'bg-white/10 text-accent-200' : 'bg-accent-50 text-accent-700'}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className={`text-4xl font-extrabold ${index === 0 ? 'text-white' : 'text-neutral-950'}`}>{item.stat}</div>
                  <div className={`mt-2 text-sm font-medium ${index === 0 ? 'text-blue-100/80' : 'text-neutral-500'}`}>{item.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
