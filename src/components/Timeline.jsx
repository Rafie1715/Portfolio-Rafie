import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import {
  BriefcaseBusiness,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Maximize2,
  Pause,
  Play,
  Presentation,
  Smartphone,
  X,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { experiences } from "../data/experience";
import JourneyMilestone from "./JourneyMilestone";

const iconMap = {
  mobile: Smartphone,
  teaching: Presentation,
  organization: BriefcaseBusiness,
};

const ExperienceDocShowcase = ({
  docs,
  title,
  cardIndex,
  reduceMotion,
  onOpenFullscreen,
  t,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isManualPaused, setIsManualPaused] = useState(false);
  const [isInView, setIsInView] = useState(
    () => typeof window === "undefined" || typeof IntersectionObserver === "undefined"
  );
  const [hasStartedOffset, setHasStartedOffset] = useState(false);

  const containerRef = useRef(null);
  const stripRef = useRef(null);
  const thumbRefs = useRef([]);

  const total = docs.length;
  // Staggered duration per card so multiple cards never flip in lockstep
  const durationMs = 3600 + (cardIndex % 3) * 550;
  const initialDelayMs = (cardIndex % 4) * 650;

  // Track viewport visibility so offscreen carousels pause automatically
  useEffect(() => {
    const node = containerRef.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.25 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // Apply staggered initial offset once when first entering viewport
  useEffect(() => {
    if (!isInView || hasStartedOffset || reduceMotion) return undefined;
    const timer = window.setTimeout(() => {
      setHasStartedOffset(true);
    }, initialDelayMs);
    return () => window.clearTimeout(timer);
  }, [isInView, hasStartedOffset, initialDelayMs, reduceMotion]);

  const isPlaying =
    total > 1 &&
    isInView &&
    hasStartedOffset &&
    !isHovered &&
    !isManualPaused &&
    !reduceMotion;

  // Auto-advance timer
  useEffect(() => {
    if (!isPlaying) return undefined;

    const timer = window.setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % total);
    }, durationMs);

    return () => window.clearTimeout(timer);
  }, [isPlaying, activeIndex, total, durationMs]);

  // Keep active thumbnail centered horizontally inside the filmstrip without scrolling the page
  useEffect(() => {
    const strip = stripRef.current;
    const activeThumb = thumbRefs.current[activeIndex];
    if (!strip || !activeThumb) return;

    const targetLeft =
      activeThumb.offsetLeft -
      strip.clientWidth / 2 +
      activeThumb.clientWidth / 2;

    strip.scrollTo({
      left: Math.max(0, targetLeft),
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }, [activeIndex, reduceMotion]);

  const goPrev = (event) => {
    event.stopPropagation();
    setActiveIndex((prev) => (prev - 1 + total) % total);
  };

  const goNext = (event) => {
    event.stopPropagation();
    setActiveIndex((prev) => (prev + 1) % total);
  };

  const currentSrc = docs[activeIndex];

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocusCapture={() => setIsHovered(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsHovered(false);
        }
      }}
      className="timeline-document group/stage flex flex-col overflow-hidden rounded-xl border border-gray-200/90 bg-gray-50 shadow-sm transition-colors hover:border-primary/60 dark:border-slate-700/90 dark:bg-slate-900"
    >
      {/* Main Large Auto-Carousel Stage */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-950">
        {/* Layer 1: Ambient Blurred Backdrop to eliminate harsh bars on any aspect ratio */}
        <img
          src={currentSrc}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          className="pointer-events-none absolute inset-0 h-full w-full scale-110 object-cover opacity-50 blur-xl transition-all duration-500 dark:opacity-40"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/65 via-slate-950/20 to-slate-950/50"
        />

        {/* Layer 2: Crisp Foreground Documentation Photo */}
        <button
          type="button"
          onClick={() => onOpenFullscreen(activeIndex)}
          aria-label={t("experience.open_docs", { title })}
          className="relative z-10 flex h-full w-full cursor-zoom-in items-center justify-center p-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary sm:p-2.5"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.img
              key={currentSrc}
              src={currentSrc}
              alt={t("experience.photo_alt", {
                title,
                current: activeIndex + 1,
                total,
              })}
              loading="lazy"
              decoding="async"
              initial={reduceMotion ? false : { opacity: 0, scale: 0.985 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0, scale: 1.015 }}
              transition={{ duration: reduceMotion ? 0 : 0.28, ease: "easeOut" }}
              className="timeline-document-image max-h-full max-w-full rounded-md object-contain shadow-lg"
            />
          </AnimatePresence>
        </button>

        {/* Top-Left Live Counter & Auto-Play Status Pill */}
        <div className="pointer-events-none absolute left-3 top-3 z-20 flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-950/75 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-md">
            <ImageIcon className="h-3.5 w-3.5 text-blue-400" aria-hidden="true" />
            <span>
              {activeIndex + 1} / {total}
            </span>
          </span>

          {total > 1 && (
            <span className="hidden items-center gap-1.5 rounded-full bg-slate-950/70 px-2.5 py-1 text-[11px] font-medium text-slate-200 backdrop-blur-md sm:inline-flex">
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  isPlaying
                    ? "animate-pulse bg-emerald-400"
                    : "bg-amber-400"
                }`}
              />
              <span>
                {isPlaying
                  ? t("experience.auto_playing")
                  : t("experience.paused")}
              </span>
            </span>
          )}
        </div>

        {/* Top-Right Controls: Play/Pause & Expand Fullscreen */}
        <div className="absolute right-3 top-3 z-20 flex items-center gap-1.5">
          {total > 1 && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                setIsManualPaused((prev) => !prev);
              }}
              aria-label={
                isManualPaused
                  ? t("experience.play_slideshow")
                  : t("experience.pause_slideshow")
              }
              title={
                isManualPaused
                  ? t("experience.play_slideshow")
                  : t("experience.pause_slideshow")
              }
              className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-950/75 text-white backdrop-blur-md transition hover:bg-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              {isManualPaused ? (
                <Play className="h-3.5 w-3.5" aria-hidden="true" />
              ) : (
                <Pause className="h-3.5 w-3.5" aria-hidden="true" />
              )}
            </button>
          )}

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onOpenFullscreen(activeIndex);
            }}
            aria-label={t("experience.open_docs", { title })}
            title={t("experience.expand_photo")}
            className="flex h-8 items-center gap-1.5 rounded-full bg-slate-950/75 px-2.5 text-xs font-semibold text-white backdrop-blur-md transition hover:bg-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <Maximize2 className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">{t("experience.expand_photo")}</span>
          </button>
        </div>

        {/* Prev / Next Navigation Arrows */}
        {total > 1 && (
          <>
            <button
              type="button"
              onClick={goPrev}
              aria-label={t("experience.previous_photo")}
              className="absolute left-2.5 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-slate-950/70 text-white opacity-85 backdrop-blur-md transition hover:bg-primary hover:opacity-100 focus:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:opacity-0 sm:group-hover/stage:opacity-100"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label={t("experience.next_photo")}
              className="absolute right-2.5 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-slate-950/70 text-white opacity-85 backdrop-blur-md transition hover:bg-primary hover:opacity-100 focus:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:opacity-0 sm:group-hover/stage:opacity-100"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </>
        )}

        {/* Bottom Animated Progress Bar */}
        {total > 1 && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-1 bg-white/15"
          >
            {isPlaying ? (
              <motion.div
                key={`progress-${activeIndex}`}
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{
                  duration: durationMs / 1000,
                  ease: "linear",
                }}
                className="h-full bg-primary"
              />
            ) : (
              <div className="h-full w-1/3 bg-amber-400/70" />
            )}
          </div>
        )}
      </div>

      {/* Bottom Interactive Filmstrip Thumbnail Bar */}
      <div className="flex flex-col gap-2 border-t border-gray-200/80 bg-white/90 p-2.5 dark:border-slate-700/80 dark:bg-slate-900/90">
        {total > 1 && (
          <div
            ref={stripRef}
            className="flex items-center gap-1.5 overflow-x-auto pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            role="tablist"
            aria-label={t("experience.gallery_label", { title })}
          >
            {docs.map((docSrc, docIdx) => {
              const isActive = docIdx === activeIndex;
              return (
                <button
                  key={docSrc}
                  ref={(el) => {
                    thumbRefs.current[docIdx] = el;
                  }}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={t("experience.select_photo", {
                    index: docIdx + 1,
                    total,
                  })}
                  onClick={() => setActiveIndex(docIdx)}
                  className={`relative h-11 w-16 flex-none overflow-hidden rounded-md border-2 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    isActive
                      ? "border-primary opacity-100 shadow-sm"
                      : "border-transparent opacity-55 hover:opacity-90"
                  }`}
                >
                  <img
                    src={docSrc}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                </button>
              );
            })}
          </div>
        )}

        <div className="flex items-center justify-between px-1 text-xs font-semibold text-gray-600 dark:text-gray-300">
          <span className="flex items-center gap-1.5">
            <ImageIcon className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            <span>{t("experience.docs")}</span>
            <span className="text-gray-400 dark:text-slate-500">•</span>
            <span>{t("experience.photo_count", { count: total })}</span>
          </span>
          <button
            type="button"
            onClick={() => onOpenFullscreen(activeIndex)}
            className="font-semibold text-primary hover:underline focus:outline-none focus-visible:underline"
          >
            {t("experience.view_docs")}
          </button>
        </div>
      </div>
    </div>
  );
};

const Timeline = () => {
  const { t, i18n } = useTranslation();
  const reduceMotion = useReducedMotion();
  const language = i18n.resolvedLanguage?.startsWith("id") ? "id" : "en";
  const [gallery, setGallery] = useState(null);

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
    <div data-experience-timeline className="relative mx-auto max-w-6xl px-4 sm:px-6">
      <div
        aria-hidden="true"
        className="absolute bottom-8 left-[39px] top-8 w-0.5 bg-gray-200 dark:bg-slate-700 sm:left-[51px]"
      />

      <div className="space-y-8">
        {experiences.map((experience, index) => {
          const Icon = iconMap[experience.icon] || BriefcaseBusiness;
          const descriptions = experience.description[language] || experience.description.en;
          const localizedTitle = localize(experience.title);

          return (
            <motion.article
              key={experience.id}
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: reduceMotion ? 0 : 0.32,
                delay: reduceMotion ? 0 : Math.min(index * 0.04, 0.12),
              }}
              className="relative flex items-start gap-4 sm:gap-6"
            >
              <JourneyMilestone className="z-10 h-12 w-12 shadow-sm sm:h-14 sm:w-14">
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
              </JourneyMilestone>

              <div className="min-w-0 flex-1 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-slate-700 dark:bg-slate-800/90 sm:p-6 lg:p-7">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center lg:gap-8">
                  {/* Left Column: Experience Details & Bullet Points */}
                  <div className="lg:col-span-6 xl:col-span-7">
                    <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-dark dark:text-white sm:text-xl">
                          {localizedTitle}
                        </h3>
                        <p className="mt-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
                          {experience.org}
                        </p>
                        {experience.type && (
                          <p className="mt-1 inline-block rounded-md bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                            {localize(experience.type)}
                          </p>
                        )}
                      </div>
                      <time className="flex-none rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary dark:bg-primary/20">
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

                  {/* Right Column: Large Auto-Playing Documentation Showcase */}
                  {experience.docs?.length > 0 && (
                    <div className="lg:col-span-6 xl:col-span-5">
                      <ExperienceDocShowcase
                        docs={experience.docs}
                        title={localizedTitle}
                        cardIndex={index}
                        reduceMotion={reduceMotion}
                        onOpenFullscreen={(photoIndex) =>
                          setGallery({
                            docs: experience.docs,
                            index: photoIndex,
                            title: localizedTitle,
                          })
                        }
                        t={t}
                      />
                    </div>
                  )}
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>

      {/* Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {gallery && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={t("experience.gallery_label", { title: gallery.title })}
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.18 }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/92 p-4 backdrop-blur-sm"
            onClick={() => setGallery(null)}
          >
            <div
              className="relative flex h-full w-full max-w-6xl flex-col items-center justify-center gap-4"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="relative flex min-h-0 flex-1 w-full items-center justify-center">
                <img
                  src={gallery.docs[gallery.index]}
                  alt={t("experience.photo_alt", {
                    title: gallery.title,
                    current: gallery.index + 1,
                    total: gallery.docs.length,
                  })}
                  className="max-h-[78vh] max-w-full rounded-lg object-contain shadow-2xl"
                />

                {gallery.docs.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => moveGallery(-1)}
                      aria-label={t("experience.previous_photo")}
                      className="absolute left-0 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md transition hover:bg-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:left-2"
                    >
                      <ChevronLeft className="h-6 w-6" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveGallery(1)}
                      aria-label={t("experience.next_photo")}
                      className="absolute right-0 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md transition hover:bg-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:right-2"
                    >
                      <ChevronRight className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </>
                )}
              </div>

              {/* Modal Bottom Bar: Counter + Thumbnail Strip */}
              <div className="flex w-full max-w-3xl flex-col items-center gap-2.5">
                <div className="flex items-center gap-3 rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold text-white backdrop-blur-md">
                  <span>{gallery.title}</span>
                  <span className="text-white/40">•</span>
                  <span>
                    {gallery.index + 1} / {gallery.docs.length}
                  </span>
                </div>

                {gallery.docs.length > 1 && (
                  <div className="flex max-w-full items-center gap-2 overflow-x-auto py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {gallery.docs.map((docSrc, idx) => (
                      <button
                        key={docSrc}
                        type="button"
                        onClick={() =>
                          setGallery((curr) => ({ ...curr, index: idx }))
                        }
                        className={`h-12 w-18 flex-none overflow-hidden rounded-md border-2 transition ${
                          idx === gallery.index
                            ? "border-primary opacity-100 scale-105"
                            : "border-transparent opacity-50 hover:opacity-85"
                        }`}
                      >
                        <img
                          src={docSrc}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => setGallery(null)}
                aria-label={t("experience.close_gallery")}
                className="absolute right-0 top-0 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md transition hover:bg-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Timeline;
