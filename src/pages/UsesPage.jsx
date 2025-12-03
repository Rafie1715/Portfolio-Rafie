import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usesData } from '../data/uses';
import SEO from '../components/SEO';
import SpotifyTopTracks from '../components/SpotifyTopTracks';
import SpotlightCard from '../components/SpotlightCard';
import { Link } from 'react-scroll';

const UsesPage = () => {
  const [activeSection, setActiveSection] = useState(usesData[0].category);

  useEffect(() => {
    const handleScroll = () => {
      const sections = usesData.map(s => document.getElementById(s.category));
      const scrollPosition = window.scrollY + 150; // Offset

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(usesData[i].category);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-white dark:bg-dark min-h-screen pt-24 pb-20 transition-colors duration-300 selection:bg-primary selection:text-white">
      
      <SEO 
        title="Uses | Rafie Rojagat" 
        description="Software, hardware, and tools I use for coding and productivity."
        url="https://rafie-dev.netlify.app/uses" 
      />

      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16" data-aos="fade-down">
          <h1 className="text-4xl md:text-6xl font-bold text-dark dark:text-white mb-6 tracking-tight">
            /uses
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            A curated list of the tech I use daily. Inspired by <a href="https://uses.tech/" className="text-primary hover:underline">uses.tech</a>.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 relative">
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-32">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
                Categories
              </h3>
              <div className="space-y-1 border-l-2 border-gray-100 dark:border-slate-800">
                {usesData.map((section) => (
                  <Link
                    key={section.category}
                    to={section.category}
                    smooth={true}
                    duration={500}
                    offset={-100}
                    className={`block pl-4 py-2 text-sm cursor-pointer transition-all border-l-2 -ml-[2px] ${
                      activeSection === section.category
                        ? 'border-primary text-primary font-bold'
                        : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
                    }`}
                  >
                    {section.category}
                  </Link>
                ))}
                <Link
                    to="music"
                    smooth={true}
                    duration={500}
                    offset={-100}
                    className={`block pl-4 py-2 text-sm cursor-pointer transition-all border-l-2 -ml-[2px] ${
                      activeSection === 'music'
                        ? 'border-[#1DB954] text-[#1DB954] font-bold'
                        : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
                    }`}
                    onClick={() => setActiveSection('music')}
                  >
                    On Repeat 🎵
                  </Link>
              </div>
            </div>
          </aside>

          <div className="flex-1 space-y-24">
            {usesData.map((section, index) => (
              <motion.div 
                key={index}
                id={section.category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <h2 className="text-2xl font-bold text-dark dark:text-white mb-8 flex items-center gap-3">
                  <span className="text-primary">#</span> {section.category}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {section.items.map((item, idx) => (
                    <SpotlightCard 
                      key={idx} 
                      className="flex flex-col p-6 bg-gray-50/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 transition-all h-full"
                    >
                      <div className="flex items-center gap-4 mb-3">
                          <div className="text-3xl">{item.icon}</div>
                          <h3 className="font-bold text-dark dark:text-white text-lg group-hover:text-primary transition-colors">
                              {item.name}
                          </h3>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                        {item.desc}
                      </p>
                    </SpotlightCard>
                  ))}
                </div>
              </motion.div>
            ))}

            <motion.div 
              id="music" 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="pt-8"
            >
                <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-gray-200 dark:border-slate-700 rounded-3xl p-8 md:p-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                        <h2 className="text-2xl font-bold text-dark dark:text-white flex items-center gap-3">
                            <i className="fab fa-spotify text-[#1DB954] text-3xl"></i> 
                            On Repeat
                        </h2>
                        <div className="text-xs font-bold text-[#1DB954] bg-[#1DB954]/10 px-3 py-1 rounded-full">
                           Live from Spotify
                        </div>
                    </div>
                    <SpotifyTopTracks />
                </div>
            </motion.div>

          </div>
        </div>

        <div className="mt-24 text-center border-t border-gray-100 dark:border-slate-800 pt-8 text-gray-400 text-sm">
            <p>Note: None of these are affiliate links.</p>
        </div>

      </div>
    </div>
  );
};

export default UsesPage;