import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Award, ExternalLink, Grid2X2, ListFilter } from "lucide-react";
import { useTranslation } from "react-i18next";

import ImageDialog from './ImageDialog';
import ProjectCatalogStatus from './ProjectCatalogStatus';

const Certifications = () => {
  const { t, i18n } = useTranslation();
  const reduceMotion = useReducedMotion();
  const [certItems, setCertItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const language = i18n.resolvedLanguage?.startsWith("id") ? "id" : "en";

  const getText = (value) => {
    if (!value) return "";
    if (typeof value === "object" && !Array.isArray(value)) {
      return value[language] || value.en || value.id || "";
    }
    return String(value);
  };

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    const timer = setTimeout(() => controller.abort(), 10000);
    const load = async () => {
      setLoading(true); setError(false);
      try {
        const response = await fetch('/.netlify/functions/public-certifications', { signal: controller.signal, cache: 'no-store' });
        if (!response.ok) throw new Error('Certificates unavailable');
        const data = await response.json();
        if (!Array.isArray(data.certifications)) throw new Error('Invalid certificates');
        if (active) setCertItems(data.certifications);
      } catch { if (active) { setCertItems([]); setError(true); } }
      finally { clearTimeout(timer); if (active) setLoading(false); }
    };
    load();
    return () => { active = false; clearTimeout(timer); controller.abort(); };
  }, [attempt]);

  const featuredItems = useMemo(() => certItems.filter((item) => item.featured), [certItems]);
  const visibleItems = showAll || featuredItems.length === 0 ? certItems : featuredItems;

  return (
    <section id="certifications" className="bg-gray-50 py-16 dark:bg-slate-950 sm:py-20">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"
        >
          <div className="max-w-2xl">
            <p className="mb-3 text-sm font-bold uppercase text-primary">{t("certifications.eyebrow")}</p>
            <h2 className="text-3xl font-bold text-dark dark:text-white sm:text-4xl">
              {t("certifications.title")}
            </h2>
            <p className="mt-4 leading-7 text-gray-600 dark:text-gray-400">
              {t("certifications.subtitle")}
            </p>
          </div>

          {certItems.length > featuredItems.length && featuredItems.length > 0 && (
            <button
              type="button"
              onClick={() => setShowAll((current) => !current)}
              className="inline-flex items-center justify-center gap-2 self-start rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm font-bold text-gray-800 transition hover:border-primary hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:border-slate-600 dark:bg-slate-900 dark:text-white sm:self-auto"
              aria-expanded={showAll}
            >
              {showAll ? <ListFilter className="h-4 w-4" aria-hidden="true" /> : <Grid2X2 className="h-4 w-4" aria-hidden="true" />}
              {showAll ? t("certifications.show_selected") : t("certifications.view_all", { count: certItems.length })}
            </button>
          )}
        </motion.div>

        <ProjectCatalogStatus loading={loading} error={error} retry={() => setAttempt(value => value + 1)} loadingKey="common.certificates_loading" errorKey="common.certificates_error" />
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {visibleItems.map((certification, index) => {
            const title = getText(certification.title);
            const summary = getText(certification.summary);

            return (
              <motion.article
                key={certification.id}
                initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.18) }}
                className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-slate-700 dark:bg-slate-900 sm:min-h-[260px]"
              >
                {certification.img ? (
                  <button
                    type="button"
                    onClick={() => setSelectedImage({ src: certification.img, alt: getText(certification.alt) || title })}
                    className="group relative block aspect-[4/3] w-full flex-none cursor-zoom-in overflow-hidden bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary dark:bg-slate-800 sm:aspect-[16/8]"
                    aria-label={t("certifications.preview", { title })}
                  >
                    <img
                      src={certification.img}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-contain p-3 transition duration-300 group-hover:scale-[1.015] sm:p-4"
                    />
                  </button>
                ) : (
                  <div className="flex aspect-[4/3] w-full flex-none items-center justify-center bg-gray-100 dark:bg-slate-800 sm:aspect-[16/8]">
                    <Award className="h-9 w-9 text-primary sm:h-12 sm:w-12" aria-hidden="true" />
                  </div>
                )}

                <div className="min-w-0 flex flex-1 flex-col p-4 sm:p-5">
                  <div className="mb-3 flex flex-col gap-1 text-xs font-bold uppercase text-primary sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                    <span>{getText(certification.category) || t("certifications.general")}</span>
                    <span className="text-gray-500 dark:text-gray-400">{certification.date}</span>
                  </div>
                  <h3 className="text-lg font-bold leading-snug text-dark dark:text-white">{title}</h3>
                  <p className="mt-2 text-sm font-semibold text-gray-600 dark:text-gray-300">
                    {getText(certification.issuer)}
                  </p>
                  {summary && (
                    <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-400">{summary}</p>
                  )}

                  {certification.link && (
                    <a
                      href={certification.link}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-bold text-primary hover:text-blue-700 focus:outline-none focus-visible:underline dark:hover:text-blue-300"
                    >
                      {t("certifications.verify")}
                      <ExternalLink className="h-4 w-4" aria-hidden="true" />
                    </a>
                  )}
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>

      <ImageDialog image={selectedImage} onClose={() => setSelectedImage(null)} />
    </section>
  );
};

export default Certifications;
