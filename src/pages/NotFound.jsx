import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-white dark:bg-dark text-center px-4 overflow-hidden relative">
      <motion.h1 
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.1 }}
        className="text-[15rem] font-bold text-dark dark:text-white absolute select-none z-0"
      >
        404
      </motion.h1>

      <div className="relative z-10">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
            <i className="fas fa-ghost text-6xl text-primary mb-6 animate-bounce"></i>
        </motion.div>
        
        <h2 className="text-3xl md:text-5xl font-bold text-dark dark:text-white mb-4">
          Oops! Page Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>

        <Link 
          to="/" 
          className="inline-flex items-center px-8 py-3 bg-primary text-white rounded-full font-bold shadow-lg hover:bg-secondary transition-all hover:-translate-y-1"
        >
          <i className="fas fa-home mr-2"></i> Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;