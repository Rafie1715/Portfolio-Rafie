import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usesData } from '../data/uses';
import SEO from '../components/SEO';
import SpotifyTopTracks from '../components/SpotifyTopTracks';
import { Link } from 'react-scroll';
import ThreeDCard from '../components/ThreeDCard';

const UsesPage = () => {
  const [activeSection, setActiveSection] = useState(usesData[0].category);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 50 }
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = usesData.map(s => document.getElementById(s.category));
      const scrollPosition = window.scrollY + 150;

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
    <div
      className="bg-white dark:bg-dark min-h-screen pt-24 pb-20 transition-colors duration-300 selection:bg-primary selection:text-white"
      style={{ perspective: "1000px" }}
    >

      <SEO
        title="Uses | Rafie Rojagat"
        description="Software, hardware, and tools I use for coding and productivity."
        url="https://rafie-dev.netlify.app/uses"
      />

      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16" data-aos="fade-down">
          <motion.div
            animate={{ y: [0, -15, 0], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="inline-block p-4 rounded-3xl bg-gradient-to-br from-primary to-secondary shadow-lg shadow-primary/30 mb-6"
          >
            <i className="fas fa-layer-group text-4xl text-white"></i>
          </motion.div>

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
                    className={`block pl-4 py-2 text-sm cursor-pointer transition-all border-l-2 -ml-[2px] ${activeSection === section.category
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
                  className={`block pl-4 py-2 text-sm cursor-pointer transition-all border-l-2 -ml-[2px] ${activeSection === 'music'
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
              <div key={index} id={section.category}>
                <motion.h2
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="text-2xl font-bold text-dark dark:text-white mb-8 flex items-center gap-3"
                >
                  <span className="text-primary">#</span> {section.category}
                </motion.h2>

                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 gap-8"
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                >
                  {section.items.map((item, idx) => {
                    const Wrapper = item.link ? 'a' : 'div';
                    const wrapperProps = item.link ? { href: item.link, target: "_blank", rel: "noopener noreferrer" } : {};

                    return (
                      <motion.div key={idx} variants={itemVariants} className="h-full">
                        <Wrapper {...wrapperProps} className="block h-full outline-none focus-visible:ring-4 focus-visible:ring-primary/50 rounded-2xl">
                          <ThreeDCard
                            className="group relative h-full bg-white dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-slate-700 p-6 shadow-sm transition-all duration-300 hover:shadow-2xl"
                            style={{
                              "--hover-shadow": item.color || "#6366f1"
                            }}
                          >
                            <style jsx>{`
            .group:hover {
              box-shadow: 0 20px 40px -10px var(--hover-shadow) !important;
              border-color: var(--hover-shadow) !important;
            }
          `}</style>

                            <div style={{ transform: "translateZ(30px)" }} className="relative z-10">
                              <div className="flex items-start justify-between mb-4">
                                <div
                                  className="w-12 h-12 rounded-xl flex items-center justify-center text-3xl shadow-inner transition-colors duration-300"
                                  style={{ backgroundColor: item.color ? `${item.color}15` : 'rgba(99, 102, 241, 0.1)' }}
                                >
                                  {item.icon}
                                </div>

                                <div className="flex flex-col items-end gap-1">
                                  {item.tags?.map((tag, i) => (
                                    <span
                                      key={i}
                                      className="text-[10px] font-bold px-2 py-0.5 rounded-md border"
                                      style={{
                                        borderColor: item.color ? `${item.color}40` : '#cbd5e1',
                                        color: item.color || '#64748b',
                                        backgroundColor: item.color ? `${item.color}10` : 'transparent'
                                      }}
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                  {!item.tags && (
                                    <div className="text-[10px] font-bold text-gray-300 dark:text-slate-600 border border-gray-200 dark:border-slate-600 px-2 py-1 rounded-md">
                                      REF
                                    </div>
                                  )}
                                </div>
                              </div>

                              <h3 className="font-bold text-dark dark:text-white text-lg mb-2 group-hover:text-primary transition-colors flex items-center gap-2" style={{ color: "inherit" }}>
                                <span className="group-hover:text-[var(--hover-shadow)] transition-colors">{item.name}</span>
                                {item.link && <i className="fas fa-external-link-alt text-xs opacity-0 group-hover:opacity-100 transition-opacity text-gray-400"></i>}
                              </h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                                {item.desc}
                              </p>
                            </div>

                            <div
                              style={{ transform: "translateZ(0px)" }}
                              className="absolute bottom-2 right-2 text-8xl opacity-5 pointer-events-none grayscale group-hover:grayscale-0 transition-all duration-500"
                            >
                              {item.icon}
                            </div>

                            <div
                              className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none mix-blend-overlay"
                              style={{
                                background: `linear-gradient(120deg, transparent 30%, ${item.color || '#ffffff'}40 50%, transparent 70%)`
                              }}
                            ></div>
                          </ThreeDCard>
                        </Wrapper>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </div>
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