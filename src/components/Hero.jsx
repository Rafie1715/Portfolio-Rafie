import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { MapPin, BriefcaseBusiness, Layers, Code2, Download, Send } from 'lucide-react';
import { trackCTAClick, trackExternalLink } from '../utils/analytics';

import HeroNodeBackground from './HeroNodeBackground';

const TypewriterLine = ({ phrases, prefix, accessibleText, reduceMotion, active }) => {
  const safePhrases = Array.isArray(phrases) && phrases.length > 0 ? phrases : [''];
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [characterCount, setCharacterCount] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const currentPhrase = safePhrases[phraseIndex % safePhrases.length];

  useEffect(() => {
    if (reduceMotion || !active || !currentPhrase) return undefined;

    const reachedEnd = !isDeleting && characterCount === currentPhrase.length;
    const reachedStart = isDeleting && characterCount === 0;
    const delay = reachedEnd ? 1500 : reachedStart ? 220 : isDeleting ? 24 : 42;

    const timeout = window.setTimeout(() => {
      if (reachedEnd) {
        setIsDeleting(true);
        return;
      }

      if (reachedStart) {
        setIsDeleting(false);
        setPhraseIndex((index) => (index + 1) % safePhrases.length);
        return;
      }

      setCharacterCount((count) => count + (isDeleting ? -1 : 1));
    }, delay);

    return () => window.clearTimeout(timeout);
  }, [active, characterCount, currentPhrase, isDeleting, reduceMotion, safePhrases.length]);

  const visiblePhrase = reduceMotion
    ? currentPhrase
    : currentPhrase.slice(0, characterCount);

  return (
    <span aria-label={accessibleText}>
      <span aria-hidden="true">
        {prefix}{' '}
        <span className="font-semibold text-blue-600 dark:text-blue-400">
          {visiblePhrase}
        </span>
        {!reduceMotion && (
          <span className="ml-0.5 inline-block h-[1.1em] w-0.5 translate-y-[0.12em] bg-blue-500 animate-pulse" />
        )}
      </span>
    </span>
  );
};

