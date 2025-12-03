import Contact from '../components/Contact';
import SEO from '../components/SEO';

const ContactPage = () => {
  return (
    <div className="pt-20 bg-white dark:bg-dark min-h-screen">
      <SEO title="Contact | Rafie Rojagat" description="Get in touch with me." url="https://rafierojagat.netlify.app/contact" />
      <Contact />
    </div>
  );
};

export default ContactPage;