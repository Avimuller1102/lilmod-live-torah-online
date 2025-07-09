
import React from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import About from '@/components/About';
import CombinedContentLibrary from '@/components/CombinedContentLibrary';
import ShabbatTimes from '@/components/ShabbatTimes';
import Speakers from '@/components/Speakers';
import Partners from '@/components/Partners';
import NewsletterSignup from '@/components/NewsletterSignup';
import Support from '@/components/Support';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import LinkTreeButton from '@/components/LinkTreeButton';
import NewsletterButton from '@/components/NewsletterButton';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <Navbar />
      
      {/* Section Hero - Point focal du site */}
      <div className="section-hero">
        <HeroSection />
      </div>
      
      {/* Logo LILMOD agrandi avant la section À propos */}
      <div className="py-16 flex justify-center">
        <img 
          src="/lovable-uploads/23cfbdef-511e-4f4e-ae20-7fe823957cbb.png" 
          alt="LILMOD - Torah Mitzion" 
          className="h-36 md:h-40 lg:h-44 drop-shadow-xl rounded-3xl transform hover:scale-105 transition-all duration-500"
        />
      </div>
      
      {/* Section À propos - Juste après le Hero comme demandé */}
      <div className="section-content">
        <About />
      </div>
      
      {/* Section Recherche - Avec une ligne avant le titre comme demandé */}
      <div className="section-feature">
        <CombinedContentLibrary />
      </div>
      
      {/* Section Horaires Shabbat - Toutes les villes */}
      <div className="section-content">
        <ShabbatTimes />
      </div>
      
      {/* Section Intervenants */}
      <div className="section-feature">
        <Speakers />
      </div>
      
      {/* Section Partenaires */}
      <div className="section-content">
        <Partners />
      </div>
      
      {/* Section Newsletter */}
      <div className="section-content">
        <NewsletterSignup />
      </div>
      
      {/* Section Support */}
      <div className="section-feature">
        <Support />
      </div>
      
      {/* Section Contact */}
      <div className="section-content">
        <Contact />
      </div>
      
      {/* Footer */}
      <Footer />
      
      {/* Boutons flottants améliorés */}
      <WhatsAppButton />
      <LinkTreeButton />
      <NewsletterButton />
    </div>
  );
};

export default Index;
