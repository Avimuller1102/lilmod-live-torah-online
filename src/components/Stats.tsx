
import React from 'react';
import { 
  Youtube, 
  Users, 
  Video, 
  Headphones, 
  Globe 
} from 'lucide-react';

const Stats = () => {
  const stats = [
    {
      icon: <Video className="w-6 h-6 text-lilmod-blue" />,
      count: '+2 500',
      label: 'Cours et rediffusions disponibles'
    },
    {
      icon: <Users className="w-6 h-6 text-lilmod-blue" />,
      count: '+20',
      label: 'Intervenants réguliers'
    },
    {
      icon: <Youtube className="w-6 h-6 text-lilmod-blue" />,
      count: '+2 470',
      label: 'Abonnés sur YouTube'
    },
    {
      icon: <Globe className="w-6 h-6 text-lilmod-blue" />,
      count: '+10 000',
      label: 'Heures d\'études disponibles'
    },
    {
      icon: <Headphones className="w-6 h-6 text-lilmod-blue" />,
      count: '100%',
      label: 'Francophone, accessible partout'
    }
  ];

  return (
    <section id="stats" className="py-16 px-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-lilmod-navy mb-2">
          <span className="relative">
            LILMOD EN CHIFFRES
            <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-lilmod-blue to-blue-400"></span>
          </span>
        </h2>
        <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">Notre mission : rendre accessible l'étude de la Torah en français, partout dans le monde</p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-12">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="bg-white border border-gray-100 rounded-xl shadow-lg hover:shadow-xl transition-all p-6 flex flex-col items-center text-center transform hover:-translate-y-1 duration-300"
            >
              <div className="bg-blue-50 p-3 rounded-full mb-4">
                {stat.icon}
              </div>
              <div className="text-2xl md:text-3xl font-bold text-lilmod-navy mb-1">{stat.count}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
