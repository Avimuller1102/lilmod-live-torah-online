/**
 * LILMOD - About Section
 * 
 * Clean, spacious layout - NOT cramped!
 */

import { useEffect, useRef, useState } from 'react';
import { Radio, Archive, Users, MessageCircle } from 'lucide-react';
import { SITE_CONFIG, SOCIAL_LINKS } from '@/lib/constants';

const features = [
  { icon: Radio, stat: "10+", label: "Cours LIVE / semaine" },
  { icon: Archive, stat: "2500+", label: "Vidéos disponibles" },
  { icon: Users, stat: "20+", label: "Intervenants experts" },
  { icon: MessageCircle, stat: "5k+", label: "Membres actifs" },
];

const About = () => {
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
    <section ref={sectionRef} id="about" className="section-padding bg-neutral-50">
      <div className="container-custom">
        
        {/* Stats bar - simple and clean */}
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
          {features.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="text-center p-6 bg-white rounded-2xl shadow-sm">
                <Icon className="w-6 h-6 text-primary-600 mx-auto mb-2" />
                <div className="text-2xl md:text-3xl font-bold text-neutral-900">{item.stat}</div>
                <div className="text-sm text-neutral-500">{item.label}</div>
              </div>
            );
          })}
        </div>

        {/* Main content - SPACIOUS, full width */}
        <div className={`max-w-4xl mx-auto transition-all duration-500 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
          
          {/* Heading */}
          <h2 className="section-title text-center mb-6">
            À Propos de LILMOD
          </h2>

          {/* Text content - plenty of space! */}
          <div className="space-y-6 text-center mb-10">
            <p className="text-lg md:text-xl text-neutral-700 leading-relaxed">
              <strong className="text-primary-700">LILMOD by Torah Mitzion</strong> diffuse en LIVE depuis {SITE_CONFIG.foundedYear}, 
              un message juif adapté à l'époque que nous vivons, celle du retour d'Israël sur sa terre.
            </p>

            <p className="text-lg text-neutral-600 leading-relaxed">
              Grâce à plus de 10 cours LIVE par semaine, LILMOD crée un véritable lien avec nos textes 
              et nos traditions. Les participants peuvent poser des questions et tisser un véritable 
              lien avec les enseignants.
            </p>

            <p className="text-lg text-neutral-600 leading-relaxed">
              Grâce à notre site vous retrouverez facilement les enregistrements et bien plus encore…
            </p>
          </div>

          {/* WhatsApp CTA - prominent */}
          <div className="text-center">
            <p className="text-neutral-600 mb-4">
              Rejoignez le groupe WhatsApp pour recevoir le programme de la semaine :
            </p>
            <a
              href={SOCIAL_LINKS.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Rejoindre sur WhatsApp
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};

export default About;
