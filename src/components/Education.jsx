import { motion, useReducedMotion } from 'framer-motion';
import JourneyMilestone from './JourneyMilestone';
import { Award, CalendarDays } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Education = () => {
  const { t, i18n } = useTranslation();
  const reducedMotion = useReducedMotion();
  const isId = i18n.resolvedLanguage?.startsWith('id');

  return (
    <section className="py-16 md:py-20 bg-white dark:bg-dark">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.4 }}
        >
          <div className="mb-8">
            <div className="mb-3 flex items-center gap-3">
              <span aria-hidden="true" className="h-0.5 w-8 rounded-full bg-gradient-to-r from-primary via-cyan-500 to-emerald-400" />
              <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-primary">
                {isId ? 'FONDASI AKADEMIK' : 'ACADEMIC FOUNDATION'}
              </p>
            </div>
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <h2 className="text-3xl font-bold text-dark dark:text-white sm:text-4xl">{t('about.education.title')}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t('about.education.subtitle')}</p>
            </div>
          </div>

          <div className="grid gap-6 border-y border-slate-200 dark:border-slate-700 py-7 md:grid-cols-[88px_1fr_auto] md:items-center">
            <JourneyMilestone className="h-20 w-20 p-3">
              <img src="/images/upnvj_logo.webp" alt="UPN Veteran Jakarta" className="h-full w-full object-contain" loading="lazy" />
            </JourneyMilestone>
            <div>
              <h3 className="text-xl font-bold text-dark dark:text-white">{t('about.uni_name')}</h3>
              <p className="mt-1 font-semibold text-primary">{t('about.education.degree')}</p>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-500 dark:text-gray-400">{t('about.education.note')}</p>
            </div>
            <div className="space-y-3 text-sm font-semibold text-gray-600 dark:text-gray-300 md:text-right">
              <p className="flex items-center gap-2 md:justify-end">
                <CalendarDays size={17} className="text-primary" aria-hidden="true" />
                {t('about.education.period')}
              </p>
              <p className="flex items-center gap-2 md:justify-end">
                <Award size={17} className="text-primary" aria-hidden="true" />
                {t('about.education.gpa')}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Education;
