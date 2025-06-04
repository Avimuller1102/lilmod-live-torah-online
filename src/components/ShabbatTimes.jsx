
import React, { useState, useEffect } from 'react';
import { Clock, Calendar } from 'lucide-react';

const ShabbatTimes = () => {
  const [shabbatData, setShabbatData] = useState({
    paracha: "נשא",
    hebrewDates: "א'-ח' סיון תשפ\"ה",
    frenchDates: "1-8 Juin 2025",
    times: {
      paris: { entree: "21:45", sortie: "23:15" },
      jerusalem: { entree: "19:10", sortie: "20:25" }
    }
  });

  return (
    <section className="py-20 px-8 bg-gradient-to-br from-blue-50 to-indigo-50">
      
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            HORAIRES DU CHABBAT
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto mb-8 rounded-full"></div>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-blue-100">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">Cette semaine</h3>
            <div className="text-xl md:text-2xl font-semibold text-black bg-white/90 inline-block px-6 py-3 rounded-xl">
              {shabbatData.paracha} • {shabbatData.frenchDates}
            </div>
            <div className="text-lg mt-3 text-blue-100">
              {shabbatData.hebrewDates}
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-200">
                <div className="flex items-center justify-center mb-4">
                  <h4 className="text-2xl font-bold text-gray-800">France</h4>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm">
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 text-orange-500 mr-3" />
                      <span className="font-medium text-gray-700">Entrée</span>
                    </div>
                    <span className="text-2xl font-bold text-orange-600">{shabbatData.times.paris.entree}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm">
                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 text-orange-500 mr-3" />
                      <span className="font-medium text-gray-700">Sortie</span>
                    </div>
                    <span className="text-2xl font-bold text-orange-600">{shabbatData.times.paris.sortie}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200">
                <div className="flex items-center justify-center mb-4">
                  <h4 className="text-2xl font-bold text-gray-800">Israël</h4>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm">
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 text-blue-500 mr-3" />
                      <span className="font-medium text-gray-700">Entrée</span>
                    </div>
                    <span className="text-2xl font-bold text-blue-600">{shabbatData.times.jerusalem.entree}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm">
                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 text-blue-500 mr-3" />
                      <span className="font-medium text-gray-700">Sortie</span>
                    </div>
                    <span className="text-2xl font-bold text-blue-600">{shabbatData.times.jerusalem.sortie}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShabbatTimes;
