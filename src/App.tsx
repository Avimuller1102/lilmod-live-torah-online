/**
 * LILMOD - Main Application
 * 
 * A beautiful, professional Torah education website
 * Built with React, TypeScript, and Tailwind CSS
 * 
 * Features:
 * - Premium design with Jerusalem Gold theme
 * - Scroll-triggered animations
 * - Responsive mobile-first layout
 * - YouTube & Spotify API integration
 * - Contact form with Formspree
 */

import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import MissionStatement from '@/components/MissionStatement';
import About from '@/components/About';
import VideoGallery from '@/components/VideoGallery';
import AudioLibrary from '@/components/AudioLibrary';
import Speakers from '@/components/Speakers';
import Newsletter from '@/components/Newsletter';
import Support from '@/components/Support';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

function App() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <Navbar />
      
      {/* Main Content */}
      <main id="main-content">
        {/* Hero Section */}
        <HeroSection />
        
        {/* Mission Statement - "Un Peuple - Une Torah - Une Terre" */}
        <MissionStatement />
        
        {/* About Section */}
        <About />
        
        {/* Video Gallery */}
        <VideoGallery />
        
        {/* Audio Library / Podcast */}
        <AudioLibrary />
        
        {/* Speakers / Teachers */}
        <Speakers />
        
        {/* Newsletter Signup */}
        <Newsletter />
        
        {/* Support / Donate */}
        <Support />
        
        {/* Contact Form */}
        <Contact />
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
