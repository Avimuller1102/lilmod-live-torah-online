import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Calendar, Star } from 'lucide-react';
import { fetchCurrentParacha, type ParachaData } from '@/services/parachaService';

const ParachaWidget = () => {
  const [paracha, setParacha] = useState<ParachaData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getParacha = async () => {
      try {
        const currentParacha = await fetchCurrentParacha();
        setParacha(currentParacha);
      } catch (error) {
        console.error('Failed to load paracha:', error);
      } finally {
        setLoading(false);
      }
    };

    getParacha();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!paracha) {
    return null;
  }

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mr-3">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-blue-800">Paracha de la semaine</h3>
            <div className="flex items-center text-sm text-blue-600">
              <Calendar className="w-3 h-3 mr-1" />
              <span>{new Date(paracha.date).toLocaleDateString('fr-FR')}</span>
            </div>
          </div>
        </div>
        
        <div className="text-center mb-4">
          <h4 className="text-2xl font-bold text-gray-800 mb-2">{paracha.name}</h4>
          {paracha.hebrew && (
            <p className="text-xl text-blue-700 font-hebrew mb-2" dir="rtl">{paracha.hebrew}</p>
          )}
          {paracha.verses && (
            <p className="text-sm text-gray-600 font-medium">{paracha.verses}</p>
          )}
        </div>

        <div className="bg-white/60 rounded-lg p-3 text-center">
          <p className="text-gray-700 text-sm font-medium">{paracha.summary}</p>
        </div>

        <div className="flex items-center justify-center mt-4 pt-3 border-t border-blue-200">
          <Star className="w-4 h-4 text-yellow-500 mr-2" />
          <span className="text-xs text-gray-600 font-medium">Mise à jour automatique</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ParachaWidget;