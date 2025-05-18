
import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import VideoGallery from '@/components/VideoGallery';
import AudioLibrary from '@/components/AudioLibrary';
import Speakers from '@/components/Speakers';
import Partners from '@/components/Partners';
import Support from '@/components/Support';
import NewsletterSignup from '@/components/NewsletterSignup';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import LinkTreeButton from '@/components/LinkTreeButton';
import NewsletterButton from '@/components/NewsletterButton';
import Stats from '@/components/Stats';
import ShabbatTimes from '@/components/ShabbatTimes';

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <About />
      <Stats />
      <ShabbatTimes />
      <VideoGallery />
      <AudioLibrary />
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
