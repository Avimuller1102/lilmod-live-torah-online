
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock, Sun, Star } from 'lucide-react';
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
        setParacha({
          name: "Nasso",
          hebrewName: "נשא",
          dateRange: "1-8 Juin 2025"
        });
      } catch (error) {
        console.error("Failed to fetch Shabbat times:", error);
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
      <section className="py-32 px-8 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <div className="max-w-6xl mx-auto text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-orange-400 mx-auto"></div>
          <p className="mt-8 text-gray-700 text-xl">Chargement des horaires de Chabbat...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-32 px-8 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-12">
            HORAIRES DE CHABBAT
          </h2>
          {paracha && (
            <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-10 max-w-2xl mx-auto shadow-2xl border border-orange-200/40">
              <div className="flex items-center justify-center mb-6">
                <Calendar className="text-orange-500 mr-4 w-8 h-8" />
                <div className="text-center">
                  <div className="font-bold text-2xl text-black">Cette semaine</div>
                  <div className="text-lg mt-2 text-black">
                    {paracha.hebrewName} • {paracha.dateRange}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <Card className="bg-white/95 backdrop-blur-xl overflow-hidden shadow-2xl border-0 rounded-3xl">
          <CardContent className="p-0">
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-50/90 backdrop-blur-sm rounded-none border-b border-gray-200">
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
              
              <TabsContent value="france" className="p-16 mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                  {franceTimes.map((time, index) => (
                    <Card key={index} className="group hover:shadow-2xl transition-all duration-300 hover:scale-105 border-0 shadow-lg bg-gradient-to-br from-white to-orange-50/30 rounded-2xl overflow-hidden">
                      <CardContent className="p-10">
                        <div className="text-center space-y-8">
                          <h3 className="font-bold text-2xl text-gray-800 mb-8">{time.city}</h3>
                          
                          <div className="space-y-6">
                            <div className="flex items-center justify-between bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl p-6 shadow-sm">
                              <div className="flex items-center">
                                <Sun className="w-7 h-7 text-orange-600 mr-4" />
                                <span className="font-bold text-gray-700 text-lg">Entrée</span>
                              </div>
                              <span className="font-bold text-2xl text-gray-900">{time.entree}</span>
                            </div>
                            
                            <div className="flex items-center justify-between bg-gradient-to-r from-purple-100 to-indigo-100 rounded-xl p-6 shadow-sm">
                              <div className="flex items-center">
                                <Star className="w-7 h-7 text-purple-600 mr-4" />
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
              
              <TabsContent value="israel" className="p-16 mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                  {israelTimes.map((time, index) => (
                    <Card key={index} className="group hover:shadow-2xl transition-all duration-300 hover:scale-105 border-0 shadow-lg bg-gradient-to-br from-white to-blue-50/30 rounded-2xl overflow-hidden">
                      <CardContent className="p-10">
                        <div className="text-center space-y-8">
                          <h3 className="font-bold text-2xl text-gray-800 mb-8">{time.city}</h3>
                          
                          <div className="space-y-6">
                            <div className="flex items-center justify-between bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl p-6 shadow-sm">
                              <div className="flex items-center">
                                <Sun className="w-7 h-7 text-orange-600 mr-4" />
                                <span className="font-bold text-gray-700 text-lg">Entrée</span>
                              </div>
                              <span className="font-bold text-2xl text-gray-900">{time.entree}</span>
                            </div>
                            
                            <div className="flex items-center justify-between bg-gradient-to-r from-purple-100 to-indigo-100 rounded-xl p-6 shadow-sm">
                              <div className="flex items-center">
                                <Star className="w-7 h-7 text-purple-600 mr-4" />
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

        <div className="mt-16 text-center">
          <p className="text-lg text-gray-600">
            Les horaires sont donnés à titre indicatif. 
            <br />
            <span className="text-orange-600 font-medium">
              Données synchronisées avec Torah-Box
            </span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default ShabbatTimes;
