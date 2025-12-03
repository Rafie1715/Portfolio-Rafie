import About from '../components/About';
import Experience from '../components/Experience';
import Skills from '../components/Skills';
import Certifications from '../components/Certifications';
import SEO from '../components/SEO';

const AboutPage = () => {
  return (
    <div className="pt-20 bg-white dark:bg-dark min-h-screen">
      <SEO title="About Me | Rafie Rojagat" description="Learn more about my background, experience, and skills." url="https://rafierojagat.netlify.app/about" />
      
      <About />
      <Experience />
      <Skills />
      <Certifications />
    </div>
  );
};

export default AboutPage;