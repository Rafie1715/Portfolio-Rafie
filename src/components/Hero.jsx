import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { BriefcaseBusiness, Download } from 'lucide-react';
import { trackCTAClick, trackExternalLink } from '../utils/analytics';

import HeroLightBackground from './HeroLightBackground';
import TypewriterLine from './TypewriterLine';

const supportsWebGL = () => {
  try {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!context) return false;
    context.getExtension('WEBGL_lose_context')?.loseContext();
    return true;
  } catch { return false; }
};

const Hero = () => {
  const { t, i18n } = useTranslation();
  const shouldReduceMotion = useReducedMotion();
  const heroRef = useRef(null);
  const [completedGreetingLanguage, setCompletedGreetingLanguage] = useState(null);
  const language = i18n.resolvedLanguage;
  const handleGreetingComplete = useCallback(() => setCompletedGreetingLanguage(language), [language]);
  const [isHeroVisible, setIsHeroVisible] = useState(true);
  const [isDocumentVisible, setIsDocumentVisible] = useState(
    () => typeof document === 'undefined' || document.visibilityState === 'visible',
  );
  const [canUse3D, setCanUse3D] = useState(false);
  const [bgMode, setBgMode] = useState('wave');

  useEffect(() => {
    if (typeof window !== 'undefined' && supportsWebGL()) {
      setCanUse3D(true);
      setBgMode('wave');
    } else {
      setBgMode('contour');
    }
  }, []);

  useEffect(() => {
    const element = heroRef.current;
    if (!element) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => setIsHeroVisible(entry.isIntersecting),
      { threshold: 0.08 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsDocumentVisible(document.visibilityState === 'visible');
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);



  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.08 },
    },
  };

  const itemVariants = shouldReduceMotion ? {
    hidden: { opacity: 1 },
    visible: { opacity: 1 },
  } : {
    hidden: { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: 'easeOut' },
    },
  };

  const nameVariants = shouldReduceMotion ? {
    hidden: { opacity: 1 },
    visible: { opacity: 1 },
  } : {
    hidden: { opacity: 0, y: 24, filter: 'blur(6px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const groupVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.07 },
    },
  };

  return (
    <section
      ref={heroRef}
      id="home"
      data-motion-active={isHeroVisible && isDocumentVisible && !shouldReduceMotion}
      className="relative flex flex-col items-center justify-center bg-white dark:bg-dark text-dark dark:text-white px-4 sm:px-6 lg:px-8 pt-32 pb-8 sm:pt-40 sm:pb-10 overflow-hidden transition-colors duration-300"
    >
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          aria-hidden="true"
          className="absolute -inset-4 opacity-40 bg-[linear-gradient(to_right,#64748b0a_1px,transparent_1px),linear-gradient(to_bottom,#64748b0a_1px,transparent_1px)] bg-[size:48px_48px]"
        />
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-blue-50 to-transparent dark:from-blue-950/20"></div>
      </div>

      <HeroLightBackground active={isHeroVisible && isDocumentVisible} mode={bgMode} />

      <motion.div
        className="z-20 text-center max-w-6xl mx-auto flex flex-col items-center justify-center h-full w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="mb-3 flex w-full justify-center">
          <TypewriterLine
            key={language}
            phrases={[t('hero.greeting')]}
            active={isHeroVisible && isDocumentVisible}
            once
            onComplete={handleGreetingComplete}
          />
        </motion.div>

        <motion.h1 variants={groupVariants} aria-label="Rafie Rojagat Bachri"
          className="hero-name mb-3 px-2 text-4xl sm:text-5xl md:text-6xl lg:text-[5rem] font-black tracking-tight">
          <span aria-hidden="true" className="block sm:inline">
            <motion.span variants={nameVariants} className="hero-name-word">Rafie</motion.span>
          </span>{' '}
          <span aria-hidden="true" className="block whitespace-nowrap sm:inline">
            <motion.span variants={nameVariants} className="hero-name-word">Rojagat</motion.span>{' '}
            <motion.span variants={nameVariants} className="hero-name-word">Bachri</motion.span>
          </span>
        </motion.h1>

        <motion.p variants={itemVariants} className="max-w-3xl px-2 text-base font-semibold leading-relaxed text-slate-700 dark:text-slate-200 sm:text-xl">{t('hero.role')}</motion.p>
        <motion.div variants={itemVariants} className="mt-3 flex w-full justify-center">
          <TypewriterLine
            key={language}
            phrases={t('hero.build_phrases', { returnObjects: true })}
            staticText={t('hero.build_summary')}
            active={isHeroVisible && isDocumentVisible && completedGreetingLanguage === language}
            summary
          />
        </motion.div>

        <motion.p variants={itemVariants} className="mt-5 inline-flex items-center justify-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300 sm:text-sm">
          <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-emerald-500" />
          {t('hero.quick_facts.availability')}
        </motion.p>

        <motion.div variants={groupVariants} className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full px-4 sm:px-0">
          <motion.div variants={itemVariants} className="w-full sm:w-auto">
            <Link to="/projects" onClick={() => trackCTAClick('view_projects')} className="group relative w-full sm:w-auto px-7 py-3 sm:px-8 sm:py-3.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-full font-bold text-sm sm:text-base shadow-lg shadow-blue-500/30 overflow-hidden transition-all active:scale-95 hover:scale-[1.03] hover:shadow-blue-500/50 text-center min-h-[44px] flex items-center justify-center gap-2">
              <BriefcaseBusiness size={18} aria-hidden="true" className="relative z-10" />
              <span className="relative z-10">{t('hero.view_projects')}</span>
              {!shouldReduceMotion && (
                <motion.span
                  aria-hidden="true"
                  initial={{ x: '-220%' }}
                  animate={{ x: '720%' }}
                  transition={{ duration: 0.85, delay: 1.15, ease: 'easeOut' }}
                  className="absolute inset-y-[-25%] left-0 w-1/4 rotate-12 bg-gradient-to-r from-transparent via-white/35 to-transparent pointer-events-none"
                />
              )}
              <span className="absolute inset-0 h-full w-full scale-0 rounded-full transition-all duration-300 group-hover:scale-100 group-hover:bg-white/20"></span>
            </Link>
          </motion.div>

          <motion.div variants={itemVariants} className="w-full sm:w-auto">
            <a href="/assets/CV Rafie Rojagat Bachri.pdf" download="CV_Rafie_Rojagat_Bachri.pdf" className="w-full sm:w-auto px-7 py-3 sm:px-8 sm:py-3.5 border border-blue-200 dark:border-blue-700 text-blue-600 dark:text-blue-300 rounded-full font-bold text-sm sm:text-base hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-all duration-300 backdrop-blur-sm bg-white/70 dark:bg-slate-900/40 text-center min-h-[44px] flex items-center justify-center gap-2 hover:-translate-y-0.5 shadow-sm">
              <Download size={18} aria-hidden="true" />
              {t('hero.download_cv')}
            </a>
          </motion.div>


        </motion.div>



        <motion.div variants={itemVariants} className="mt-5 flex gap-3 text-lg text-slate-500 dark:text-slate-400">
          <a href="https://github.com/Rafie1715" target="_blank" rel="noreferrer" className="inline-flex size-11 items-center justify-center p-2 hover:text-dark dark:hover:text-white hover:-translate-y-1 transition-all rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800/50" aria-label="GitHub" onClick={event => trackExternalLink('github', event.currentTarget.href)}>
            <FaGithub />
          </a>
          <a href="https://linkedin.com/in/rafie-rojagat" target="_blank" rel="noreferrer" className="inline-flex size-11 items-center justify-center p-2 hover:text-blue-600 hover:-translate-y-1 transition-all rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800/50" aria-label="LinkedIn" onClick={event => trackExternalLink('linkedin', event.currentTarget.href)}>
            <FaLinkedin />
          </a>
          <a href="https://instagram.com/rafie_rb" target="_blank" rel="noreferrer" className="inline-flex size-11 items-center justify-center p-2 hover:text-pink-500 hover:-translate-y-1 transition-all rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800/50" aria-label="Instagram" onClick={event => trackExternalLink('instagram', event.currentTarget.href)}>
            <FaInstagram />
          </a>
        </motion.div>

        {canUse3D && (
          <motion.div variants={itemVariants} className="mt-6 flex flex-col items-center">
            <div
              role="group"
              aria-label={t('hero.bg_toggle_label')}
              className="inline-flex items-center rounded-full border border-slate-200/90 bg-slate-100/90 p-1 shadow-sm backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80"
            >
              <button
                type="button"
                onClick={() => setBgMode('wave')}
                aria-pressed={bgMode === 'wave'}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  bgMode === 'wave'
                    ? 'bg-white text-primary shadow-sm dark:bg-slate-800 dark:text-white'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                {t('hero.bg_wave')}
              </button>
              <button
                type="button"
                onClick={() => setBgMode('contour')}
                aria-pressed={bgMode === 'contour'}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  bgMode === 'contour'
                    ? 'bg-white text-primary shadow-sm dark:bg-slate-800 dark:text-white'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                {t('hero.bg_contour')}
              </button>
            </div>
          </motion.div>
        )}

      </motion.div>
    </section>
  );
};

export default Hero;
