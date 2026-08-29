import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  ArrowUpRight,
  Boxes,
  CalendarClock,
  Code2,
  Database,
  GitBranch,
  Laptop,
  LayoutGrid,
  ListChecks,
  Maximize2,
  NotebookPen,
  PenTool,
  Rocket,
  Smartphone,
  Tablet,
  TestTube2,
  Wrench,
  X,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { setupItems } from '../data/setup';
import SEO from '../components/SEO';
import PageTransition from '../components/PageTransition';

const itemIconRenderers = {
  laptop: (props) => <Laptop {...props} />,
  tablet: (props) => <Tablet {...props} />,
  smartphone: (props) => <Smartphone {...props} />,
  code: (props) => <Code2 {...props} />,
  database: (props) => <Database {...props} />,
  'pen-tool': (props) => <PenTool {...props} />,
  notebook: (props) => <NotebookPen {...props} />,
  test: (props) => <TestTube2 {...props} />,
  'git-branch': (props) => <GitBranch {...props} />,
  fallback: (props) => <Boxes {...props} />,
};

const groupIconRenderers = {
  all: (props) => <LayoutGrid {...props} />,
  hardware: (props) => <Laptop {...props} />,
  development: (props) => <Code2 {...props} />,
  'design-productivity': (props) => <PenTool {...props} />,
  'testing-delivery': (props) => <TestTube2 {...props} />,
};

const groupVisualClasses = {
  hardware: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300',
  development: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-300',
  'design-productivity': 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
  'testing-delivery': 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
};

const ItemVisual = ({ item, modal = false }) => {
  if (item.image) {
    return (
      <div className={`relative w-full overflow-hidden bg-gray-100 dark:bg-slate-800 ${modal ? 'aspect-[16/10] rounded-lg' : 'aspect-[4/3] sm:aspect-[16/10]'}`}>
        <img
          src={item.image}
          alt={item.title}
          loading={modal ? 'eager' : 'lazy'}
          decoding="async"
          className="h-full w-full object-contain p-3 sm:p-4"
        />
      </div>
    );
  }

  const renderIcon = itemIconRenderers[item.icon] || itemIconRenderers.fallback;

  return (
    <div className={`relative flex w-full items-center justify-center overflow-hidden ${modal ? 'aspect-[16/10] rounded-lg' : 'aspect-[4/3] sm:aspect-[16/10]'} ${groupVisualClasses[item.group]}`}>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] bg-[size:28px_28px] opacity-[0.05]" />
      <span className={`relative flex items-center justify-center rounded-lg border border-current/15 bg-white/70 shadow-sm dark:bg-slate-900/50 ${modal ? 'h-24 w-24' : 'h-16 w-16 sm:h-20 sm:w-20'}`}>
        {renderIcon({ className: modal ? 'h-12 w-12' : 'h-8 w-8 sm:h-10 sm:w-10', 'aria-hidden': true })}
      </span>
    </div>
  );
};

