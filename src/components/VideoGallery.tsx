
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const videoData = [
  {
    id: 1,
    title: "Paracha de la semaine- TAZRIA METSORA",
    subtitle: "\"Comment être un peuple influent\"",
    teacher: "Rav Ben Ichay",
    date: "02.05.25",
    thumbnail: "https://picsum.photos/id/30/400/225"
  },
  {
    id: 2,
    title: "Étude du Kol Ator du Gaon de Vilna",
    subtitle: "YOM HATSMAOUT",
    teacher: "Rav Menahem Akerman",
    date: "28.04.25",
    thumbnail: "https://picsum.photos/id/60/400/225"
  },
  {
    id: 3,
    title: "Ouverture midrashique sur Yom Hatsmaout",
    subtitle: "Chir hachirim",
    teacher: "Rav Elie KLING",
    date: "27.04.25",
    thumbnail: "https://picsum.photos/id/65/400/225"
  },
  {
    id: 4,
    title: "#israel #soldier #torah",
    subtitle: "",
    teacher: "Rav Avi Goldberg",
    date: "",
    thumbnail: "https://picsum.photos/id/1005/400/225"
  },
  {
    id: 5,
    title: "RELATIONS DISAPORA ET ISRAËL",
    subtitle: "",
    teacher: "Présenté par le Rav Saadia Morali",
    date: "",
    thumbnail: "https://picsum.photos/id/328/400/225"
  },
  {
    id: 6,
    title: "Etude de texte du Rav Kook",
    subtitle: "",
    teacher: "Rav Yossef Ben-Shoushan",
    date: "24.04.25",
    thumbnail: "https://picsum.photos/id/514/400/225"
  }
];

const VideoGallery = () => {
  return (
    <section id="videos" className="bg-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="section-title">LES DERNIÈRES VIDÉOS</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videoData.map((video) => (
            <Card key={video.id} className="overflow-hidden video-card border-none shadow-md">
              <div className="relative pb-[56.25%]">
                <img 
                  src={video.thumbnail} 
                  alt={video.title} 
                  className="absolute top-0 left-0 w-full h-full object-cover rounded-t-lg"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-lilmod-blue bg-opacity-80 flex items-center justify-center cursor-pointer hover:bg-opacity-100 transition-all">
                    <div className="w-0 h-0 border-t-8 border-t-transparent border-l-16 border-l-white border-b-8 border-b-transparent ml-1"></div>
                  </div>
                </div>
              </div>
              <CardContent className="pt-4">
                <h3 className="font-bold text-lg text-lilmod-navy line-clamp-2">{video.title}</h3>
                {video.subtitle && (
                  <p className="text-gray-600 mt-1">{video.subtitle}</p>
                )}
                <div className="flex items-center justify-between mt-3">
                  <span className="text-gray-600 text-sm">{video.teacher}</span>
                  {video.date && (
                    <span className="text-lilmod-gold text-sm">{video.date}</span>
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
            Voir toutes les vidéos
          </a>
        </div>
      </div>
    </section>
  );
};

export default VideoGallery;
