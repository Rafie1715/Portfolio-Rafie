import { motion } from 'framer-motion';
import { Award, CalendarDays, GraduationCap } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Education = () => {
  const { t } = useTranslation();

  return (
    <section className="py-16 md:py-20 bg-white dark:bg-dark">
      <div className="container mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-start gap-4 mb-8">
            <span className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/40 text-primary">
              <GraduationCap size={21} aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-3xl font-bold text-dark dark:text-white">{t('about.education.title')}</h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t('about.education.subtitle')}</p>
            </div>
          </div>

          <div className="grid gap-6 border-y border-slate-200 dark:border-slate-700 py-7 md:grid-cols-[88px_1fr_auto] md:items-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white p-3 dark:bg-slate-800">
              <img src="/images/upnvj_logo.webp" alt="UPN Veteran Jakarta" className="h-full w-full object-contain" loading="lazy" />
            </div>
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
                GPA 3.89 / 4.00
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Education;
