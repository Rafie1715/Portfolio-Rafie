import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import VisitorCounter from './VisitorCounter';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: "fab fa-github", url: "https://github.com/Rafie1715", color: "hover:text-gray-900 dark:hover:text-white" },
    { icon: "fab fa-linkedin", url: "https://linkedin.com/in/rafie-rojagat", color: "hover:text-[#0077b5]" },
    { icon: "fab fa-instagram", url: "https://instagram.com/rafie_rb", color: "hover:text-[#E4405F]" },
    { icon: "fas fa-envelope", url: "mailto:rojagatrafie@gmail.com", color: "hover:text-red-500" },
  ];

  const footerLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Projects", path: "/projects" },
    { name: "Workspace", path: "/workspace" },
    { name: "AFK", path: "/afk" },
    { name: "Contact", path: "/contact" },
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
                    Building digital experiences with code and creativity. Let's create something amazing together.
                </p>
                <div className="pt-2">
                    <VisitorCounter />
                </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-col items-center md:items-start space-y-4">
                <h3 className="font-bold text-dark dark:text-white">Quick Links</h3>
                <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2">
                    {footerLinks.map((link) => (
                        <Link 
                            key={link.name}
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
                <h3 className="font-bold text-dark dark:text-white">Connect</h3>
                <div className="flex gap-4">
                    {socialLinks.map((social, idx) => (
                        <motion.a 
                            key={idx}
                            href={social.url}
                            target="_blank" 
                            rel="noreferrer"
                            whileHover={{ y: -3, scale: 1.1 }}
                            className={`w-10 h-10 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-gray-500 dark:text-gray-400 transition-colors shadow-sm ${social.color}`}
                        >
                            <i className={`${social.icon} text-lg`}></i>
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
                    <i className="fas fa-download"></i> Download CV
                </motion.a>
            </motion.div>
        </motion.div>

        <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="pt-8 border-t border-gray-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-400"
        >
            <p>© {currentYear} Rafie Rojagat. All rights reserved.</p>
            <p className="flex items-center gap-1">
                Made with <span className="text-red-500 animate-pulse">❤</span> and <span className="text-amber-600">☕</span> in Jakarta
            </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;