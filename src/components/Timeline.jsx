import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";
import {
  BriefcaseBusiness,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Presentation,
  Smartphone,
  X,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { experiences } from "../data/experience";

const iconMap = {
  mobile: Smartphone,
  teaching: Presentation,
  organization: BriefcaseBusiness,
};

const Timeline = () => {
  const { t, i18n } = useTranslation();
  const reduceMotion = useReducedMotion();
  const language = i18n.resolvedLanguage?.startsWith("id") ? "id" : "en";
  const [gallery, setGallery] = useState(null);
  const timelineRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 75%", "end 35%"],
  });
  const timelineProgress = useSpring(scrollYProgress, {
    stiffness: 130,
    damping: 28,
    mass: 0.2,
  });

  const localize = (value) => {
    if (!value) return "";
    if (typeof value === "object" && !Array.isArray(value)) {
      return value[language] || value.en || "";
    }
    return value;
  };

  useEffect(() => {
    if (!gallery) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setGallery(null);
      if (event.key === "ArrowRight") {
        setGallery((current) => ({
          ...current,
          index: (current.index + 1) % current.docs.length,
        }));
      }
      if (event.key === "ArrowLeft") {
        setGallery((current) => ({
          ...current,
          index: (current.index - 1 + current.docs.length) % current.docs.length,
        }));
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [gallery]);

  const moveGallery = (direction) => {
    setGallery((current) => ({
      ...current,
      index: (current.index + direction + current.docs.length) % current.docs.length,
    }));
  };

  return (
    <div ref={timelineRef} className="relative mx-auto max-w-5xl px-4 sm:px-6">
      <div
        aria-hidden="true"
        className="absolute bottom-8 left-[35px] top-8 w-px overflow-hidden bg-gray-200 dark:bg-slate-700 sm:left-[43px]"
      >
        {!reduceMotion && (
          <motion.span
            data-timeline-progress
            className="absolute inset-0 origin-top bg-primary"
            style={{ scaleY: timelineProgress }}
          />
        )}
      </div>

      <div className="space-y-6">
        {experiences.map((experience, index) => {
          const Icon = iconMap[experience.icon] || BriefcaseBusiness;
          const descriptions = experience.description[language] || experience.description.en;

          return (
            <motion.article
              key={experience.id}
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.35, delay: index * 0.05 }}
              className="relative flex items-start gap-4 sm:gap-6"
            >
              <motion.div
                initial={reduceMotion ? false : { opacity: 0.7, scale: 0.88 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.7 }}
                transition={{ duration: 0.28, delay: index * 0.04, ease: "easeOut" }}
                className="relative z-10 flex h-12 w-12 flex-none items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:h-14 sm:w-14"
              >
                {experience.logo ? (
                  <img
                    src={experience.logo}
                    alt={`${experience.org} logo`}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-contain p-2"
                  />
                ) : (
                  <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
                )}
              </motion.div>

              <div className="min-w-0 flex-1 rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-6">
                <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_220px] lg:gap-7">
                  <div>
                    <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-dark dark:text-white sm:text-xl">
                          {localize(experience.title)}
                        </h3>
                        <p className="mt-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
                          {experience.org}
                        </p>
                        {experience.type && (
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {localize(experience.type)}
                          </p>
                        )}
                      </div>
                      <time className="flex-none text-sm font-semibold text-primary">
                        {localize(experience.date)}
                      </time>
                    </div>

                    <ul className="space-y-3">
                      {descriptions.map((description) => (
                        <li
                          key={description}
                          className="flex gap-3 text-sm leading-6 text-gray-600 dark:text-gray-300"
                        >
                          <span className="mt-2.5 h-1.5 w-1.5 flex-none rounded-full bg-primary" />
                          <span>{description}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {experience.docs?.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setGallery({
                        docs: experience.docs,
                        index: 0,
                        title: localize(experience.title),
                      })}
                      className="group mt-5 w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-50 text-left transition hover:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:border-slate-700 dark:bg-slate-900 lg:mt-0"
                      aria-label={t("experience.open_docs", { title: localize(experience.title) })}
                    >
                      <img
                        src={experience.docs[0]}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        className="aspect-video w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                      />
                      <span className="flex items-center justify-between gap-3 px-3 py-2.5 text-xs font-semibold text-gray-700 dark:text-gray-200">
                        <span className="flex items-center gap-2">
                          <ImageIcon className="h-4 w-4 text-primary" aria-hidden="true" />
                          {t("experience.view_docs")}
                        </span>
                        <span>{t("experience.photo_count", { count: experience.docs.length })}</span>
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>

      <AnimatePresence>
        {gallery && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={t("experience.gallery_label", { title: gallery.title })}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-4"
            onClick={() => setGallery(null)}
          >
            <div className="relative flex h-full w-full max-w-6xl items-center justify-center" onClick={(event) => event.stopPropagation()}>
              <img
                src={gallery.docs[gallery.index]}
                alt={t("experience.photo_alt", {
                  title: gallery.title,
                  current: gallery.index + 1,
                  total: gallery.docs.length,
                })}
                className="max-h-[88vh] max-w-full rounded-lg object-contain"
              />

              <button
                type="button"
                onClick={() => setGallery(null)}
                aria-label={t("experience.close_gallery")}
                className="absolute right-0 top-0 flex h-11 w-11 items-center justify-center rounded-md bg-black/70 text-white hover:bg-black focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>

              {gallery.docs.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => moveGallery(-1)}
                    aria-label={t("experience.previous_photo")}
                    className="absolute left-0 flex h-11 w-11 items-center justify-center rounded-md bg-black/70 text-white hover:bg-black focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    <ChevronLeft className="h-6 w-6" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveGallery(1)}
                    aria-label={t("experience.next_photo")}
                    className="absolute right-0 flex h-11 w-11 items-center justify-center rounded-md bg-black/70 text-white hover:bg-black focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    <ChevronRight className="h-6 w-6" aria-hidden="true" />
                  </button>
                  <span className="absolute bottom-0 rounded-md bg-black/70 px-3 py-2 text-sm font-semibold text-white">
                    {gallery.index + 1} / {gallery.docs.length}
                  </span>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Timeline;
