import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  BriefcaseBusiness,
  Download,
  FolderKanban,
  MapPin,
  Send,
} from 'lucide-react';
import cvFile from '/assets/CV Rafie Rojagat Bachri.pdf';

const About = () => {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="about" aria-labelledby="about-intro-title" className="py-10 md:py-14 bg-white dark:bg-dark relative overflow-hidden">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="grid gap-y-6 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:grid-rows-[auto_auto] lg:gap-x-12 lg:gap-y-5">
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="min-w-0 lg:col-start-2 lg:row-start-1 lg:self-end"
          >
            <p className="text-xs font-bold uppercase text-primary mb-3">
              {t('about.eyebrow')}
            </p>
            <h2 id="about-intro-title" className="text-3xl md:text-4xl font-black text-dark dark:text-white max-w-3xl leading-tight">
              {t('about.headline')}
            </h2>
          </motion.div>

          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="relative mx-auto w-full max-w-[240px] sm:max-w-[280px] lg:col-start-1 lg:row-start-1 lg:row-span-2 lg:max-w-[360px] lg:self-center"
          >
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-100 p-1.5 dark:border-slate-700 dark:bg-slate-900">
              <img
                src="/images/profile.webp"
                alt="Rafie Rojagat Bachri"
                width="3015"
                height="3864"
                decoding="async"
                className="aspect-[4/5] w-full rounded-lg object-cover object-center"
              />
            </div>
            <span aria-hidden="true" className="absolute -bottom-0.5 left-6 h-1 w-14 rounded-full bg-primary" />
          </motion.div>

          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08, ease: 'easeOut' }}
            className="min-w-0 lg:col-start-2 lg:row-start-2 lg:self-start"
          >
            <p className="text-base md:text-lg leading-relaxed text-gray-600 dark:text-gray-300 max-w-3xl">
              {t('about.summary')}
            </p>
            <p className="mt-3 text-sm md:text-base leading-relaxed text-gray-500 dark:text-gray-400 max-w-3xl">
              {t('about.summary_secondary')}
            </p>

            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-gray-600 dark:text-gray-300">
              <span className="inline-flex items-center gap-2">
                <MapPin size={17} className="text-primary" aria-hidden="true" />
                {t('about.location')}
              </span>
              <span className="inline-flex items-center gap-2">
                <BriefcaseBusiness size={17} className="text-primary" aria-hidden="true" />
                {t('about.availability')}
              </span>
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/projects"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-bold text-white hover:bg-blue-700 transition-colors"
              >
                <FolderKanban size={17} aria-hidden="true" />
                {t('about.view_projects')}
              </Link>
              <a
                href={cvFile}
                download="CV_Rafie_Rojagat_Bachri.pdf"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-primary/40 px-5 py-3 text-sm font-bold text-primary hover:bg-primary/5 transition-colors"
              >
                <Download size={17} aria-hidden="true" />
                {t('about.download_cv')}
              </a>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-bold text-dark dark:text-white hover:text-primary transition-colors"
              >
                <Send size={17} aria-hidden="true" />
                {t('about.contact')}
              </Link>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
};

export default About;
