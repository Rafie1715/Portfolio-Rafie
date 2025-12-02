import { useState, useEffect } from 'react';
import { Link as ScrollLink } from 'react-scroll';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import useTheme from '../hooks/useTheme';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", to: "home", type: "scroll" },
    { name: "About", to: "about", type: "scroll" },
    { name: "Experience", to: "experience", type: "scroll" },
    { name: "Projects", to: "projects", type: "scroll" },
    { name: "Skills", to: "skills", type: "scroll" },
    { name: "Certifications", to: "certifications", type: "scroll" },
    { name: "Uses", to: "/uses", type: "page" }, // <-- Link Halaman Baru
    { name: "Contact", to: "contact", type: "scroll" },
  ];

  const navbarClasses = scrolled 
    ? 'bg-white/90 dark:bg-dark/90 shadow-md backdrop-blur-sm py-3' 
    : 'bg-transparent py-5';

  const textClasses = 'text-gray-800 dark:text-white';

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${navbarClasses}`}>
      <div className={`container mx-auto px-4 flex justify-between items-center ${textClasses}`}>
        
        <RouterLink to="/" className="text-xl font-bold tracking-wider hover:text-primary transition-colors">
          Rafie<span className="text-primary">.</span>
        </RouterLink>
        
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => {
            if (link.type === "page") {
              return (
                <RouterLink
                  key={link.name}
                  to={link.to}
                  className="cursor-pointer text-sm font-medium hover:text-primary transition-colors"
                >
                  {link.name}
                </RouterLink>
              );
            }

            return isHomePage ? (
              <ScrollLink 
                key={link.name}
                to={link.to} 
                smooth={true} 
                duration={500}
                offset={-70}
                className="cursor-pointer text-sm font-medium hover:text-primary transition-colors relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
              </ScrollLink>
            ) : (
              <RouterLink 
                key={link.name}
                to={`/#${link.to}`}
                className="cursor-pointer text-sm font-medium hover:text-primary transition-colors"
              >
                {link.name}
              </RouterLink>
            );
          })}

          <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-full bg-gray-100 dark:bg-slate-800 text-yellow-500 dark:text-yellow-400 hover:bg-gray-200 dark:hover:bg-slate-700 flex items-center justify-center transition-all duration-300 shadow-sm"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <i className="fas fa-sun text-lg"></i>
            ) : (
              <i className="fas fa-moon text-slate-600 text-lg"></i>
            )}
          </button>
        </div>

        <div className="md:hidden flex items-center gap-4">
          <button onClick={toggleTheme} className="text-xl transition-colors text-yellow-500 dark:text-yellow-400">
             {theme === 'dark' ? <i className="fas fa-sun"></i> : <i className="fas fa-moon text-slate-600"></i>}
          </button>

          <button className="text-2xl focus:outline-none" onClick={() => setIsOpen(!isOpen)}>
            <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </button>
        </div>
      </div>

      <div className={`md:hidden absolute w-full shadow-xl overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} bg-white dark:bg-dark`}>
        <div className="flex flex-col px-4 pb-4 space-y-2">
          {navLinks.map((link) => {
             if (link.type === "page") {
                return (
                  <RouterLink
                    key={link.name}
                    to={link.to}
                    onClick={() => setIsOpen(false)}
                    className="block py-2 text-gray-800 dark:text-white hover:text-primary border-b border-gray-100 dark:border-slate-800 last:border-0"
                  >
                    {link.name}
                  </RouterLink>
                );
             }

             return isHomePage ? (
              <ScrollLink 
                key={link.name}
                to={link.to} 
                smooth={true}
                offset={-70}
                onClick={() => setIsOpen(false)}
                className="block py-2 text-gray-800 dark:text-white hover:text-primary border-b border-gray-100 dark:border-slate-800 last:border-0"
              >
                {link.name}
              </ScrollLink>
             ) : (
              <RouterLink
                key={link.name}
                to={`/#${link.to}`}
                onClick={() => setIsOpen(false)}
                className="block py-2 text-gray-800 dark:text-white hover:text-primary border-b border-gray-100 dark:border-slate-800 last:border-0"
              >
                {link.name}
              </RouterLink>
             );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;