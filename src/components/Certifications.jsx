import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Award, ExternalLink, Grid2X2, ListFilter, X } from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { useTranslation } from "react-i18next";
import { certifications } from "../data/certifications";
import { useFirebaseInit } from "../hooks/useFirebaseInit";

const normalizeTitle = (value) => {
  const title = typeof value === "object" ? value?.en || value?.id || "" : value || "";
  const normalized = String(title).trim().toLowerCase();

  if (normalized.includes("programming assistant") || normalized.includes("asisten program")) {
    return "bnsp-programming-assistant";
  }

  return normalized;
};

const mergeCertifications = (cmsItems) => {
  const merged = new Map();
  const localItems = certifications.map((item) => ({ ...item, id: `local-${item.id}`, source: "local" }));

  [...localItems, ...cmsItems].forEach((item) => {
    const key = normalizeTitle(item.title) || String(item.id);
    const current = merged.get(key);
    const preserveFeaturedCopy = Boolean(current?.featured);
    merged.set(key, current ? {
      ...current,
      ...item,
      title: preserveFeaturedCopy ? current.title : item.title,
      date: preserveFeaturedCopy ? current.date : item.date,
      img: item.img || current.img,
      link: item.link || current.link,
      featured: Boolean(current.featured || item.featured),
      summary: item.summary || current.summary,
    } : item);
  });

  return Array.from(merged.values());
};

const Certifications = () => {
  const { t, i18n } = useTranslation();
  const reduceMotion = useReducedMotion();
  const { dbFirestore } = useFirebaseInit("dbFirestore");
  const [certItems, setCertItems] = useState(() => mergeCertifications([]));
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
    if (!dbFirestore) return undefined;
    let cancelled = false;

    const fetchCertifications = async () => {
      try {
        const snapshot = await getDocs(collection(dbFirestore, "certifications"));
        const cmsItems = snapshot.docs
          .map((entry) => ({ id: `cms-${entry.id}`, ...entry.data(), source: "cms" }))
          .filter((item) => item.isPublished !== false)
          .sort((a, b) => {
            const leftOrder = typeof a.order === "number" ? a.order : Number.MAX_SAFE_INTEGER;
            const rightOrder = typeof b.order === "number" ? b.order : Number.MAX_SAFE_INTEGER;
            return leftOrder - rightOrder;
          });

        if (!cancelled) setCertItems(mergeCertifications(cmsItems));
      } catch (error) {
        console.error("Error fetching certifications from CMS:", error);
      }
    };

    fetchCertifications();
    return () => {
      cancelled = true;
    };
  }, [dbFirestore]);

  useEffect(() => {
    if (!selectedImage) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setSelectedImage(null);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedImage]);

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

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={selectedImage.alt}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative flex h-full w-full max-w-6xl items-center justify-center" onClick={(event) => event.stopPropagation()}>
              <img src={selectedImage.src} alt={selectedImage.alt} className="max-h-[88vh] max-w-full rounded-lg object-contain" />
              <button
                type="button"
                onClick={() => setSelectedImage(null)}
                aria-label={t("certifications.close_preview")}
                className="absolute right-0 top-0 flex h-11 w-11 items-center justify-center rounded-md bg-black/70 text-white hover:bg-black focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Certifications;
