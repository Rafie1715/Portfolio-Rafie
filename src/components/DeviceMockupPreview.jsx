import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Maximize2, Globe, ChevronLeft, ChevronRight, Cpu, ArrowRight } from 'lucide-react';
import { caseStudyDetails } from '../data/caseStudyDetails';

const pickText = (value, lang) => {
  if (!value) return '';
  if (typeof value === 'object' && !Array.isArray(value)) {
    return value[lang] || value.en || value.id || '';
  }
  return String(value);
};

export default function DeviceMockupPreview({ project, onSelectImage, title }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage?.startsWith('id') ? 'id' : 'en';
  const shouldReduceMotion = useReducedMotion();
  const isMobile = project.category === 'mobile';
  const architectureFlows = project.architecture?.length
    ? project.architecture
    : caseStudyDetails[project.id]?.architecture || [];
  const hasArchitecture = architectureFlows.length > 0;

  // Combine hero image with gallery if available
  const allScreens = [
    project.image,
    ...(Array.isArray(project.gallery) ? project.gallery.filter((src) => src !== project.image) : []),
  ].filter(Boolean);

  const [activeScreenIndex, setActiveScreenIndex] = useState(0);
  const [previewMode, setPreviewMode] = useState(() => (project.conceptualCover && hasArchitecture ? 'blueprint' : 'device'));
  const currentImage = allScreens[activeScreenIndex] || project.image;

  const handleNext = () => {
    setActiveScreenIndex((prev) => (prev + 1) % allScreens.length);
  };

  const handlePrev = () => {
    setActiveScreenIndex((prev) => (prev - 1 + allScreens.length) % allScreens.length);
  };

  const renderModeSwitcher = () => {
    if (!hasArchitecture) return null;
    return (
      <div className="mb-4 flex items-center justify-center">
        <div
          role="group"
          aria-label={lang === 'id' ? 'Mode pratinjau proyek' : 'Project preview mode'}
          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-100/90 p-1 dark:border-slate-700/80 dark:bg-slate-900"
        >
          <button
            type="button"
            aria-pressed={previewMode === 'device'}
            onClick={() => setPreviewMode('device')}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
              previewMode === 'device'
                ? 'bg-white text-primary shadow-sm dark:bg-slate-800 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            {isMobile
              ? (lang === 'id' ? 'Mockup Perangkat' : 'Device Mockup')
              : (lang === 'id' ? 'Tampilan Antarmuka' : 'Interface View')}
          </button>
          <button
            type="button"
            aria-pressed={previewMode === 'blueprint'}
            onClick={() => setPreviewMode('blueprint')}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
              previewMode === 'blueprint'
                ? 'bg-white text-primary shadow-sm dark:bg-slate-800 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            {lang === 'id' ? 'Blueprint Sistem' : 'System Blueprint'}
          </button>
        </div>
      </div>
    );
  };

  if (previewMode === 'blueprint' && hasArchitecture) {
    return (
      <div className="my-8">
        {renderModeSwitcher()}
        <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-slate-950 p-5 text-white shadow-xl sm:p-7">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(56 189 248 / 0.35) 1px, transparent 0)',
              backgroundSize: '22px 22px',
            }}
          />
          <div className="relative z-10">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/90 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="flex size-8 items-center justify-center rounded-md bg-blue-500/15 text-cyan-300 ring-1 ring-cyan-400/30">
                  <Cpu size={16} aria-hidden="true" />
                </span>
                <div>
                  <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-cyan-300">
                    {lang === 'id' ? 'ARSITEKTUR & ALUR DATA SISTEM' : 'SYSTEM ARCHITECTURE & DATA FLOW'}
                  </p>
                  <p className="text-sm font-bold text-white">{title}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPreviewMode('device')}
                className="rounded-md border border-slate-700 bg-slate-900/90 px-3 py-1.5 text-xs font-semibold text-slate-300 transition hover:border-cyan-400/50 hover:text-white"
              >
                {lang === 'id' ? 'Lihat Layar Aplikasi' : 'View App Screen'}
              </button>
            </div>

            <div className="space-y-5">
              {architectureFlows.map((flow, flowIdx) => (
                <div key={flowIdx} className="rounded-lg border border-slate-800/90 bg-slate-900/75 p-4">
                  <p className="mb-3 font-mono text-xs font-semibold text-blue-300">
                    {pickText(flow.title, lang)}
                  </p>
                  <div className="grid gap-2.5 md:grid-cols-3">
                    {flow.nodes.map((node, nodeIdx) => (
                      <div key={nodeIdx} className="relative flex items-start gap-2.5 rounded-md border border-slate-700/80 bg-slate-950/80 p-3">
                        <span className="mt-0.5 rounded bg-cyan-500/15 px-1.5 py-0.5 font-mono text-[10px] font-bold text-cyan-300">
                          0{nodeIdx + 1}
                        </span>
                        <span className="text-xs leading-5 text-slate-200">{pickText(node, lang)}</span>
                        {nodeIdx < flow.nodes.length - 1 && (
                          <ArrowRight
                            size={13}
                            aria-hidden="true"
                            className="hidden shrink-0 self-center text-cyan-400/70 md:block"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                  {flow.note && (
                    <p className="mt-3 text-xs leading-5 text-slate-400">{pickText(flow.note, lang)}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="my-8 flex flex-col items-center">
        {renderModeSwitcher()}
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

              {/* System Architecture Pipeline Overlay for single-cover mobile projects */}
              {hasArchitecture && allScreens.length === 1 && (
                <div className="pointer-events-none absolute inset-x-2.5 bottom-14 z-10 rounded-xl border border-white/15 bg-slate-950/85 p-3 text-left text-white backdrop-blur-md">
                  <p className="font-mono text-[9px] font-bold uppercase tracking-wider text-cyan-300">
                    {pickText(architectureFlows[0].title, lang)}
                  </p>
                  <div className="mt-1.5 space-y-1">
                    {architectureFlows[0].nodes.slice(0, 3).map((node, idx) => (
                      <p key={idx} className="truncate text-[10px] text-slate-200">
                        <span className="mr-1.5 font-mono text-cyan-400">0{idx + 1}</span>
                        {pickText(node, lang)}
                      </p>
                    ))}
                  </div>
                </div>
              )}

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
      </div>
    );
  }

  // Web / Desktop / AI Browser Window Mockup
  return (
    <div className="mb-10">
      {renderModeSwitcher()}
      <figure className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50 shadow-md dark:border-slate-700 dark:bg-slate-900">
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
      </figure>
    </div>
  );
}


