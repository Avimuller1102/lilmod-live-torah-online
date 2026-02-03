/**
 * LILMOD - Mission Statement
 * 
 * "Un Peuple - Une Torah - Une Terre"
 * Clean, modern design
 */

import { useEffect, useRef, useState } from 'react';
import { MapPin, BookOpen, Users } from 'lucide-react';

const pillars = [
  {
    icon: Users,
    hebrew: "עם",
    french: "Un Peuple",
    color: "bg-blue-500",
  },
  {
    icon: BookOpen,
    hebrew: "תורה",
    french: "Une Torah",
    color: "bg-accent-500",
  },
  {
    icon: MapPin,
    hebrew: "ארץ",
    french: "Une Terre",
    color: "bg-green-500",
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
    <section
      ref={sectionRef}
      id="mission"
      className="py-20 md:py-28 pb-32 md:pb-40 bg-primary-800 text-white"
    >
      <div className="container-custom text-center">
        {/* Main heading */}
        <div className={`mb-12 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
          <p className="text-accent-400 text-lg mb-4">עם ישראל חי</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
            Un Peuple • Une Torah • Une Terre
          </h2>
        </div>

        {/* Three pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {pillars.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <div
                key={i}
                className={`p-8 bg-white/5 rounded-2xl border border-white/10 transition-all duration-500 hover:bg-white/10 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className={`w-14 h-14 ${pillar.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <div className="text-4xl font-bold text-accent-400 mb-2">{pillar.hebrew}</div>
                <div className="text-xl font-semibold">{pillar.french}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default MissionStatement;
