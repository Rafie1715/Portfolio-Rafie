import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import { projects } from '../data/projects';
import SpotlightCard from '../components/SpotlightCard';
import SEO from '../components/SEO';

const HomePage = () => {
  const featuredProjects = projects.slice(0, 3);

  return (
    <div className="bg-white dark:bg-dark min-h-screen">
      <SEO
        title="Rafie Rojagat | Software Engineer"
        description="Welcome to my digital playground. Exploring Mobile & Web Development."
        url="https://rafierojagat.netlify.app/"
      />

      <Hero />

      <section className="py-20 px-4 container mx-auto">
        <div className="text-center mb-12" data-aos="fade-up">
          <h2 className="text-3xl font-bold text-dark dark:text-white mb-4">Featured Work</h2>
          <p className="text-gray-600 dark:text-gray-400">A glimpse of what I've built.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {featuredProjects.map((project, index) => (
            <SpotlightCard key={project.id} className="group p-0 overflow-hidden h-full flex flex-col" data-aos="fade-up" data-aos-delay={index * 100}>
              <div className="h-48 overflow-hidden relative">
                <img src={project.image} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-dark dark:text-white mb-2">{project.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4 flex-grow">{project.shortDesc}</p>
                <Link to={`/project/${project.id}`} className="text-primary font-medium hover:underline mt-auto">View Details →</Link>
              </div>
            </SpotlightCard>
          ))}
        </div>

        <div className="text-center">
          <Link to="/projects" className="inline-block px-8 py-3 rounded-full border border-gray-300 dark:border-slate-700 text-dark dark:text-white hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
            View All Projects
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;