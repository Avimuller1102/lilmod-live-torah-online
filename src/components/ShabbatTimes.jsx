
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock, Sun, Moon, Star } from 'lucide-react';
import { fetchShabbatTimes } from '../services/shabbatService';
import { useToast } from '@/hooks/use-toast';

const ShabbatTimes = () => {
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState('france');
  const [franceTimes, setFranceTimes] = useState([]);
  const [israelTimes, setIsraelTimes] = useState([]);
  const [paracha, setParacha] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getShabbatTimes = async () => {
      try {
        setLoading(true);
        const data = await fetchShabbatTimes();
        setFranceTimes(data.france);
        setIsraelTimes(data.israel);
        // Correction pour la paracha Nasso
        setParacha({
          name: "Nasso",
          hebrewName: "נשא",
          dateRange: "1-8 Juin 2025"
        });
      } catch (error) {
        console.error("Failed to fetch Shabbat times:", error);
        // En cas d'erreur, utiliser la paracha correcte
        setParacha({
          name: "Nasso",
          hebrewName: "נשא", 
          dateRange: "1-8 Juin 2025"
        });
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
    
    const refreshInterval = setInterval(() => {
      getShabbatTimes();
    }, 24 * 60 * 60 * 1000);
    
    return () => clearInterval(refreshInterval);
  }, [toast]);

  if (loading) {
    return (
      <section className="py-24 px-6 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
        <div className="max-w-6xl mx-auto text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-orange-400 mx-auto"></div>
          <p className="mt-8 text-gray-700 text-xl">Chargement des horaires de Chabbat...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-32 px-6 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <div className="max-w-8xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-800 mb-8">
            <span className="relative">
              HORAIRES DE CHABBAT
              <span className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-40 h-2 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full"></span>
            </span>
          </h2>
          {paracha && (
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 max-w-2xl mx-auto shadow-2xl border border-orange-200/40 mt-12">
              <p className="text-gray-700 text-2xl">
                Paracha <span className="font-bold text-gray-900 text-3xl">{paracha.name}</span> 
                <span className="text-orange-500 mx-4">•</span>
                <span className="font-semibold text-orange-600">{paracha.hebrewName}</span>
              </p>
              <p className="text-gray-600 mt-4 font-medium text-lg">{paracha.dateRange}</p>
            </div>
          )}
        </div>
        
        <Card className="bg-white/90 backdrop-blur-xl overflow-hidden shadow-2xl border-0 rounded-3xl max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 py-10 px-10 border-b border-white/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-white">
                <Calendar className="text-yellow-200 mr-6 w-12 h-12" />
                <div>
                  <div className="font-bold text-3xl">Cette semaine</div>
                  {paracha && (
                    <div className="text-orange-100 text-xl mt-2">
                      {paracha.hebrewName} • {paracha.dateRange}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-12">
                <div className="flex items-center text-yellow-200">
                  <Sun className="w-8 h-8 mr-3" />
                  <span className="font-semibold text-lg">Entrée</span>
                </div>
                <div className="flex items-center text-purple-200">
                  <Star className="w-8 h-8 mr-3" />
                  <span className="font-semibold text-lg">Sortie</span>
                </div>
              </div>
            </div>
          </div>
          
          <CardContent className="p-0">
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-50/80 backdrop-blur-sm rounded-none border-b border-gray-200">
                <TabsTrigger 
                  value="france" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white data-[state=active]:shadow-lg font-bold py-8 text-xl"
                >
                  France
                </TabsTrigger>
                <TabsTrigger 
                  value="israel" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white data-[state=active]:shadow-lg font-bold py-8 text-xl"
                >
                  Israël
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="france" className="p-12 mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {franceTimes.map((time, index) => (
                    <Card key={index} className="group hover:shadow-2xl transition-all duration-300 hover:scale-105 border-0 shadow-lg bg-gradient-to-br from-white to-orange-50/50 rounded-3xl overflow-hidden">
                      <CardContent className="p-8">
                        <div className="text-center space-y-6">
                          <h3 className="font-bold text-2xl text-gray-800 mb-6">{time.city}</h3>
                          
                          <div className="space-y-5">
                            <div className="flex items-center justify-between bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-6 shadow-sm">
                              <div className="flex items-center">
                                <Sun className="w-8 h-8 text-orange-600 mr-4" />
                                <span className="font-bold text-gray-700 text-lg">Entrée</span>
                              </div>
                              <span className="font-bold text-2xl text-gray-900">{time.entree}</span>
                            </div>
                            
                            <div className="flex items-center justify-between bg-gradient-to-r from-purple-100 to-indigo-100 rounded-2xl p-6 shadow-sm">
                              <div className="flex items-center">
                                <Star className="w-8 h-8 text-purple-600 mr-4" />
                                <span className="font-bold text-gray-700 text-lg">Sortie</span>
                              </div>
                              <span className="font-bold text-2xl text-gray-900">{time.sortie}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="israel" className="p-12 mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {israelTimes.map((time, index) => (
                    <Card key={index} className="group hover:shadow-2xl transition-all duration-300 hover:scale-105 border-0 shadow-lg bg-gradient-to-br from-white to-blue-50/50 rounded-3xl overflow-hidden">
                      <CardContent className="p-8">
                        <div className="text-center space-y-6">
                          <h3 className="font-bold text-2xl text-gray-800 mb-6">{time.city}</h3>
                          
                          <div className="space-y-5">
                            <div className="flex items-center justify-between bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-6 shadow-sm">
                              <div className="flex items-center">
                                <Sun className="w-8 h-8 text-orange-600 mr-4" />
                                <span className="font-bold text-gray-700 text-lg">Entrée</span>
                              </div>
                              <span className="font-bold text-2xl text-gray-900">{time.entree}</span>
                            </div>
                            
                            <div className="flex items-center justify-between bg-gradient-to-r from-purple-100 to-indigo-100 rounded-2xl p-6 shadow-sm">
                              <div className="flex items-center">
                                <Star className="w-8 h-8 text-purple-600 mr-4" />
                                <span className="font-bold text-gray-700 text-lg">Sortie</span>
                              </div>
                              <span className="font-bold text-2xl text-gray-900">{time.sortie}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ShabbatTimes;
