/**
 * LILMOD — application : routes publiques et administration (chargée à la demande).
 */
import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer.tsx';
import HomePage from '@/pages/HomePage';

const ProgrammePage = lazy(() => import('@/pages/ProgrammePage'));
const CoursePage = lazy(() => import('@/pages/CoursePage'));
const LibraryPage = lazy(() => import('@/pages/LibraryPage'));
const VideoPage = lazy(() => import('@/pages/VideoPage'));
const TeachersPage = lazy(() => import('@/pages/TeachersPages').then((m) => ({ default: m.TeachersPage })));
const TeacherPage = lazy(() => import('@/pages/TeachersPages').then((m) => ({ default: m.TeacherPage })));
const SeriesListPage = lazy(() => import('@/pages/SeriesPages').then((m) => ({ default: m.SeriesListPage })));
const SeriesPage = lazy(() => import('@/pages/SeriesPages').then((m) => ({ default: m.SeriesPage })));
const SearchPage = lazy(() => import('@/pages/MiscPages').then((m) => ({ default: m.SearchPage })));
const PrivacyPage = lazy(() => import('@/pages/MiscPages').then((m) => ({ default: m.PrivacyPage })));
const NotFoundPage = lazy(() => import('@/pages/MiscPages').then((m) => ({ default: m.NotFoundPage })));
const AdminApp = lazy(() => import('@/admin/AdminApp'));

/** Remonte en haut à chaque page, ou fait défiler jusqu'à l'ancre demandée (#about…). */
function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }
    let tries = 0;
    const tick = () => {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (el) el.scrollIntoView();
      else if (tries++ < 20) window.setTimeout(tick, 100);
    };
    tick();
  }, [pathname, hash]);
  return null;
}

const PageFallback = () => (
  <div className="flex min-h-[60vh] items-center justify-center pt-24" role="status">
    <span className="h-8 w-8 animate-spin rounded-full border-2 border-primary-200 border-t-primary-700" />
    <span className="sr-only">Chargement…</span>
  </div>
);

function PublicSite() {
  return (
    <div className="min-h-screen overflow-x-hidden text-neutral-900">
      <Navbar />
      <main id="main-content" tabIndex={-1} className="focus:outline-none">
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/programme" element={<ProgrammePage />} />
            <Route path="/programme/:id" element={<CoursePage />} />
            <Route path="/cours" element={<LibraryPage />} />
            <Route path="/cours/:id/:slug?" element={<VideoPage />} />
            <Route path="/intervenants" element={<TeachersPage />} />
            <Route path="/intervenants/:id" element={<TeacherPage />} />
            <Route path="/series" element={<SeriesListPage />} />
            <Route path="/series/:id" element={<SeriesPage />} />
            <Route path="/recherche" element={<SearchPage />} />
            <Route path="/confidentialite" element={<PrivacyPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ScrollManager />
      <Routes>
        <Route
          path="/admin/*"
          element={
            <Suspense fallback={<PageFallback />}>
              <AdminApp />
            </Suspense>
          }
        />
        <Route path="/*" element={<PublicSite />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