const Hero = ({ recruiterLens = 'overview' }) => {
  const { t, i18n } = useTranslation();
  const shouldReduceMotion = useReducedMotion();
  const heroRef = useRef(null);
  const [isHeroVisible, setIsHeroVisible] = useState(true);
  const [isDocumentVisible, setIsDocumentVisible] = useState(
    () => typeof document === 'undefined' || document.visibilityState === 'visible',
  );
  const lensKey = "home.recruiter_lens.modes." + recruiterLens;

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

  const quickFacts = [
    { icon: MapPin, text: t('hero.quick_facts.location') },
    { icon: BriefcaseBusiness, text: t('hero.quick_facts.availability') },
    { icon: Layers, text: t(`${lensKey}.focus`) },
    { icon: Code2, text: t(`${lensKey}.stack`) },
  ];
  const rolePhrases = t(`${lensKey}.hero_phrases`, { returnObjects: true });
  const accessibleTagline = t(`${lensKey}.tagline`);

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
      className="relative md:min-h-[calc(100svh-140px)] flex flex-col items-center justify-center bg-white dark:bg-dark text-dark dark:text-white px-4 sm:px-6 lg:px-8 pt-28 pb-8 sm:pb-12 md:pb-14 overflow-hidden transition-colors duration-300"
    >
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          aria-hidden="true"
          className="absolute -inset-4 bg-[linear-gradient(to_right,#64748b0a_1px,transparent_1px),linear-gradient(to_bottom,#64748b0a_1px,transparent_1px)] bg-[size:32px_32px]"
        />
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-blue-50 to-transparent dark:from-blue-950/20"></div>
      </div>

      <HeroNodeBackground active={isHeroVisible && isDocumentVisible} reduceMotion={shouldReduceMotion} />

      <motion.div
        className="z-20 text-center max-w-5xl mx-auto flex flex-col items-center justify-center h-full w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.figure variants={itemVariants} className="mb-5 rounded-full bg-gradient-to-br from-blue-500 via-cyan-400 to-blue-600 p-1 shadow-lg shadow-blue-500/15">
          <img
            src="/images/profile.webp"
            alt={t('home.about_snapshot.photo_alt')}
            width="144" height="144" fetchPriority="high" decoding="async"
            className="size-24 rounded-full border-4 border-white object-cover object-[center_25%] dark:border-slate-900 sm:size-28 lg:size-36"
          />
        </motion.figure>

        <motion.p variants={itemVariants} className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium text-gray-500 dark:text-gray-400 mb-2 md:mb-3 px-2">
          {t('hero.greeting')}
        </motion.p>

        <div className="overflow-hidden mb-3 md:mb-2 px-2 pb-2">
          <motion.h1 variants={nameVariants} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight leading-tight break-words">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500 drop-shadow-sm">
              Rafie Rojagat Bachri
            </span>
          </motion.h1>
        </div>

        <motion.p variants={itemVariants} className="text-base sm:text-lg md:text-xl text-gray-500 dark:text-gray-400 mb-6 mt-2 md:mt-3 font-normal max-w-3xl mx-auto leading-relaxed px-4 min-h-[3.25rem] sm:min-h-[2rem]">
          <TypewriterLine
            key={`${i18n.resolvedLanguage}-${recruiterLens}`}
            phrases={rolePhrases}
            prefix={t('hero.typewriter_prefix')}
            accessibleText={accessibleTagline}
            reduceMotion={shouldReduceMotion}
            active={isHeroVisible && isDocumentVisible}
          />
        </motion.p>

        <motion.div variants={groupVariants} className="mb-6 md:mb-8 w-full max-w-3xl px-4 sm:px-0">
          <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:justify-center">
            {quickFacts.map((fact) => (
              <motion.div
                key={fact.text}
                variants={itemVariants}
                whileHover={shouldReduceMotion ? undefined : { y: -3, scale: 1.015 }}
                transition={{ duration: 0.2 }}
                className="group flex items-center justify-center gap-2 rounded-xl border border-gray-200 dark:border-slate-700 px-3 py-2 bg-white/80 dark:bg-slate-800/80 text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-medium shadow-sm hover:border-blue-200 dark:hover:border-blue-700 hover:shadow-md transition-[border-color,box-shadow]"
              >
                <fact.icon size={16} aria-hidden="true" className="shrink-0 text-primary transition-transform duration-200 group-hover:-translate-y-0.5" />
                <span>{fact.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={groupVariants} className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-5 md:gap-6 w-full px-4 sm:px-0">
          <motion.div variants={itemVariants} className="w-full sm:w-auto">
            <Link to="/projects" onClick={() => trackCTAClick('view_projects')} className="group relative w-full px-7 py-3 sm:px-8 sm:py-3.5 md:px-10 md:py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-full font-bold text-sm sm:text-base shadow-lg shadow-blue-500/30 overflow-hidden transition-all active:scale-95 hover:scale-[1.03] hover:shadow-blue-500/50 text-center min-h-[44px] flex items-center justify-center gap-2">
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
            <a href="/assets/CV Rafie Rojagat Bachri.pdf" download="CV_Rafie_Rojagat_Bachri.pdf" className="w-full px-7 py-3 sm:px-8 sm:py-3.5 md:px-10 md:py-4 border border-blue-200 dark:border-blue-700 text-blue-600 dark:text-blue-300 rounded-full font-bold text-sm sm:text-base hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-all duration-300 backdrop-blur-sm bg-white/70 dark:bg-slate-900/40 text-center min-h-[44px] flex items-center justify-center gap-2 hover:-translate-y-0.5">
              <Download size={18} aria-hidden="true" />
              {t('hero.download_cv')}
            </a>
          </motion.div>

          <motion.div variants={itemVariants} className="w-full sm:w-auto">
            <Link to="/contact" onClick={() => trackCTAClick('contact')} className="w-full px-7 py-3 sm:px-8 sm:py-3.5 md:px-10 md:py-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-full font-bold text-sm sm:text-base hover:border-blue-500 hover:text-blue-500 dark:hover:text-blue-400 dark:hover:border-blue-400 transition-all duration-300 backdrop-blur-sm bg-white/50 dark:bg-black/20 text-center min-h-[44px] flex items-center justify-center gap-2 hover:-translate-y-0.5">
              <Send size={18} aria-hidden="true" />
              {t('hero.contact_me')}
            </Link>
          </motion.div>
        </motion.div>

        <motion.p variants={itemVariants} className="mt-4 px-4 text-center text-sm text-gray-500 dark:text-gray-400 md:text-base">
          {t('hero.afk_cta.prefix')}{' '}
          <Link to="/afk" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline underline-offset-4">
            {t('hero.afk_cta.link')}
          </Link>
          .
        </motion.p>

        <motion.div variants={itemVariants} className="mt-8 flex gap-5 text-2xl text-gray-400 md:mt-12 md:gap-6 md:text-3xl">
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
