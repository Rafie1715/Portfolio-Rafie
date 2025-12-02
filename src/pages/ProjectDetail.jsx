import { useParams, Link } from 'react-router-dom';
import { projects } from '../data/projects';
import { useEffect } from 'react';

const ProjectDetail = () => {
  const { id } = useParams();
  const project = projects.find(p => p.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Project Not Found</h2>
        <Link to="/" className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-dark min-h-screen pb-20">
      <div className="bg-dark text-white pt-32 pb-16 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <span className="inline-block px-4 py-1 bg-white/10 rounded-full text-sm font-medium mb-4 backdrop-blur-sm uppercase tracking-wide">
            {project.category} Project
          </span>
          <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">{project.title}</h1>
          <p className="text-gray-300 text-lg md:text-xl leading-relaxed">{project.shortDesc}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-10">
        <div className="max-w-5xl mx-auto bg-white dark:bg-darkLight rounded-2xl shadow-xl overflow-hidden">
          <div className="aspect-video w-full bg-gray-100">
            <img src={project.image} alt={project.title} loading="lazy" className="w-full h-full object-cover" />
          </div>
          
          <div className="p-8 md:p-12">
            <div className="flex flex-wrap justify-center gap-8 mb-12 py-8 border-y border-gray-100">
               {project.techStack.map((tech, idx) => (
                <div key={idx} className="flex flex-col items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
                  <i className={`${tech.icon} text-4xl`}></i>
                  <span className="text-sm font-medium">{tech.name}</span>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-3 gap-12">
              <div className="md:col-span-2 space-y-8">
                <section>
                  <h3 className="text-2xl font-bold text-dark dark:text-white mb-4">Project Background</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                    {project.fullDesc}
                  </p>
                </section>

                {(project.challenges || project.solution) && (
                  <section>
                    <h3 className="text-2xl font-bold text-dark dark:text-white mb-4">Challenges & Solutions</h3>
                    <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-xl mb-4 border border-red-100 dark:border-red-900/30">
                      <h4 className="font-bold text-red-700 mb-2 flex items-center">
                        <i className="fas fa-exclamation-triangle mr-2"></i> The Challenge
                      </h4>
                      <p className="text-gray-700 dark:text-red-400">{project.challenges}</p>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl border border-green-100 dark:border-green-900/30">
                      <h4 className="font-bold text-green-700 mb-2 flex items-center">
                        <i className="fas fa-check-circle mr-2"></i> The Solution
                      </h4>
                      <p className="text-gray-700 dark:text-green-400">{project.solution}</p>
                    </div>
                  </section>
                )}
              </div>

              <div className="md:col-span-1 space-y-6">
                 <div className="bg-gray-50 dark:bg-slate-800 p-6 rounded-xl border border-gray-100 dark:border-slate-700 sticky top-24">
                    <h4 className="font-bold text-dark dark:text-white mb-4 text-lg">Project Links</h4>
                    {project.github ? (
                      <a 
                        href={project.github} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center justify-center w-full py-3 bg-dark text-white rounded-lg hover:bg-gray-800 transition mb-3 shadow-lg shadow-gray-400/20"
                      >
                        <i className="fab fa-github mr-2"></i> GitHub Repository
                      </a>
                    ) : (
                      <button disabled className="w-full py-3 bg-gray-200 text-gray-400 rounded-lg cursor-not-allowed flex items-center justify-center">
                        <i className="fab fa-github mr-2"></i> Private Repo
                      </button>
                    )}
                    <Link to="/#contact" className="flex items-center justify-center w-full py-3 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition">
                      Ask me about this
                    </Link>
                 </div>
              </div>
            </div>

            {project.gallery && project.gallery.length > 0 && (
              <section className="mt-16 pt-12 border-t border-gray-100">
                <h3 className="text-2xl font-bold text-dark dark:text-white mb-8 text-center">Project Gallery</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {project.gallery.map((img, idx) => (
                    <div key={idx} className="rounded-xl overflow-hidden shadow-md group">
                       <img 
                        src={img} 
                        alt={`${project.title} Screenshot ${idx+1}`} 
                        loading="lazy"
                        className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500" 
                       />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;