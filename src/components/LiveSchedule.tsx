
import React from 'react';
import { Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const scheduleData = [
  {
    day: "Dimanche",
    courses: [
      {
        time: "19:30",
        title: "Cours de philosophie juive",
        teacher: "Rav Botshko",
        link: "#"
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
        link: "#"
      },
      {
        time: "20:30",
        title: "Paracha de la semaine",
        teacher: "Rav Elie KLING",
        link: "#"
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
        link: "#"
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
        link: "#"
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
        link: "#"
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
        link: "#"
      }
    ]
  },
];

const LiveSchedule = () => {
  return (
    <section id="schedule" className="bg-gradient-to-br from-amber-50 to-amber-100 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="section-title">LES DIRECTS DE LA SEMAINE</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {scheduleData.map((daySchedule) => (
            <Card key={daySchedule.day} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border-t-4 border-lilmod-gold">
              <div className="bg-lilmod-gold text-white py-3 px-4">
                <h3 className="font-bold text-xl">{daySchedule.day}</h3>
              </div>
              <CardContent className="pt-5">
                {daySchedule.courses.map((course, idx) => (
                  <div key={idx} className={`${idx > 0 ? 'mt-4 pt-4 border-t' : ''}`}>
                    <div className="flex items-center text-lilmod-gold mb-1">
                      <Calendar size={16} className="mr-2" />
                      <span className="font-semibold">{course.time}</span>
                    </div>
                    <h4 className="font-bold text-lg text-lilmod-navy">{course.title}</h4>
                    <p className="text-gray-600 mb-2">{course.teacher}</p>
                    <a 
                      href={course.link} 
                      className="text-sm text-lilmod-blue hover:underline font-medium"
                    >
                      Rejoindre le direct →
                    </a>
                  </div>
                ))}
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
