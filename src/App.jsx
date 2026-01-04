import { Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Loading from './components/Loading';
import ScrollProgress from './components/ScrollProgress';
import Spotlight from './components/Spotlight';
import { HelmetProvider } from 'react-helmet-async';
import Chatbot from './components/Chatbot';
import Footer from './components/Footer'; 

const HomePage = lazy(() => import('./pages/HomePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const UsesPage = lazy(() => import('./pages/WorkspacePage'));
const NotFound = lazy(() => import('./pages/NotFound'));
const AfkPage = lazy(() => import('./pages/AfkPage'));

function App() {
  const location = useLocation();

  return (
    <HelmetProvider>
      <ScrollProgress />
      <div className="bg-noise"></div>
      <Spotlight />
      
      <Navbar />

      <Suspense fallback={<Loading />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/workspace" element={<UsesPage />} />
          <Route path="/afk" element={<AfkPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>

      <Footer />

      <Chatbot />
    </HelmetProvider>
  );
}

export default App;