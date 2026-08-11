import { Suspense, lazy } from 'react';
import Typewriter from 'typewriter-effect';
import { motion, useReducedMotion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const Hero = () => {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();

  const ParticlesBackground = lazy(() => import('./ParticlesBackground'));

  const quickFacts = [
    { icon: 'fas fa-map-marker-alt', text: t('hero.quick_facts.location') },
    { icon: 'fas fa-briefcase', text: t('hero.quick_facts.availability') },
    { icon: 'fas fa-layer-group', text: t('hero.quick_facts.focus') },
    { icon: 'fas fa-code', text: t('hero.quick_facts.stack') },
  ];

  const Blobs = [
    { size: 72, left: '-8%', top: '-8%', bg: 'rgba(59,130,246,0.12)', delay: 0 },
    { size: 96, right: '-10%', top: '18%', bg: 'rgba(6,182,212,0.08)', delay: 1.2 },
    { size: 88, left: '18%', bottom: '-18%', bg: 'rgba(14,165,233,0.08)', delay: 2.4 }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.16, delayChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: 'easeOut' },
    },
  };

  return (
    <section id="home" className="relative min-h-[calc(100vh-80px)] md:min-h-screen flex flex-col items-center justify-center bg-white dark:bg-dark text-dark dark:text-white px-4 sm:px-6 lg:px-8 pt-20 pb-10 overflow-hidden transition-colors duration-300">
      <div className="absolute inset-0 pointer-events-none">
        <Suspense fallback={null}>
          <div className="absolute inset-0 z-0">
            {/* Particles lazy-loaded for subtle motion */}
            {typeof window !== 'undefined' && <ParticlesBackground />}
          </div>
        </Suspense>

        {Blobs.map((b, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.75, 0.6], y: [0, -12, 0] }}
            transition={{ duration: 6 + i, repeat: Infinity, delay: b.delay, ease: 'easeInOut' }}
            style={{
              width: b.size,
              height: b.size,
              left: b.left,
              right: b.right,
              top: b.top,
              bottom: b.bottom,
              background: b.bg,
              borderRadius: '50%',
              filter: 'blur(40px)'
            }}
            className="absolute opacity-80 z-0"
          />
        ))}

        <div className="absolute inset-0 bg-[linear-gradient(to_right,#64748b14_1px,transparent_1px),linear-gradient(to_bottom,#64748b14_1px,transparent_1px)] bg-[size:32px_32px] z-10"></div>
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-blue-50 to-transparent dark:from-blue-950/20 z-10"></div>
      </div>

      <motion.div
        className="z-20 text-center max-w-5xl mx-auto flex flex-col items-center justify-center h-full w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="mb-3 md:mb-2 px-2">
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium text-gray-500 dark:text-gray-400 mb-2 md:mb-3">
            {t('hero.greeting')}
          </h2>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight leading-tight break-words">
            <MotionName />
          </h1>
        </motion.div>

        <motion.div variants={itemVariants} className="text-base sm:text-lg md:text-xl text-gray-500 dark:text-gray-400 mb-6 mt-3 md:mt-4 font-normal max-w-2xl mx-auto leading-relaxed px-4">
          <Typewriter
            options={{
              strings: (t('hero.role_phrases', { returnObjects: true }) || [t('hero.tagline')]),
              autoStart: true,
              loop: true,
              delay: 40,
              deleteSpeed: 20,
              cursor: '|'
            }}
          />
        </motion.div>

        <motion.div variants={itemVariants} className="mb-6 md:mb-8 w-full max-w-3xl px-4 sm:px-0">
          <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:justify-center">
            {quickFacts.map((fact, idx) => (
              <motion.div
                key={fact.text}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 * idx, duration: 0.45, ease: 'easeOut' }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 dark:border-slate-700 px-3 py-2 bg-white/80 dark:bg-slate-800/80 text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-medium shadow-sm"
              >
                <i className={`${fact.icon} text-primary text-xs`}></i>
                <span>{fact.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-5 md:gap-6 w-full px-4 sm:px-0">
          <a href="/projects" className="group relative px-7 py-3 sm:px-8 sm:py-3.5 md:px-10 md:py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-full font-bold text-sm sm:text-base shadow-lg shadow-blue-500/30 overflow-hidden transition-all active:scale-95 hover:scale-105 hover:shadow-blue-500/50 text-center min-h-[44px] flex items-center justify-center gap-2">
            <i className="fas fa-briefcase relative z-10"></i>
            <span className="relative z-10">{t('hero.view_projects')}</span>
            <div className="absolute inset-0 h-full w-full scale-0 rounded-full transition-all duration-300 group-hover:scale-100 group-hover:bg-white/20"></div>
          </a>

          <a href="/assets/CV Rafie Rojagat Bachri.pdf" download="CV_Rafie_Rojagat_Bachri.pdf" className="px-7 py-3 sm:px-8 sm:py-3.5 md:px-10 md:py-4 border border-blue-200 dark:border-blue-700 text-blue-600 dark:text-blue-300 rounded-full font-bold text-sm sm:text-base hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-all duration-300 backdrop-blur-sm bg-white/70 dark:bg-slate-900/40 text-center min-h-[44px] flex items-center justify-center gap-2">
            <i className="fas fa-download"></i>
            {t('hero.download_cv')}
          </a>

          <a href="/contact" className="px-7 py-3 sm:px-8 sm:py-3.5 md:px-10 md:py-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-full font-bold text-sm sm:text-base hover:border-blue-500 hover:text-blue-500 dark:hover:text-blue-400 dark:hover:border-blue-400 transition-all duration-300 backdrop-blur-sm bg-white/50 dark:bg-black/20 text-center min-h-[44px] flex items-center justify-center gap-2">
            <i className="fas fa-paper-plane"></i>
            {t('hero.contact_me')}
          </a>
        </motion.div>

        <motion.p variants={itemVariants} className="mt-4 text-sm md:text-base text-gray-500 dark:text-gray-400 px-4 text-center">
          {t('hero.afk_cta.prefix')}{' '}
          <a href="/afk" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline underline-offset-4">
            {t('hero.afk_cta.link')}
          </a>
          .
        </motion.p>

        <motion.div variants={itemVariants} className="mt-8 md:mt-12 flex gap-5 md:gap-6 text-2xl md:text-3xl text-gray-400">
          <a href="https://github.com/Rafie1715" target="_blank" rel="noreferrer" className="p-2 hover:text-dark dark:hover:text-white hover:-translate-y-1 transition-all rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800/50" aria-label="GitHub">
            <FaGithub />
          </a>
          <a href="https://linkedin.com/in/rafie-rojagat" target="_blank" rel="noreferrer" className="p-2 hover:text-blue-600 hover:-translate-y-1 transition-all rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800/50" aria-label="LinkedIn">
            <FaLinkedin />
          </a>
          <a href="https://instagram.com/rafie_rb" target="_blank" rel="noreferrer" className="p-2 hover:text-pink-500 hover:-translate-y-1 transition-all rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800/50" aria-label="Instagram">
            <FaInstagram />
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
};

const MotionName = () => {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500 drop-shadow-sm">
        Rafie Rojagat Bachri
      </span>
    );
  }

  return (
    <motion.span
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500 drop-shadow-sm"
    >
      Rafie Rojagat Bachri
    </motion.span>
  );
};

export default Hero;
