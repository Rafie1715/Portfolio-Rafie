import Icon from '../components/Icon';
import { lazy, Suspense, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProjects } from '../hooks/useProjects';
import ProjectCatalogStatus from '../components/ProjectCatalogStatus';
import NotFound from './NotFound';
import ImageDialog from '../components/ImageDialog';
import ProjectEvidence from '../components/ProjectEvidence';
import DecisionReplay from '../components/DecisionReplay';
import SEO from '../components/SEO';
import { motion } from 'framer-motion';
const LikeButton = lazy(() => import('../components/LikeButton'));
import { useTranslation } from 'react-i18next';
import PageTransition from '../components/PageTransition';
import Loading from '../components/Loading';

const ProjectDetail = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;
  const { projects, loading, error, retry } = useProjects();
  const [selectedImage, setSelectedImage] = useState(null);
  const [showLikes, setShowLikes] = useState(false);
  const project = projects.find(entry => entry.id === id);
  if (loading) return <Loading />;
  if (error) return <main className="min-h-screen px-4 pt-28"><ProjectCatalogStatus error retry={retry} /></main>;
  if (!project) return <NotFound />;

  const getData = (data) => {
    if (!data) return "";
    if (typeof data === 'string') return data;
    if (typeof data === 'object' && (data.en || data.id)) {
      return data[currentLang] || data.en || "";
    }
    return String(data);
  };

  const getFeatures = (data) => {
      const raw = getData(data);
      if (Array.isArray(raw)) return raw;
      if (typeof raw === 'string') return [raw];
      return [];
  };

  const title = getData(project.title);
  const shortDesc = getData(project.shortDesc);
  const fullDesc = getData(project.fullDesc);
  const challenges = getData(project.challenges);
  const solution = getData(project.solution);
  const lessonLearned = getData(project.lessonLearned);
  const featuresList = getFeatures(project.features);
  const techStack = Array.isArray(project.techStack) ? project.techStack : [];
  const techNames = techStack.map((tech) => tech?.name).filter(Boolean);
  const techKeywords = techNames.join(', ');
  const impactDetails = project.impactDetails || {};
  const structuredRole = getData(impactDetails.role);
  const structuredTeam = getData(impactDetails.team);
  const structuredResult = getData(impactDetails.result);
  const structuredScope = getData(impactDetails.scope);
  const impactSummary = getData(project.impact);
  const impactParts = typeof impactSummary === 'string'
    ? impactSummary.split(/[•|]/).map((part) => part.trim()).filter(Boolean)
    : [];
  const firstFeature = featuresList[0] || shortDesc;
  const teamText = impactParts.find((part, index) => (
    index > 0 && /(team|tim|member|anggota|solo|lead|cohort)/i.test(part)
  ));
  const resultText = impactParts.find((part, index) => (
    index > 0 && part !== teamText
  ));
  const availableLinks = [
    project.live && t('projects.live_site'),
    project.github && t('projects.source_code'),
    project.figma && t('projects.design'),
    project.prototype && t('projects.prototype'),
  ].filter(Boolean);

  const selectedImpactCards = [
    {
      label: t('projectDetail.impact.role'),
      value: structuredRole || impactParts[0] || `${project.category || 'Software'} Project`,
      icon: 'fas fa-user-tie',
    },
    {
      label: t('projectDetail.impact.team'),
      value: structuredTeam || teamText || (/solo/i.test(impactParts[0] || '') ? 'Solo project' : t('projectDetail.impact.team_fallback')),
      icon: 'fas fa-users',
    },
    {
      label: t('projectDetail.impact.result'),
      value: structuredResult || resultText || firstFeature,
      icon: 'fas fa-chart-line',
    },
    {
      label: t('projectDetail.impact.tech_link'),
      value: [structuredScope, techNames.slice(0, 3).join(', '), availableLinks.join(' + ')].filter(Boolean).join(' / '),
      icon: 'fas fa-link',
    },
  ].filter((item) => item.value);
  const replay = project.decisionReplay || {};
  const decisionReplaySteps = [
    { key: 'problem', value: challenges },
    { key: 'constraint', value: getData(replay.constraint) },
    { key: 'options', value: getData(replay.options) },
    { key: 'decision', value: getData(replay.decision) || solution },
    { key: 'tradeoff', value: getData(replay.tradeoff) },
    {
      key: 'evidence',
      value: getData(replay.evidence) || structuredResult || resultText || impactSummary,
    },
  ].filter((step) => step.value);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } },
  };

  const fadeInBottom = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <PageTransition>
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="bg-white dark:bg-dark min-h-screen overflow-x-hidden pt-24 pb-20 transition-colors duration-300"
      >

        <SEO
          title={`${title} | Rafie Rojagat Portfolio`}
          description={shortDesc}
          url={`https://rafierb.me/project/${project.id}`}
          image={project.image}
          type="article"
          keywords={`${title}, ${project.category}, Software Project, ${techKeywords}, Portfolio Project`}
          published={project.createdAt}
          modified={project.updatedAt}
        />

        <div className="container mx-auto px-4 max-w-4xl">

          <motion.nav
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-8 overflow-x-auto whitespace-nowrap"
          >
            <Link to="/" className="hover:text-primary transition-colors flex items-center gap-1">
              <Icon className="fas fa-home text-xs"></Icon> {t('navbar.home')}
            </Link>
            <span className="mx-2 text-gray-300 dark:text-gray-600">/</span>
            <Link to="/projects" className="hover:text-primary transition-colors">
              {t('navbar.projects')}
            </Link>
            <span className="mx-2 text-gray-300 dark:text-gray-600">/</span>
            <span className="text-primary font-medium truncate max-w-[200px]">
              {title}
            </span>
          </motion.nav>

          <motion.div
            className="mb-10"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="flex-1">
                <motion.span variants={itemVariants} className="text-primary font-bold tracking-wider uppercase text-sm mb-2 block">
                  {project.category} {t('projectDetail.category_label')}
                </motion.span>
                <motion.h1 variants={itemVariants} className="text-3xl md:text-5xl font-bold text-dark dark:text-white mb-4 leading-tight">
                  {title}
                </motion.h1>
                <motion.p variants={itemVariants} className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl">
                  {shortDesc}
                </motion.p>
              </div>

              <motion.div variants={itemVariants} className="flex flex-col gap-4 flex-shrink-0 min-w-[140px]">
                <div className="self-start md:self-end">
                  {showLikes ? <Suspense fallback={null}><LikeButton projectId={project.id} /></Suspense> : <button type="button" onClick={() => setShowLikes(true)} className="rounded-full border px-4 py-2 text-sm">{t('common.show_reactions')}</button>}
                </div>
                <div className="flex flex-wrap gap-3">
                  {project.github && (
                    <motion.a
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      href={project.github}
                      target="_blank"
                      rel="noreferrer"
                      className="px-5 py-2.5 rounded-full bg-gray-100 dark:bg-slate-800 text-dark dark:text-white font-medium hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-2 text-sm"
                    >
                      <Icon className="fab fa-github text-lg"></Icon> {t('projects.source_code')}
                    </motion.a>
                  )}
                  {project.live && (
                    <motion.a
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      href={project.live}
                      target="_blank"
                      rel="noreferrer"
                      className="px-5 py-2.5 rounded-full bg-primary text-white font-medium hover:bg-secondary transition-colors shadow-lg shadow-primary/30 flex items-center gap-2 text-sm"
                    >
                      <Icon className="fas fa-external-link-alt"></Icon> {t('projects.live_site')}
                    </motion.a>
                  )}
                </div>
                <div className="flex flex-wrap gap-3">
                  {project.figma && (
                    <motion.a whileHover={{ scale: 1.05 }} href={project.figma} target="_blank" rel="noreferrer" className="px-5 py-2 rounded-full bg-gray-100 dark:bg-slate-800 text-xs font-bold hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-2">
                      <Icon className="fab fa-figma text-blue-500"></Icon> {t('projects.design')}
                    </motion.a>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>

          <ProjectEvidence project={project} />

          {selectedImpactCards.length > 0 && (
            <motion.section
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeInBottom}
              className="mb-8 border-y border-blue-100 dark:border-blue-900/40 py-5 md:py-6"
            >
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-400 mb-2">
                    {t('projectDetail.impact.eyebrow')}
                  </p>
                  <h2 className="text-2xl font-bold text-dark dark:text-white">
                    {t('projectDetail.impact.title')}
                  </h2>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 max-w-lg">
                  {t('projectDetail.impact.desc')}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {selectedImpactCards.map((item) => (
                  <div key={item.label} className="border-l-2 border-blue-200 dark:border-blue-800 pl-4 py-1">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 flex items-center justify-center mb-3">
                      <Icon className={item.icon}></Icon>
                    </div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1">
                      {item.label}
                    </p>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 leading-relaxed">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </motion.section>
          )}

          <motion.figure
            initial={{ opacity: 0, scale: 0.98, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut", delay: 0.15 }}
            className="rounded-lg overflow-hidden shadow-xl mb-12 border border-gray-100 dark:border-slate-800 bg-gray-100 dark:bg-slate-900"
          >
            <button type="button" onClick={() => setSelectedImage(project.image)} aria-label={t('common.preview') + ': ' + title} className="block w-full cursor-zoom-in">
            <img
              src={project.image}
              alt={title}
              decoding="async"
              fetchPriority="high"
              className="w-full h-auto object-cover"
              sizes="(min-width: 1024px) 896px, 100vw"
            />
            </button>
            {project.conceptualCover && (
              <figcaption className="border-t border-gray-200 bg-white px-4 py-3 text-sm text-gray-500 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-400">
                {t('projectDetail.conceptual_cover')}
              </figcaption>
            )}
          </motion.figure>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeInBottom}
            className="mb-12"
          >
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">{t('projectDetail.tech_used')}</h3>
            <div className="flex flex-wrap gap-3">
              {techStack.map((tech, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -5, backgroundColor: "rgba(37, 99, 235, 0.1)" }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-darkLight border border-gray-200 dark:border-slate-700 shadow-sm transition-colors cursor-default"
                >
                  <Icon className={`${tech.icon} text-xl colored`}></Icon>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{tech.name}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <DecisionReplay key={project.id} steps={decisionReplaySteps} />

          <div className="mb-16 max-w-3xl space-y-10">
              <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInBottom}
              >
                <h2 className="text-2xl font-bold text-dark dark:text-white mb-4">{t('projectDetail.overview')}</h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line text-lg">
                  {fullDesc}
                </p>
              </motion.section>

              {featuresList && featuresList.length > 0 && (
                <motion.section
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeInBottom}
                >
                  <h2 className="text-2xl font-bold text-dark dark:text-white mb-6">{t('projectDetail.features')}</h2>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {featuresList.map((feature, idx) => (
                      <motion.li
                        key={idx}
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors"
                        whileHover={{ x: 5 }}
                      >
                        <div className="mt-1 w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 flex items-center justify-center flex-shrink-0">
                          <Icon className="fas fa-check text-xs"></Icon>
                        </div>
                        <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.section>
              )}
          </div>

          {lessonLearned && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="mb-20"
            >
              <div className="relative p-8 rounded-3xl bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5 border border-primary/10 overflow-hidden shadow-sm">
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>

                <div className="relative z-10">
                  <h2 className="text-2xl font-bold text-dark dark:text-white mb-4 flex items-center gap-3">
                    <span className="text-3xl">🎓</span> {t('projectDetail.learned')}
                  </h2>
                  <p className="text-lg text-gray-700 dark:text-gray-200 leading-relaxed italic border-l-4 border-primary pl-6 py-2">
                    "{lessonLearned}"
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {project.gallery && project.gallery.length > 0 && (
            <motion.section
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
              className="mb-20"
            >
              <h2 className="text-2xl font-bold text-dark dark:text-white mb-8">{t('projectDetail.gallery')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {project.gallery.map((img, idx) => (
                  <motion.button
                    type="button"
                    aria-label={`${t('common.preview')} ${title} - ${idx + 1}`}
                    key={idx}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                    onClick={() => setSelectedImage(img)}
                    className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all cursor-zoom-in"
                  >
                    <div className="aspect-video bg-gray-100 dark:bg-slate-800">
                      <img
                        src={img}
                        alt={`Screenshot ${idx + 1}`}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Icon className="fas fa-search-plus text-white text-3xl drop-shadow-lg transform scale-50 group-hover:scale-100 transition-transform duration-300"></Icon>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.section>
          )}
        </div>

        <ImageDialog image={selectedImage ? { src: selectedImage, alt: title } : null} onClose={() => setSelectedImage(null)} />
      </motion.main>
    </PageTransition>
  );
};

export default ProjectDetail;
