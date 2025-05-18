
import React from 'react';
import { Youtube, Users, Globe, Book, User } from 'lucide-react';

const Stats = () => {
  return (
    <section id="stats" className="py-16 bg-gradient-to-br from-white to-amber-50 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-lilmod-navy mb-12">
          <span className="relative">
            LILMOD en chiffres
            <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-amber-300 to-lilmod-gold"></span>
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 md:gap-8">
          {/* Cours et rediffusions */}
          <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center transform transition-all duration-300 hover:shadow-lg hover:translate-y-[-5px]">
            <div className="w-14 h-14 bg-gradient-to-br from-lilmod-blue to-blue-400 rounded-full flex items-center justify-center mb-4">
              <Youtube className="w-7 h-7 text-white" />
            </div>
            <div className="text-3xl font-bold text-lilmod-navy">2 500+</div>
            <p className="text-gray-600 text-center mt-2">Cours et rediffusions disponibles</p>
          </div>

          {/* Intervenants */}
          <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center transform transition-all duration-300 hover:shadow-lg hover:translate-y-[-5px]">
            <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-lilmod-gold rounded-full flex items-center justify-center mb-4">
              <User className="w-7 h-7 text-white" />
            </div>
            <div className="text-3xl font-bold text-lilmod-navy">40+</div>
            <p className="text-gray-600 text-center mt-2">Intervenants réguliers</p>
          </div>

          {/* Abonnés YouTube */}
          <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center transform transition-all duration-300 hover:shadow-lg hover:translate-y-[-5px]">
            <div className="w-14 h-14 bg-gradient-to-br from-red-600 to-red-400 rounded-full flex items-center justify-center mb-4">
              <Users className="w-7 h-7 text-white" />
            </div>
            <div className="text-3xl font-bold text-lilmod-navy">2 470+</div>
            <p className="text-gray-600 text-center mt-2">Abonnés sur YouTube</p>
          </div>

          {/* Francophone */}
          <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center transform transition-all duration-300 hover:shadow-lg hover:translate-y-[-5px]">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-sky-300 rounded-full flex items-center justify-center mb-4">
              <Globe className="w-7 h-7 text-white" />
            </div>
            <div className="text-3xl font-bold text-lilmod-navy">100%</div>
            <p className="text-gray-600 text-center mt-2">Francophone, accessible partout</p>
          </div>

          {/* Heures d'études */}
          <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center transform transition-all duration-300 hover:shadow-lg hover:translate-y-[-5px]">
            <div className="w-14 h-14 bg-gradient-to-br from-green-600 to-emerald-400 rounded-full flex items-center justify-center mb-4">
              <Book className="w-7 h-7 text-white" />
            </div>
            <div className="text-3xl font-bold text-lilmod-navy">10 000+</div>
            <p className="text-gray-600 text-center mt-2">Heures d'études de Torah</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
