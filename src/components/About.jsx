
import React, { useState, useEffect, useRef } from 'react';

const About = () => {
  const sectionRef = useRef(null);
  const [visibleElements, setVisibleElements] = useState({
    title: false,
    text1: false,
    text2: false,
    text3: false,
    button: false,
    stats: false
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisibleElements(prev => ({ ...prev, title: true })), 100);
          setTimeout(() => setVisibleElements(prev => ({ ...prev, text1: true })), 300);
          setTimeout(() => setVisibleElements(prev => ({ ...prev, text2: true })), 500);
          setTimeout(() => setVisibleElements(prev => ({ ...prev, text3: true })), 700);
          setTimeout(() => setVisibleElements(prev => ({ ...prev, button: true })), 900);
          setTimeout(() => setVisibleElements(prev => ({ ...prev, stats: true })), 400);
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const stats = [
    { number: '2015', label: 'Depuis', icon: '📅' },
    { number: '10+', label: 'Cours LIVE/semaine', icon: '🎬' },
    { number: '2500+', label: 'Cours disponibles', icon: '📚' },
    { number: '20+', label: 'Rabbanim', icon: '👨‍🏫' },
  ];

  return (
    <section ref={sectionRef} id="about" className="relative bg-gradient-to-b from-amber-100/80 via-orange-50 to-amber-50 overflow-hidden" style={{ paddingTop: '180px', paddingBottom: '200px' }}>
      {/* Decorative soft elements - no dots */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-20 w-96 h-96 bg-gradient-to-br from-amber-200/20 to-orange-100/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-[500px] h-[500px] bg-gradient-to-tr from-amber-100/30 to-yellow-100/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-orange-50/50 to-amber-100/30 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Title with golden underline */}
        <div className={`text-center mb-16 transition-all duration-700 ${visibleElements.title ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            À PROPOS DE LILMOD
          </h2>
          <div className="w-32 h-1.5 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-400 mx-auto rounded-full shadow-lg shadow-amber-500/30"></div>
        </div>

        {/* Main content - Centered layout */}
        <div className="max-w-4xl mx-auto text-center">
          {/* Text content */}
          <div className="space-y-8">
            {/* Paragraph 1 */}
            <p className={`text-xl md:text-2xl text-gray-800 leading-relaxed transition-all duration-700 ${visibleElements.text1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <span className="text-amber-600 font-bold">LILMOD by Torah Mitzion</span> diffuse en{' '}
              <span className="inline-flex items-center mx-1 px-3 py-1 bg-red-100 border border-red-200 rounded-lg">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2"></span>
                <span className="text-red-600 font-bold">LIVE</span>
              </span>{' '}
              depuis 2015, un message juif adapté à l'époque que nous vivons, celle du retour d'Israël sur sa terre.
            </p>
            
            {/* Paragraph 2 */}
            <p className={`text-lg text-gray-700 leading-relaxed transition-all duration-700 ${visibleElements.text2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              Grâce à plus de <span className="text-amber-600 font-bold">10 Cours LIVE par semaine</span>, LILMOD crée un véritable lien avec nos textes et nos traditions. Les participants peuvent poser des questions et tisser un véritable lien avec les enseignants. Grâce à notre site vous retrouverez facilement les enregistrements et bien plus encore…
            </p>
            
            {/* Paragraph 3 */}
            <p className={`text-lg text-gray-700 leading-relaxed transition-all duration-700 ${visibleElements.text3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              Pour rejoindre le groupe WhatsApp afin de recevoir le programme de la semaine, cliquez sur le lien ci-dessous.
            </p>

            {/* CTA Button with more spacing */}
            <div className={`transition-all duration-700 ${visibleElements.button ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ marginTop: '60px' }}>
              <a 
                href="https://chat.whatsapp.com/KR5PN77WbfvDb4zFgBu3Cl" 
                target="_blank"
                rel="noopener noreferrer" 
                className="group inline-flex items-center gap-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-5 px-10 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl hover:shadow-green-500/30"
              >
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217s.232.002.333.012c.107.01.251-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289-.086.101-.173.188-.246.289-.086.101-.177.209-.076.411.101.202.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.333.202c.043.073.043.423-.101.828z"/>
                </svg>
                <span className="text-lg">Rejoindre sur WhatsApp</span>
                <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>

            {/* Stats Grid - now below text, centered */}
            <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 transition-all duration-700 ${visibleElements.stats ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ marginTop: '80px' }}>
              {stats.map((stat, index) => (
                <div 
                  key={index}
                  className="group relative bg-white/60 backdrop-blur-sm border border-amber-200/50 rounded-2xl p-5 shadow-lg hover:shadow-xl hover:border-amber-400/50 transition-all duration-500 hover:scale-105"
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="text-2xl mb-2 transform group-hover:scale-110 transition-transform duration-300">{stat.icon}</div>
                  <div className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500 mb-1">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-medium text-xs">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>


      </div>
    </section>
  );
};

export default About;
