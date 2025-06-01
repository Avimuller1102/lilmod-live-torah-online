
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
    
    const refreshInterval = setInterval(() => {
      getShabbatTimes();
    }, 24 * 60 * 60 * 1000);
    
    return () => clearInterval(refreshInterval);
  }, [toast]);

  if (loading) {
    return (
      <section className="py-16 px-4 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
        <div className="max-w-6xl mx-auto text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-lilmod-gold mx-auto"></div>
          <p className="mt-6 text-gray-700 text-lg">Chargement des horaires de Chabbat...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-lilmod-navy mb-6">
            <span className="relative">
              HORAIRES DE CHABBAT
              <span className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-32 h-1.5 bg-gradient-to-r from-lilmod-gold to-amber-400 rounded-full"></span>
            </span>
          </h2>
          {paracha && (
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 max-w-lg mx-auto shadow-xl border border-lilmod-gold/20">
              <p className="text-gray-700 text-xl">
                Paracha <span className="font-bold text-lilmod-navy text-2xl">{paracha.name}</span> 
                <span className="text-lilmod-gold mx-3">•</span>
                <span className="font-medium text-lilmod-blue">{paracha.hebrewName}</span>
              </p>
              <p className="text-gray-500 mt-2 font-medium">{paracha.dateRange}</p>
            </div>
          )}
        </div>
        
        <Card className="bg-white/90 backdrop-blur-xl overflow-hidden shadow-2xl border-0 rounded-3xl">
          <div className="bg-gradient-to-r from-lilmod-navy via-lilmod-blue to-lilmod-navy py-8 px-8 border-b border-white/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-white">
                <Calendar className="text-lilmod-gold mr-4 w-10 h-10" />
                <div>
                  <div className="font-bold text-2xl">Cette semaine</div>
                  {paracha && (
                    <div className="text-blue-100 text-lg">
                      {paracha.hebrewName} • {paracha.dateRange}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-8">
                <div className="flex items-center text-amber-300">
                  <Sun className="w-6 h-6 mr-2" />
                  <span className="font-medium">Entrée</span>
                </div>
                <div className="flex items-center text-purple-300">
                  <Star className="w-6 h-6 mr-2" />
                  <span className="font-medium">Sortie</span>
                </div>
              </div>
            </div>
          </div>
          
          <CardContent className="p-0">
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-50/80 backdrop-blur-sm rounded-none border-b border-gray-200">
                <TabsTrigger 
                  value="france" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-lilmod-gold data-[state=active]:to-amber-400 data-[state=active]:text-white data-[state=active]:shadow-lg font-semibold py-6 text-lg"
                >
                  France
                </TabsTrigger>
                <TabsTrigger 
                  value="israel" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-lilmod-gold data-[state=active]:to-amber-400 data-[state=active]:text-white data-[state=active]:shadow-lg font-semibold py-6 text-lg"
                >
                  Israël
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="france" className="p-8 mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {franceTimes.map((time, index) => (
                    <Card key={index} className="group hover:shadow-2xl transition-all duration-300 hover:scale-105 border-0 shadow-lg bg-gradient-to-br from-white to-amber-50/50 rounded-2xl overflow-hidden">
                      <CardContent className="p-6">
                        <div className="text-center space-y-4">
                          <h3 className="font-bold text-xl text-lilmod-navy mb-4">{time.city}</h3>
                          
                          <div className="space-y-4">
                            <div className="flex items-center justify-between bg-gradient-to-r from-amber-100 to-yellow-100 rounded-xl p-4 shadow-sm">
                              <div className="flex items-center">
                                <Sun className="w-6 h-6 text-amber-600 mr-3" />
                                <span className="font-semibold text-gray-700">Entrée</span>
                              </div>
                              <span className="font-bold text-xl text-lilmod-navy">{time.entree}</span>
                            </div>
                            
                            <div className="flex items-center justify-between bg-gradient-to-r from-purple-100 to-indigo-100 rounded-xl p-4 shadow-sm">
                              <div className="flex items-center">
                                <Star className="w-6 h-6 text-purple-600 mr-3" />
                                <span className="font-semibold text-gray-700">Sortie</span>
                              </div>
                              <span className="font-bold text-xl text-lilmod-navy">{time.sortie}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="israel" className="p-8 mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {israelTimes.map((time, index) => (
                    <Card key={index} className="group hover:shadow-2xl transition-all duration-300 hover:scale-105 border-0 shadow-lg bg-gradient-to-br from-white to-blue-50/50 rounded-2xl overflow-hidden">
                      <CardContent className="p-6">
                        <div className="text-center space-y-4">
                          <h3 className="font-bold text-xl text-lilmod-navy mb-4">{time.city}</h3>
                          
                          <div className="space-y-4">
                            <div className="flex items-center justify-between bg-gradient-to-r from-amber-100 to-yellow-100 rounded-xl p-4 shadow-sm">
                              <div className="flex items-center">
                                <Sun className="w-6 h-6 text-amber-600 mr-3" />
                                <span className="font-semibold text-gray-700">Entrée</span>
                              </div>
                              <span className="font-bold text-xl text-lilmod-navy">{time.entree}</span>
                            </div>
                            
                            <div className="flex items-center justify-between bg-gradient-to-r from-purple-100 to-indigo-100 rounded-xl p-4 shadow-sm">
                              <div className="flex items-center">
                                <Star className="w-6 h-6 text-purple-600 mr-3" />
                                <span className="font-semibold text-gray-700">Sortie</span>
                              </div>
                              <span className="font-bold text-xl text-lilmod-navy">{time.sortie}</span>
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
