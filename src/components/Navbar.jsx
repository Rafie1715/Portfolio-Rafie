import { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import useTheme from '../hooks/useTheme';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { name: "Home", to: "/" },
    { name: "About", to: "/about" },
    { name: "Projects", to: "/projects" },
    { name: "Uses", to: "/uses" },
    { name: "Contact", to: "/contact" },
  ];

  const navbarClasses = scrolled 
    ? 'bg-white/80 dark:bg-dark/80 shadow-sm backdrop-blur-md py-3' 
    : 'bg-transparent py-5';

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${navbarClasses}`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        
        <Link 
          to="/" 
          className="text-xl font-bold tracking-wider text-gray-800 dark:text-white hover:text-primary transition-colors"
        >
          Rafie<span className="text-primary">.</span>
        </Link>
        
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
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
              
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full opacity-0 group-hover:opacity-100"></span>
            </NavLink>
          ))}

          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-full bg-gray-100 dark:bg-slate-800 text-yellow-500 dark:text-yellow-400 hover:bg-gray-200 dark:hover:bg-slate-700 flex items-center justify-center transition-all duration-300 shadow-sm hover:scale-110"
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
          <button 
            onClick={toggleTheme} 
            className="text-xl transition-colors text-yellow-500 dark:text-yellow-400"
          >
             {theme === 'dark' ? <i className="fas fa-sun"></i> : <i className="fas fa-moon text-slate-600"></i>}
          </button>

          <button 
            className="text-2xl focus:outline-none text-gray-800 dark:text-white" 
            onClick={() => setIsOpen(!isOpen)}
          >
            <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </button>
        </div>
      </div>

      <div 
        className={`md:hidden absolute w-full bg-white dark:bg-dark shadow-xl border-b border-gray-100 dark:border-slate-800 overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="flex flex-col px-4 pb-6 pt-2 space-y-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.to}
              className={({ isActive }) => 
                `block py-3 px-4 rounded-lg text-base font-medium transition-colors ${
                  isActive 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;