import { Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Navbar from './components/Navbar';
import Loading from './components/Loading';
import ScrollProgress from './components/ScrollProgress';
import Spotlight from './components/Spotlight';
import { HelmetProvider } from 'react-helmet-async';
import Chatbot from './components/Chatbot';
import Footer from './components/Footer';
import RequireAuth from './components/RequireAuth';
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

// Lazy load admin pages - defers Firebase loading until admin routes accessed
const Login = lazy(() => import('./pages/admin/Login'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const ManageProjects = lazy(() => import('./pages/admin/ManageProjects'));
const AddProject = lazy(() => import('./pages/admin/AddProject'));

function App() {
  const location = useLocation();
  
  // Track page views
  usePageTracking();

  // Opsional: Cek apakah sedang di halaman admin/login agar Navbar/Footer bisa disembunyikan (kalau mau)
  const isAdminRoute = location.pathname.startsWith('/admin') || location.pathname === '/login';

  return (
    <HelmetProvider>
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
          </Routes>
        </AnimatePresence>
      </Suspense>

      {!isAdminRoute && <Footer />}

      <Chatbot />
    </HelmetProvider>
  );
}

export default App;