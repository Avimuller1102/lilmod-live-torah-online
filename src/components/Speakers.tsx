
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { User, Video, Music, Link } from 'lucide-react';

const speakersData = [
  {
    id: 1,
    name: "Rav Akerman",
    image: "/lovable-uploads/89872365-27db-493a-9c07-f347ffe5a202.png",
    specialty: "Kol Ator et Morale de Guerre",
    bio: "Le Rav Menahem Akerman enseigne à l'institut « Machon Meir » à Jérusalem et dirige les cours en français.",
    youtubePlaylist: "https://www.youtube.com/@Lilmodfr/playlists"
  },
  {
    id: 2,
    name: "Ariel Assaf",
    image: "/lovable-uploads/89872365-27db-493a-9c07-f347ffe5a202.png",
    specialty: "Histoire juive",
    bio: "Ariel Assaf est spécialisé dans l'histoire juive contemporaine et les relations entre Israël et la diaspora.",
    youtubePlaylist: "https://www.youtube.com/@Lilmodfr/playlists"
  },
  {
    id: 3,
    name: "Rav Ben Ichay",
    image: "/lovable-uploads/f5f960c5-eaca-4956-990a-e4037d7f1148.png",
    specialty: "Paracha de la semaine",
    bio: "Le Rav Ben Ichay est connu pour ses analyses profondes et pertinentes de la paracha de la semaine.",
    youtubePlaylist: "https://www.youtube.com/@Lilmodfr/playlists"
  },
  {
    id: 4,
    name: "Rav Ben Shoushan",
    image: "/lovable-uploads/89872365-27db-493a-9c07-f347ffe5a202.png",
    specialty: "Études du Rav Kook",
    bio: "Le Rav Yossef Ben-Shoushan est un spécialiste des écrits du Rav Kook et de sa philosophie.",
    youtubePlaylist: "https://www.youtube.com/@Lilmodfr/playlists"
  },
  {
    id: 5,
    name: "Rav Botshko",
    image: "/lovable-uploads/89872365-27db-493a-9c07-f347ffe5a202.png",
    specialty: "Philosophie juive",
    bio: "Le Rav Botshko est l'un des piliers de l'enseignement de la Torah en français en Israël.",
    youtubePlaylist: "https://www.youtube.com/@Lilmodfr/playlists"
  },
  {
    id: 6,
    name: "Rav Chouraqui",
    image: "/lovable-uploads/89872365-27db-493a-9c07-f347ffe5a202.png",
    specialty: "Talmud",
    bio: "Le Rav Chouraqui est un expert du Talmud et de son application dans la vie contemporaine.",
    youtubePlaylist: "https://www.youtube.com/@Lilmodfr/playlists"
  }
];

// Composant pour la carte détaillée d'un intervenant
const SpeakerDetailCard = ({ speaker, onClose }: { speaker: typeof speakersData[0], onClose: () => void }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-lilmod-navy">{speaker.name}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="sm:w-1/3">
              <div className="aspect-square overflow-hidden rounded-lg">
                <img 
                  src={speaker.image} 
                  alt={speaker.name} 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            <div className="sm:w-2/3">
              <div className="flex items-center mb-2">
                <User className="w-5 h-5 text-lilmod-gold mr-2" />
                <h3 className="font-semibold text-lg">{speaker.name}</h3>
              </div>
              
              <div className="flex items-center mb-4 text-lilmod-blue">
                <Music className="w-5 h-5 mr-2" />
                <span>{speaker.specialty}</span>
              </div>
              
              <p className="text-gray-700 mb-6">{speaker.bio}</p>
              
              <div className="space-y-4">
                <a 
                  href={speaker.youtubePlaylist} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-red-600 hover:underline"
                >
                  <Video className="w-5 h-5 mr-2" />
                  <span>Voir les cours sur YouTube</span>
                </a>
                
                <a 
                  href="https://linktr.ee/lilmod.torahmitzion" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-lilmod-blue hover:underline"
                >
                  <Link className="w-5 h-5 mr-2" />
                  <span>Tous les liens</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Speakers = () => {
  const [selectedSpeaker, setSelectedSpeaker] = React.useState<typeof speakersData[0] | null>(null);

  return (
    <section id="speakers" className="bg-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="section-title">LES INTERVENANTS</h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {speakersData.map((speaker) => (
            <Card 
              key={speaker.id} 
              className="border-none shadow-md teacher-card overflow-hidden cursor-pointer"
              onClick={() => setSelectedSpeaker(speaker)}
            >
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
            href="https://www.youtube.com/@Lilmodfr/playlists" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block bg-lilmod-blue hover:bg-lilmod-navy text-white px-6 py-3 rounded-md font-medium transition-colors"
          >
            Découvrir tous les cours
          </a>
        </div>
      </div>

      {selectedSpeaker && (
        <SpeakerDetailCard 
          speaker={selectedSpeaker} 
          onClose={() => setSelectedSpeaker(null)} 
        />
      )}
    </section>
  );
};

export default Speakers;
