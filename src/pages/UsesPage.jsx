import { motion } from 'framer-motion';
import { usesData } from '../data/uses';
import SEO from '../components/SEO';
import SpotifyTopTracks from '../components/SpotifyTopTracks';

const UsesPage = () => {
  return (
    <div className="bg-white dark:bg-dark min-h-screen pt-24 pb-20 transition-colors duration-300">
      
      <SEO 
        title="Uses | Rafie Rojagat" 
        description="Software, hardware, and tools I use for coding and productivity."
        url="https://rafie-dev.netlify.app/uses" 
      />

      <div className="container mx-auto px-4 max-w-4xl">
        
        <div className="text-center mb-16" data-aos="fade-down">
          <h1 className="text-4xl md:text-5xl font-bold text-dark dark:text-white mb-6">
            /uses
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            A curated list of the tech I use, software I love, and other things that help me build software. Inspired by <a href="https://uses.tech/" target="_blank" rel="noreferrer" className="text-primary underline hover:text-secondary">uses.tech</a>.
          </p>
        </div>

        <div className="space-y-16">
          {usesData.map((section, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <h2 className="text-2xl font-bold text-primary mb-8 border-b border-gray-200 dark:border-slate-700 pb-2 inline-block">
                {section.category}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {section.items.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-start p-4 rounded-xl bg-gray-50 dark:bg-darkLight border border-gray-100 dark:border-slate-700 hover:shadow-md transition-all group"
                  >
                    <span className="text-3xl mr-4 group-hover:scale-110 transition-transform block">
                        {item.icon}
                    </span>
                    <div>
                      <h3 className="font-bold text-dark dark:text-white text-lg">
                        {item.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20"
        >
            <div className="flex items-center justify-between mb-8 border-b border-gray-200 dark:border-slate-700 pb-2">
                <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
                    <i className="fab fa-spotify text-[#1DB954]"></i> On Repeat
                </h2>
                <span className="text-xs text-gray-400 bg-gray-100 dark:bg-slate-800 px-2 py-1 rounded-full">
                    Last 4 Weeks
                </span>
            </div>
            
            <p className="mb-6 text-gray-600 dark:text-gray-400">
                Music is my fuel. Here's what I've been jamming to while coding recently.
            </p>

            <SpotifyTopTracks />
        </motion.div>

        <div className="mt-20 text-center text-sm text-gray-400 border-t border-gray-100 dark:border-slate-800 pt-8">
            <p>Note: These are tools I genuinely use and enjoy. No affiliate links here.</p>
        </div>

      </div>
    </div>
  );
};

export default UsesPage;