import { useEffect, useState } from 'react';
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim"; 
import Typewriter from 'typewriter-effect';

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
    fullScreen: { enable: false, zIndex: 0 },
    background: { color: { value: "transparent" } },
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
      color: { value: "#a855f7" },
      links: {
        color: "#6366f1",
        distance: 150,
        enable: true,
        opacity: 0.3,
        width: 1,
      },
      move: {
        enable: true,
        speed: 1.5,
        direction: "none",
        random: false,
        straight: false,
        outModes: { default: "bounce" },
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
    <section id="home" className="relative min-h-screen flex flex-col items-center justify-center bg-white dark:bg-dark text-dark dark:text-white px-4 pt-20 overflow-hidden transition-colors duration-300">
      
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-400/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob dark:bg-purple-900/30"></div>
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-yellow-400/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000 dark:bg-yellow-900/30"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-pink-400/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000 dark:bg-pink-900/30"></div>
      </div>

      {init && (
        <Particles
          id="tsparticles"
          options={particlesOptions}
          className="absolute inset-0 z-0 h-full w-full" 
        />
      )}
      
      <div className="z-10 text-center max-w-5xl mx-auto flex flex-col items-center justify-center h-full">
        
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight leading-tight min-h-[1.2em]">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-gradient-x">
            <Typewriter
              onInit={(typewriter) => {
                typewriter
                  .typeString('Rafie Rojagat Bachri')
                  .start();
              }}
              options={{
                autoStart: true,
                loop: false, 
                delay: 75,
                cursor: '|',
                wrapperClassName: "bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-gradient-x"
              }}
            />
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 font-light max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="500">
          Undergraduate Informatics Student at UPN Veteran Jakarta
        </p>
 
        <div className="w-32 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 mx-auto mb-10 rounded-full animate-pulse"></div>
   
        <div className="text-lg md:text-3xl text-gray-500 dark:text-gray-400 mb-12 h-16 md:h-auto font-medium flex flex-col md:flex-row justify-center items-center gap-2" data-aos="fade-up" data-aos-delay="700">
          <span>Passionate about</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500 font-bold">
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
                delay: 50,
                deleteSpeed: 30,
              }}
            />
          </span>
        </div>
 
        <div className="flex flex-col sm:flex-row justify-center gap-5" data-aos="fade-up" data-aos-delay="900">
          <a href="#projects" className="px-10 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-bold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 transition-all duration-300">
            View My Work
          </a>
          <a href="#contact" className="px-10 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-full font-bold hover:border-purple-500 hover:text-purple-500 dark:hover:text-purple-400 dark:hover:border-purple-400 transition-all duration-300 backdrop-blur-sm">
            Contact Me
          </a>
        </div>
      </div>
  
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce z-10 text-gray-400 dark:text-gray-600 cursor-pointer">
        <a href="#about" aria-label="Scroll down">
          <i className="fas fa-chevron-down text-3xl hover:text-primary transition-colors"></i>
        </a>
      </div>
    </section>
  );
};

export default Hero;