// src/components/Navbar.jsx
import { useState, useEffect } from 'react';
// Kita pakai 'react-scroll' untuk scroll di halaman Home, 
// tapi pakai 'react-router-dom' untuk navigasi jika kita sedang di halaman Detail.
import { Link as ScrollLink } from 'react-scroll';
import { Link as RouterLink, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
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
        <div className="hidden md:flex space-x-8">
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
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-2xl focus:outline-none" onClick={() => setIsOpen(!isOpen)}>
          <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </button>
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