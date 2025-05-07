
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { PlayCircle } from 'lucide-react';

const audioData = [
  {
    id: 1,
    title: "Le Rav Kook et la Terre d'Israël",
    teacher: "Rav Yossef Ben-Shoushan",
    duration: "52:14",
    date: "01.05.25"
  },
  {
    id: 2,
    title: "Les fêtes juives et leur signification contemporaine",
    teacher: "Rav Elie KLING",
    duration: "45:30",
    date: "28.04.25"
  },
  {
    id: 3,
    title: "Morale de Guerre - Épisode 8",
    teacher: "Rav Akerman",
    duration: "60:12",
    date: "25.04.25"
  },
  {
    id: 4,
    title: "La Guéoula - la délivrance d'Israël",
    teacher: "Mariacha Drai",
    duration: "48:25",
    date: "20.04.25"
  }
];

const AudioLibrary = () => {
  return (
    <section id="audio" className="bg-lilmod-navy py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">LES COURS AUDIO</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {audioData.map((audio) => (
            <Card key={audio.id} className="bg-white/10 backdrop-blur-md border-none text-white hover:bg-white/20 transition-all duration-200 overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{audio.title}</h3>
                    <div className="text-lilmod-gold mt-1">{audio.teacher}</div>
                  </div>
                  <div className="ml-4">
                    <PlayCircle className="w-12 h-12 text-lilmod-gold cursor-pointer hover:text-white transition-colors" />
                  </div>
                </div>
                <div className="flex justify-between items-center mt-4 text-sm text-gray-300">
                  <span>{audio.duration}</span>
                  <span>{audio.date}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <a 
            href="#" 
            className="inline-block bg-lilmod-gold hover:bg-yellow-500 text-lilmod-navy px-6 py-3 rounded-md font-medium transition-colors"
          >
            Explorer tous les cours audio
          </a>
        </div>
      </div>
    </section>
  );
};

export default AudioLibrary;
