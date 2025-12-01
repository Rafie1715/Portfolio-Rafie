// src/components/Navbar.jsx
import { useState, useEffect } from 'react';
import { Link as ScrollLink } from 'react-scroll';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import useTheme from '../hooks/useTheme'; // <-- Import Hook tadi

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme(); // <-- Pakai Hook
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", to: "home" },
    { name: "About", to: "about" },
    { name: "Experience", to: "experience" },
    { name: "Projects", to: "projects" },
    { name: "Skills", to: "skills" },
    { name: "Certifications", to: "certifications" },
    { name: "Contact", to: "contact" },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-dark/95 backdrop-blur-sm shadow-lg py-3' : 'bg-dark py-5'}`}>
      <div className="container mx-auto px-4 flex justify-between items-center text-white">
        <RouterLink to="/" className="text-xl font-bold tracking-wider hover:text-primary transition-colors">
          Rafie<span className="text-primary">.</span>
        </RouterLink>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            isHomePage ? (
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
            )
          ))}

          {/* Tombol Toggle Theme (Desktop) */}
          <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-full bg-slate-700 hover:bg-primary flex items-center justify-center transition-all duration-300"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <i className="fas fa-sun text-yellow-400 text-lg"></i>
            ) : (
              <i className="fas fa-moon text-white text-lg"></i>
            )}
          </button>
        </div>

        {/* Mobile Controls */}
        <div className="md:hidden flex items-center gap-4">
          {/* Tombol Toggle Theme (Mobile) */}
          <button
            onClick={toggleTheme}
            className="text-xl text-white hover:text-primary transition-colors"
          >
             {theme === 'dark' ? (
              <i className="fas fa-sun text-yellow-400"></i>
            ) : (
              <i className="fas fa-moon"></i>
            )}
          </button>

          <button className="text-2xl focus:outline-none" onClick={() => setIsOpen(!isOpen)}>
            <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden bg-dark absolute w-full shadow-xl overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="flex flex-col px-4 pb-4 space-y-2">
          {navLinks.map((link) => (
             isHomePage ? (
              <ScrollLink 
                key={link.name}
                to={link.to} 
                smooth={true}
                offset={-70}
                onClick={() => setIsOpen(false)}
                className="block py-2 text-white hover:text-primary border-b border-gray-700 last:border-0"
              >
                {link.name}
              </ScrollLink>
             ) : (
              <RouterLink
                key={link.name}
                to={`/#${link.to}`}
                onClick={() => setIsOpen(false)}
                className="block py-2 text-white hover:text-primary border-b border-gray-700 last:border-0"
              >
                {link.name}
              </RouterLink>
             )
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;