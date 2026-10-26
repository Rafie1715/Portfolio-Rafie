import { lazy, Suspense, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  ArrowUpRight,
  BrainCircuit,
  ChartLine,
  Database,
  MonitorSmartphone,
  Smartphone,
  Wrench,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import TechnologyLabel from './TechnologyLabel';
import { useProjects } from '../hooks/useProjects';
import { projectPath } from '../utils/projectRoutes';
import { projectsForSkill, skillSources, skillUsage } from '../utils/skillEvidence';

const CategoryOrbit3D = lazy(() => import('./CategoryOrbit3D'));

const supportsWebGL = () => {
  try {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!context) return false;
    context.getExtension('WEBGL_lose_context')?.loseContext();
    return true;
  } catch {
    return false;
  }
};

const categories = [
  { key: 'mobile', Icon: Smartphone, accent: '#3b82f6', columns: 'md:col-span-6 lg:col-span-7',
    skills: ['Kotlin', 'XML layouts', 'Jetpack Compose', 'Android Studio', 'Retrofit', 'MVVM', 'Coroutines', 'Paging 3', 'Material Design'] },
  { key: 'frontend', Icon: MonitorSmartphone, accent: '#06b6d4', columns: 'md:col-span-6 lg:col-span-5',
    skills: ['React.js', 'JavaScript', 'Tailwind CSS', 'Bootstrap'], learning: ['Next.js'] },
  { key: 'ai', Icon: BrainCircuit, accent: '#10b981', columns: 'md:col-span-6',
    skills: ['Python', 'Machine Learning', 'Scikit-Learn', 'Prompt Engineering', 'Generative AI'] },
  { key: 'analytics', Icon: ChartLine, accent: '#0891b2', columns: 'md:col-span-6',
    skills: ['Pandas', 'NumPy', 'Matplotlib', 'Data Cleaning', 'Exploratory Data Analysis (EDA)', 'Data Visualization'] },
  { key: 'backend', Icon: Database, accent: '#f59e0b', columns: 'md:col-span-6', initial: 'Firebase',
    skills: ['Node.js', 'Express.js', 'REST API', 'MySQL', 'Firebase'], learning: ['MongoDB', 'PostgreSQL'] },
  { key: 'tools', Icon: Wrench, accent: '#a78bfa', columns: 'md:col-span-6', initial: 'Figma',
    skills: ['Git', 'GitHub', 'Postman', 'VS Code', 'Google Colab', 'Figma'] },
];

