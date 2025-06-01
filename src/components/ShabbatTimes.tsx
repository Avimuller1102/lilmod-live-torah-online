
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock } from 'lucide-react';
import { fetchShabbatTimes, ShabbatTime, ParachaInfo } from '../services/shabbatService';
import { useToast } from '@/components/ui/use-toast';

const ShabbatTimes = () => {
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState('france');
  const [franceTimes, setFranceTimes] = useState<ShabbatTime[]>([]);
  const [israelTimes, setIsraelTimes] = useState<ShabbatTime[]>([]);
  const [paracha, setParacha] = useState<ParachaInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getShabbatTimes = async () => {
      try {
        setLoading(true);
        const data = await fetchShabbatTimes();
        setFranceTimes(data.france);
        setIsraelTimes(data.israel);
        setParacha(data.paracha);
      } catch (error) {
        console.error("Failed to fetch Shabbat times:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les horaires de Chabbat. Veuillez réessayer plus tard.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    getShabbatTimes();
    
    // Actualiser les horaires toutes les 24 heures
    const refreshInterval = setInterval(() => {
      getShabbatTimes();
    }, 24 * 60 * 60 * 1000);
    
    return () => clearInterval(refreshInterval);
  }, [toast]);

  if (loading) {
    return (
      <section className="py-12 px-4 bg-gradient-to-r from-amber-50 to-white">
        <div className="max-w-5xl mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lilmod-gold mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des horaires de Chabbat...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-amber-50 via-white to-blue-50">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-lilmod-navy mb-3">
            <span className="relative">
              HORAIRES DE CHABBAT
              <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-lilmod-gold to-amber-400"></span>
            </span>
          </h2>
          {paracha && (
            <p className="text-gray-600 text-lg">
              Paracha <span className="font-bold text-lilmod-navy">{paracha.name}</span> 
              <span className="text-lilmod-gold mx-2">•</span>
              <span className="font-medium">{paracha.dateRange}</span>
            </p>
          )}
        </div>
        
        <Card className="bg-white/90 backdrop-blur-sm overflow-hidden shadow-xl border-t-4 border-lilmod-gold">
          <div className="bg-gradient-to-r from-lilmod-navy to-lilmod-blue py-4 px-6 flex items-center border-b border-white/20">
            <Calendar className="text-lilmod-gold mr-3 w-6 h-6" />
            <div className="text-white">
              <div className="font-bold text-lg">Cette semaine</div>
              {paracha && (
                <div className="text-blue-100 text-sm">
                  {paracha.hebrewName} • {paracha.dateRange}
                </div>
              )}
            </div>
          </div>
          
          <CardContent className="p-0">
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-50 rounded-none">
                <TabsTrigger 
                  value="france" 
                  className="data-[state=active]:bg-lilmod-gold data-[state=active]:text-lilmod-navy font-medium"
                >
                  🇫🇷 France
                </TabsTrigger>
                <TabsTrigger 
                  value="israel" 
                  className="data-[state=active]:bg-lilmod-gold data-[state=active]:text-lilmod-navy font-medium"
                >
                  🇮🇱 Israël
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="france" className="px-6 pb-6 mt-0">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 mt-4">
                    <thead className="bg-gradient-to-r from-gray-50 to-amber-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                          Ville
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2" />
                            Entrée
                          </div>
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2" />
                            Sortie
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {franceTimes.map((time, index) => (
                        <tr key={index} className="hover:bg-amber-50/50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-lilmod-navy">
                            {time.city}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                            {time.entree}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                            {time.sortie}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
              
              <TabsContent value="israel" className="px-6 pb-6 mt-0">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 mt-4">
                    <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                          Ville
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2" />
                            Entrée
                          </div>
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2" />
                            Sortie
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {israelTimes.map((time, index) => (
                        <tr key={index} className="hover:bg-blue-50/50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-lilmod-navy">
                            {time.city}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                            {time.entree}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                            {time.sortie}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Les horaires sont donnés à titre indicatif. 
            <br />
            <span className="text-lilmod-blue font-medium">
              Données synchronisées avec Torah-Box - Toulouse
            </span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default ShabbatTimes;
