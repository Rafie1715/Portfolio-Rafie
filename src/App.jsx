import { Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Loading from './components/Loading';
import ScrollProgress from './components/ScrollProgress';
import Spotlight from './components/Spotlight';
import { HelmetProvider } from 'react-helmet-async';
import Chatbot from './components/Chatbot';
import Footer from './components/Footer';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import RequireAuth from './components/RequireAuth';
import ManageProjects from './pages/admin/ManageProjects';
import AddProject from './pages/admin/AddProject';

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
      </Suspense>

      <Footer />

      <Chatbot />
    </HelmetProvider>
  );
}

export default App;