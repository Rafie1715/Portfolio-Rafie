// src/components/Hero.jsx
import { useEffect, useState } from 'react';
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim"; 
import Typewriter from 'typewriter-effect';
import profileImg from '../assets/images/profile.jpg';

const Hero = () => {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesOptions = {
    // PENTING: Matikan fullscreen agar partikel hanya di section ini
    fullScreen: {
      enable: false, 
      zIndex: 0 
    },
    background: {
      color: {
        value: "transparent",
      },
    },
    fpsLimit: 120,
    interactivity: {
      events: {
        onClick: { enable: true, mode: "push" },
        onHover: { enable: true, mode: "repulse" },
        resize: true,
      },
      modes: {
        push: { quantity: 4 },
        repulse: { distance: 200, duration: 0.4 },
      },
    },
    particles: {
      color: { value: "#8B5CF6" }, // Warna Violet Muda
      links: {
        color: "#4F46E5", // Warna Indigo
        distance: 150,
        enable: true,
        opacity: 0.3,
        width: 1,
      },
      move: {
        enable: true,
        speed: 2, // Kecepatan partikel
        direction: "none",
        random: false,
        straight: false,
        outModes: { default: "bounce" }, // Agar memantul di batas kotak section
      },
      number: {
        density: { enable: true, area: 800 },
        value: 80,
      },
      opacity: { value: 0.5 },
      shape: { type: "circle" },
      size: { value: { min: 1, max: 3 } },
    },
    detectRetina: true,
  };

  return (
    <section id="home" className="relative min-h-screen flex flex-col items-center justify-center bg-dark text-white px-4 pt-20 overflow-hidden">
      
      {/* Container Partikel: Absolute agar menempel di belakang konten section ini saja */}
      {init && (
        <Particles
          id="tsparticles"
          options={particlesOptions}
          className="absolute inset-0 z-0 h-full w-full" 
        />
      )}
      
      <div className="z-10 text-center max-w-3xl mx-auto" data-aos="zoom-in">
        <div className="relative inline-block mb-8 group">
          <img 
            src={profileImg} 
            alt="Rafie Rojagat Bachri" 
            className="w-40 h-40 md:w-48 md:h-48 rounded-full border-4 border-slate-700 object-cover shadow-2xl relative z-10 group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-full blur opacity-30 group-hover:opacity-75 transition duration-500 animate-pulse"></div>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-primary to-secondary">
            Rafie Rojagat Bachri
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-slate-300 mb-6 font-light">
          Undergraduate Informatics Student at UPN Veteran Jakarta
        </p>
        
        <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mb-8 rounded-full"></div>
        
        <div className="text-lg md:text-2xl text-slate-400 mb-10 h-16 md:h-auto font-medium">
          Passionate about{' '}
          <span className="text-primary font-bold inline-block">
            <Typewriter
              options={{
                strings: [
                  'Mobile Development',
                  'Web Development',
                  'UI/UX Design',
                  'Machine Learning'
                ],
                autoStart: true,
                loop: true,
                delay: 75,
              }}
            />
          </span>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a href="#projects" className="px-8 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-full font-semibold hover:shadow-lg hover:shadow-primary/50 transform hover:-translate-y-1 transition-all duration-300">
            View My Work
          </a>
          <a href="#contact" className="px-8 py-3 border-2 border-slate-600 text-slate-300 rounded-full font-medium hover:border-primary hover:text-white hover:bg-primary/10 transition-all duration-300">
            Contact Me
          </a>
        </div>
      </div>
      
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-10">
        <a href="#about" className="text-slate-500 hover:text-primary transition-colors">
          <i className="fas fa-chevron-down text-2xl"></i>
        </a>
      </div>
    </section>
  );
};

export default Hero;