const WorkspacePage = () => {
  const { t, i18n } = useTranslation();
  const shouldReduceMotion = useReducedMotion();
  const [selectedGroup, setSelectedGroup] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);
  const closeButtonRef = useRef(null);
  const modalRef = useRef(null);
  const lastTriggerRef = useRef(null);
  const languageKey = String(i18n.resolvedLanguage || i18n.language).startsWith('id') ? 'id' : 'en';

  const getText = (value) => {
    if (typeof value === 'string') return value;
    return value?.[languageKey] || value?.en || value?.id || '';
  };

  const groups = useMemo(() => [
    { id: 'all', label: t('workspace.groups.all') },
    { id: 'hardware', label: t('workspace.groups.hardware') },
    { id: 'development', label: t('workspace.groups.development') },
    { id: 'design-productivity', label: t('workspace.groups.design_productivity') },
    { id: 'testing-delivery', label: t('workspace.groups.testing_delivery') },
  ], [t]);

  const filteredItems = useMemo(
    () => selectedGroup === 'all'
      ? setupItems
      : setupItems.filter((item) => item.group === selectedGroup),
    [selectedGroup],
  );

  useEffect(() => {
    if (!selectedItem) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setSelectedItem(null);
        return;
      }

      if (event.key !== 'Tab') return;

      const focusableElements = modalRef.current?.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusableElements?.length) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.requestAnimationFrame(() => closeButtonRef.current?.focus());

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      window.requestAnimationFrame(() => lastTriggerRef.current?.focus());
    };
  }, [selectedItem]);

  const openItem = (item, trigger) => {
    lastTriggerRef.current = trigger;
    setSelectedItem(item);
  };

  const getLinkLabel = (item) => {
    if (item.linkType === 'product') return t('workspace.product_page');
    if (item.linkType === 'profile') return t('workspace.github_profile');
    return t('workspace.official_site');
  };

  const revealProps = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 16 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.15 },
        transition: { duration: 0.4, ease: 'easeOut' },
      };

  const workflowItems = [
    {
      key: 'plan',
      icon: <ListChecks className="h-5 w-5" aria-hidden="true" />,
      tools: 'Notion + Figma',
    },
    {
      key: 'build',
      icon: <Code2 className="h-5 w-5" aria-hidden="true" />,
      tools: 'VS Code + Android Studio + Firebase',
    },
    {
      key: 'validate',
      icon: <Rocket className="h-5 w-5" aria-hidden="true" />,
      tools: 'Postman + Physical Device + GitHub',
    },
  ];

  return (
    <PageTransition>
      <main className="relative min-h-screen overflow-hidden bg-white pb-16 pt-20 text-dark transition-colors duration-300 dark:bg-dark dark:text-white md:pb-20 md:pt-24">
        <SEO
          title={t('workspace.seo_title')}
          description={t('workspace.seo_desc')}
          url="https://rafierb.me/workspace"
          keywords="Developer Workspace, Android Development Tools, Front-End Workflow, Software Engineering Setup, Testing Tools"
          type="website"
        />

        <div className="pointer-events-none absolute inset-x-0 top-0 h-[32rem] opacity-60 dark:opacity-25">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        </div>

        <header className="relative z-10 mx-auto max-w-6xl px-4 pb-10 pt-10 sm:px-6 md:pb-14 md:pt-14 lg:px-8">
          <motion.div {...revealProps} className="max-w-3xl">
            <p className="mb-4 flex items-center gap-2 text-sm font-bold uppercase text-primary">
              <Wrench className="h-4 w-4" aria-hidden="true" />
              {t('workspace.eyebrow')}
            </p>
            <h1 className="text-4xl font-black leading-tight text-dark dark:text-white sm:text-5xl md:text-6xl">
              {t('workspace.title_prefix')}{' '}
              <span className="text-primary">{t('workspace.title_highlight')}</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-gray-600 dark:text-gray-300 md:text-lg">
              {t('workspace.subtitle')}
            </p>
            <p className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-gray-500 dark:text-gray-400">
              <CalendarClock className="h-4 w-4 text-primary" aria-hidden="true" />
              {t('workspace.updated')}
            </p>
          </motion.div>
        </header>

        <section className="relative z-10 border-y border-gray-200 bg-gray-50/80 py-12 dark:border-slate-700 dark:bg-slate-900/40 md:py-16" aria-labelledby="workspace-workflow-title">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <motion.div {...revealProps} className="max-w-2xl">
              <p className="text-sm font-bold uppercase text-primary">{t('workspace.workflow.eyebrow')}</p>
              <h2 id="workspace-workflow-title" className="mt-2 text-2xl font-black text-dark dark:text-white sm:text-3xl">
                {t('workspace.workflow.title')}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400 sm:text-base">
                {t('workspace.workflow.subtitle')}
              </p>
            </motion.div>

            <div className="mt-9 grid gap-7 md:grid-cols-3 md:gap-8">
              {workflowItems.map((item, index) => (
                <motion.article key={item.key} {...revealProps} className="border-t-2 border-gray-300 pt-5 dark:border-slate-600">
                  <div className="flex items-center justify-between gap-4">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-primary shadow-sm ring-1 ring-gray-200 dark:bg-slate-800 dark:ring-slate-700">
                      {item.icon}
                    </span>
                    <span className="text-sm font-black text-gray-300 dark:text-slate-600">0{index + 1}</span>
                  </div>
                  <h3 className="mt-5 text-lg font-black text-dark dark:text-white">
                    {t(`workspace.workflow.${item.key}.title`)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                    {t(`workspace.workflow.${item.key}.desc`)}
                  </p>
                  <p className="mt-3 text-xs font-bold uppercase text-gray-500 dark:text-gray-400">{item.tools}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section className="relative z-10 mx-auto max-w-6xl px-4 py-14 sm:px-6 md:py-20 lg:px-8" aria-labelledby="workspace-stack-title">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <motion.div {...revealProps} className="max-w-2xl">
              <p className="text-sm font-bold uppercase text-primary">{t('workspace.stack.eyebrow')}</p>
              <h2 id="workspace-stack-title" className="mt-2 text-3xl font-black text-dark dark:text-white sm:text-4xl">
                {t('workspace.stack.title')}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400 sm:text-base">
                {t('workspace.stack.subtitle')}
              </p>
            </motion.div>
            <p className="text-sm font-bold text-gray-500 dark:text-gray-400">
              {t('workspace.stack.count', { count: filteredItems.length })}
            </p>
          </div>

          <div className="-mx-4 mt-8 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden">
            <div
              className="flex min-w-max gap-2 sm:min-w-0 sm:flex-wrap"
              role="group"
              aria-label={t('workspace.stack.filter_label')}
            >
              {groups.map((group) => {
                const renderGroupIcon = groupIconRenderers[group.id];
                const isActive = selectedGroup === group.id;

                return (
                  <button
                    key={group.id}
                    type="button"
                    onClick={() => setSelectedGroup(group.id)}
                    aria-pressed={isActive}
                    className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30 ${
                      isActive
                        ? 'border-primary bg-primary text-white'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-primary hover:text-primary dark:border-slate-600 dark:bg-slate-900 dark:text-gray-300'
                    }`}
                  >
                    {renderGroupIcon({ className: 'h-4 w-4', 'aria-hidden': true })}
                    {group.label}
                  </button>
                );
              })}
            </div>
          </div>

          <motion.div layout={!shouldReduceMotion} className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence mode="popLayout" initial={false}>
              {filteredItems.map((item) => (
                <motion.article
                  key={item.id}
                  layout={!shouldReduceMotion}
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={shouldReduceMotion ? undefined : { opacity: 0, y: -8 }}
                  transition={{ duration: 0.24 }}
                  className="flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-slate-700 dark:bg-slate-900"
                >
                  <ItemVisual item={item} />

                  <div className="flex min-w-0 flex-col p-4 sm:flex-1 sm:p-5">
                    <p className="text-xs font-bold uppercase text-primary">{getText(item.category)}</p>
                    <h3 className="mt-1 text-lg font-black leading-tight text-dark dark:text-white sm:text-xl">
                      {item.title}
                    </h3>
                    <p className="mt-2 line-clamp-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400 sm:line-clamp-3">
                      {getText(item.desc)}
                    </p>

                    <div className="mt-4 hidden border-t border-gray-200 pt-4 text-sm leading-relaxed text-gray-600 dark:border-slate-700 dark:text-gray-400 sm:block">
                      <span className="font-bold text-dark dark:text-gray-200">{t('workspace.purpose')}:</span>{' '}
                      {getText(item.usage)}
                    </div>

                    <div className="mt-auto flex items-center justify-between gap-3 pt-4">
                      <button
                        type="button"
                        onClick={(event) => openItem(item, event.currentTarget)}
                        className="inline-flex min-h-10 min-w-0 items-center gap-2 rounded-lg text-sm font-bold text-primary hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-primary/30"
                        aria-label={t('workspace.open_details', { title: item.title })}
                      >
                        <Maximize2 className="h-4 w-4 flex-none" aria-hidden="true" />
                        <span className="truncate">{t('workspace.view_details')}</span>
                      </button>
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noreferrer"
                        className="flex h-10 w-10 flex-none items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-colors hover:border-primary hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-700 dark:text-gray-400"
                        aria-label={`${getLinkLabel(item)}: ${item.title}`}
                        title={getLinkLabel(item)}
                      >
                        <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                      </a>
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>
        </section>

        <AnimatePresence>
          {selectedItem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.18 }}
              className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto bg-slate-950/90 p-4 backdrop-blur-sm"
              role="dialog"
              aria-modal="true"
              aria-labelledby="workspace-dialog-title"
              aria-describedby="workspace-dialog-description"
              onMouseDown={(event) => {
                if (event.target === event.currentTarget) setSelectedItem(null);
              }}
            >
              <motion.div
                ref={modalRef}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 16, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={shouldReduceMotion ? undefined : { opacity: 0, y: 10, scale: 0.98 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
                className="relative my-auto w-full max-w-3xl overflow-hidden rounded-lg border border-white/10 bg-white shadow-2xl dark:bg-slate-900"
              >
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={() => setSelectedItem(null)}
                  className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-lg bg-slate-950/80 text-white transition-colors hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-white/70"
                  aria-label={t('workspace.close_preview')}
                  title={t('workspace.close_preview')}
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>

                <div className="grid md:grid-cols-[1fr_1.05fr]">
                  <ItemVisual item={selectedItem} modal />
                  <div className="p-6 sm:p-8">
                    <p className="text-xs font-bold uppercase text-primary">{getText(selectedItem.category)}</p>
                    <h2 id="workspace-dialog-title" className="mt-2 pr-10 text-2xl font-black text-dark dark:text-white sm:text-3xl">
                      {selectedItem.title}
                    </h2>
                    <p id="workspace-dialog-description" className="mt-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400 sm:text-base">
                      {getText(selectedItem.desc)}
                    </p>

                    <div className="mt-6 border-t border-gray-200 pt-5 dark:border-slate-700">
                      <h3 className="text-sm font-black text-dark dark:text-white">{t('workspace.purpose')}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                        {getText(selectedItem.usage)}
                      </p>
                    </div>

                    <a
                      href={selectedItem.link}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-7 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
                    >
                      {getLinkLabel(selectedItem)}
                      <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                    </a>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </PageTransition>
  );
};

export default WorkspacePage;
