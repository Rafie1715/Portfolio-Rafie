import About from '../components/About';
import Skills from '../components/Skills';
import Certifications from '../components/Certifications';
import SEO from '../components/SEO';
import PageTransition from '../components/PageTransition'; 
import Timeline from '../components/Timeline';

const AboutPage = () => {
  return (
    <PageTransition>
      <div className="pt-20 bg-white dark:bg-dark min-h-screen">
        <SEO 
          title="About Rafie Rojagat | Software Engineer & Developer"
          description="Learn about Rafie Rojagat, an Informatics Student at UPN Veteran Jakarta passionate about Mobile & Web Development. Discover my journey, skills, certifications, and experience in React, Flutter, Python, and more."
          url="https://rafie-dev.netlify.app/about"
          keywords="About Rafie Rojagat, Developer Biography, Software Engineer Skills, Mobile Development Experience, Web Development Certifications, React Developer, Flutter Developer"
          type="profile"
        />
        
        <About />
        
        <section className="py-20 bg-gray-50 dark:bg-darkLight relative">
            <div className="container mx-auto px-4 mb-10 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-dark dark:text-white mb-4">
                  Experience & Organization
                </h2>
                <div className="w-20 h-1.5 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full"></div>
            </div>
            
            <Timeline /> 
        </section>

        <Skills />
        <Certifications />
      </div>
    </PageTransition>
  );
};

export default AboutPage;