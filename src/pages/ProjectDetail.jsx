import { createElement, useState, lazy, Suspense } from 'react';
import { Link, Navigate, useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowUpRight, Github, ExternalLink } from 'lucide-react';
import { useProjects } from '../hooks/useProjects';
import { findProjectByRoute, projectPath, projectSlug } from '../utils/projectRoutes';
import ProjectCatalogStatus from '../components/ProjectCatalogStatus';
import ProjectEvidence from '../components/ProjectEvidence';
import ProjectArchitecture from '../components/ProjectArchitecture';
import ModelEvaluation from '../components/ModelEvaluation';
import DecisionReplay from '../components/DecisionReplay';
import ImageDialog from '../components/ImageDialog';
import PageTransition from '../components/PageTransition';
import Loading from '../components/Loading';
import SEO from '../components/SEO';
import NotFound from './NotFound';
const LikeButton = lazy(() => import('../components/LikeButton'));

export default function ProjectDetail() {
  const { id } = useParams();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const reduceMotion = useReducedMotion();
  const { projects, loading, error, retry } = useProjects();
  const [selectedImage, setSelectedImage] = useState(null);
  const [showLikes, setShowLikes] = useState(false);
  const project = findProjectByRoute(projects, id);
  if (loading) return <Loading />;
  if (error) return <main className="min-h-screen px-4 pt-28"><ProjectCatalogStatus error retry={retry} /></main>;
  if (!project) return <NotFound />;
  if (id !== projectSlug(project)) return <Navigate replace to={projectPath(project) + location.search + location.hash} />;

  const text = value => typeof value === 'string' ? value : value?.[i18n.resolvedLanguage] || value?.en || '';
  const title = text(project.title);
  const impact = project.impactDetails || {};
  const features = text(project.features);
  const replay = project.decisionReplay || {};
  const steps = [
    { key: 'problem', value: text(project.challenges) },
    { key: 'constraint', value: text(replay.constraint) },
    { key: 'options', value: text(replay.options) },
    { key: 'decision', value: text(replay.decision) || text(project.solution) },
    { key: 'tradeoff', value: text(replay.tradeoff) },
  ].filter(step => step.value);
  const facts = [
    [t('projectDetail.impact.role'), text(impact.role)],
    [t('projectDetail.impact.team'), text(impact.team)],
    [t(project.period ? 'common.project_period' : 'common.project_completed'), text(project.period) || project.year],
  ].filter(([, value]) => value);
  const links = [
    [project.github, t('projects.source_code'), Github],
    [project.live, t('projects.live_site'), ExternalLink],
    [project.figma, t('projects.design'), ArrowUpRight],
    [project.prototype, t('projects.prototype'), ArrowUpRight],
  ].filter(([href]) => href);
  const result = text(impact.result) || text(project.impact);
  const metricContext = text(project.evidence?.metricContext);
  const sectionTitle = 'mb-4 text-2xl font-bold text-dark dark:text-white';
  const bodyText = 'leading-7 text-slate-600 dark:text-slate-300';

  return <PageTransition>
    <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reduceMotion ? 0 : 0.2 }} className="min-h-screen bg-white px-4 pb-20 pt-24 text-dark dark:bg-dark dark:text-white">
      <SEO title={`${title} | Rafie Rojagat Portfolio`} description={text(project.shortDesc)} url={`https://rafierb.me${projectPath(project)}`} image={project.image} type="article" published={project.createdAt} modified={project.updatedAt} />
      <div className="mx-auto max-w-4xl">
        <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <Link to="/projects" className="inline-flex min-h-11 shrink-0 items-center gap-2 font-medium hover:text-primary"><ArrowLeft size={16} aria-hidden="true" />{t('navbar.projects')}</Link>
          <span aria-hidden="true">/</span><span className="min-w-0 truncate" aria-current="page">{title}</span>
        </nav>
        <header className="mb-8">
          <p className="mb-2 text-sm font-bold uppercase tracking-wide text-primary">{project.category} {t('projectDetail.category_label')}</p>
          <h1 className="max-w-3xl text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">{title}</h1>
          <p className={`mt-4 max-w-3xl text-lg ${bodyText}`}>{text(project.shortDesc)}</p>
          <div className="mt-5 flex flex-wrap gap-3">{links.map(([href, label, icon]) => <a key={label} href={href} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700 hover:border-primary dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-300">{createElement(icon, { size: 18, 'aria-hidden': true })}{label}</a>)}</div>
        </header>
        {facts.length > 0 && <section aria-label={t('projectDetail.impact.eyebrow')} className="mb-8 border-y border-slate-200 py-5 dark:border-slate-700">
          <h2 className="mb-4 text-xs font-bold uppercase tracking-wide text-primary">{t('projectDetail.impact.eyebrow')}</h2>
          <dl className="grid gap-5 sm:grid-cols-3">{facts.map(([label, value]) => <div key={label}><dt className="text-sm text-slate-500 dark:text-slate-400">{label}</dt><dd className="mt-1 font-semibold">{value}</dd></div>)}</dl>
        </section>}
        <ProjectEvidence project={project} showResults={false} />
        <figure className="mb-10 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
          <button type="button" aria-label={`${t('common.preview')}: ${title}`} onClick={() => setSelectedImage({ src: project.image, alt: title })} className="block w-full cursor-zoom-in">
            <img src={project.image} alt={title} decoding="async" fetchPriority="high" className="mx-auto max-h-[28rem] w-full object-contain" />
          </button>
          {project.conceptualCover && <figcaption className="border-t border-slate-200 p-4 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">{t('projectDetail.conceptual_cover')}</figcaption>}
        </figure>
        <section className="mb-8">
          <h2 className={sectionTitle}>{t('projectDetail.overview')}</h2>
          <p className={bodyText}>{text(project.fullDesc)}</p>
        </section>
        <ProjectArchitecture flows={project.architecture} />
        <section className="mb-10">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">{t('projectDetail.tech_used')}</h2>
          <ul className="flex flex-wrap gap-2">{(project.techStack || []).map(tech => <li key={tech.name} className="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700">{tech.name}</li>)}</ul>
        </section>
        {Array.isArray(features) && features.length > 0 && <section className="mb-10">
          <h2 className={sectionTitle}>{t('projectDetail.features')}</h2>
          <ul className="grid list-inside list-disc gap-3 text-slate-600 dark:text-slate-300 sm:grid-cols-2">{features.map(feature => <li key={feature} className="leading-7">{feature}</li>)}</ul>
        </section>}
        <DecisionReplay key={project.id} steps={steps} />
        {(result || metricContext) && <section className="mb-8">
          <h2 className={sectionTitle}>{t('common.project_results')}</h2>
          {result && <p className="font-semibold text-primary">{result}</p>}
          {metricContext && <p className={`mt-3 ${bodyText}`}>{metricContext}</p>}
        </section>}
        <ModelEvaluation evaluation={project.evaluation} />
        {project.lessonLearned && <section className="my-10 border-l-2 border-primary pl-5">
          <h2 className={sectionTitle}>{t('projectDetail.learned')}</h2>
          <p className={bodyText}>{text(project.lessonLearned)}</p>
        </section>}
        {project.gallery?.length > 0 && <section className="my-12">
          <h2 className={sectionTitle}>{t('projectDetail.gallery')}</h2>
          <div className="grid gap-6 sm:grid-cols-2">{project.gallery.map((src, index) => {
            const caption = text(project.galleryCaptions?.[index]) || t('common.screenshot_caption', { title, number: index + 1 });
            return <figure key={src} className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
              <button type="button" onClick={() => setSelectedImage({ src, alt: caption })} aria-label={`${t('common.preview')}: ${caption}`} className="block w-full cursor-zoom-in bg-slate-50 p-2 dark:bg-slate-900"><img src={src} alt={caption} loading="lazy" className="h-64 w-full object-contain" /></button>
              <figcaption className="p-4 text-sm leading-6 text-slate-600 dark:text-slate-400">{caption}</figcaption>
            </figure>;
          })}</div>
        </section>}
        <footer className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-6 dark:border-slate-700">
          <Link to="/projects" className="inline-flex min-h-11 items-center gap-2 font-semibold text-primary"><ArrowLeft size={18} aria-hidden="true" />{t('hero.view_projects')}</Link>
          {showLikes ? <Suspense fallback={null}><LikeButton projectId={project.id} /></Suspense> : <button type="button" onClick={() => setShowLikes(true)} className="min-h-11 rounded-lg border border-slate-300 px-4 py-2 text-sm dark:border-slate-700">{t('common.show_reactions')}</button>}
        </footer>
      </div>
      <ImageDialog image={selectedImage} onClose={() => setSelectedImage(null)} />
    </motion.main>
  </PageTransition>;
}
