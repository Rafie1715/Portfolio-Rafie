import { useEffect, useState } from 'react';
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim"; 
import Typewriter from 'typewriter-effect';
import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import { FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const Hero = () => {
  const [init, setInit] = useState(false);
  const { t, i18n } = useTranslation();

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
      color: { value: "#a855f7" },
      links: {
        color: "#6366f1",
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
        value: 60,
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
    <section id="home" className="relative min-h-screen flex flex-col items-center justify-center bg-white dark:bg-dark text-dark dark:text-white px-4 pt-20 overflow-hidden transition-colors duration-300">      
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-400/20 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-blob dark:bg-purple-900/20"></div>
        <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-blue-400/20 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-blob animation-delay-2000 dark:bg-blue-900/20"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-pink-400/20 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-blob animation-delay-4000 dark:bg-pink-900/20"></div>
      </div>

      {init && (
        <Particles id="tsparticles" options={particlesOptions} className="absolute inset-0 z-0 h-full w-full" />
      )}
      
      <motion.div 
        className="z-10 text-center max-w-5xl mx-auto flex flex-col items-center justify-center h-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >

        <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} perspective={1000} scale={1.02}>
            <motion.div variants={itemVariants} className="mb-2">
                 <h2 className="text-xl md:text-2xl font-medium text-gray-500 dark:text-gray-400 mb-2">
                    {t('hero.greeting')}
                 </h2>
                 
                 <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-tight min-h-[1.2em]">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-gradient-x drop-shadow-sm">
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
                                wrapperClassName: "bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-gradient-x"
                            }}
                        />
                    </span>
                </h1>
            </motion.div>
        </Tilt>

        <motion.p variants={itemVariants} className="text-base md:text-lg text-gray-500 dark:text-gray-400 mb-8 mt-4 font-normal max-w-2xl mx-auto leading-relaxed">
          {t('hero.description')} <strong className="text-dark dark:text-white">UPN Veteran Jakarta</strong>. 
        </motion.p>

        <motion.div variants={itemVariants} className="mb-10 h-10 flex flex-col md:flex-row items-center justify-center gap-2 text-lg md:text-2xl font-light text-gray-600 dark:text-gray-300">
          {t('hero.passionate')}
          <span>{t('hero.passionate')}</span>
          <span className="text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-lg">
            <Typewriter
              key={i18n.language} 
              options={{
                strings: [
                  t('hero.skills.mobile'), 
                  t('hero.skills.web'), 
                  t('hero.skills.uiux'), 
                  t('hero.skills.ml')
                ],
                autoStart: true,
                loop: true,
                delay: 50,
                deleteSpeed: 30,
              }}
            />
          </span>
        </motion.div>
 
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-center gap-5 w-full sm:w-auto">
          <a href="/projects" className="group relative px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-bold shadow-lg shadow-indigo-500/30 overflow-hidden transition-all hover:scale-105 hover:shadow-indigo-500/50">
            <span className="relative z-10">{t('hero.view_work')}</span>
            <div className="absolute inset-0 h-full w-full scale-0 rounded-full transition-all duration-300 group-hover:scale-100 group-hover:bg-white/20"></div>
          </a>
          
          <a href="/contact" className="px-8 py-3.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-full font-bold hover:border-purple-500 hover:text-purple-500 dark:hover:text-purple-400 dark:hover:border-purple-400 transition-all duration-300 backdrop-blur-sm bg-white/50 dark:bg-black/20">
            {t('hero.contact_me')}
          </a>
        </motion.div>

        <motion.div variants={itemVariants} className="mt-12 flex gap-6 text-2xl text-gray-400">
            <a href="https://github.com/Rafie1715" target="_blank" rel="noreferrer" className="hover:text-dark dark:hover:text-white hover:-translate-y-1 transition-all"><FaGithub /></a>
            <a href="https://linkedin.com/in/rafie-rojagat" target="_blank" rel="noreferrer" className="hover:text-blue-600 hover:-translate-y-1 transition-all"><FaLinkedin /></a>
            <a href="https://instagram.com/rafie_rb" target="_blank" rel="noreferrer" className="hover:text-pink-500 hover:-translate-y-1 transition-all"><FaInstagram /></a>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;