// src/App.jsx
import { useEffect } from 'react'; // <-- Import useEffect
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Certifications from './components/Certifications';
import Contact from './components/Contact';
import ProjectDetail from './pages/ProjectDetail';
import BackToTop from './components/BacktoTop';

// Import AOS
import AOS from 'aos';
import 'aos/dist/aos.css'; // Import CSS AOS

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
  // Inisialisasi AOS saat aplikasi dimuat
  useEffect(() => {
    AOS.init({
      duration: 1000, // Durasi animasi (ms)
      once: true,     // Animasi hanya berjalan sekali saat scroll ke bawah
      offset: 100,    // Offset trigger animasi
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