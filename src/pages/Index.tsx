
import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import LiveSchedule from '@/components/LiveSchedule';
import VideoGallery from '@/components/VideoGallery';
import AudioLibrary from '@/components/AudioLibrary';
import Speakers from '@/components/Speakers';
import Support from '@/components/Support';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';

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
      <Support />
      <Contact />
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
