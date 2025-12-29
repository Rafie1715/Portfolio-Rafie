import { useState } from 'react';
import { projects } from '../data/projects';
import { Link } from 'react-router-dom';
import Tilt from 'react-parallax-tilt';
import { motion, AnimatePresence } from 'framer-motion';

const Projects = () => {
  const [filter, setFilter] = useState('all');

  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(p => p.category === filter);

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'mobile', label: 'Mobile' },
    { id: 'web', label: 'Web' },
    { id: 'python', label: 'Python' },
    { id: 'java', label: 'Java' },
    { id: 'ui', label: 'UI/UX' },
    { id: 'flutter', label: 'Flutter' }
  ];

  return (
    <section id="projects" className="py-24 bg-gray-50 dark:bg-dark relative overflow-hidden">
      
      <div className="absolute top-0 left-0 w-full h-[500px] bg-primary/5 blur-[120px] -z-10 pointer-events-none"></div>

      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-dark dark:text-white mb-4"
          >
            Featured Projects
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

        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode='popLayout'>
            {filteredProjects.map((project) => (
              <motion.div
                layout
                key={project.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
              >
                <Tilt 
                  tiltMaxAngleX={5} 
                  tiltMaxAngleY={5} 
                  scale={1.02}
                  transitionSpeed={2000}
                  className="h-full"
                >
                  <div className="group bg-white dark:bg-darkLight rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 border border-gray-100 dark:border-slate-700/50 flex flex-col h-full relative">                    
                    <div className="h-52 overflow-hidden relative">
                      <img 
                        src={project.image} 
                        alt={project.title} 
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1" 
                      />
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-6">
                          <Link 
                            to={`/project/${project.id}`}
                            className="px-6 py-2 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 hover:bg-primary hover:border-primary shadow-lg"
                          >
                            View Details
                          </Link>
                      </div>

                      <div className="absolute top-4 left-4 bg-white/90 dark:bg-dark/90 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-bold text-dark dark:text-white shadow-sm border border-gray-100 dark:border-slate-700">
                        {project.category.toUpperCase()}
                      </div>
                    </div>
                    
                    <div className="p-6 flex flex-col flex-grow">
                      <Link to={`/project/${project.id}`} className="block">
                        <h3 className="text-xl font-bold mb-3 text-dark dark:text-white group-hover:text-primary transition-colors line-clamp-1" title={project.title}>
                          {project.title}
                        </h3>
                      </Link>

                      <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm leading-relaxed flex-grow line-clamp-3">
                        {project.shortDesc}
                      </p>
                      
                      <div className="flex gap-3 mb-6 text-xl text-gray-400 dark:text-gray-500">
                         {project.techStack.slice(0,4).map((tech, idx) => (
                           <motion.i 
                              key={idx} 
                              whileHover={{ y: -3, color: "#6366f1" }}
                              className={`${tech.icon} transition-colors cursor-help`} 
                              title={tech.name}
                           ></motion.i>
                         ))}
                      </div>

                      <div className="mt-auto flex flex-col gap-3">
                        
                        {project.live && (
                          <a 
                            href={project.live} 
                            target="_blank" 
                            rel="noreferrer"
                            className="block w-full text-center py-2.5 bg-gradient-to-r from-primary to-secondary text-white rounded-xl shadow-md hover:shadow-lg hover:shadow-primary/30 transition-all flex items-center justify-center gap-2 font-medium text-sm group/btn"
                          >
                            <i className="fas fa-external-link-alt group-hover/btn:rotate-45 transition-transform duration-300"></i> View Live Site
                          </a>
                        )}

                        {project.github && (
                          <a 
                            href={project.github} 
                            target="_blank" 
                            rel="noreferrer"
                            className="block w-full text-center py-2.5 bg-gray-100 dark:bg-slate-700 text-dark dark:text-white rounded-xl hover:bg-gray-200 dark:hover:bg-slate-600 transition-all flex items-center justify-center gap-2 font-medium text-sm"
                          >
                            <i className="fab fa-github text-lg"></i> Source Code
                          </a>
                        )}

                        {!project.live && !project.github && !project.figma && !project.prototype && (
                          <div className="block w-full text-center py-2.5 bg-gray-50 dark:bg-slate-800/50 text-gray-400 border border-dashed border-gray-300 dark:border-slate-700 rounded-xl text-sm cursor-not-allowed">
                             <i className="fas fa-lock mr-2"></i> Private Repository
                          </div>
                        )}
                      </div>

                    </div>
                  </div>
                </Tilt>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

      </div>
    </section>
  );
};

export default Projects;