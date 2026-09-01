import { createElement, useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  BriefcaseBusiness,
  Download,
  FolderKanban,
  GraduationCap,
  MapPin,
  Send,
} from 'lucide-react';
import cvFile from '/assets/CV Rafie Rojagat Bachri.pdf';

const MetricValue = ({ target, decimals = 0, suffix = '', isStatic = false, reduceMotion }) => {
  const valueRef = useRef(null);
  const isInView = useInView(valueRef, { once: true, margin: '-40px' });
  const [displayValue, setDisplayValue] = useState(isStatic || reduceMotion ? target : 0);

  useEffect(() => {
    if (isStatic || reduceMotion || !isInView) return undefined;

    const duration = 900;
    const startedAt = performance.now();
    let animationFrame;

    const updateValue = (timestamp) => {
      const progress = Math.min((timestamp - startedAt) / duration, 1);
      const easedProgress = 1 - ((1 - progress) ** 3);
      setDisplayValue(target * easedProgress);

      if (progress < 1) {
        animationFrame = window.requestAnimationFrame(updateValue);
      }
    };

    animationFrame = window.requestAnimationFrame(updateValue);
    return () => window.cancelAnimationFrame(animationFrame);
  }, [decimals, isInView, isStatic, reduceMotion, target]);

  const currentValue = isStatic || reduceMotion ? target : displayValue;
  const formattedValue = isStatic
    ? String(target)
    : Number(currentValue).toFixed(decimals);

  return (
    <span ref={valueRef} data-metric-value className="tabular-nums">
      {formattedValue}{suffix}
    </span>
  );
};

const About = () => {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();

  const proofPoints = [
    { target: 2026, isStatic: true, label: t('about.snapshot.graduate'), icon: GraduationCap },
    { target: 3.89, decimals: 2, label: t('about.snapshot.gpa'), icon: GraduationCap },
    { target: 88.71, decimals: 2, suffix: '/100', label: t('about.snapshot.mandiri'), icon: BriefcaseBusiness },
    { target: 92.06, decimals: 2, suffix: '%', label: t('about.snapshot.ml_accuracy'), icon: FolderKanban },
    { target: 900, suffix: '+', label: t('about.snapshot.bangkit_hours'), icon: BriefcaseBusiness },
  ];

  return (
    <section id="about" className="py-14 md:py-16 bg-white dark:bg-dark relative overflow-hidden">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-center">
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="mx-auto w-full max-w-sm"
          >
            <div className="aspect-[4/5] overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <img
                src="/images/profile.webp"
                alt="Rafie Rojagat Bachri"
                className="h-full w-full object-cover"
                decoding="async"
              />
            </div>
          </motion.div>

          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08, ease: 'easeOut' }}
          >
            <p className="text-xs font-bold uppercase text-primary mb-3">
              {t('about.eyebrow')}
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-dark dark:text-white max-w-3xl leading-tight">
              {t('about.headline')}
            </h2>
            <p className="mt-5 text-base md:text-lg leading-relaxed text-gray-600 dark:text-gray-300 max-w-3xl">
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

        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.4 }}
          className="mt-12 border-y border-slate-200 dark:border-slate-700 py-5"
        >
          <div className="grid grid-cols-2 gap-y-5 sm:grid-cols-3 lg:grid-cols-5 lg:divide-x divide-slate-200 dark:divide-slate-700">
            {proofPoints.map((proofPoint) => (
              <div key={proofPoint.label} className="px-3 lg:px-5 first:lg:pl-0 last:lg:pr-0">
                <div className="flex items-center gap-2 text-primary mb-1">
                  {createElement(proofPoint.icon, { size: 15, 'aria-hidden': true })}
                  <span className="text-xl font-black text-dark dark:text-white">
                    <MetricValue {...proofPoint} reduceMotion={shouldReduceMotion} />
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400">{proofPoint.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
