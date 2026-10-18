import { GraduationCap, ArrowUpRight, MapPin, FileText } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import DeveloperIDPreview from './DeveloperIDPreview';

const HomeAboutSnapshot = ({ onOpenPitch }) => {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();
  const revealFromRight = shouldReduceMotion ? undefined : { opacity: 0, y: 16 };

  return (
    <section
      className="border-y border-slate-200 bg-slate-50/80 py-14 dark:border-slate-800 dark:bg-slate-900/45 md:py-20"
      aria-labelledby="home-about-title"
    >
      <div className="container mx-auto grid min-w-0 max-w-6xl grid-cols-[minmax(0,1fr)] items-center gap-10 px-4 text-center sm:px-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-12 lg:text-left">
        <DeveloperIDPreview />
        <motion.div
          className="min-w-0"
          initial={revealFromRight}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.5, delay: shouldReduceMotion ? 0 : 0.08, ease: 'easeOut' }}
        >
          <p className="text-xs font-bold uppercase text-primary">
            {t('home.about_snapshot.eyebrow')}
          </p>
          <h2
            id="home-about-title"
            className="mx-auto mt-3 max-w-3xl text-3xl font-black leading-tight text-slate-950 dark:text-white md:text-4xl"
          >
            {t('home.about_snapshot.title')}
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-7 text-slate-600 dark:text-slate-300 md:text-lg md:leading-8">
            {t('home.about_snapshot.summary')}
          </p>

          <p className="mt-3 flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400 lg:justify-start">
            <MapPin className="h-4 w-4 flex-none text-primary" aria-hidden="true" />
            {t('about.location')}
          </p>

          <p className="mt-5 flex items-start justify-center gap-2 text-sm leading-6 text-slate-500 dark:text-slate-400 lg:justify-start">
            <GraduationCap className="mt-1 h-4 w-4 flex-none text-primary" aria-hidden="true" />
            <span>{t('home.about_snapshot.education')}</span>
          </p>

          <Link
            to="/about"
            className="mt-7 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
          >
            {t('home.about_snapshot.cta')}
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          {onOpenPitch && <button type="button" onClick={onOpenPitch}
            className="mx-auto mt-3 flex min-h-11 items-center gap-2 rounded-md text-sm font-medium text-slate-600 underline-offset-4 hover:text-primary hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary dark:text-slate-300 lg:mx-0"
            aria-haspopup="dialog">
            <FileText className="size-4" aria-hidden="true" />
            {t('home.recruiter_pitch.trigger_button')}
          </button>}
        </motion.div>
      </div>
    </section>
  );
};

export default HomeAboutSnapshot;
