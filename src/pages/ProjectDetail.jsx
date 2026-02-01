import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { projects } from '../data/projects';
import SpotlightCard from '../components/SpotlightCard';
import SEO from '../components/SEO';
import { motion, AnimatePresence } from 'framer-motion';
import LikeButton from '../components/LikeButton';
import { useTranslation } from 'react-i18next';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const project = projects.find((p) => p.id === id);
  const [selectedImage, setSelectedImage] = useState(null);
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;

  useEffect(() => {
    if (!project) {
      navigate('/not-found');
    }
    window.scrollTo(0, 0);
  }, [project, navigate]);

  if (!project) return null;

  const getData = (data) => {
    if (data && typeof data === 'object' && !Array.isArray(data) && data[currentLang]) {
      return data[currentLang];
    }
    return data;
  };

  const title = getData(project.title);
  const shortDesc = getData(project.shortDesc);
  const fullDesc = getData(project.fullDesc);
  const challenges = getData(project.challenges);
  const solution = getData(project.solution);
  const lessonLearned = getData(project.lessonLearned);
  const features = getData(project.features);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 50 }
    },
  };

  const fadeInBottom = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: "easeOut" } 
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-white dark:bg-dark min-h-screen pt-24 pb-20 transition-colors duration-300"
    >
      
      <SEO 
        title={`${title} | Rafie Rojagat`}
        description={shortDesc}
        url={`https://rafierojagat.netlify.app/project/${project.id}`}
        image={project.image}
      />

      <div className="container mx-auto px-4 max-w-4xl">
        
        <motion.nav 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-8 overflow-x-auto whitespace-nowrap"
        >
            <Link to="/" className="hover:text-primary transition-colors flex items-center gap-1">
              <i className="fas fa-home text-xs"></i> {t('navbar.home')}
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
                 <LikeButton projectId={project.id} />
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
                      <i className="fab fa-github text-lg"></i> {t('projects.source_code')}
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
                      <i className="fas fa-external-link-alt"></i> {t('projects.live_site')}
                    </motion.a>
                  )}
              </div>
               <div className="flex flex-wrap gap-3">
                  {project.figma && (
                     <motion.a whileHover={{ scale: 1.05 }} href={project.figma} target="_blank" rel="noreferrer" className="px-5 py-2 rounded-full bg-gray-100 dark:bg-slate-800 text-xs font-bold hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-2">
                        <i className="fab fa-figma text-purple-500"></i> {t('projects.design')}
                     </motion.a>
                  )}
               </div>
            </motion.div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="rounded-2xl overflow-hidden shadow-2xl mb-12 border border-gray-100 dark:border-slate-800 bg-gray-100 dark:bg-slate-900"
        >
          <img 
            src={project.image} 
            alt={title} 
            className="w-full h-auto object-cover"
          />
        </motion.div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeInBottom}
          className="mb-12"
        >
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">{t('projectDetail.tech_used')}</h3>
            <div className="flex flex-wrap gap-3">
                {project.techStack.map((tech, idx) => (
                    <motion.div 
                        key={idx} 
                        whileHover={{ y: -5, backgroundColor: "rgba(99, 102, 241, 0.1)" }}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-darkLight border border-gray-200 dark:border-slate-700 shadow-sm transition-colors cursor-default"
                    >
                        <i className={`${tech.icon} text-xl colored`}></i>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{tech.name}</span>
                    </motion.div>
                ))}
            </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
            
            <div className="lg:col-span-2 space-y-10">
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

                {features && features.length > 0 && (
                    <motion.section 
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInBottom}
                    >
                        <h2 className="text-2xl font-bold text-dark dark:text-white mb-6">{t('projectDetail.features')}</h2>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {features.map((feature, idx) => (
                                <motion.li 
                                    key={idx} 
                                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors"
                                    whileHover={{ x: 5 }}
                                >
                                    <div className="mt-1 w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 flex items-center justify-center flex-shrink-0">
                                        <i className="fas fa-check text-xs"></i>
                                    </div>
                                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.section>
                )}
            </div>

            <div className="space-y-8">
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                >
                    <SpotlightCard className="p-6 bg-red-50/50 dark:bg-red-900/10 border-red-100 dark:border-red-900/30 h-auto">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-500">
                                <i className="fas fa-fire text-xl"></i>
                            </div>
                            <h3 className="font-bold text-dark dark:text-white text-lg">{t('projectDetail.challenge')}</h3>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                            {challenges}
                        </p>
                    </SpotlightCard>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                >
                    <SpotlightCard className="p-6 bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/30 h-auto">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-500">
                                <i className="fas fa-lightbulb text-xl"></i>
                            </div>
                            <h3 className="font-bold text-dark dark:text-white text-lg">{t('projectDetail.solution')}</h3>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                            {solution}
                        </p>
                    </SpotlightCard>
                </motion.div>
            </div>
        </div>

        {lessonLearned && (
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="mb-20"
            >
                <div className="relative p-8 rounded-3xl bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5 border border-primary/10 overflow-hidden shadow-sm">
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
                <motion.div 
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
                         <i className="fas fa-search-plus text-white text-3xl drop-shadow-lg transform scale-50 group-hover:scale-100 transition-transform duration-300"></i>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={() => setSelectedImage(null)} 
          >
            <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="relative max-w-7xl w-full max-h-screen flex flex-col items-center"
                onClick={(e) => e.stopPropagation()}
            >
                <img
                    src={selectedImage}
                    alt="Full Preview"
                    className="w-auto h-auto max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                />
                
                <button
                    className="absolute -top-12 right-0 md:-right-6 text-white text-3xl hover:text-primary transition-colors bg-white/10 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md"
                    onClick={() => setSelectedImage(null)}
                >
                    &times;
                </button>
                
                <p className="text-gray-400 mt-4 text-sm">{t('projectDetail.click_close')}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProjectDetail;