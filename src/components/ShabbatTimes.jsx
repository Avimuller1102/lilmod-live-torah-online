
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, MapPin, Calendar, Star } from 'lucide-react';
import { fetchShabbatTimes } from '../services/shabbatService';

const ShabbatTimes = () => {
  const [shabbatData, setShabbatData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadShabbatTimes = async () => {
      try {
        const data = await fetchShabbatTimes();
        setShabbatData(data);
      } catch (error) {
        console.error('Erreur lors du chargement des horaires:', error);
      } finally {
        setLoading(false);
      }
    };

    loadShabbatTimes();
  }, []);

  if (loading) {
    return (
      <section className="py-20 px-4 bg-gradient-to-br from-indigo-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-800 mb-4">Horaires du Chabbat</h2>
          </div>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-32 px-4 bg-gradient-to-br from-indigo-50 via-white to-blue-50 relative overflow-hidden">
      {/* Motifs de fond subtils */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-40 h-40 bg-indigo-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-56 h-56 bg-blue-600 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-slate-400 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-8">
            <Star className="w-8 h-8 text-indigo-600 mr-3" />
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 via-indigo-800 to-blue-800 bg-clip-text text-transparent">
              HORAIRES DU CHABBAT
            </h2>
            <Star className="w-8 h-8 text-indigo-600 ml-3" />
          </div>
          
          {shabbatData?.parasha && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 max-w-2xl mx-auto mb-8 border border-indigo-200 shadow-lg">
              <div className="flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-indigo-600 mr-2" />
                <h3 className="text-2xl font-bold text-slate-800">Paracha de la semaine</h3>
              </div>
              <p className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent mb-2">
                {shabbatData.parasha.name}
              </p>
              <p className="text-lg text-slate-600 font-medium">{shabbatData.parasha.date}</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {shabbatData?.cities?.map((city, index) => (
            <Card key={index} className="bg-white/90 backdrop-blur-sm border-2 border-indigo-100 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-indigo-600 via-blue-600 to-slate-700 text-white p-6">
                <CardTitle className="flex items-center text-xl font-bold">
                  <MapPin className="w-5 h-5 mr-2" />
                  {city.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 font-medium">Allumage:</span>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1 text-orange-500" />
                    <span className="font-bold text-orange-600">{city.candleLighting}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 font-medium">Sortie:</span>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1 text-blue-500" />
                    <span className="font-bold text-blue-600">{city.havdalah}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShabbatTimes;
