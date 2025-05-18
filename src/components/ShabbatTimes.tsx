
import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ShabbatInfo {
  date: string;
  hebrewDate: string;
  paracha: string;
  candles: string;
  havdalah: string;
}

const ShabbatTimes = () => {
  const [location, setLocation] = useState<'paris' | 'jerusalem'>('paris');
  
  // Ces informations devraient être récupérées via une API en production
  const shabbatData: Record<string, ShabbatInfo> = {
    paris: {
      date: 'Vendredi 16 Mai 2025',
      hebrewDate: '18 Iyar 5785',
      paracha: 'Behar-Bechukotai',
      candles: '20:54',
      havdalah: '22:16'
    },
    jerusalem: {
      date: 'Vendredi 16 Mai 2025',
      hebrewDate: '18 Iyar 5785',
      paracha: 'Behar-Bechukotai',
      candles: '18:54',
      havdalah: '20:16'
    }
  };
  
  const currentShabbat = shabbatData[location];
  
  return (
    <section className="py-12 px-4 bg-gradient-to-r from-amber-50 to-white">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-lilmod-navy mb-2">LES HORAIRES DE CHABATH</h2>
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            {currentShabbat.date} / {currentShabbat.hebrewDate}
          </div>
        </div>
        
        <Card className="overflow-hidden border-none shadow-lg bg-white">
          <div className="bg-gradient-to-r from-lilmod-navy to-lilmod-blue p-4">
            <div className="flex justify-center space-x-4">
              <Button 
                variant={location === 'paris' ? "default" : "outline"} 
                onClick={() => setLocation('paris')}
                className={`${location === 'paris' ? 'bg-white text-lilmod-navy' : 'bg-transparent text-white border-white'}`}
              >
                France
              </Button>
              <Button 
                variant={location === 'jerusalem' ? "default" : "outline"} 
                onClick={() => setLocation('jerusalem')}
                className={`${location === 'jerusalem' ? 'bg-white text-lilmod-navy' : 'bg-transparent text-white border-white'}`}
              >
                Jerusalem
              </Button>
            </div>
          </div>
          
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-lilmod-gold">Paracha: {currentShabbat.paracha}</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-amber-50 p-4 rounded-lg text-center">
                  <p className="text-gray-600">Allumage des bougies</p>
                  <p className="text-2xl font-bold text-lilmod-navy">{currentShabbat.candles}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <p className="text-gray-600">Havdala</p>
                  <p className="text-2xl font-bold text-lilmod-navy">{currentShabbat.havdalah}</p>
                </div>
              </div>
              
              <div className="flex justify-center mt-4">
                <a 
                  href="https://www.torah-box.com/calendrier/chabbat/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-lilmod-blue hover:underline text-sm inline-flex items-center"
                >
                  Voir plus de villes
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="text-center mt-4 text-lilmod-gold font-medium">
          LILMOD vous souhaite Chabath Chalom !
        </div>
      </div>
    </section>
  );
};

export default ShabbatTimes;
