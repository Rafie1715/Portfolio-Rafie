import Contact from '../components/Contact';
import SEO from '../components/SEO';
import { useTranslation } from 'react-i18next';
import PageTransition from '../components/PageTransition';

const ContactPage = () => {
  const { t } = useTranslation();

  return (
    <PageTransition>
    <div className="pt-20 bg-white dark:bg-dark min-h-screen">
      <SEO 
        title={t('contact.seo_title')} 
        description={t('contact.seo_desc')} 
        url="https://rafierojagat.netlify.app/contact" 
      />
      <Contact />
    </div>
    </PageTransition>
  );
};

export default ContactPage;