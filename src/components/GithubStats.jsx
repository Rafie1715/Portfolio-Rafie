import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GitHubCalendar } from 'react-github-calendar';
import { FaGithub } from 'react-icons/fa';

const GithubStats = () => {
  const [blockSize, setBlockSize] = useState(15);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setBlockSize(9); 
      } else {
        setBlockSize(15); 
      }
    };

    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section className="py-10 px-4">      
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-dark dark:text-white mb-4 flex items-center justify-center gap-3">
          <FaGithub className="text-4xl md:text-5xl" />
          Coding Activity
        </h2>
        <div className="w-20 h-1.5 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full"></div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="flex justify-center w-full"
      >
        <div className="w-full overflow-x-auto flex justify-start md:justify-center pb-4 scrollbar-hide">
          <div className="min-w-[800px] md:min-w-fit px-2">
             <GitHubCalendar 
                username="Rafie1715" 
                colorScheme="dark"
                blockSize={blockSize} 
                blockMargin={4}
                fontSize={14}
                showWeekdayLabels={true}
             /> 
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default GithubStats;