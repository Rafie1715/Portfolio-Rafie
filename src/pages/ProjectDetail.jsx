import { useParams, Link, useNavigate } from 'react-router-dom';
import { projects } from '../data/projects';
import { useEffect } from 'react';
import SpotlightCard from '../components/SpotlightCard';
import SEO from '../components/SEO';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const project = projects.find((p) => p.id === id);

  useEffect(() => {
    if (!project) {
      navigate('/not-found');
    }
    window.scrollTo(0, 0);
  }, [project, navigate]);

  if (!project) return null;

  return (
    <div className="bg-white dark:bg-dark min-h-screen pt-24 pb-20 transition-colors duration-300">
      
      <SEO 
        title={`${project.title} | Rafie Rojagat`}
        description={project.shortDesc}
        url={`https://rafie-dev.netlify.app/project/${project.id}`}
        image={project.image}
      />

      <div className="container mx-auto px-4 max-w-4xl">
        
        <nav className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-8 overflow-x-auto whitespace-nowrap">
            <Link 
              to="/" 
              className="hover:text-primary transition-colors flex items-center gap-1"
            >
              <i className="fas fa-home text-xs"></i> Home
            </Link>
            
            <span className="mx-2 text-gray-300 dark:text-gray-600">/</span>
            
            <Link 
              to="/projects" 
              className="hover:text-primary transition-colors"
            >
              Projects
            </Link>
            
            <span className="mx-2 text-gray-300 dark:text-gray-600">/</span>
            
            <span className="text-primary font-medium truncate max-w-[200px]">
                {project.title}
            </span>
        </nav>

        <div className="mb-10" data-aos="fade-up">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div>
              <span className="text-primary font-bold tracking-wider uppercase text-sm mb-2 block">
                {project.category} Project
              </span>
              <h1 className="text-3xl md:text-5xl font-bold text-dark dark:text-white mb-4 leading-tight">
                {project.title}
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl">
                {project.shortDesc}
              </p>
            </div>

            <div className="flex flex-wrap gap-3 flex-shrink-0">
              {project.github && (
                <a 
                  href={project.github} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="px-6 py-2.5 rounded-full bg-gray-100 dark:bg-slate-800 text-dark dark:text-white font-medium hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-2"
                >
                  <i className="fab fa-github text-lg"></i> Source Code
                </a>
              )}
              {project.live && (
                <a 
                  href={project.live} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="px-6 py-2.5 rounded-full bg-primary text-white font-medium hover:bg-secondary transition-colors shadow-lg shadow-primary/30 flex items-center gap-2"
                >
                  <i className="fas fa-external-link-alt"></i> Live Demo
                </a>
              )}
              {project.figma && (
                <a 
                  href={project.figma} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="px-6 py-2.5 rounded-full bg-gray-100 dark:bg-slate-800 text-dark dark:text-white font-medium hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-2"
                >
                  <i className="fab fa-figma text-lg text-purple-500"></i> Design
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-2xl overflow-hidden shadow-2xl mb-12 border border-gray-100 dark:border-slate-800 bg-gray-100 dark:bg-slate-900" data-aos="zoom-in">
          <img 
            src={project.image} 
            alt={project.title} 
            className="w-full h-auto object-cover"
          />
        </div>

        <div className="mb-12" data-aos="fade-up">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Technologies Used</h3>
            <div className="flex flex-wrap gap-3">
                {project.techStack.map((tech, idx) => (
                    <div 
                        key={idx} 
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-darkLight border border-gray-200 dark:border-slate-700 shadow-sm"
                    >
                        <i className={`${tech.icon} text-xl colored`}></i>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{tech.name}</span>
                    </div>
                ))}
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
            <div className="lg:col-span-2 space-y-10">
                <section data-aos="fade-up">
                    <h2 className="text-2xl font-bold text-dark dark:text-white mb-4">Project Overview</h2>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                        {project.fullDesc}
                    </p>
                </section>

                {project.features && (
                    <section data-aos="fade-up">
                        <h2 className="text-2xl font-bold text-dark dark:text-white mb-6">Key Features</h2>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {project.features.map((feature, idx) => (
                                <li key={idx} className="flex items-start gap-3">
                                    <div className="mt-1 w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 flex items-center justify-center flex-shrink-0">
                                        <i className="fas fa-check text-xs"></i>
                                    </div>
                                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}
            </div>

            <div className="space-y-8">
                <SpotlightCard className="p-6 bg-red-50/50 dark:bg-red-900/10 border-red-100 dark:border-red-900/30 h-auto" data-aos="fade-left">
                    <div className="flex items-center gap-3 mb-3">
                        <i className="fas fa-fire text-red-500 text-xl"></i>
                        <h3 className="font-bold text-dark dark:text-white text-lg">The Challenge</h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                        {project.challenges}
                    </p>
                </SpotlightCard>

                <SpotlightCard className="p-6 bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/30 h-auto" data-aos="fade-left" data-aos-delay="100">
                    <div className="flex items-center gap-3 mb-3">
                        <i className="fas fa-lightbulb text-blue-500 text-xl"></i>
                        <h3 className="font-bold text-dark dark:text-white text-lg">The Solution</h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                        {project.solution}
                    </p>
                </SpotlightCard>
            </div>
        </div>

        {project.lessonLearned && (
            <div className="mb-20" data-aos="fade-up">
                <div className="relative p-8 rounded-2xl bg-gradient-to-r from-primary/5 to-purple-500/5 border border-primary/10 overflow-hidden">
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl"></div>
                    
                    <div className="relative z-10">
                        <h2 className="text-2xl font-bold text-dark dark:text-white mb-4 flex items-center gap-3">
                            <span className="text-3xl">🎓</span> What I Learned
                        </h2>
                        <p className="text-lg text-gray-700 dark:text-gray-200 leading-relaxed italic border-l-4 border-primary pl-6">
                            "{project.lessonLearned}"
                        </p>
                    </div>
                </div>
            </div>
        )}

        {project.gallery && project.gallery.length > 0 && (
          <section className="mb-20" data-aos="fade-up">
            <h2 className="text-2xl font-bold text-dark dark:text-white mb-8">Project Gallery</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {project.gallery.map((img, idx) => (
                <div key={idx} className="group relative rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
                  <div className="aspect-video bg-gray-100 dark:bg-slate-800">
                    <img 
                      src={img} 
                      alt={`Screenshot ${idx + 1}`} 
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProjectDetail;