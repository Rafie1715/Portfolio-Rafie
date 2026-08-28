import { Suspense, lazy, useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Navbar from './components/Navbar';
import Loading from './components/Loading';
import ScrollProgress from './components/ScrollProgress';
import Spotlight from './components/Spotlight';
import { HelmetProvider } from 'react-helmet-async';
import Footer from './components/Footer';
import { ToastProvider } from './components/ToastProvider';
import { usePageTracking } from './hooks/usePageTracking';

// Lazy load all routes for code splitting
const HomePage = lazy(() => import('./pages/HomePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const UsesPage = lazy(() => import('./pages/WorkspacePage'));
const NotFound = lazy(() => import('./pages/NotFound'));
const AfkPage = lazy(() => import('./pages/AfkPage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const BlogDetail = lazy(() => import('./pages/BlogDetail'));
const Chatbot = lazy(() => import('./components/Chatbot'));
const RequireAuth = lazy(() => import('./components/RequireAuth'));

// Lazy load admin pages - defers Firebase loading until admin routes accessed
const Login = lazy(() => import('./pages/admin/Login'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const ManageProjects = lazy(() => import('./pages/admin/ManageProjects'));
const AddProject = lazy(() => import('./pages/admin/AddProject'));
const EditProject = lazy(() => import('./pages/admin/EditProject'));
const ManageCertifications = lazy(() => import('./pages/admin/ManageCertifications'));
const AddCertification = lazy(() => import('./pages/admin/AddCertification'));
const EditCertification = lazy(() => import('./pages/admin/EditCertification'));
const ManageMoviePicks = lazy(() => import('./pages/admin/ManageMoviePicks'));
const CinemaLogPreview = lazy(() => import('./pages/admin/CinemaLogPreview'));

function App() {
  const location = useLocation();
  const [isDesktop, setIsDesktop] = useState(false);
  const [hasEngaged, setHasEngaged] = useState(false);
  
  usePageTracking();

  useEffect(() => {
    const desktopQuery = window.matchMedia('(min-width: 768px)');
    const updateViewport = () => setIsDesktop(desktopQuery.matches);
    const revealChatbot = () => {
      if (window.scrollY > 320) setHasEngaged(true);
    };

    updateViewport();
    revealChatbot();
    desktopQuery.addEventListener('change', updateViewport);
    window.addEventListener('scroll', revealChatbot, { passive: true });

    return () => {
      desktopQuery.removeEventListener('change', updateViewport);
      window.removeEventListener('scroll', revealChatbot);
    };
  }, []);

  const isAdminRoute = location.pathname.startsWith('/admin') || location.pathname === '/login';

  return (
    <HelmetProvider>
      <ToastProvider>
        <ScrollProgress />
        <div className="bg-noise"></div>
        <Spotlight />

        {!isAdminRoute && <Navbar />}

        <Suspense fallback={<Loading />}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/project/:id" element={<ProjectDetail />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/workspace" element={<UsesPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogDetail />} />
            <Route path="/afk" element={<AfkPage />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/login" element={<Login />} />

            <Route
              path="/admin/dashboard"
              element={
                <RequireAuth>
                  <Dashboard />
                </RequireAuth>
              }
            />

            <Route
              path="/admin/projects"
              element={
                <RequireAuth>
                  <ManageProjects />
                </RequireAuth>
              }
            />

            <Route
              path="/admin/add-project"
              element={
                <RequireAuth>
                  <AddProject />
                </RequireAuth>
              }
            />

            <Route
              path="/admin/edit-project/:id"
              element={
                <RequireAuth>
                  <EditProject />
                </RequireAuth>
              }
            />

            <Route
              path="/admin/certifications"
              element={
                <RequireAuth>
                  <ManageCertifications />
                </RequireAuth>
              }
            />

            <Route
              path="/admin/add-certification"
              element={
                <RequireAuth>
                  <AddCertification />
                </RequireAuth>
              }
            />

            <Route
              path="/admin/movie-picks"
              element={
                <RequireAuth>
                  <ManageMoviePicks />
                </RequireAuth>
              }
            />

            <Route
              path="/admin/cinema-log-preview"
              element={
                <RequireAuth>
                  <CinemaLogPreview />
                </RequireAuth>
              }
            />

            <Route
              path="/admin/edit-certification/:id"
              element={
                <RequireAuth>
                  <EditCertification />
                </RequireAuth>
              }
            />
            </Routes>
          </AnimatePresence>
        </Suspense>

        {!isAdminRoute && <Footer />}

        {!isAdminRoute && isDesktop && hasEngaged && (
          <Suspense fallback={null}>
            <Chatbot />
          </Suspense>
        )}
      </ToastProvider>
    </HelmetProvider>
  );
}

export default App;
