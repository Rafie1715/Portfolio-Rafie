import { useState } from 'react';
import { projects } from '../data/projects';
import { Link } from 'react-router-dom';
import Tilt from 'react-parallax-tilt';

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
    <section id="projects" className="py-24 bg-gray-50 dark:bg-dark">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16" data-aos="fade-down">
          <h2 className="text-3xl md:text-4xl font-bold text-dark dark:text-white mb-4">Featured Projects</h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-12" data-aos="fade-up">
          {filters.map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                filter === f.id 
                  ? 'bg-primary text-white shadow-lg shadow-blue-500/30 scale-105' 
                  : 'bg-white dark:bg-darkLight text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 hover:border-primary/50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <Tilt 
              key={project.id} 
              tiltMaxAngleX={3} 
              tiltMaxAngleY={3} 
              scale={1.01}
              transitionSpeed={2000}
              className="h-full"
            >
              <div 
                data-aos="fade-up"
                data-aos-delay={index * 100} 
                className="group bg-white dark:bg-darkLight rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-slate-700 flex flex-col h-full"
              >
                <div className="h-52 overflow-hidden relative">
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-dark/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                     <Link 
                      to={`/project/${project.id}`}
                      className="px-6 py-2 bg-primary text-white rounded-full font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-lg"
                    >
                      View Details
                    </Link>
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
                  
                  <div className="flex gap-3 mb-6 text-xl text-gray-400">
                     {project.techStack.slice(0,4).map((tech, idx) => (
                       <i key={idx} className={tech.icon} title={tech.name}></i>
                     ))}
                  </div>

                  <div className="mt-auto flex flex-col gap-3">
                    
                    {project.live && (
                      <a 
                        href={project.live} 
                        target="_blank" 
                        rel="noreferrer"
                        className="block w-full text-center py-3 bg-primary text-white rounded-xl hover:bg-secondary transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 font-medium"
                      >
                        <i className="fas fa-external-link-alt text-lg"></i> View Live Site
                      </a>
                    )}

                    {project.github && (
                      <a 
                        href={project.github} 
                        target="_blank" 
                        rel="noreferrer"
                        className="block w-full text-center py-3 bg-dark text-white rounded-xl hover:bg-gray-800 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 font-medium"
                      >
                        <i className="fab fa-github text-lg"></i> View on GitHub
                      </a>
                    )}

                    {project.figma && (
                      <a 
                        href={project.figma} 
                        target="_blank" 
                        rel="noreferrer"
                        className="block w-full text-center py-3 bg-dark dark:bg-slate-700 text-white rounded-xl hover:bg-gray-800 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 font-medium"
                      >
                        <i className="fab fa-figma text-lg"></i> View Design
                      </a>
                    )}

                    {project.prototype && (
                      <a 
                        href={project.prototype} 
                        target="_blank" 
                        rel="noreferrer"
                        className="block w-full text-center py-3 border-2 border-dark dark:border-slate-500 text-dark dark:text-slate-200 rounded-xl hover:bg-dark dark:hover:bg-slate-700 hover:text-white transition-all flex items-center justify-center gap-2 font-medium"
                      >
                        <i className="fas fa-play text-lg"></i> Try Prototype
                      </a>
                    )}

                    {!project.live && !project.github && !project.figma && !project.prototype && (
                      <div className="block w-full text-center py-3 bg-gray-100 dark:bg-slate-800 text-gray-400 rounded-xl cursor-not-allowed border border-gray-200 dark:border-slate-700 text-sm">
                        Private Repository
                      </div>
                    )}
                  </div>

                </div>
              </div>
            </Tilt>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;