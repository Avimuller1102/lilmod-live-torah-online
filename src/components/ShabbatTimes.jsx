
import React, { useState, useEffect } from 'react';
import { Clock, MapPin, Calendar } from 'lucide-react';
import { fetchShabbatTimes } from '../services/shabbatService';

const ShabbatTimes = () => {
  const [shabbatData, setShabbatData] = useState(null);
  const [loading, setLoading] = useState(true);

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
    if (!shabbatData) return { entree: '19:30', sortie: '20:45' };
    
    // Chercher dans toutes les régions
    const allCities = [
      ...(shabbatData.france || []),
      ...(shabbatData.israel || []),
      ...(shabbatData.international || [])
    ];
    
    const cityData = allCities.find(city => city.city === cityName);
    if (cityData) {
      return { entree: cityData.entree, sortie: cityData.sortie };
    }
    
    // Fallback
    return { entree: '19:30', sortie: '20:45' };
  };

  // Liste complète des villes
  const cities = [
    // France
    { name: 'Paris', country: 'France' },
    { name: 'Lyon', country: 'France' },
    { name: 'Marseille', country: 'France' },
    { name: 'Nice', country: 'France' },
    { name: 'Strasbourg', country: 'France' },
    { name: 'Toulouse', country: 'France' },
    // Israël
    { name: 'Jérusalem', country: 'Israël' },
    { name: 'Tel Aviv', country: 'Israël' },
    { name: 'Ashdod', country: 'Israël' },
    { name: 'Netanya', country: 'Israël' },
    { name: 'Haïfa', country: 'Israël' },
    // International
    { name: 'Londres', country: 'Royaume-Uni' }
  ];

  return (
    <section className="py-20 px-8 bg-gradient-to-br from-blue-50 to-amber-50">
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center mb-16">
          <div className="w-32 h-1 bg-gradient-to-r from-blue-600 to-amber-500 mx-auto mb-12 rounded-full"></div>
          <h2 className="text-4xl md:text-5xl font-bold text-blue-600 mb-8">
            HORAIRES DU CHABBAT
          </h2>
        </div>

        {/* Information sur la semaine en cours */}
        <div className="text-center mb-16">
          <div className="bg-gradient-to-br from-white to-blue-50 rounded-3xl p-8 shadow-xl max-w-2xl mx-auto border border-blue-200">
            <h3 className="text-2xl font-bold text-blue-800 mb-4">Cette semaine</h3>
            {shabbatData?.paracha ? (
              <>
                <p className="text-xl font-bold text-blue-600 mb-2">
                  {shabbatData.paracha.name} • {shabbatData.paracha.dateRange}
                </p>
                <p className="text-lg font-semibold text-gray-700">
                  {shabbatData.paracha.hebrewName}
                </p>
              </>
            ) : (
              <>
                <p className="text-xl font-bold text-blue-600 mb-2">Houkat • 8-9 Juillet 2025</p>
                <p className="text-lg font-semibold text-gray-700">חוקת</p>
              </>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {cities.map((city) => {
              const times = getCityTimes(city.name);

              return (
                <div 
                  key={`${city.name}-${city.country}`}
                  className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-5 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-blue-200"
                >
                  <div className="flex items-center mb-4">
                    <MapPin className="w-4 h-4 text-blue-600 mr-2" />
                    <div>
                      <h3 className="font-bold text-blue-800 text-base">{city.name}</h3>
                      <p className="text-xs text-gray-600">{city.country}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between bg-white/70 rounded-lg p-2">
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 text-amber-600 mr-2" />
                        <span className="text-xs font-medium text-gray-700">Allumage</span>
                      </div>
                      <span className="font-bold text-amber-600 text-sm">{times.entree}</span>
                    </div>
                    
                    <div className="flex items-center justify-between bg-white/70 rounded-lg p-2">
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 text-blue-600 mr-2" />
                        <span className="text-xs font-medium text-gray-700">Havdalah</span>
                      </div>
                      <span className="font-bold text-blue-600 text-sm">{times.sortie}</span>
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