function SkillCard({ category, index, catalog, reduceMotion }) {
  const { t, i18n } = useTranslation();
  const [selected, setSelected] = useState(category.initial || category.skills[0]);
  const language = i18n.resolvedLanguage?.startsWith('id') ? 'id' : 'en';
  const related = projectsForSkill(catalog.projects, selected);
  const sources = skillSources[selected] || [];
  const usage = skillUsage[selected];
  const primary = category.key === 'mobile';
  const panelId = `skill-evidence-${category.key}`;

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className={`min-w-0 ${category.columns}`}
    >
      <article
        data-skill-category={category.key}
        style={{ '--skill-accent': category.accent }}
        className={`skill-category flex min-w-0 flex-col rounded-2xl border bg-white p-5 dark:bg-slate-900/70 sm:p-6 ${
          primary ? 'border-blue-300 dark:border-blue-500/50' : 'border-slate-200 dark:border-slate-700'
        }`}
      >
        <div className="mb-5 flex items-center justify-between gap-3">
          <span className="skill-category-icon flex size-11 items-center justify-center rounded-xl">
            <category.Icon className="size-5" aria-hidden="true" />
          </span>
          {primary && (
            <span className="text-xs font-bold uppercase tracking-wide text-blue-700 dark:text-blue-300">
              {t('skills.primary_focus')}
            </span>
          )}
        </div>
        <h3 className={`${primary ? 'text-2xl sm:text-3xl' : 'text-xl'} font-bold text-slate-950 dark:text-white`}>
          {t(`skills.categories.${category.key}.title`)}
        </h3>
        <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-400">
          {t(`skills.categories.${category.key}.desc`)}
        </p>

        <div
          className="my-5 flex flex-wrap gap-2"
          role="group"
          aria-label={t(`skills.categories.${category.key}.title`)}
        >
          {category.skills.map((name, skillIndex) => (
            <button
              key={name}
              type="button"
              aria-pressed={selected === name}
              aria-controls={panelId}
              onClick={() => setSelected(name)}
              className={`skill-choice inline-flex min-h-11 max-w-full items-center rounded-lg border px-3 py-2 text-left text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 ${
                selected === name
                  ? 'border-blue-400 bg-blue-50 font-semibold text-slate-950 dark:border-blue-400 dark:bg-blue-950/60 dark:text-white'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-400 dark:border-slate-700 dark:bg-slate-950/40 dark:text-slate-200 dark:hover:border-slate-500'
              } ${skillIndex === 0 ? 'font-semibold' : ''}`}
            >
              <TechnologyLabel technology={name} />
            </button>
          ))}
        </div>

        {category.learning && (
          <div className="mb-5 text-xs leading-5 text-slate-500 dark:text-slate-400">
            <p className="mb-2">{t('common.learning')}</p>
            <ul className="flex flex-wrap gap-x-4 gap-y-2 text-slate-700 dark:text-slate-300">
              {category.learning.map((name) => (
                <li key={name}>
                  <TechnologyLabel technology={name} />
                </li>
              ))}
            </ul>
          </div>
        )}

        <div
          id={panelId}
          className="mt-auto border-t border-slate-200 pt-4 dark:border-slate-700"
          aria-live="polite"
          aria-atomic="true"
          aria-busy={catalog.loading}
        >
          <motion.div
            key={selected}
            initial={reduceMotion ? false : { opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18 }}
          >
            <p className="mb-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              {t('skills.evidence_for', { technology: selected })}
            </p>
            {usage && (
              <p className="mb-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                {t(`skills.usage.${usage}`)}
              </p>
            )}
            {related.slice(0, 3).map((project) => (
              <Link
                key={project.id}
                to={projectPath(project)}
                className="group flex min-h-11 items-center justify-between gap-3 rounded-md py-2 text-sm font-medium text-blue-700 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 dark:text-blue-300"
              >
                <span>
                  {typeof project.title === 'string'
                    ? project.title
                    : project.title?.[language] || project.title?.en || project.title?.id}
                </span>
                <ArrowRight
                  className="size-4 shrink-0 motion-safe:transition-transform motion-safe:group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
            ))}
            {sources.map((source) => (
              <a
                key={source.href}
                href={source.href}
                target="_blank"
                rel="noreferrer"
                className="flex min-h-11 items-center justify-between gap-3 rounded-md py-2 text-sm font-medium text-blue-700 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 dark:text-blue-300"
              >
                <span>{source.label}</span>
                <ArrowUpRight className="size-4 shrink-0" aria-hidden="true" />
              </a>
            ))}
            {catalog.loading && (
              <p className="py-2 text-sm text-slate-500 dark:text-slate-400">{t('skills.loading')}</p>
            )}
            {catalog.error && (
              <button
                type="button"
                onClick={catalog.retry}
                className="min-h-11 py-2 text-left text-sm font-medium text-blue-700 underline dark:text-blue-300"
              >
                {t('skills.retry')}
              </button>
            )}
            {!catalog.loading && !catalog.error && !related.length && !sources.length && !usage && (
              <p className="py-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                {t('skills.no_evidence')}
              </p>
            )}
          </motion.div>
        </div>
      </article>
    </motion.div>
  );
}

