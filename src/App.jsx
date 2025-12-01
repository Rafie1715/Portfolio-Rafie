import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/NavBar';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Certifications from './components/Certifications';
import Contact from './components/Contact';
import ProjectDetail from './pages/ProjectDetail';
import BackToTop from './components/BacktoTop';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Home = () => (
  <>
    <Hero />
    <About />
    <Experience />
    <Projects />
    <Skills />
    <Certifications />
    <Contact />
    <BackToTop />
    
    <footer className="bg-dark text-white py-6 text-center border-t border-gray-800">
      <div className="container mx-auto px-4">
        <p className="text-gray-400 text-sm">
          &copy; 2025 Rafie Rojagat Bachri. All Rights Reserved.
        </p>
      </div>
    </footer>
  </>
);

function App() {
  useEffect(() => {
    AOS.init({
      duration: 1000, 
      once: true,     
      offset: 100,   
    });
  }, []);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/project/:id" element={<ProjectDetail />} />
      </Routes>
    </Router>
  );
}

export default App;