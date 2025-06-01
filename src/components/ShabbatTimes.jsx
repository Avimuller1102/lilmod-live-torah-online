
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
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-lilmod-navy mb-3">
            <span className="relative">
              HORAIRES DE CHABBAT
              <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-lilmod-gold to-amber-400"></span>
            </span>
          </h2>
          {paracha && (
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 max-w-md mx-auto shadow-md">
              <p className="text-gray-600 text-lg">
                Paracha <span className="font-bold text-lilmod-navy">{paracha.name}</span> 
                <span className="text-lilmod-gold mx-2">•</span>
                <span className="font-medium text-lilmod-blue">{paracha.hebrewName}</span>
              </p>
              <p className="text-sm text-gray-500 mt-1">{paracha.dateRange}</p>
            </div>
          )}
        </div>
        
        <Card className="bg-white/90 backdrop-blur-sm overflow-hidden shadow-xl border-t-4 border-lilmod-gold">
          <div className="bg-gradient-to-r from-lilmod-navy to-lilmod-blue py-6 px-6 flex items-center justify-between border-b border-white/20">
            <div className="flex items-center text-white">
              <Calendar className="text-lilmod-gold mr-3 w-8 h-8" />
              <div>
                <div className="font-bold text-xl">Cette semaine</div>
                {paracha && (
                  <div className="text-blue-100 text-sm">
                    {paracha.hebrewName} • {paracha.dateRange}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-amber-300">
                <Sun className="w-5 h-5 mr-1" />
                <span className="text-sm">Entrée</span>
              </div>
              <div className="flex items-center text-purple-300">
                <Star className="w-5 h-5 mr-1" />
                <span className="text-sm">Sortie</span>
              </div>
            </div>
          </div>
          
          <CardContent className="p-0">
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-50 rounded-none">
                <TabsTrigger 
                  value="france" 
                  className="data-[state=active]:bg-lilmod-gold data-[state=active]:text-lilmod-navy font-medium py-4"
                >
                  🇫🇷 France
                </TabsTrigger>
                <TabsTrigger 
                  value="israel" 
                  className="data-[state=active]:bg-lilmod-gold data-[state=active]:text-lilmod-navy font-medium py-4"
                >
                  🇮🇱 Israël
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="france" className="p-6 mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {franceTimes.map((time, index) => (
                    <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:scale-105 border border-amber-200">
                      <CardContent className="p-4">
                        <div className="text-center">
                          <h3 className="font-bold text-lg text-lilmod-navy mb-3">{time.city}</h3>
                          
                          <div className="space-y-3">
                            <div className="flex items-center justify-between bg-amber-50 rounded-lg p-3">
                              <div className="flex items-center">
                                <Sun className="w-5 h-5 text-amber-600 mr-2" />
                                <span className="text-sm font-medium text-gray-700">Entrée</span>
                              </div>
                              <span className="font-bold text-lg text-lilmod-navy">{time.entree}</span>
                            </div>
                            
                            <div className="flex items-center justify-between bg-purple-50 rounded-lg p-3">
                              <div className="flex items-center">
                                <Star className="w-5 h-5 text-purple-600 mr-2" />
                                <span className="text-sm font-medium text-gray-700">Sortie</span>
                              </div>
                              <span className="font-bold text-lg text-lilmod-navy">{time.sortie}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="israel" className="p-6 mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {israelTimes.map((time, index) => (
                    <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:scale-105 border border-blue-200">
                      <CardContent className="p-4">
                        <div className="text-center">
                          <h3 className="font-bold text-lg text-lilmod-navy mb-3">{time.city}</h3>
                          
                          <div className="space-y-3">
                            <div className="flex items-center justify-between bg-amber-50 rounded-lg p-3">
                              <div className="flex items-center">
                                <Sun className="w-5 h-5 text-amber-600 mr-2" />
                                <span className="text-sm font-medium text-gray-700">Entrée</span>
                              </div>
                              <span className="font-bold text-lg text-lilmod-navy">{time.entree}</span>
                            </div>
                            
                            <div className="flex items-center justify-between bg-purple-50 rounded-lg p-3">
                              <div className="flex items-center">
                                <Star className="w-5 h-5 text-purple-600 mr-2" />
                                <span className="text-sm font-medium text-gray-700">Sortie</span>
                              </div>
                              <span className="font-bold text-lg text-lilmod-navy">{time.sortie}</span>
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
