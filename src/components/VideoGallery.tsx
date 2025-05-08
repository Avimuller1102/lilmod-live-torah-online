
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Youtube, Link } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
        <div className="mb-12 flex flex-col md:flex-row items-center justify-between">
          <h2 className="section-title mb-4 md:mb-0">LES DERNIÈRES VIDÉOS</h2>
          <div className="flex items-center">
            <a 
              href="https://www.youtube.com/@Lilmodfr" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-base font-medium transition-colors"
            >
              <Youtube className="w-5 h-5 mr-2" />
              Notre chaîne YouTube
            </a>
          </div>
        </div>
        
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-r">
          <div className="flex items-start">
            <Youtube className="w-6 h-6 text-red-600 mt-1 mr-3" />
            <div>
              <h3 className="font-bold text-red-600 mb-1">LILMOD sur YouTube</h3>
              <p className="text-gray-700">Retrouvez tous nos cours sur notre chaîne YouTube et abonnez-vous pour ne manquer aucun contenu.</p>
              <div className="mt-3">
                <a 
                  href="https://www.youtube.com/@Lilmodfr" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-red-600 hover:underline font-medium flex items-center"
                >
                  Visiter la chaîne YouTube
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
        
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
        
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a 
            href="https://www.youtube.com/@Lilmodfr" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center bg-lilmod-blue hover:bg-lilmod-navy text-white px-6 py-3 rounded-md font-medium transition-colors"
          >
            Voir toutes les vidéos
          </a>
          <a 
            href="https://open.spotify.com/show/5oJ8bkMtw0hR1iRxomrSRR" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md font-medium transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
            Écouter sur Spotify
          </a>
          <a 
            href="https://linktr.ee/lilmod.torahmitzion" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center border border-lilmod-gold text-lilmod-gold hover:bg-lilmod-gold hover:text-white px-6 py-3 rounded-md font-medium transition-colors"
          >
            <Link className="w-5 h-5 mr-2" />
            Tous nos liens
          </a>
        </div>
      </div>
    </section>
  );
};

export default VideoGallery;
