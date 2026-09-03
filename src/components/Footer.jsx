import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const VisitorCounter = lazy(() => import('./VisitorCounter'));

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  const visitorSlotRef = useRef(null);
  const [showVisitorCounter, setShowVisitorCounter] = useState(false);

  useEffect(() => {
    const element = visitorSlotRef.current;
    if (!element) return undefined;

    let observer;

    const observeCounter = () => {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setShowVisitorCounter(true);
            observer.disconnect();
          }
        },
        { rootMargin: '160px' },
      );

      observer.observe(element);
    };

    if (window.scrollY > 0) {
      observeCounter();
    } else {
      window.addEventListener('scroll', observeCounter, { passive: true, once: true });
    }

    return () => {
      window.removeEventListener('scroll', observeCounter);
      observer?.disconnect();
    };
  }, []);

  const socialLinks = [
    { label: "GitHub", icon: "fab fa-github", url: "https://github.com/Rafie1715", color: "hover:text-gray-900 dark:hover:text-white", external: true },
    { label: "LinkedIn", icon: "fab fa-linkedin", url: "https://linkedin.com/in/rafie-rojagat", color: "hover:text-[#0077b5]", external: true },
    { label: "Instagram", icon: "fab fa-instagram", url: "https://instagram.com/rafie_rb", color: "hover:text-[#E4405F]", external: true },
    { label: "Email", icon: "fas fa-envelope", url: "mailto:rojagatrafie@gmail.com", color: "hover:text-red-500", external: false },
  ];

  const footerLinks = [
    { name: t('navbar.home'), path: "/" },
    { name: t('navbar.about'), path: "/about" },
    { name: t('navbar.projects'), path: "/projects" },
    { name: t('navbar.workspace'), path: "/workspace" },
    { name: t('navbar.afk'), path: "/afk" },
    { name: t('navbar.contact'), path: "/contact" },
  ];

  const footerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6, 
        ease: "easeOut",
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <footer className="relative mt-20 border-t border-gray-200 dark:border-slate-800 bg-white/50 dark:bg-dark/50 backdrop-blur-xl transition-colors duration-300">        
      <motion.div 
        initial={{ opacity: 0.5, scaleX: 0.8 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent"
      ></motion.div>

      <div className="container mx-auto px-4 py-12">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12"
          variants={footerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
            
            <motion.div variants={itemVariants} className="flex flex-col items-center md:items-start space-y-4">
                <Link to="/" className="text-2xl font-bold text-dark dark:text-white tracking-tighter hover:text-primary transition-colors">
                    rafie<span className="text-primary">.dev</span>
                </Link>
                <p className="text-gray-500 dark:text-gray-400 text-sm text-center md:text-left leading-relaxed max-w-xs">
                    {t('footer.description')}
                </p>
                <div ref={visitorSlotRef} className="pt-2 min-h-6">
                    {showVisitorCounter && (
                      <Suspense fallback={null}>
                        <VisitorCounter />
                      </Suspense>
                    )}
                </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-col items-center md:items-start space-y-4">
                <h3 className="font-bold text-dark dark:text-white">{t('footer.quick_links')}</h3>
                <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2">
                    {footerLinks.map((link) => (
                        <Link 
                            key={link.path} // Ganti key jadi path karena name bisa berubah bahasa
                            to={link.path} 
                            className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors relative group"
                        >
                            {link.name}
                            <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-primary transition-all group-hover:w-full"></span>
                        </Link>
                    ))}
                </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-col items-center md:items-end space-y-4">
                <h3 className="font-bold text-dark dark:text-white">{t('footer.connect')}</h3>
                <div className="flex gap-4">
                    {socialLinks.map((social) => (
                        <motion.a 
                            key={social.label}
                            href={social.url}
                            target={social.external ? "_blank" : undefined}
                            rel={social.external ? "noreferrer" : undefined}
                            aria-label={social.label}
                            title={social.label}
                            whileHover={{ y: -3, scale: 1.1 }}
                            className={`w-10 h-10 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-gray-500 dark:text-gray-400 transition-colors shadow-sm ${social.color}`}
                        >
                            <i className={`${social.icon} text-lg`} aria-hidden="true"></i>
                        </motion.a>
                    ))}
                </div>
                <motion.a 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    href="/assets/CV Rafie Rojagat Bachri.pdf" 
                    download="CV_Rafie_Rojagat_Bachri.pdf"
                    className="text-xs font-bold px-4 py-2 rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-primary hover:text-white transition-all flex items-center gap-2 shadow-sm hover:shadow-md"
                >
                    <i className="fas fa-download"></i> {t('footer.download_cv')}
                </motion.a>
            </motion.div>
        </motion.div>

        <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="pt-8 border-t border-gray-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-400"
        >
            <p>© {currentYear} Rafie Rojagat. {t('footer.rights')}</p>
            <p className="flex items-center gap-1">
                {t('footer.made_with')} <span className="text-red-500 animate-pulse">❤</span> {t('footer.and')} <span className="text-amber-600">☕</span> {t('footer.in')} Jakarta
            </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