// Side inspector panel in 3D Category Orbit view
function SkillEvidenceInspector({
  selectedSkill,
  category,
  catalog,
  language,
  onSelectSkill,
  onSwitchToGrid,
  t,
}) {
  const related = projectsForSkill(catalog.projects, selectedSkill);
  const sources = skillSources[selectedSkill] || [];
  const usage = skillUsage[selectedSkill];

  return (
    <div
      className="flex h-full flex-col justify-between rounded-2xl border-2 bg-white p-5 shadow-sm transition-all duration-300 dark:bg-slate-900/80 sm:p-6"
      style={{ borderColor: category.accent }}
      aria-live="polite"
    >
      <div>
        {/* Category Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span
              className="flex size-10 items-center justify-center rounded-xl"
              style={{
                backgroundColor: `${category.accent}18`,
                color: category.accent,
              }}
            >
              <category.Icon className="size-5" aria-hidden="true" />
            </span>
            <span
              className="rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider"
              style={{
                backgroundColor: `${category.accent}15`,
                color: category.accent,
              }}
            >
              {t(`skills.categories.${category.key}.title`)}
            </span>
          </div>

          <button
            type="button"
            onClick={onSwitchToGrid}
            className="text-xs font-semibold text-slate-500 hover:text-blue-600 hover:underline dark:text-slate-400 dark:hover:text-blue-400"
          >
            {t('skills.switch_to_cards')}
          </button>
        </div>

        {/* Selected Skill Title */}
        <div className="mt-5 border-b border-slate-100 pb-4 dark:border-slate-800">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {t('skills.selected_skill')}
          </p>
          <h3 className="mt-1 flex items-center gap-3 text-2xl font-black text-slate-950 dark:text-white sm:text-3xl">
            <TechnologyLabel technology={selectedSkill} />
          </h3>
        </div>

        {/* Evidence Content */}
        <div className="mt-4 space-y-4">
          {usage && (
            <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
              {t(`skills.usage.${usage}`)}
            </p>
          )}

          {/* Related Projects */}
          {related.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {t('skills.projects_using', { technology: selectedSkill })}
              </p>
              <div className="space-y-2">
                {related.map((project) => (
                  <Link
                    key={project.id}
                    to={projectPath(project)}
                    className="group flex min-h-11 items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50/70 px-3 py-2 text-sm font-semibold text-blue-700 transition hover:border-blue-400 hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-800/60 dark:text-blue-300 dark:hover:border-blue-500 dark:hover:bg-blue-950/40"
                  >
                    <span className="truncate">
                      {typeof project.title === 'string'
                        ? project.title
                        : project.title?.[language] || project.title?.en || project.title?.id}
                    </span>
                    <ArrowRight
                      className="size-4 shrink-0 motion-safe:transition-transform motion-safe:group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Verified Source / Credential links */}
          {sources.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {t('skills.external_proof')}
              </p>
              <div className="space-y-2">
                {sources.map((source) => (
                  <a
                    key={source.href}
                    href={source.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex min-h-11 items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50/70 px-3 py-2 text-sm font-semibold text-blue-700 transition hover:border-blue-400 hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-800/60 dark:text-blue-300 dark:hover:border-blue-500 dark:hover:bg-blue-950/40"
                  >
                    <span className="truncate">{source.label}</span>
                    <ArrowUpRight className="size-4 shrink-0" aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {catalog.loading && (
            <p className="py-2 text-sm text-slate-500 dark:text-slate-400">{t('skills.loading')}</p>
          )}

          {!catalog.loading && !related.length && !sources.length && !usage && (
            <p className="rounded-lg border border-dashed border-slate-200 p-3 text-sm leading-6 text-slate-500 dark:border-slate-700 dark:text-slate-400">
              {t('skills.no_evidence')}
            </p>
          )}
        </div>
      </div>

      {/* Sibling skills in this category */}
      <div className="mt-6 border-t border-slate-100 pt-4 dark:border-slate-800">
        <p className="mb-2.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
          {t(`skills.categories.${category.key}.title`)} ({category.skills.length})
        </p>
        <div className="flex flex-wrap gap-1.5">
          {category.skills.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => onSelectSkill(name)}
              className={`rounded-md px-2.5 py-1 text-xs transition-colors ${
                selectedSkill === name
                  ? 'bg-blue-600 font-bold text-white shadow-sm dark:bg-blue-500'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function CategoryOrbitSkeleton() {
  return (
    <div className="flex h-[380px] w-full animate-pulse flex-col items-center justify-center rounded-2xl border border-slate-200 bg-slate-900/90 sm:h-[440px] lg:h-[480px]">
      <div className="size-44 rounded-full border-4 border-dashed border-slate-700" />
      <div className="mt-4 h-4 w-36 rounded bg-slate-800" />
    </div>
  );
}

export default function Skills() {
  const { t, i18n } = useTranslation();
  const reduceMotion = useReducedMotion();
  const catalog = useProjects();
  const language = i18n.resolvedLanguage?.startsWith('id') ? 'id' : 'en';

  const [hasWebGL] = useState(() => typeof document !== 'undefined' && supportsWebGL());
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'orbit'
  const [activeCategoryKey, setActiveCategoryKey] = useState('mobile');
  const [selectedSkill, setSelectedSkill] = useState('Kotlin');

  const activeCategory = useMemo(() => {
    return categories.find((cat) => cat.key === activeCategoryKey) || categories[0];
  }, [activeCategoryKey]);

  // Orbit skills only for the selected category (typically 5 - 9 items)
  const categorySkills = useMemo(() => {
    const base = activeCategory.skills.map((name) => ({
      name,
      category: activeCategory.key,
      categoryLabel: t(`skills.categories.${activeCategory.key}.title`),
      accent: activeCategory.accent,
      learning: false,
    }));
    const learn = (activeCategory.learning || []).map((name) => ({
      name,
      category: activeCategory.key,
      categoryLabel: t(`skills.categories.${activeCategory.key}.title`),
      accent: activeCategory.accent,
      learning: true,
    }));
    return [...base, ...learn];
  }, [activeCategory, t]);

  const handleSelectCategory = (catKey) => {
    setActiveCategoryKey(catKey);
    const cat = categories.find((c) => c.key === catKey);
    if (cat && !cat.skills.includes(selectedSkill)) {
      setSelectedSkill(cat.skills[0]);
    }
  };

  const handleSelectSkill = (skillName) => {
    if (!skillName) return;
    setSelectedSkill(skillName);
    const foundCat = categories.find(
      (c) => c.skills.includes(skillName) || (c.learning && c.learning.includes(skillName))
    );
    if (foundCat && foundCat.key !== activeCategoryKey) {
      setActiveCategoryKey(foundCat.key);
    }
  };

  return (
    <section id="skills" aria-labelledby="skills-title" className="scroll-mt-24 bg-gray-50 py-16 dark:bg-slate-950 sm:py-20">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        {/* Section Header + View Switcher */}
        <div className="mb-8 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <p className="mb-3 text-sm font-bold uppercase text-primary">{t('skills.eyebrow')}</p>
            <h2 id="skills-title" className="text-3xl font-bold text-dark dark:text-white sm:text-4xl">
              {t('skills.title')}
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-400">
              {t('skills.description')}
            </p>
          </motion.div>

          {/* Hybrid View Mode Switcher (Clean, no emoji) */}
          {hasWebGL && (
            <div
              role="group"
              aria-label="Skill layout view switch"
              className="inline-flex shrink-0 items-center rounded-full border border-slate-200 bg-white/90 p-1 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/90"
            >
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                aria-pressed={viewMode === 'grid'}
                className={`rounded-full px-4 py-2 text-xs font-bold tracking-wide transition-all ${
                  viewMode === 'grid'
                    ? 'bg-blue-600 text-white shadow-sm dark:bg-blue-500'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                {t('skills.view_grid')}
              </button>
              <button
                type="button"
                onClick={() => setViewMode('orbit')}
                aria-pressed={viewMode === 'orbit'}
                className={`rounded-full px-4 py-2 text-xs font-bold tracking-wide transition-all ${
                  viewMode === 'orbit'
                    ? 'bg-blue-600 text-white shadow-sm dark:bg-blue-500'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                {t('skills.view_orbit')}
              </button>
            </div>
          )}
        </div>

        {/* View Mode 1: 3D Category Orbit */}
        {viewMode === 'orbit' && hasWebGL ? (
          <div className="space-y-6">
            {/* Category Switcher Tabs */}
            <div
              className="flex flex-wrap items-center gap-2"
              role="tablist"
              aria-label="Skill category switcher"
            >
              {categories.map((cat) => {
                const isCatActive = activeCategoryKey === cat.key;
                const totalInCat = cat.skills.length + (cat.learning ? cat.learning.length : 0);
                return (
                  <button
                    key={cat.key}
                    type="button"
                    role="tab"
                    aria-selected={isCatActive}
                    onClick={() => handleSelectCategory(cat.key)}
                    style={{
                      borderColor: isCatActive ? cat.accent : undefined,
                      color: isCatActive ? cat.accent : undefined,
                    }}
                    className={`inline-flex min-h-10 items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
                      isCatActive
                        ? 'bg-slate-50 font-bold shadow-sm dark:bg-slate-900/90'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <cat.Icon className="size-3.5" aria-hidden="true" />
                    <span>{t(`skills.categories.${cat.key}.title`)}</span>
                    <span className="rounded-full bg-slate-200/70 px-1.5 py-0.5 text-[10px] text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      {totalInCat}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* 3D Category Orbit Canvas & Evidence Inspector */}
            <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
              <div className="lg:col-span-7 xl:col-span-8">
                <Suspense fallback={<CategoryOrbitSkeleton />}>
                  <CategoryOrbit3D
                    category={activeCategory}
                    skills={categorySkills}
                    selectedSkill={selectedSkill}
                    onSelectSkill={handleSelectSkill}
                    labels={{
                      view_orbit: t('skills.view_orbit'),
                      orbit_hint: t('skills.orbit_hint'),
                      orbit_touch_hint: t('skills.orbit_touch_hint'),
                      orbit_pause: t('skills.orbit_pause'),
                      orbit_play: t('skills.orbit_play'),
                      orbit_reset: t('skills.orbit_reset'),
                    }}
                  />
                </Suspense>
              </div>

              <div className="lg:col-span-5 xl:col-span-4">
                <SkillEvidenceInspector
                  selectedSkill={selectedSkill}
                  category={activeCategory}
                  catalog={catalog}
                  language={language}
                  onSelectSkill={handleSelectSkill}
                  onSwitchToGrid={() => setViewMode('grid')}
                  t={t}
                />
              </div>
            </div>
          </div>
        ) : (
          /* View Mode 2: Standard Recruiter Card Grid */
          <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-12 sm:gap-5">
            {categories.map((category, index) => (
              <SkillCard
                key={category.key}
                category={category}
                index={index}
                catalog={catalog}
                reduceMotion={reduceMotion}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
