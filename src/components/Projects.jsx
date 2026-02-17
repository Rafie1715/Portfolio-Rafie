import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Tilt from 'react-parallax-tilt';
import { motion, AnimatePresence } from 'framer-motion';
import { projects as manualProjects } from '../data/projects';
import { dbFirestore } from '../config/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';

const Projects = () => {
  const [filter, setFilter] = useState('all');
  const [cmsProjects, setCmsProjects] = useState([]);
  const [loadingCms, setLoadingCms] = useState(true);
  const [repos, setRepos] = useState([]);
  const [loadingGithub, setLoadingGithub] = useState(true);
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;

  useEffect(() => {
    const fetchCmsProjects = async () => {
      try {
        const q = query(collection(dbFirestore, "projects"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        
        const list = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setCmsProjects(list);
      } catch (error) {
        console.error("Error fetching Firebase projects:", error);
        try {
            const querySnapshot = await getDocs(collection(dbFirestore, "projects"));
            const list = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setCmsProjects(list);
        } catch (e) {
            console.error("Firebase fallback failed", e);
        }
      } finally {
        setLoadingCms(false);
      }
    };

    fetchCmsProjects();
  }, []);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const res = await fetch('/.netlify/functions/github');
        const data = await res.json();
        if (Array.isArray(data)) {
          setRepos(data);
        }
      } catch (err) {
        console.error("Gagal ambil repo:", err);
      } finally {
        setLoadingGithub(false);
      }
    };
    fetchRepos();
  }, []);

  const allProjects = [...cmsProjects, ...manualProjects];
  const filteredProjects = filter === 'all'
    ? allProjects
    : allProjects.filter(p => p.category === filter);

  const filters = [
    { id: 'all', label: t('projects.filter.all') },
    { id: 'mobile', label: t('projects.filter.mobile') },
    { id: 'web', label: t('projects.filter.web') },
    { id: 'python', label: t('projects.filter.python') },
    { id: 'java', label: t('projects.filter.java') },
    { id: 'ui', label: t('projects.filter.ui') },
    { id: 'flutter', label: t('projects.filter.flutter') },
    { id: 'game', label: 'Game' }
  ];

  const langColors = {
    JavaScript: "bg-yellow-400", TypeScript: "bg-blue-500", HTML: "bg-orange-500",
    CSS: "bg-blue-400", Python: "bg-green-500", Dart: "bg-cyan-500", Kotlin: "bg-blue-600",
    default: "bg-gray-400"
  };

  const getData = (data) => {
    if (!data) return "";
    
    if (typeof data === 'object' && data.en) {
      return data[currentLang] || data.en || "";
    }
    
    return String(data);
  };

  return (
    <section id="projects" className="py-24 bg-gray-50 dark:bg-dark relative overflow-hidden transition-colors duration-300">

      <div className="absolute top-0 left-0 w-full h-[500px] bg-primary/5 blur-[120px] -z-10 pointer-events-none"></div>

      <div className="container mx-auto px-4">

        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-dark dark:text-white mb-4"
          >
            {t('projects.title')}
          </motion.h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 80 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="h-1.5 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full"
          ></motion.div>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {filters.map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className="relative px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 outline-none focus:outline-none"
            >
              {filter === f.id && (
                <motion.div
                  layoutId="activeFilter"
                  className="absolute inset-0 bg-primary rounded-full shadow-lg shadow-primary/30"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              <span className={`relative z-10 ${filter === f.id ? 'text-white' : 'text-gray-600 dark:text-gray-300 hover:text-primary'}`}>
                {f.label}
              </span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
          {loadingCms && manualProjects.length === 0 ? (
             [1, 2, 3].map(i => (
                <div key={i} className="h-[450px] bg-gray-200 dark:bg-slate-800 rounded-2xl animate-pulse"></div>
             ))
          ) : filteredProjects.length > 0 ? (
             <AnimatePresence mode='popLayout'>
                {filteredProjects.map((project) => {
                  const title = getData(project.title);
                  const shortDesc = getData(project.shortDesc);

                  return (
                    <motion.div
                      layout
                      key={project.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} scale={1.02} transitionSpeed={2000} className="h-full">
                        <div className="group bg-white dark:bg-darkLight rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 border border-gray-100 dark:border-slate-700/50 flex flex-col h-full relative">                        
                          <div className="h-52 overflow-hidden relative">
                            <img 
                              src={project.image} 
                              alt={title}
                              loading="lazy" 
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1" 
                            />
                            
                            <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-6">                            
                              <Link 
                                  to={`/project/${project.id}`} 
                                  className="px-6 py-2 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 hover:bg-primary hover:border-primary shadow-lg"
                              >
                                  {t('projects.view_details')}
                              </Link>
                            </div>
                            <div className="absolute top-4 left-4 bg-white/90 dark:bg-dark/90 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-bold text-dark dark:text-white shadow-sm border border-gray-100 dark:border-slate-700 uppercase">
                                {project.category}
                            </div>
                          </div>

                          <div className="p-6 flex flex-col flex-grow">
                            <Link to={`/project/${project.id}`} className="block">
                               <h3 className="text-xl font-bold mb-3 text-dark dark:text-white group-hover:text-primary transition-colors line-clamp-1">
                                 {title}
                               </h3>
                            </Link>
                            
                            {project.impact && (
                              <div className="flex items-center gap-1.5 mb-3 text-xs text-primary dark:text-blue-400 font-medium">
                                <i className="fas fa-chart-line text-xs"></i>
                                <span className="line-clamp-1">{i18n.language === 'id' ? project.impact.id : project.impact.en}</span>
                              </div>
                            )}
                            
                            <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm leading-relaxed flex-grow line-clamp-3">
                              {shortDesc}
                            </p>
                            
                            <div className="flex gap-3 mb-6 text-xl text-gray-400 dark:text-gray-500">
                              {Array.isArray(project.techStack) && project.techStack.slice(0, 4).map((tech, idx) => (
                                  <motion.i 
                                      key={idx} 
                                      whileHover={{ y: -3, color: "#2563eb" }} 
                                      className={`${tech.icon ? tech.icon : ''} transition-colors cursor-help`} 
                                      title={tech.name}
                                  ></motion.i>
                              ))}
                            </div>

                            <div className="mt-auto flex flex-col gap-3">
                              {project.live && (
                                <a href={project.live} target="_blank" rel="noreferrer" className="block w-full text-center py-2.5 bg-gradient-to-r from-primary to-secondary text-white rounded-xl shadow-md flex items-center justify-center gap-2 font-medium text-sm group/btn">
                                  <i className="fas fa-external-link-alt group-hover/btn:rotate-45 transition-transform duration-300"></i> {t('projects.live_site')}
                                </a>
                              )}
                              
                              {project.figma && (
                                  <a href={project.figma} target="_blank" rel="noreferrer" className="block w-full text-center py-2.5 bg-dark dark:bg-slate-800 text-white rounded-xl hover:bg-gray-800 dark:hover:bg-slate-700 transition-all shadow-md flex items-center justify-center gap-2 font-medium text-sm">
                                      <i className="fab fa-figma text-lg"></i> {t('projects.design')}
                                  </a>
                              )}

                              {project.prototype && (
                                  <a href={project.prototype} target="_blank" rel="noreferrer" className="block w-full text-center py-2.5 border-2 border-dark dark:border-slate-500 text-dark dark:text-slate-200 rounded-xl hover:bg-dark dark:hover:bg-slate-700 hover:text-white transition-all flex items-center justify-center gap-2 font-medium text-sm">
                                      <i className="fas fa-play text-sm"></i> {t('projects.prototype')}
                                  </a>
                              )}

                              {project.github && (
                                <a href={project.github} target="_blank" rel="noreferrer" className="block w-full text-center py-2.5 bg-gray-100 dark:bg-slate-700 text-dark dark:text-white rounded-xl hover:bg-gray-200 dark:hover:bg-slate-600 transition-all flex items-center justify-center gap-2 font-medium text-sm">
                                  <i className="fab fa-github text-lg"></i> {t('projects.source_code')}
                                </a>
                              )}
                            </div>
                          </div>

                        </div>
                      </Tilt>
                    </motion.div>
                  );
                })}
             </AnimatePresence>
          ) : (
             <div className="col-span-full text-center py-20 text-gray-500">
                {t('projects.no_projects')}
             </div>
          )}
        </div>

        <div className="text-center mb-12 mt-20">
          <h2 className="text-2xl md:text-3xl font-bold text-dark dark:text-white mb-2 flex items-center justify-center gap-3">
            <i className="fab fa-github text-primary"></i> {t('projects.subtitle')}
          </h2>
          <p className="text-gray-500 dark:text-gray-400">{t('projects.subtitle_desc')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loadingGithub ? (
            [1, 2, 3].map(i => (
              <div key={i} className="h-40 bg-gray-200 dark:bg-slate-800 rounded-xl animate-pulse"></div>
            ))
          ) : (
            repos.map((repo) => (
              <motion.div
                key={repo.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-lg transition-all flex flex-col h-full group"
              >
                <div className="flex justify-between items-start mb-4">
                  <i className="far fa-folder-open text-3xl text-primary/80 group-hover:text-primary transition-colors"></i>
                  <a href={repo.html_url} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-dark dark:hover:text-white transition-colors">
                    <i className="fas fa-arrow-right -rotate-45 group-hover:rotate-0 transition-transform duration-300"></i>
                  </a>
                </div>

                <h3 className="text-lg font-bold text-dark dark:text-white mb-2 group-hover:text-primary transition-colors">
                  {repo.name.replace(/-/g, ' ')}
                </h3>

                <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 flex-grow line-clamp-2">
                  {repo.description || "No description provided."}
                </p>

                <div className="flex items-center justify-between mt-auto text-xs font-mono text-gray-500 border-t border-gray-100 dark:border-slate-700 pt-4">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${langColors[repo.language] || langColors.default}`}></span>
                    <span>{repo.language || "Code"}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <i className="fas fa-star text-yellow-500"></i>
                    <span>{repo.stargazers_count}</span>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

      </div>
    </section>
  );
};

export default Projects;