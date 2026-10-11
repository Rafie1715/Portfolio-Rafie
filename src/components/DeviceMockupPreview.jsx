import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Maximize2, Smartphone, Globe, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';

export default function DeviceMockupPreview({ project, onSelectImage, title }) {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();
  const isMobile = project.category === 'mobile';

  // Combine hero image with gallery if available
  const allScreens = [
    project.image,
    ...(Array.isArray(project.gallery) ? project.gallery.filter((src) => src !== project.image) : []),
  ].filter(Boolean);

  const [activeScreenIndex, setActiveScreenIndex] = useState(0);
  const currentImage = allScreens[activeScreenIndex] || project.image;

  const handleNext = () => {
    setActiveScreenIndex((prev) => (prev + 1) % allScreens.length);
  };

  const handlePrev = () => {
    setActiveScreenIndex((prev) => (prev - 1 + allScreens.length) % allScreens.length);
  };

  if (isMobile) {
    return (
      <div className="my-8 flex flex-col items-center">
        {/* Smartphone Mockup Container */}
        <div className="relative mx-auto w-full max-w-[320px] sm:max-w-[340px]">
          {/* Phone Chassis */}
          <div className="relative overflow-hidden rounded-[2.8rem] border-[10px] border-slate-900 bg-slate-950 p-2 shadow-2xl shadow-slate-900/40 ring-1 ring-slate-800">
            {/* Dynamic Island / Notch */}
            <div className="absolute left-1/2 top-3 z-20 h-4 w-24 -translate-x-1/2 rounded-full bg-slate-900 flex items-center justify-end pr-2.5">
              <span className="size-2 rounded-full bg-slate-950 ring-1 ring-slate-800/80" />
            </div>

            {/* Speaker Ear Piece */}
            <div className="absolute left-1/2 top-1.5 z-20 h-1 w-10 -translate-x-1/2 rounded-full bg-slate-800/60" />

            {/* Inner Screen Display */}
            <div className="relative aspect-[9/19] w-full overflow-hidden rounded-[2.2rem] bg-slate-900">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImage}
                  src={currentImage}
                  alt={`${title} screenshot ${activeScreenIndex + 1}`}
                  initial={shouldReduceMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={shouldReduceMotion ? undefined : { opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="h-full w-full object-cover cursor-zoom-in"
                  onClick={() => onSelectImage({ src: currentImage, alt: `${title} screen ${activeScreenIndex + 1}` })}
                />
              </AnimatePresence>

              {/* Hover Zoom Overlay Icon */}
              <button
                type="button"
                onClick={() => onSelectImage({ src: currentImage, alt: `${title} screen ${activeScreenIndex + 1}` })}
                aria-label={t('common.preview')}
                title={t('common.preview')}
                className="absolute bottom-4 right-4 z-10 flex size-9 items-center justify-center rounded-full bg-slate-900/80 text-white backdrop-blur transition-transform hover:scale-110 active:scale-95 shadow-md"
              >
                <Maximize2 size={16} aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Interactive Screen Switcher Bar */}
          {allScreens.length > 1 && (
            <div className="mt-4 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous screen"
                className="flex size-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-colors hover:border-primary hover:text-primary dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
              >
                <ChevronLeft size={16} />
              </button>

              <div className="flex items-center gap-1.5 px-2">
                {allScreens.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveScreenIndex(idx)}
                    aria-label={`Go to screen ${idx + 1}`}
                    className={`h-2 transition-all rounded-full ${
                      idx === activeScreenIndex ? 'w-6 bg-primary' : 'w-2 bg-slate-300 dark:bg-slate-700'
                    }`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={handleNext}
                aria-label="Next screen"
                className="flex size-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-colors hover:border-primary hover:text-primary dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>

        {project.conceptualCover && (
          <p className="mt-3 text-center text-xs text-slate-500 dark:text-slate-400">
            {t('projectDetail.conceptual_cover')}
          </p>
        )}
      </div>
    );
  }

  // Web / Desktop / AI Browser Window Mockup
  return (
    <figure className="mb-10 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 shadow-md dark:border-slate-700 dark:bg-slate-900">
      {/* Browser Window Header */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-100/90 px-4 py-2.5 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <span className="size-3 rounded-full bg-red-400/80 dark:bg-red-500/80" />
          <span className="size-3 rounded-full bg-amber-400/80 dark:bg-amber-500/80" />
          <span className="size-3 rounded-full bg-emerald-400/80 dark:bg-emerald-500/80" />
        </div>

        {/* Address URL Pill */}
        <div className="flex max-w-[280px] sm:max-w-md flex-1 items-center justify-center mx-3 truncate rounded-md border border-slate-200 bg-white/90 px-3 py-1 text-[11px] font-mono text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
          <Globe size={12} className="mr-1.5 shrink-0 text-slate-400" />
          <span className="truncate">{project.live || project.github || `rafierb.me/project/${project.slug || project.id}`}</span>
        </div>

        <button
          type="button"
          onClick={() => onSelectImage({ src: project.image, alt: title })}
          aria-label={`${t('common.preview')}: ${title}`}
          title={t('common.preview')}
          className="flex size-7 items-center justify-center rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
        >
          <Maximize2 size={14} />
        </button>
      </div>

      {/* Screen Area */}
      <div className="relative">
        <button
          type="button"
          aria-label={`${t('common.preview')}: ${title}`}
          onClick={() => onSelectImage({ src: project.image, alt: title })}
          className="block w-full cursor-zoom-in group"
        >
          <img
            src={project.image}
            alt={title}
            decoding="async"
            fetchPriority="high"
            className="mx-auto max-h-[28rem] w-full object-contain transition-transform duration-300 group-hover:scale-[1.01]"
          />
        </button>
      </div>

      {project.conceptualCover && (
        <figcaption className="border-t border-slate-200 p-3 text-center text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400">
          {t('projectDetail.conceptual_cover')}
        </figcaption>
      )}
    </figure>
  );
}

