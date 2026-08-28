import Contact from '../components/Contact';
import SEO from '../components/SEO';
import { useTranslation } from 'react-i18next';
import PageTransition from '../components/PageTransition';
import { motion, useReducedMotion } from 'framer-motion';
import { BriefcaseBusiness } from 'lucide-react';

const ContactPage = () => {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();

  return (
    <PageTransition>
      <main className="relative min-h-screen overflow-hidden bg-white pb-12 pt-20 transition-colors duration-300 dark:bg-dark md:pb-20 md:pt-24">
        <SEO
          title={t('contact.seo_title')}
          description={t('contact.seo_desc')}
          url="https://rafierb.me/contact"
          keywords="Contact Rafie Rojagat, Hire Software Engineer, Android Developer Contact, Front-End Developer, Collaboration Opportunities"
          type="website"
        />

        <div className="pointer-events-none absolute inset-x-0 top-0 h-[32rem] opacity-60 dark:opacity-25">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        </div>

        <header className="relative z-10 mx-auto max-w-6xl px-4 pb-8 pt-10 sm:px-6 md:pb-12 md:pt-14 lg:px-8">
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="max-w-3xl"
          >
            <p className="mb-4 flex items-center gap-2 text-sm font-bold uppercase text-primary">
              <BriefcaseBusiness className="h-4 w-4" aria-hidden="true" />
              {t('pages.contact.eyebrow')}
            </p>
            <h1 className="max-w-3xl text-4xl font-black leading-tight text-dark dark:text-white sm:text-5xl md:text-6xl">
              {t('pages.contact.title_prefix')}{' '}
              <span className="text-primary">{t('pages.contact.title_highlight')}</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-gray-600 dark:text-gray-300 md:text-lg">
              {t('pages.contact.subtitle')}
            </p>
          </motion.div>
        </header>

        <Contact />
      </main>
    </PageTransition>
  );
};

export default ContactPage;
