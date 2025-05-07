
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const speakersData = [
  {
    id: 1,
    name: "Rav Akerman",
    image: "https://picsum.photos/id/1005/200/200",
    specialty: "Kol Ator et Morale de Guerre"
  },
  {
    id: 2,
    name: "Ariel Assaf",
    image: "https://picsum.photos/id/1012/200/200",
    specialty: "Histoire juive"
  },
  {
    id: 3,
    name: "Rav Ben Ichay",
    image: "https://picsum.photos/id/1025/200/200",
    specialty: "Paracha de la semaine"
  },
  {
    id: 4,
    name: "Rav Ben Shoushan",
    image: "https://picsum.photos/id/1074/200/200",
    specialty: "Études du Rav Kook"
  },
  {
    id: 5,
    name: "Rav Botshko",
    image: "https://picsum.photos/id/1027/200/200",
    specialty: "Philosophie juive"
  },
  {
    id: 6,
    name: "Rav Chouraqui",
    image: "https://picsum.photos/id/1062/200/200",
    specialty: "Talmud"
  }
];

const Speakers = () => {
  return (
    <section id="speakers" className="bg-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="section-title">LES INTERVENANTS</h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {speakersData.map((speaker) => (
            <Card key={speaker.id} className="border-none shadow-md teacher-card overflow-hidden">
              <CardContent className="p-0">
                <div className="aspect-square overflow-hidden">
                  <img 
                    src={speaker.image} 
                    alt={speaker.name} 
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-bold text-lilmod-navy">{speaker.name}</h3>
                  {speaker.specialty && (
                    <p className="text-sm text-gray-500 mt-1">{speaker.specialty}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <a 
            href="#" 
            className="inline-block bg-lilmod-blue hover:bg-lilmod-navy text-white px-6 py-3 rounded-md font-medium transition-colors"
          >
            Tous nos intervenants
          </a>
        </div>
      </div>
    </section>
  );
};

export default Speakers;
