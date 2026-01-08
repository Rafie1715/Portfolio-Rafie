import { motion } from 'framer-motion';
import { GitHubCalendar } from 'react-github-calendar';

const GithubStats = () => {
  return (
    <div className="w-full flex flex-col items-center gap-6 py-8">
      
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-dark dark:text-white mb-4">
          Coding Activity
        </h2>
        <div className="w-20 h-1.5 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full"></div>
      </motion.div>

      <div className="flex justify-center">
        <GitHubCalendar username="Rafie1715" /> 
      </div>

    </div>
  );
};

export default GithubStats;