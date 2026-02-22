import { useEffect, useState } from 'react';
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim"; 
import Typewriter from 'typewriter-effect';
import { motion } from 'framer-motion';
import Marquee from 'react-fast-marquee';
import Tilt from 'react-parallax-tilt';
import { FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const Hero = () => {
  const [init, setInit] = useState(false);
  const { t } = useTranslation();

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
        repulse: { distance: 100, duration: 0.4 },
      },
    },
    particles: {
      color: { value: "#3b82f6" },
      links: {
        color: "#2563eb",
        distance: 150,
        enable: true,
        opacity: 0.2,
        width: 1,
      },
      move: {
        enable: true,
        speed: 1,
        direction: "none",
        random: false,
        straight: false,
        outModes: { default: "bounce" },
      },
      number: {
        density: { enable: true, area: 800 },
        value: window.innerWidth < 768 ? 30 : 60, // Reduce particles on mobile
      },
      opacity: { value: 0.3 },
      shape: { type: "circle" },
      size: { value: { min: 1, max: 3 } },
    },
    detectRetina: true,
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section id="home" className="relative min-h-[calc(100vh-80px)] md:min-h-screen flex flex-col items-center justify-center bg-white dark:bg-dark text-dark dark:text-white px-4 sm:px-6 lg:px-8 pt-20 pb-10 overflow-hidden transition-colors duration-300">      
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-48 h-48 md:w-96 md:h-96 bg-blue-400/20 rounded-full mix-blend-multiply filter blur-[80px] md:blur-[100px] opacity-70 animate-blob dark:bg-blue-900/20"></div>
        <div className="absolute top-[20%] right-[-10%] w-48 h-48 md:w-96 md:h-96 bg-cyan-400/20 rounded-full mix-blend-multiply filter blur-[80px] md:blur-[100px] opacity-70 animate-blob animation-delay-2000 dark:bg-cyan-900/20"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-48 h-48 md:w-96 md:h-96 bg-sky-400/20 rounded-full mix-blend-multiply filter blur-[80px] md:blur-[100px] opacity-70 animate-blob animation-delay-4000 dark:bg-sky-900/20"></div>
      </div>

      {init && (
        <Particles id="tsparticles" options={particlesOptions} className="absolute inset-0 z-0 h-full w-full" />
      )}
      
      <motion.div 
        className="z-10 text-center max-w-5xl mx-auto flex flex-col items-center justify-center h-full w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >

        <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} perspective={1000} scale={1.02} className="w-full">
            <motion.div variants={itemVariants} className="mb-3 md:mb-2 px-2">
                 <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-medium text-gray-500 dark:text-gray-400 mb-2 md:mb-3">
                    {t('hero.greeting')}
                 </h2>
                 
                 <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight leading-tight min-h-[1.2em] break-words">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500 animate-gradient-x drop-shadow-sm">
                        <Typewriter
                            onInit={(typewriter) => {
                                typewriter
                                .typeString('Rafie Rojagat Bachri')
                                .pauseFor(2000)
                                .start();
                            }}
                            options={{
                                autoStart: true,
                                loop: false,
                                delay: 75,
                                cursor: '|',
                                wrapperClassName: "bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500 animate-gradient-x"
                            }}
                        />
                    </span>
                </h1>
            </motion.div>
        </Tilt>

        <motion.p variants={itemVariants} className="text-sm sm:text-base md:text-lg text-gray-500 dark:text-gray-400 mb-6 mt-3 md:mt-4 font-normal max-w-2xl mx-auto leading-relaxed px-4">
          {t('hero.tagline')}
        </motion.p>

        <motion.div variants={itemVariants} className="mb-6 md:mb-8 w-full max-w-3xl">
          <Marquee gradient={false} speed={18} pauseOnHover={true} className="text-[10px] sm:text-xs md:text-sm text-gray-500 dark:text-gray-400">
            <span className="mx-2 sm:mx-3 flex items-center gap-2 sm:gap-3">
              <span className="flex items-center gap-1.5 sm:gap-2 rounded-full border border-gray-200 dark:border-slate-700 px-2 py-1 sm:px-3 sm:py-1.5 bg-white/60 dark:bg-slate-800/60 whitespace-nowrap">
                <i className="fas fa-map-marker-alt text-primary text-[10px] sm:text-xs"></i>
                <span>{t('hero.quick_facts.location')}</span>
              </span>
              <span className="text-gray-300 dark:text-gray-600">•</span>
            </span>
            <span className="mx-2 sm:mx-3 flex items-center gap-2 sm:gap-3">
              <span className="flex items-center gap-1.5 sm:gap-2 rounded-full border border-gray-200 dark:border-slate-700 px-2 py-1 sm:px-3 sm:py-1.5 bg-white/60 dark:bg-slate-800/60 whitespace-nowrap">
                <i className="fas fa-briefcase text-primary text-[10px] sm:text-xs"></i>
                <span>{t('hero.quick_facts.availability')}</span>
              </span>
              <span className="text-gray-300 dark:text-gray-600">•</span>
            </span>
            <span className="mx-2 sm:mx-3 flex items-center gap-2 sm:gap-3">
              <span className="flex items-center gap-1.5 sm:gap-2 rounded-full border border-gray-200 dark:border-slate-700 px-2 py-1 sm:px-3 sm:py-1.5 bg-white/60 dark:bg-slate-800/60 whitespace-nowrap">
                <i className="fas fa-layer-group text-primary text-[10px] sm:text-xs"></i>
                <span>{t('hero.quick_facts.focus')}</span>
              </span>
              <span className="text-gray-300 dark:text-gray-600">•</span>
            </span>
            <span className="mx-2 sm:mx-3 flex items-center gap-2 sm:gap-3">
              <span className="flex items-center gap-1.5 sm:gap-2 rounded-full border border-gray-200 dark:border-slate-700 px-2 py-1 sm:px-3 sm:py-1.5 bg-white/60 dark:bg-slate-800/60 whitespace-nowrap">
                <i className="fas fa-code text-primary text-[10px] sm:text-xs"></i>
                <span>{t('hero.quick_facts.stack')}</span>
              </span>
            </span>
          </Marquee>
        </motion.div>
 
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 md:gap-5 w-full sm:w-auto px-4 sm:px-0">
          <a href="/projects" className="group relative px-6 py-3 sm:px-7 sm:py-3.5 md:px-8 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-full font-bold text-sm sm:text-base shadow-lg shadow-blue-500/30 overflow-hidden transition-all hover:scale-105 hover:shadow-blue-500/50 text-center">
            <span className="relative z-10">{t('hero.view_work')}</span>
            <div className="absolute inset-0 h-full w-full scale-0 rounded-full transition-all duration-300 group-hover:scale-100 group-hover:bg-white/20"></div>
          </a>
          
          <a href="/contact" className="px-6 py-3 sm:px-7 sm:py-3.5 md:px-8 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-full font-bold text-sm sm:text-base hover:border-blue-500 hover:text-blue-500 dark:hover:text-blue-400 dark:hover:border-blue-400 transition-all duration-300 backdrop-blur-sm bg-white/50 dark:bg-black/20 text-center">
            {t('hero.contact_me')}
          </a>
        </motion.div>

        <motion.div variants={itemVariants} className="mt-8 md:mt-12 flex gap-5 md:gap-6 text-xl md:text-2xl text-gray-400">
            <a href="https://github.com/Rafie1715" target="_blank" rel="noreferrer" className="hover:text-dark dark:hover:text-white hover:-translate-y-1 transition-all"><FaGithub /></a>
            <a href="https://linkedin.com/in/rafie-rojagat" target="_blank" rel="noreferrer" className="hover:text-blue-600 hover:-translate-y-1 transition-all"><FaLinkedin /></a>
            <a href="https://instagram.com/rafie_rb" target="_blank" rel="noreferrer" className="hover:text-blue-400 hover:-translate-y-1 transition-all"><FaInstagram /></a>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;