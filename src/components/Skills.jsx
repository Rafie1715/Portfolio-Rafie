import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, BrainCircuit, Database, MonitorSmartphone, Smartphone, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import TechnologyLabel from './TechnologyLabel';
import { useProjects } from '../hooks/useProjects';
import { projectPath } from '../utils/projectRoutes';
import { projectsForSkill, skillSources, skillUsage } from '../utils/skillEvidence';

const categories = [
  { key: 'mobile', Icon: Smartphone, accent: '#3b82f6', columns: 'md:col-span-6 lg:col-span-7',
    skills: ['Kotlin', 'XML layouts', 'Jetpack Compose', 'Android Studio', 'Retrofit', 'MVVM', 'Coroutines', 'Paging 3', 'Material Design'] },
  { key: 'frontend', Icon: MonitorSmartphone, accent: '#06b6d4', columns: 'md:col-span-6 lg:col-span-5',
    skills: ['React.js', 'JavaScript', 'Tailwind CSS', 'Bootstrap'], learning: 'Next.js' },
  { key: 'ai', Icon: BrainCircuit, accent: '#10b981', columns: 'md:col-span-6 lg:col-span-4',
    skills: ['Python', 'Machine Learning', 'Scikit-Learn', 'Prompt Engineering', 'Generative AI'] },
  { key: 'backend', Icon: Database, accent: '#f59e0b', columns: 'md:col-span-6 lg:col-span-4', initial: 'Firebase',
    skills: ['Node.js', 'Express.js', 'REST API', 'MySQL', 'Firebase'] },
  { key: 'tools', Icon: Wrench, accent: '#a78bfa', columns: 'md:col-span-12 lg:col-span-4', initial: 'Figma',
    skills: ['Git', 'GitHub', 'Postman', 'VS Code', 'Figma'] },
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
      <article data-skill-category={category.key} style={{ '--skill-accent': category.accent }}
        className={`skill-category flex min-w-0 flex-col rounded-2xl border bg-white p-5 dark:bg-slate-900/70 sm:p-6 ${primary ? 'border-blue-300 dark:border-blue-500/50' : 'border-slate-200 dark:border-slate-700'}`}>
        <div className="mb-5 flex items-center justify-between gap-3">
          <span className="skill-category-icon flex size-11 items-center justify-center rounded-xl">
            <category.Icon className="size-5" aria-hidden="true" />
          </span>
          {primary && <span className="text-xs font-bold uppercase tracking-wide text-blue-700 dark:text-blue-300">{t('skills.primary_focus')}</span>}
        </div>
        <h3 className={`${primary ? 'text-2xl sm:text-3xl' : 'text-xl'} font-bold text-slate-950 dark:text-white`}>
          {t(`skills.categories.${category.key}.title`)}
        </h3>
        <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-400">{t(`skills.categories.${category.key}.desc`)}</p>

        <div className="my-5 flex flex-wrap gap-2" role="group" aria-label={t(`skills.categories.${category.key}.title`)}>
          {category.skills.map((name, skillIndex) => (
            <button key={name} type="button" aria-pressed={selected === name} aria-controls={panelId}
              onClick={() => setSelected(name)}
              className={`skill-choice inline-flex min-h-11 max-w-full items-center rounded-lg border px-3 py-2 text-left text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 ${selected === name ? 'border-blue-400 bg-blue-50 font-semibold text-slate-950 dark:border-blue-400 dark:bg-blue-950/60 dark:text-white' : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-400 dark:border-slate-700 dark:bg-slate-950/40 dark:text-slate-200 dark:hover:border-slate-500'} ${skillIndex === 0 ? 'font-semibold' : ''}`}>
              <TechnologyLabel technology={name} />
            </button>
          ))}
        </div>

        {category.learning && <p className="mb-5 text-xs leading-5 text-slate-500 dark:text-slate-400">{t('common.learning')}: <span className="font-semibold text-slate-700 dark:text-slate-300">{category.learning}</span></p>}

        <div id={panelId} className="mt-auto border-t border-slate-200 pt-4 dark:border-slate-700" aria-live="polite" aria-atomic="true" aria-busy={catalog.loading}>
          <motion.div key={selected} initial={reduceMotion ? false : { opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18 }}>
            <p className="mb-2 text-xs font-semibold text-slate-500 dark:text-slate-400">{t('skills.evidence_for', { technology: selected })}</p>
            {usage && <p className="mb-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{t(`skills.usage.${usage}`)}</p>}
            {related.slice(0, 3).map(project => (
              <Link key={project.id} to={projectPath(project)} className="group flex min-h-11 items-center justify-between gap-3 rounded-md py-2 text-sm font-medium text-blue-700 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 dark:text-blue-300">
                <span>{typeof project.title === 'string' ? project.title : project.title?.[language] || project.title?.en || project.title?.id}</span>
                <ArrowRight className="size-4 shrink-0 motion-safe:transition-transform motion-safe:group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            ))}
            {sources.map(source => <a key={source.href} href={source.href} target="_blank" rel="noreferrer" className="flex min-h-11 items-center justify-between gap-3 rounded-md py-2 text-sm font-medium text-blue-700 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 dark:text-blue-300">
              <span>{source.label}</span><ArrowUpRight className="size-4 shrink-0" aria-hidden="true" />
            </a>)}
            {catalog.loading && <p className="py-2 text-sm text-slate-500 dark:text-slate-400">{t('skills.loading')}</p>}
            {catalog.error && <button type="button" onClick={catalog.retry} className="min-h-11 py-2 text-left text-sm font-medium text-blue-700 underline dark:text-blue-300">{t('skills.retry')}</button>}
            {!catalog.loading && !catalog.error && !related.length && !sources.length && !usage && <p className="py-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{t('skills.no_evidence')}</p>}
          </motion.div>
        </div>
      </article>
    </motion.div>
  );
}

export default function Skills() {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const catalog = useProjects();
  return (
    <section id="skills" aria-labelledby="skills-title" className="scroll-mt-24 bg-gray-50 py-16 dark:bg-slate-950 sm:py-20">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div initial={reduceMotion ? false : { opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8 max-w-2xl">
          <p className="mb-3 text-sm font-bold uppercase text-primary">{t('skills.eyebrow')}</p>
          <h2 id="skills-title" className="text-3xl font-bold text-dark dark:text-white sm:text-4xl">{t('skills.title')}</h2>
          <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-400">{t('skills.description')}</p>
        </motion.div>
        <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-12 sm:gap-5">
          {categories.map((category, index) => <SkillCard key={category.key} category={category} index={index} catalog={catalog} reduceMotion={reduceMotion} />)}
        </div>
      </div>
    </section>
  );
}
