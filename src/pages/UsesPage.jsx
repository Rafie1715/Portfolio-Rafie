// src/pages/UsesPage.jsx
import { motion } from 'framer-motion';
import { usesData } from '../data/uses';
import SEO from '../components/SEO';
import SpotifyTopTracks from '../components/SpotifyTopTracks';
import SpotlightCard from '../components/SpotlightCard'; // <-- Import SpotlightCard

const UsesPage = () => {
  return (
    <div className="bg-white dark:bg-dark min-h-screen pt-24 pb-20 transition-colors duration-300">
      
      <SEO 
        title="Uses | Rafie Rojagat" 
        description="Software, hardware, and tools I use for coding and productivity."
        url="https://rafie-dev.netlify.app/uses" 
      />

      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* Header */}
        <div className="text-center mb-16" data-aos="fade-down">
          <h1 className="text-4xl md:text-5xl font-bold text-dark dark:text-white mb-6">
            /uses
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            A curated list of the tech I use, software I love, and other things that help me build software. 
            Inspired by <a href="https://uses.tech/" target="_blank" rel="noreferrer" className="text-primary font-semibold underline decoration-2 decoration-primary/30 hover:decoration-primary transition-all">uses.tech</a>.
          </p>
        </div>

        {/* Content Grid */}
        <div className="space-y-20">
          {usesData.map((section, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <h2 className="text-2xl font-bold text-dark dark:text-white mb-8 border-l-4 border-primary pl-4">
                {section.category}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {section.items.map((item, idx) => (
                  // Gunakan SpotlightCard di sini
                  <SpotlightCard 
                    key={idx} 
                    className="flex flex-col h-full p-6 hover:shadow-lg transition-shadow duration-300 bg-gray-50/50 dark:bg-slate-800/50"
                  >
                    <div className="flex items-start justify-between mb-4 relative z-10">
                        <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-white dark:bg-slate-700 shadow-sm text-2xl border border-gray-100 dark:border-slate-600">
                            {item.icon}
                        </div>
                    </div>
                    
                    <div className="relative z-10">
                      <h3 className="font-bold text-dark dark:text-white text-lg mb-1 group-hover:text-primary transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </SpotlightCard>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Top Tracks Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24 pt-12 border-t border-gray-100 dark:border-slate-800"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-dark dark:text-white flex items-center gap-2">
                        <i className="fab fa-spotify text-[#1DB954] text-3xl"></i> 
                        On Repeat
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">
                        Music is my fuel. Here's what I've been jamming to recently.
                    </p>
                </div>
                <span className="self-start md:self-center text-xs font-bold text-primary bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-full uppercase tracking-wider">
                    Last 4 Weeks
                </span>
            </div>

            <SpotifyTopTracks />
        </motion.div>

        {/* Footer Note */}
        <div className="mt-24 text-center pb-8">
            <p className="text-sm text-gray-400 border-t border-gray-100 dark:border-slate-800 pt-8 inline-block px-8">
                Note: These are tools I genuinely use and enjoy. No affiliate links here.
            </p>
        </div>

      </div>
    </div>
  );
};

export default UsesPage;