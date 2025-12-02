import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Spotlight = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  const actions = [
    { id: 'home', title: 'Go to Home', type: 'section', icon: 'fas fa-home' },
    { id: 'about', title: 'Go to About', type: 'section', icon: 'fas fa-user' },
    { id: 'experience', title: 'Go to Experience', type: 'section', icon: 'fas fa-briefcase' },
    { id: 'projects', title: 'Go to Projects', type: 'section', icon: 'fas fa-code' },
    { id: 'skills', title: 'Go to Skills', type: 'section', icon: 'fas fa-tools' },
    { id: 'uses', title: 'Go to /Uses (My Gear)', type: 'page', url: '/uses', icon: 'fas fa-laptop-code' }, // <-- BARU
    { id: 'contact', title: 'Go to Contact', type: 'section', icon: 'fas fa-paper-plane' },
    { id: 'github', title: 'Visit GitHub', type: 'link', url: 'https://github.com/Rafie1715', icon: 'fab fa-github' },
    { id: 'linkedin', title: 'Visit LinkedIn', type: 'link', url: 'https://linkedin.com/in/rafie-rojagat', icon: 'fab fa-linkedin' },
    { id: 'theme', title: 'Toggle Theme', type: 'action', icon: 'fas fa-adjust' },
  ];

  const filteredActions = actions.filter(action =>
    action.title.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const handleNavigation = (e) => {
      if (!isOpen) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredActions.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredActions.length) % filteredActions.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        executeAction(filteredActions[selectedIndex]);
      }
    };
    window.addEventListener('keydown', handleNavigation);
    return () => window.removeEventListener('keydown', handleNavigation);
  }, [isOpen, filteredActions, selectedIndex]);

  const executeAction = (action) => {
    if (!action) return;

    if (action.type === 'section') {
      if (window.location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
            const element = document.getElementById(action.id);
            if (element) element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        const element = document.getElementById(action.id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (action.type === 'page') {
        navigate(action.url);
    } else if (action.type === 'link') {
      window.open(action.url, '_blank');
    } else if (action.type === 'action') {
      if (action.id === 'theme') {
        const themeBtn = document.querySelector('button[aria-label="Toggle Theme"]');
        if (themeBtn) themeBtn.click();
      }
    }
    
    setIsOpen(false);
    setQuery('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          ></motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="relative w-full max-w-lg bg-white dark:bg-darkLight rounded-xl shadow-2xl overflow-hidden border border-gray-200 dark:border-slate-700"
          >
            <div className="flex items-center px-4 py-4 border-b border-gray-100 dark:border-slate-700">
              <i className="fas fa-search text-gray-400 text-lg mr-3"></i>
              <input
                type="text"
                placeholder="Type a command (e.g., uses)..."
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value);
                    setSelectedIndex(0);
                }}
                className="w-full bg-transparent outline-none text-lg text-dark dark:text-white placeholder-gray-400"
                autoFocus
              />
              <span className="hidden md:inline text-xs bg-gray-100 dark:bg-slate-700 text-gray-500 px-2 py-1 rounded">ESC</span>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-2">
              {filteredActions.length > 0 ? (
                filteredActions.map((action, index) => (
                  <button
                    key={action.id}
                    onClick={() => executeAction(action)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`w-full text-left flex items-center px-4 py-3 rounded-lg transition-colors ${
                      index === selectedIndex
                        ? 'bg-primary text-white'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <i className={`${action.icon} w-6 text-center mr-3 ${index === selectedIndex ? 'text-white' : 'text-gray-400'}`}></i>
                    <span className="flex-1 font-medium">{action.title}</span>
                    {index === selectedIndex && (
                        <span className="text-xs opacity-70">Enter</span>
                    )}
                  </button>
                ))
              ) : (
                <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                  No results found for "{query}"
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Spotlight;