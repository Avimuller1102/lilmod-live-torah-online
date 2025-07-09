
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { User, Video, Music, Link } from 'lucide-react';

const speakersData = [
  {
    id: 1,
    name: "Rav Akerman",
    image: "/lovable-uploads/89872365-27db-493a-9c07-f347ffe5a202.png",
    specialty: "Kol Ator et Morale de Guerre",
    bio: "Le Rav Menahem Akerman enseigne à l'institut « Machon Lev» et sur LILMOD.",
    youtubePlaylist: "https://www.youtube.com/@Lilmodfr/playlists"
  },
  {
    id: 2,
    name: "Ariel Assaf",
    image: "/lovable-uploads/bd00c9d7-a9ab-4762-99be-29fe1439438c.png",
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
    image: "/lovable-uploads/668de8bb-9dbe-4a6e-8bbd-f98d3c261605.png",
    specialty: "Études du Rav Kook",
    bio: "Le Rav Yossef Ben-Shoushan est un spécialiste des écrits du Rav Kook et de sa philosophie.",
    youtubePlaylist: "https://www.youtube.com/@Lilmodfr/playlists"
  },
  {
    id: 5,
    name: "Rav Botshko",
    image: "/lovable-uploads/fa44d441-126a-4331-b3f7-5a90c18ed46f.png",
    specialty: "Philosophie juive",
    bio: "Le Rav Botshko est l'un des piliers de l'enseignement de la Torah en français en Israël.",
    youtubePlaylist: "https://www.youtube.com/@Lilmodfr/playlists"
  },
  {
    id: 6,
    name: "Rav Chouraqui",
    image: "/lovable-uploads/b73193cd-b448-4576-8e1f-dab9f685f980.png",
    specialty: "Talmud",
    bio: "Le Rav Chouraqui est un expert du Talmud et de son application dans la vie contemporaine.",
    youtubePlaylist: "https://www.youtube.com/@Lilmodfr/playlists"
  },
  {
    id: 7,
    name: "Rav Fizson",
    image: "/lovable-uploads/aef209f6-b2c9-4b30-82d6-a4993687c5d6.png",
    specialty: "Étude des textes",
    bio: "Le Rav Fizson se distingue par sa maîtrise des textes et son approche pédagogique.",
    youtubePlaylist: "https://www.youtube.com/@Lilmodfr/playlists"
  },
  {
    id: 8,
    name: "Georges Spira",
    image: "/lovable-uploads/6dd77fab-b7e3-43f2-a533-73dd214c2c41.png",
    specialty: "Philosophie et pensée juive",
    bio: "Georges Spira partage sa profonde connaissance de la philosophie juive et son application dans la vie moderne.",
    youtubePlaylist: "https://www.youtube.com/@Lilmodfr/playlists"
  },
  {
    id: 9,
    name: "Rav Kling",
    image: "/lovable-uploads/f8411b77-2369-405a-9825-d7d22de77d9c.png",
    specialty: "Paracha et enseignement",
    bio: "Le Rav Elie Kling offre des analyses profondes et accessibles sur la paracha et d'autres textes fondamentaux.",
    youtubePlaylist: "https://www.youtube.com/@Lilmodfr/playlists"
  },
  {
    id: 10,
    name: "Rav Shlomo Ouziel",
    image: "/lovable-uploads/2a58f0c8-025e-4695-baa4-13b87253fd9e.png",
    specialty: "Études talmudiques",
    bio: "Le Rav Shlomo Ouziel est reconnu pour son expertise en études talmudiques et sa pédagogie claire.",
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
    <section id="speakers" className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 py-24 px-8">
      <div className="max-w-8xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-800 mb-8">
            <span className="relative">
              LES INTERVENANTS
              <span className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-40 h-2 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full"></span>
            </span>
          </h2>
          <p className="text-gray-600 text-xl max-w-4xl mx-auto leading-relaxed">
            Découvrez nos enseignants experts qui partagent leur savoir avec passion
          </p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 md:gap-12">
          {speakersData.map((speaker) => (
            <Card 
              key={speaker.id} 
              className="group border-0 shadow-lg hover:shadow-2xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:translate-y-[-8px] bg-white rounded-3xl"
              onClick={() => setSelectedSpeaker(speaker)}
            >
              <CardContent className="p-0">
                <div className="aspect-square overflow-hidden">
                  <img 
                    src={speaker.image} 
                    alt={speaker.name} 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="font-bold text-gray-800 text-lg mb-2 group-hover:text-orange-600 transition-colors">{speaker.name}</h3>
                  {speaker.specialty && (
                    <p className="text-sm text-gray-500 leading-relaxed">{speaker.specialty}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-20 text-center">
          <a 
            href="https://www.youtube.com/@Lilmodfr/playlists" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block bg-gradient-to-r from-orange-500 to-amber-500 hover:from-amber-500 hover:to-orange-500 text-white px-10 py-5 rounded-2xl font-bold transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 text-lg"
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
