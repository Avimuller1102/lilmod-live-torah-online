
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

type CityOption = 'paris' | 'lyon' | 'marseille' | 'nice' | 'jerusalem' | 'ashdod' | 'telaviv' | 'netanya' | 'toulouse';

const ShabbatTimes = () => {
  const [location, setLocation] = useState<CityOption>('paris');
  
  // Ces informations seraient récupérées dynamiquement via une API en production
  // Actuellement, données statiques correspondant à la semaine du 23 Mai 2025
  const shabbatData: Record<CityOption, ShabbatInfo> = {
    paris: {
      date: 'Vendredi 23 Mai 2025',
      hebrewDate: '25 Iyar 5785',
      paracha: 'Behar-Bechukotai',
      candles: '21:13',
      havdalah: '22:33'
    },
    lyon: {
      date: 'Vendredi 23 Mai 2025',
      hebrewDate: '25 Iyar 5785',
      paracha: 'Behar-Bechukotai',
      candles: '20:58',
      havdalah: '22:15'
    },
    marseille: {
      date: 'Vendredi 23 Mai 2025',
      hebrewDate: '25 Iyar 5785',
      paracha: 'Behar-Bechukotai',
      candles: '20:46',
      havdalah: '22:00'
    },
    nice: {
      date: 'Vendredi 23 Mai 2025',
      hebrewDate: '25 Iyar 5785',
      paracha: 'Behar-Bechukotai',
      candles: '20:40',
      havdalah: '21:53'
    },
    jerusalem: {
      date: 'Vendredi 23 Mai 2025',
      hebrewDate: '25 Iyar 5785',
      paracha: 'Behar-Bechukotai',
      candles: '19:01',
      havdalah: '20:20'
    },
    ashdod: {
      date: 'Vendredi 23 Mai 2025',
      hebrewDate: '25 Iyar 5785',
      paracha: 'Behar-Bechukotai',
      candles: '19:14',
      havdalah: '20:18'
    },
    telaviv: {
      date: 'Vendredi 23 Mai 2025',
      hebrewDate: '25 Iyar 5785',
      paracha: 'Behar-Bechukotai',
      candles: '19:16',
      havdalah: '20:20'
    },
    netanya: {
      date: 'Vendredi 23 Mai 2025',
      hebrewDate: '25 Iyar 5785',
      paracha: 'Behar-Bechukotai',
      candles: '19:15',
      havdalah: '20:19'
    },
    toulouse: {
      date: 'Vendredi 23 Mai 2025',
      hebrewDate: '25 Iyar 5785',
      paracha: 'Behar-Bechukotai',
      candles: '21:08',
      havdalah: '22:21'
    }
  };
  
  const currentShabbat = shabbatData[location];
  
  // Groupement des villes par pays pour l'affichage
  const frenchCities: CityOption[] = ['paris', 'lyon', 'marseille', 'nice', 'toulouse'];
  const israelCities: CityOption[] = ['jerusalem', 'ashdod', 'telaviv', 'netanya'];
  
  const getCityLabel = (city: CityOption): string => {
    const labels: Record<CityOption, string> = {
      paris: 'Paris',
      lyon: 'Lyon',
      marseille: 'Marseille',
      nice: 'Nice',
      jerusalem: 'Jérusalem',
      ashdod: 'Ashdod',
      telaviv: 'Tel-Aviv',
      netanya: 'Netanya',
      toulouse: 'Toulouse'
    };
    return labels[city];
  };
  
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
            <div className="flex flex-wrap justify-center gap-2">
              <div className="mb-2 w-full text-center text-white font-semibold">France</div>
              {frenchCities.map(city => (
                <Button 
                  key={city}
                  variant={location === city ? "default" : "outline"} 
                  onClick={() => setLocation(city)}
                  className={`${location === city ? 'bg-white text-lilmod-navy' : 'bg-transparent text-white border-white'} text-xs md:text-sm`}
                  size="sm"
                >
                  {getCityLabel(city)}
                </Button>
              ))}
              
              <div className="mt-3 mb-2 w-full text-center text-white font-semibold">Israël</div>
              {israelCities.map(city => (
                <Button 
                  key={city}
                  variant={location === city ? "default" : "outline"} 
                  onClick={() => setLocation(city)}
                  className={`${location === city ? 'bg-white text-lilmod-navy' : 'bg-transparent text-white border-white'} text-xs md:text-sm`}
                  size="sm"
                >
                  {getCityLabel(city)}
                </Button>
              ))}
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
