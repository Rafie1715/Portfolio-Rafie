import { lazy, Suspense, useState } from 'react';
import { motion } from 'framer-motion';
import { Box, CreditCard, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import IDCard from './IDCard';

const ThreeIDCard = lazy(() => import('./ThreeIDCard'));

const ProfileLab = () => {
  const { t } = useTranslation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const toggleProfile = () => {
    setIsProfileOpen((current) => {
      if (current) setIsPreviewOpen(false);
      return !current;
    });
  };

  return (
    <section className="py-16 md:py-20 bg-gray-50 dark:bg-darkLight border-t border-slate-200 dark:border-slate-800">
      <div className="container mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.4 }}
          className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-8"
        >
          <div className="flex items-start gap-4">
            <span className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-slate-200 dark:bg-slate-800 text-primary">
              <CreditCard size={20} aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-dark dark:text-white">{t('about.profile_lab.title')}</h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 max-w-2xl">{t('about.profile_lab.subtitle')}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {isProfileOpen && (
              <button
                type="button"
                onClick={() => setIsPreviewOpen((current) => !current)}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-bold text-dark transition-colors hover:border-primary hover:text-primary dark:border-slate-600 dark:text-white"
                aria-expanded={isPreviewOpen}
              >
                {isPreviewOpen ? <X size={17} aria-hidden="true" /> : <Box size={17} aria-hidden="true" />}
                {isPreviewOpen ? t('about.profile_lab.hide_3d') : t('about.profile_lab.show_3d')}
              </button>
            )}
            <button
              type="button"
              onClick={toggleProfile}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-bold text-dark transition-colors hover:border-primary hover:text-primary dark:border-slate-600 dark:text-white"
              aria-expanded={isProfileOpen}
            >
              {isProfileOpen ? <X size={17} aria-hidden="true" /> : <CreditCard size={17} aria-hidden="true" />}
              {isProfileOpen ? t('about.profile_lab.hide_profile') : t('about.profile_lab.show_profile')}
            </button>
          </div>
        </motion.div>

        {isProfileOpen && (
          <div className={`grid gap-8 items-start ${isPreviewOpen ? 'lg:grid-cols-2' : ''}`}>
            <div className="py-4">
              <IDCard />
            </div>
            {isPreviewOpen && (
              <Suspense fallback={<div className="aspect-[4/3] rounded-lg bg-slate-200 dark:bg-slate-800 animate-pulse" />}>
                <ThreeIDCard />
              </Suspense>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProfileLab;
