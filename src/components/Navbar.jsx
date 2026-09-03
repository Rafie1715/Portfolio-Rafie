import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import useTheme from '../hooks/useTheme';
import { useTranslation } from 'react-i18next'; // 1. Import Hook

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const nextLanguage = i18n.language === 'en' ? 'Indonesian' : 'English';
  const nextTheme = theme === 'dark' ? 'light' : 'dark';

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'id' : 'en';
    i18n.changeLanguage(newLang);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: t('navbar.home'), to: "/" },
    { name: t('navbar.about'), to: "/about" },
    { name: t('navbar.projects'), to: "/projects" },
    { name: t('navbar.blog'), to: "/blog" },
    { name: t('navbar.workspace'), to: "/workspace" },
    { name: t('navbar.contact'), to: "/contact" },
  ];

  const navbarClasses = scrolled 
    ? 'bg-white/80 dark:bg-dark/80 shadow-sm backdrop-blur-md py-3' 
    : 'bg-transparent py-5';

  return (
    <nav aria-label="Primary navigation" className={`fixed w-full z-50 transition-all duration-300 ${navbarClasses}`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        
        <Link 
          to="/" 
          className="text-xl font-bold tracking-wider text-gray-800 dark:text-white hover:text-primary transition-colors"
        >
          Rafie<span className="text-primary">.</span>
        </Link>
        
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <div key={link.to} className="relative">
              <NavLink
                to={link.to}
                className={({ isActive }) => 
                  `text-sm font-medium transition-colors hover:text-primary relative group ${
                    isActive 
                      ? 'text-primary font-bold' 
                      : 'text-gray-600 dark:text-gray-300'
                  }`
                }
              >
                {link.name}
              </NavLink>
              <motion.span 
                className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-primary to-blue-400"
                initial={{ width: 0 }}
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            </div>
          ))}

          <button
            onClick={toggleLanguage}
            className="px-3 py-2 min-h-[44px] min-w-[44px] rounded text-xs font-bold border border-gray-300 dark:border-slate-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            title={`Switch to ${nextLanguage}`}
            aria-label={`Switch to ${nextLanguage}`}
          >
            {i18n.language === 'en' ? 'ID' : 'EN'}
          </button>

          <button
            onClick={toggleTheme}
            className="w-10 h-10 sm:w-11 sm:h-11 min-h-[44px] min-w-[44px] rounded-full bg-gray-100 dark:bg-slate-800 text-yellow-500 dark:text-yellow-400 hover:bg-gray-200 dark:hover:bg-slate-700 flex items-center justify-center transition-all duration-300 shadow-sm hover:scale-110"
            aria-label={`Switch to ${nextTheme} mode`}
            title={`Switch to ${nextTheme} mode`}
          >
            {theme === 'dark' ? (
              <i className="fas fa-sun text-lg"></i>
            ) : (
              <i className="fas fa-moon text-slate-600 text-lg"></i>
            )}
          </button>
        </div>

        <div className="md:hidden flex items-center gap-3">
          <button
            onClick={toggleLanguage}
            className="px-3 py-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-sm font-bold text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-all"
            title={`Switch to ${nextLanguage}`}
            aria-label={`Switch to ${nextLanguage}`}
          >
            {i18n.language === 'en' ? 'ID' : 'EN'}
          </button>

          <button 
            onClick={toggleTheme} 
            className="p-2 min-h-[44px] min-w-[44px] text-xl transition-colors text-yellow-500 dark:text-yellow-400 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800"
            aria-label={`Switch to ${nextTheme} mode`}
            title={`Switch to ${nextTheme} mode`}
          >
             {theme === 'dark' ? <i className="fas fa-sun"></i> : <i className="fas fa-moon text-slate-600"></i>}
          </button>

          <button 
            className="p-2 min-h-[44px] min-w-[44px] text-2xl focus:outline-none text-gray-800 dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-all" 
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
          >
            <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id="mobile-navigation"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="absolute left-0 top-full w-full overflow-hidden border-b border-gray-100 bg-white shadow-xl dark:border-slate-800 dark:bg-dark md:hidden"
          >
            <div className="flex flex-col space-y-1 px-4 pb-6 pt-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `block rounded-lg px-4 py-3 text-base font-medium transition-colors ${
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-slate-800'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
