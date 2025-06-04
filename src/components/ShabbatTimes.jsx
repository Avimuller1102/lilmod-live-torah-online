
import React, { useState, useEffect } from 'react';
import { Clock, Calendar } from 'lucide-react';

const ShabbatTimes = () => {
  const [shabbatData, setShabbatData] = useState({
    paracha: "Nasso",
    hebrewName: "נשא",
    hebrewDates: "א'-ח' סיון תשפ\"ה",
    frenchDates: "1-8 Juin 2025",
    allCities: [
      { city: "Paris", country: "France", entree: "21:04", sortie: "22:23" },
      { city: "Lyon", country: "France", entree: "20:53", sortie: "22:09" },
      { city: "Marseille", country: "France", entree: "20:32", sortie: "21:41" },
      { city: "Toulouse", country: "France", entree: "20:50", sortie: "22:02" },
      { city: "Strasbourg", country: "France", entree: "21:12", sortie: "22:35" },
      { city: "Nice", country: "France", entree: "20:28", sortie: "21:38" },
      { city: "Jérusalem", country: "Israël", entree: "19:05", sortie: "20:21" },
      { city: "Tel Aviv", country: "Israël", entree: "19:22", sortie: "20:22" },
      { city: "Haïfa", country: "Israël", entree: "19:21", sortie: "20:24" },
      { city: "Beer Sheva", country: "Israël", entree: "19:16", sortie: "20:17" },
      { city: "Netanya", country: "Israël", entree: "19:21", sortie: "20:22" },
      { city: "Londres", country: "Royaume-Uni", entree: "21:25", sortie: "22:51" },
      { city: "New York", country: "États-Unis", entree: "19:58", sortie: "21:06" },
      { city: "Los Angeles", country: "États-Unis", entree: "19:52", sortie: "20:56" },
      { city: "Montreal", country: "Canada", entree: "20:15", sortie: "21:31" },
      { city: "Casablanca", country: "Maroc", entree: "19:35", sortie: "20:40" }
    ]
  });

  return (
    <section className="py-24 px-8 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8">
            HORAIRES DU CHABBAT
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto mb-12 rounded-full"></div>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-blue-100 mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-12 text-center">
            <div className="text-2xl md:text-3xl font-bold mb-6 text-black bg-white/95 inline-block px-8 py-4 rounded-2xl">
              Cette semaine
            </div>
            <div className="text-3xl md:text-4xl font-bold mb-4 text-black bg-white/95 inline-block px-8 py-4 rounded-2xl">
              {shabbatData.paracha} • {shabbatData.frenchDates}
            </div>
            <div className="text-xl text-black bg-white/95 inline-block px-6 py-3 rounded-xl">
              {shabbatData.hebrewDates}
            </div>
          </div>

          <div className="p-12">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-50 to-indigo-50">
                    <th className="px-8 py-6 text-left text-lg font-bold text-gray-800 border-b-2 border-blue-200">Ville</th>
                    <th className="px-8 py-6 text-left text-lg font-bold text-gray-800 border-b-2 border-blue-200">Pays</th>
                    <th className="px-8 py-6 text-center text-lg font-bold text-gray-800 border-b-2 border-blue-200">
                      <div className="flex items-center justify-center">
                        <Clock className="w-6 h-6 text-orange-500 mr-3" />
                        Entrée
                      </div>
                    </th>
                    <th className="px-8 py-6 text-center text-lg font-bold text-gray-800 border-b-2 border-blue-200">
                      <div className="flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-orange-500 mr-3" />
                        Sortie
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {shabbatData.allCities.map((cityData, index) => (
                    <tr key={index} className="hover:bg-blue-50/50 transition-colors border-b border-gray-100">
                      <td className="px-8 py-6 font-bold text-xl text-gray-900">{cityData.city}</td>
                      <td className="px-8 py-6 text-lg text-gray-600">{cityData.country}</td>
                      <td className="px-8 py-6 text-center">
                        <span className="text-2xl font-bold text-orange-600 bg-orange-50 px-4 py-2 rounded-lg">
                          {cityData.entree}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <span className="text-2xl font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-lg">
                          {cityData.sortie}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-lg text-gray-600">
            Les horaires sont donnés à titre indicatif.
            <br />
            <span className="text-blue-600 font-medium">
              Données synchronisées avec Torah-Box
            </span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default ShabbatTimes;
