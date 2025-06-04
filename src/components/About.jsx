
import React from 'react';

const About = () => {
  return (
    <section id="about" className="py-20 px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            À PROPOS DE LILMOD.FR
          </h2>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-10 shadow-lg border border-orange-100">
            <p className="text-gray-700 text-lg mb-6 leading-relaxed">
              LILMOD by Torah Mitzion diffuse en LIVE depuis 2015, un message juif adapté à l'époque que nous vivons, celle du retour d'Israël sur sa terre.
            </p>
            <p className="text-gray-700 text-lg mb-6 leading-relaxed">
              Grâce à plus de 10 Cours LIVE par semaine, LILMOD crée un véritable lien avec nos textes et nos traditions. Les participants peuvent poser des questions et tisser un véritable lien avec les enseignants. Grâce à notre site vous retrouverez facilement les enregistrements et bien plus encore…
            </p>
            <p className="text-gray-700 text-lg mb-8 leading-relaxed">
              Pour rejoindre le groupe WhatsApp afin de recevoir le programme de la semaine cliquez sur le lien ci-dessous
            </p>
            <div className="text-center">
              <a 
                href="https://chat.whatsapp.com/KR5PN77WbfvDb4zFgBu3Cl" 
                target="_blank"
                rel="noopener noreferrer" 
                className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217s.232.002.333.012c.107.01.251-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289-.086.101-.173.188-.246.289-.086.101-.177.209-.076.411.101.202.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.333.202c.043.073.043.423-.101.828z"/>
                </svg>
                Rejoindre sur WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
