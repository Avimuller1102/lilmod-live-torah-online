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

import Navbar from '@/components/Navbar.tsx';
import HeroSection from '@/components/HeroSection.tsx';
import MissionStatement from '@/components/MissionStatement.tsx';
import ShabbatTimes from '@/components/ShabbatTimes.tsx';
import About from '@/components/About.tsx';
import VideoGallery from '@/components/VideoGallery.tsx';
import AudioLibrary from '@/components/AudioLibrary.tsx';
import Speakers from '@/components/Speakers.tsx';
import Newsletter from '@/components/Newsletter.tsx';
import Support from '@/components/Support.tsx';
import Contact from '@/components/Contact.tsx';
import Footer from '@/components/Footer.tsx';

function App() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-neutral-900">
      {/* Navigation */}
      <Navbar />
      
      {/* Main Content */}
      <main id="main-content">
        {/* Hero Section */}
        <HeroSection />
        
        {/* Mission Statement - "Un Peuple - Une Torah - Une Terre" */}
        <MissionStatement />

        {/* Shabbat Times by city */}
        <ShabbatTimes />
        
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
