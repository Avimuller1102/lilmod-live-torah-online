
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from 'lucide-react';

// Type pour les données d'horaires du Shabbat
interface ShabbatTime {
  city: string;
  entree: string;
  sortie: string;
}

const ShabbatTimes = () => {
  const [selectedTab, setSelectedTab] = useState('france');
  
  // Horaires pour la France (exemple)
  const franceTimes: ShabbatTime[] = [
    { city: "Paris", entree: "21:00", sortie: "22:15" },
    { city: "Lyon", entree: "20:45", sortie: "22:00" },
    { city: "Marseille", entree: "20:30", sortie: "21:45" },
    { city: "Nice", entree: "20:25", sortie: "21:40" },
    { city: "Toulouse", entree: "20:55", sortie: "22:10" }
  ];
  
  // Horaires pour Israël (exemple)
  const israelTimes: ShabbatTime[] = [
    { city: "Jérusalem", entree: "19:00", sortie: "20:15" },
    { city: "Tel-Aviv", entree: "19:10", sortie: "20:25" },
    { city: "Netanya", entree: "19:05", sortie: "20:20" },
    { city: "Ashdod", entree: "19:08", sortie: "20:23" },
  ];

  return (
    <section className="py-12 px-4 bg-gradient-to-r from-amber-50 to-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-lilmod-navy mb-2">Horaires de Chabbat</h2>
          <p className="text-gray-600">Horaires de Chabbat pour cette semaine - Paracha Bamidbar</p>
        </div>
        
        <Card className="bg-white overflow-hidden shadow-md border-t-4 border-lilmod-gold">
          <div className="bg-gradient-to-r from-amber-50 to-white py-3 px-4 flex items-center border-b border-gray-100">
            <Calendar className="text-lilmod-gold mr-3" />
            <span className="font-medium text-lg">Vendredi 24 Mai - Samedi 25 Mai 2024</span>
          </div>
          
          <CardContent className="p-0">
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="france">France</TabsTrigger>
                <TabsTrigger value="israel">Israël</TabsTrigger>
              </TabsList>
              <TabsContent value="france" className="px-4 pb-4">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 mt-2">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ville</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entrée</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sortie</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {franceTimes.map((time, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{time.city}</td>
                          <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{time.entree}</td>
                          <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{time.sortie}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
              <TabsContent value="israel" className="px-4 pb-4">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 mt-2">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ville</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entrée</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sortie</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {israelTimes.map((time, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{time.city}</td>
                          <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{time.entree}</td>
                          <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{time.sortie}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="mt-4 text-sm text-gray-500 text-center">
          Les horaires sont donnés à titre indicatif. Veuillez consulter votre communauté locale pour les horaires exacts.
        </div>
      </div>
    </section>
  );
};

export default ShabbatTimes;
