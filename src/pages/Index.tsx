
import React from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import About from '@/components/About';
import ShabbatTimes from '@/components/ShabbatTimes';
import CombinedContentLibrary from '@/components/CombinedContentLibrary';
import Stats from '@/components/Stats';
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
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <About />
      <ShabbatTimes />
      <CombinedContentLibrary />
      <Stats />
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
