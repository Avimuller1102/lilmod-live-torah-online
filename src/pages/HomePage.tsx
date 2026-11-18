/**
 * Page d'accueil LILMOD — construite autour de l'usage réel :
 * cours en direct et à venir → semaine → replays → thèmes → intervenants →
 * communauté → découvrir LILMOD → témoignages → soutien → Chabbat → contact.
 */
import HeroSection from '@/components/HeroSection.tsx';
import UpNext from '@/components/home/UpNext';
import { Community, LatestReplays, TeachersStrip, Themes, WeekPreview } from '@/components/home/HomeSections';
import MissionStatement from '@/components/MissionStatement.tsx';
import About from '@/components/About.tsx';
import AudioLibrary from '@/components/AudioLibrary.tsx';
import Testimonials from '@/components/Testimonials.tsx';
import Support from '@/components/Support.tsx';
import ShabbatTimes from '@/components/ShabbatTimes.tsx';
import Contact from '@/components/Contact.tsx';
import { useSeo } from '@/lib/seo';

const HomePage = () => {
  useSeo('');
  return (
    <>
      <HeroSection />
      <UpNext />
      <WeekPreview />
      <LatestReplays />
      <Themes />
      <TeachersStrip />
      <AudioLibrary />
      <Community />
      <MissionStatement />
      <About />
      <Testimonials />
      <Support />
      <ShabbatTimes />
      <Contact />
    </>
  );
};

export default HomePage;
