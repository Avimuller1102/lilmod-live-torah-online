
import React from 'react';
import { Calendar, PlusCircle, Bell } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

const scheduleData = [
  {
    day: "Dimanche",
    courses: [
      {
        time: "19:30",
        title: "Cours de philosophie juive",
        teacher: "Rav Botshko",
        link: "https://www.youtube.com/@Lilmodfr/live"
      }
    ]
  },
  {
    day: "Lundi",
    courses: [
      {
        time: "19:00",
        title: "Étude du Kol Ator du Gaon de Vilna",
        teacher: "Rav Menahem Akerman",
        link: "https://www.youtube.com/@Lilmodfr/live"
      },
      {
        time: "20:30",
        title: "Paracha de la semaine",
        teacher: "Rav Elie KLING",
        link: "https://www.youtube.com/@Lilmodfr/live"
      }
    ]
  },
  {
    day: "Mardi",
    courses: [
      {
        time: "18:00",
        title: "Morale de Guerre",
        teacher: "Rav Akerman",
        link: "https://www.youtube.com/@Lilmodfr/live"
      }
    ]
  },
  {
    day: "Mercredi",
    courses: [
      {
        time: "19:30",
        title: "Etude de texte du Rav Kook",
        teacher: "Rav Yossef Ben-Shoushan",
        link: "https://www.youtube.com/@Lilmodfr/live"
      }
    ]
  },
  {
    day: "Jeudi",
    courses: [
      {
        time: "20:00",
        title: "Relations Disapora et Israël",
        teacher: "Rav Saadia Morali",
        link: "https://www.youtube.com/@Lilmodfr/live"
      }
    ]
  },
  {
    day: "Vendredi",
    courses: [
      {
        time: "11:00",
        title: "Paracha de la semaine",
        teacher: "Rav Ben Ichay",
        link: "https://www.youtube.com/@Lilmodfr/live"
      }
    ]
  },
  {
    day: "Shabbat",
    courses: []
  }
];

const LiveSchedule = () => {
  // Fonction pour ajouter un cours à Google Calendar
  const handleAddToCalendar = (course: any, day: string) => {
    // Dans une implémentation réelle, on génèrerait un lien Google Calendar
    // Pour l'instant, on affiche juste un toast
    toast({
      title: "Cours ajouté à votre calendrier",
      description: `${course.title} avec ${course.teacher} le ${day} à ${course.time}`,
    });
  };

  // Fonction pour configurer un rappel
  const handleSetReminder = (course: any) => {
    // Dans une implémentation réelle, on configurerait un rappel
    // Pour l'instant, on redirige vers le groupe WhatsApp
    window.open("https://chat.whatsapp.com/KR5PN77WbfvDb4zFgBu3Cl", "_blank");
    toast({
      title: "Rappel configuré",
      description: "Vous recevrez un rappel avant le début du cours.",
    });
  };

  return (
    <section id="schedule" className="bg-gradient-to-br from-amber-50 to-amber-100 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="section-title">LES DIRECTS DE LA SEMAINE</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {scheduleData.map((daySchedule) => (
            <Card key={daySchedule.day} className={`overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border-t-4 ${daySchedule.day === "Shabbat" || daySchedule.courses.length === 0 ? 'border-gray-300' : 'border-lilmod-gold'}`}>
              <div className={`py-3 px-4 ${daySchedule.day === "Shabbat" || daySchedule.courses.length === 0 ? 'bg-gray-200' : 'bg-lilmod-gold'} text-white`}>
                <h3 className="font-bold text-xl">{daySchedule.day}</h3>
              </div>
              <CardContent className="pt-5">
                {daySchedule.courses.length > 0 ? (
                  daySchedule.courses.map((course, idx) => (
                    <div key={idx} className={`${idx > 0 ? 'mt-4 pt-4 border-t' : ''}`}>
                      <div className="flex items-center text-lilmod-gold mb-1">
                        <Calendar size={16} className="mr-2" />
                        <span className="font-semibold">{course.time}</span>
                      </div>
                      <h4 className="font-bold text-lg text-lilmod-navy">{course.title}</h4>
                      <p className="text-gray-600 mb-2">{course.teacher}</p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <a 
                          href={course.link} 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm bg-lilmod-blue hover:bg-lilmod-navy text-white py-1 px-3 rounded-full font-medium transition-colors"
                        >
                          Rejoindre le direct
                        </a>
                        <button 
                          onClick={() => handleAddToCalendar(course, daySchedule.day)}
                          className="text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 py-1 px-3 rounded-full font-medium transition-colors flex items-center"
                        >
                          <PlusCircle size={14} className="mr-1" />
                          Ajouter au calendrier
                        </button>
                        <button 
                          onClick={() => handleSetReminder(course)}
                          className="text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 py-1 px-3 rounded-full font-medium transition-colors flex items-center"
                        >
                          <Bell size={14} className="mr-1" />
                          Recevoir un rappel
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-6 text-center text-gray-500">
                    <p>Pas de cours programmés</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <a 
            href="https://chat.whatsapp.com/KR5PN77WbfvDb4zFgBu3Cl"
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md font-medium transition-colors"
          >
            Recevoir le programme complet via WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
};

export default LiveSchedule;
