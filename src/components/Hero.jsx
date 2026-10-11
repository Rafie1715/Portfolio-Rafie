import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { BriefcaseBusiness, Download, Send } from 'lucide-react';
import { trackCTAClick, trackExternalLink } from '../utils/analytics';

import HeroLightBackground from './HeroLightBackground';
import PersonalMark from './PersonalMark';
import TypewriterLine from './TypewriterLine';

const Hero = ({ recruiterLens = 'overview' }) => {
  const { t, i18n } = useTranslation();
  const shouldReduceMotion = useReducedMotion();
  const heroRef = useRef(null);
  const [isHeroVisible, setIsHeroVisible] = useState(true);
  const [isDocumentVisible, setIsDocumentVisible] = useState(
    () => typeof document === 'undefined' || document.visibilityState === 'visible',
  );

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
    hidden: { opacity: 0.35, y: '105%' },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
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
      className="relative flex flex-col items-center justify-center bg-white dark:bg-dark text-dark dark:text-white px-4 sm:px-6 lg:px-8 pt-24 pb-4 overflow-hidden transition-colors duration-300"
    >
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          aria-hidden="true"
          className="absolute -inset-4 opacity-40 bg-[linear-gradient(to_right,#64748b0a_1px,transparent_1px),linear-gradient(to_bottom,#64748b0a_1px,transparent_1px)] bg-[size:48px_48px]"
        />
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-blue-50 to-transparent dark:from-blue-950/20"></div>
      </div>

      <HeroLightBackground active={isHeroVisible && isDocumentVisible} />

      <motion.div
        className="z-20 text-center max-w-5xl mx-auto flex flex-col items-center justify-center h-full w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.figure variants={itemVariants} className="relative mb-3 rounded-full bg-gradient-to-br from-blue-500 via-cyan-400 to-blue-600 p-1 shadow-lg shadow-blue-500/15">
          <img
            src="/images/profile.webp"
            alt={t('home.about_snapshot.photo_alt')}
            width="144" height="144" fetchPriority="high" decoding="async"
            className="size-20 rounded-full border-4 border-white object-cover object-[center_25%] dark:border-slate-900 sm:size-20"
          />
          <span className="absolute -bottom-1 -right-3 rounded-md border border-blue-200 bg-white px-1.5 py-0.5 text-blue-600 shadow-sm dark:border-slate-600 dark:bg-slate-900 dark:text-blue-400" aria-hidden="true">
            <PersonalMark className="h-5 w-10" />
          </span>
        </motion.figure>



        <motion.div
          variants={itemVariants}
          className="mb-2 inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-50/80 px-3.5 py-1 text-xs font-semibold text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-950/40 dark:text-emerald-300 shadow-sm backdrop-blur"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>{t('hero.quick_facts.availability')}</span>
          <span className="text-emerald-400 dark:text-emerald-700">·</span>
          <span>{t('hero.quick_facts.location')}</span>
        </motion.div>

        <div className="overflow-hidden mb-3 md:mb-2 px-2 pb-2">
          <motion.h1 variants={nameVariants} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-tight break-words">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500 drop-shadow-sm">
              Rafie Rojagat Bachri
            </span>
          </motion.h1>
        </div>

        <p className="max-w-3xl px-2 text-base font-semibold leading-relaxed text-slate-700 dark:text-slate-200 sm:text-lg">{t('common.professional_identity')}</p>
        <p className="mt-1 max-w-2xl px-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{t('common.professional_summary')}</p>
        <TypewriterLine
          key={`${i18n.resolvedLanguage}-${recruiterLens}`}
          prefix={t('hero.typewriter_prefix')}
          phrases={t(`home.recruiter_lens.modes.${recruiterLens}.hero_phrases`, { returnObjects: true })}
          active={isHeroVisible && isDocumentVisible}
        />

        <motion.div variants={groupVariants} className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full px-4 sm:px-0">
          <motion.div variants={itemVariants} className="w-full sm:w-auto">
            <Link to={recruiterLens === 'overview' ? '/projects' : `/projects?focus=${recruiterLens}`} onClick={() => trackCTAClick('view_projects')} className="group relative w-full sm:w-auto px-7 py-3 sm:px-8 sm:py-3.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-full font-bold text-sm sm:text-base shadow-lg shadow-blue-500/30 overflow-hidden transition-all active:scale-95 hover:scale-[1.03] hover:shadow-blue-500/50 text-center min-h-[44px] flex items-center justify-center gap-2">
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

          <motion.div variants={itemVariants} className="w-full sm:w-auto flex justify-center">
            <Link to="/contact" onClick={() => trackCTAClick('contact')} className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-primary dark:text-slate-300 dark:hover:text-primary transition-colors py-2 px-3.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800/80">
              <Send size={14} aria-hidden="true" />
              <span>{t('hero.contact_me')}</span>
              <span aria-hidden="true">→</span>
            </Link>
          </motion.div>
        </motion.div>



        <motion.div variants={itemVariants} className="mt-1 flex gap-4 text-xl text-gray-400">
          <a href="https://github.com/Rafie1715" target="_blank" rel="noreferrer" className="p-2 hover:text-dark dark:hover:text-white hover:-translate-y-1 transition-all rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800/50" aria-label="GitHub" onClick={event => trackExternalLink('github', event.currentTarget.href)}>
            <FaGithub />
          </a>
          <a href="https://linkedin.com/in/rafie-rojagat" target="_blank" rel="noreferrer" className="p-2 hover:text-blue-600 hover:-translate-y-1 transition-all rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800/50" aria-label="LinkedIn" onClick={event => trackExternalLink('linkedin', event.currentTarget.href)}>
            <FaLinkedin />
          </a>
          <a href="https://instagram.com/rafie_rb" target="_blank" rel="noreferrer" className="p-2 hover:text-pink-500 hover:-translate-y-1 transition-all rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800/50" aria-label="Instagram" onClick={event => trackExternalLink('instagram', event.currentTarget.href)}>
            <FaInstagram />
          </a>
        </motion.div>

      </motion.div>
    </section>
  );
};

export default Hero;
