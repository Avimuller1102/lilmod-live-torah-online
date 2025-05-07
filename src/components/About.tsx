
import React from 'react';

const About = () => {
  return (
    <section id="about" className="bg-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="section-title">À PROPOS DE LILMOD.FR</h2>
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-gray-700 text-lg mb-6">
            LILMOD by Torah Mitzion diffuse en LIVE depuis 2015, un message juif adapté à l'époque que nous vivons, celle du retour d'Israël sur sa terre.
          </p>
          <p className="text-gray-700 text-lg mb-6">
            Grâce à plus de 10 Cours LIVE par semaine, LILMOD crée un véritable lien avec nos textes et nos traditions. Les participants peuvent poser des questions et tisser un véritable lien avec les enseignants. Grâce à notre site vous retrouverez facilement les enregistrements et bien plus encore…
          </p>
          <p className="text-gray-700 text-lg mb-8">
            Pour rejoindre le groupe WhatsApp afin de recevoir le programme de la semaine cliquez sur le lien ci-dessous
          </p>
          <a 
            href="https://chat.whatsapp.com/KR5PN77WbfvDb4zFgBu3Cl" 
            target="_blank"
            rel="noopener noreferrer" 
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-md transition-colors inline-block"
          >
            Rejoindre sur WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
};

export default About;
