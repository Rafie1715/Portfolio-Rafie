import { BadgeCheck, BookOpenCheck, GraduationCap, ArrowUpRight } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import DeveloperIDPreview from './DeveloperIDPreview';

const metricIcons = [GraduationCap, BookOpenCheck, BadgeCheck];
const metricColors = [
  'text-blue-600 dark:text-blue-400',
  'text-emerald-600 dark:text-emerald-400',
  'text-amber-600 dark:text-amber-400',
];

const HomeAboutSnapshot = () => {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();
  const metrics = t('home.about_snapshot.metrics', { returnObjects: true });
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

          <div className="mt-8 grid grid-cols-1 gap-y-4 sm:grid-cols-3 sm:divide-x divide-slate-200 border-y border-slate-200 py-5 dark:divide-slate-700 dark:border-slate-700">
            {Array.isArray(metrics) && metrics.map((metric, index) => {
              const Icon = metricIcons[index] || BadgeCheck;
              return (
                <dl key={metric.label} className="min-w-0 px-3 first:pl-0 last:pr-0 sm:px-4">
                  <dt className="flex flex-wrap items-center justify-center gap-2 lg:justify-start">
                    <Icon
                      className={`h-4 w-4 flex-none ${metricColors[index] || metricColors[0]}`}
                      aria-hidden="true"
                    />
                    <span className="text-lg font-black leading-tight text-slate-950 dark:text-white sm:text-2xl">
                      {metric.value}
                    </span>
                  </dt>
                  <dd className="mt-2 text-[11px] leading-4 text-slate-500 dark:text-slate-400 sm:text-xs sm:leading-5">
                    {metric.label}
                  </dd>
                </dl>
              );
            })}
          </div>

          <Link
            to="/about"
            className="mt-7 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
          >
            {t('home.about_snapshot.cta')}
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default HomeAboutSnapshot;
