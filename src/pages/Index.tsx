
import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import LiveSchedule from '@/components/LiveSchedule';
import VideoGallery from '@/components/VideoGallery';
import AudioLibrary from '@/components/AudioLibrary';
import Speakers from '@/components/Speakers';
import Support from '@/components/Support';
import NewsletterSignup from '@/components/NewsletterSignup';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import LinkTreeButton from '@/components/LinkTreeButton';
import NewsletterButton from '@/components/NewsletterButton';

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <About />
      <LiveSchedule />
      <VideoGallery />
      <AudioLibrary />
      <Speakers />
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
