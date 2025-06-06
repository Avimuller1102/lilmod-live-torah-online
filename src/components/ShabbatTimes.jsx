
import React, { useState, useEffect } from 'react';
import { Clock, MapPin, Calendar } from 'lucide-react';
import { fetchShabbatTimes } from '../services/shabbatService';

const ShabbatTimes = () => {
  const [shabbatData, setShabbatData] = useState(null);
  const [loading, setLoading] = useState(true);

  const cities = [
    // France - villes spécifiées
    { name: 'Paris', country: 'France' },
    { name: 'Toulouse', country: 'France' },
    { name: 'Lyon', country: 'France' },
    { name: 'Marseille', country: 'France' },
    { name: 'Nice', country: 'France' },
    { name: 'Strasbourg', country: 'France' },
    // Israël - villes spécifiées
    { name: 'Jérusalem', country: 'Israël' },
    { name: 'Tel Aviv', country: 'Israël' },
    { name: 'Haïfa', country: 'Israël' },
    { name: 'Eilat', country: 'Israël' }
  ];

  useEffect(() => {
    const getShabbatTimes = async () => {
      try {
        setLoading(true);
        const timesData = await fetchShabbatTimes();
        setShabbatData(timesData);
      } catch (error) {
        console.error('Error fetching Shabbat times:', error);
      } finally {
        setLoading(false);
      }
    };

    getShabbatTimes();
  }, []);

  const getCityTimes = (cityName) => {
    if (!shabbatData) return { candleLighting: '19:30', havdalah: '20:45' };
    
    // Chercher dans les données France
    const franceCity = shabbatData.france?.find(city => city.city === cityName);
    if (franceCity) {
      return { candleLighting: franceCity.entree, havdalah: franceCity.sortie };
    }
    
    // Chercher dans les données Israël
    const israelCity = shabbatData.israel?.find(city => city.city === cityName);
    if (israelCity) {
      return { candleLighting: israelCity.entree, havdalah: israelCity.sortie };
    }
    
    // Fallback
    return { candleLighting: '19:30', havdalah: '20:45' };
  };

  return (
    <section className="py-20 px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center mb-16">
          <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-12 rounded-full"></div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
            HORAIRES DU CHABBAT
          </h2>
        </div>

        {/* Information sur la semaine en cours */}
        <div className="text-center mb-16">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 shadow-lg max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-black mb-4">Cette semaine</h3>
            <p className="text-xl font-bold text-black mb-2">Nasso • 1-8 Juin 2025</p>
            <p className="text-lg font-semibold text-black">א'-ח' סיון תשפ"ה</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {cities.map((city) => {
              const times = getCityTimes(city.name);

              return (
                <div 
                  key={`${city.name}-${city.country}`}
                  className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-5 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-blue-200"
                >
                  <div className="flex items-center mb-4">
                    <MapPin className="w-4 h-4 text-blue-600 mr-2" />
                    <div>
                      <h3 className="font-bold text-gray-900 text-base">{city.name}</h3>
                      <p className="text-xs text-gray-600">{city.country}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between bg-white/70 rounded-lg p-2">
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 text-orange-600 mr-2" />
                        <span className="text-xs font-medium text-gray-700">Allumage</span>
                      </div>
                      <span className="font-bold text-orange-600 text-sm">{times.candleLighting}</span>
                    </div>
                    
                    <div className="flex items-center justify-between bg-white/70 rounded-lg p-2">
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 text-blue-600 mr-2" />
                        <span className="text-xs font-medium text-gray-700">Havdalah</span>
                      </div>
                      <span className="font-bold text-blue-600 text-sm">{times.havdalah}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default ShabbatTimes;
