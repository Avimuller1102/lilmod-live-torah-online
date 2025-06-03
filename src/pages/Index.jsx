
import React from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import CombinedContentLibrary from '@/components/CombinedContentLibrary';
import About from '@/components/About';
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
      <HeroSection />
      {/* Section de recherche repositionnée en haut après le Hero */}
      <CombinedContentLibrary />
      <About />
      <ShabbatTimes />
      <Speakers />
      <Partners />
      <NewsletterSignup />
      <Support />
      <Contact />
      <Footer />
      <WhatsAppButton />
      <LinkTreeButton />
      <NewsletterButton />
    </div>
  );
};

export default Index;
