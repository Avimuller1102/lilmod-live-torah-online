
import React from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import About from '@/components/About';
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
      <div className="py-16 md:py-24">
        <About />
      </div>
      <div className="py-16 md:py-24">
        <CombinedContentLibrary />
      </div>
      <div className="py-16 md:py-24">
        <Stats />
      </div>
      <div className="py-16 md:py-24">
        <Speakers />
      </div>
      <div className="py-16 md:py-24">
        <Partners />
      </div>
      <div className="py-16 md:py-24">
        <NewsletterSignup />
      </div>
      <div className="py-16 md:py-24">
        <Support />
      </div>
      <div className="py-16 md:py-24">
        <Contact />
      </div>
      <Footer />
      <WhatsAppButton />
      <LinkTreeButton />
      <NewsletterButton />
    </div>
  );
};

export default Index;
