import Projects from '../components/Projects';
import SEO from '../components/SEO';

const ProjectsPage = () => {
  return (
    <div className="pt-20 bg-gray-50 dark:bg-dark min-h-screen">
      <SEO title="Projects | Rafie Rojagat" description="A showcase of my software engineering projects." url="https://rafierojagat.netlify.app/projects" />
      
      <Projects />
    </div>
  );
};

export default ProjectsPage;