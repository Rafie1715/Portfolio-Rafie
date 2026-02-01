import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { experiences } from '../data/experience';
import SpotlightCard from './SpotlightCard';
import { useTranslation } from 'react-i18next';

const DocCarousel = ({ docs, setSelectedImage }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (docs.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % docs.length);
    }, 4000); 
    return () => clearInterval(timer);
  }, [docs.length]);

  return (
    <div 
      className="relative w-full h-64 md:h-full min-h-[280px] rounded-xl overflow-hidden group cursor-pointer shadow-inner border border-gray-200 dark:border-slate-700 bg-gray-100 dark:bg-slate-800"
      onClick={() => setSelectedImage(docs[index])}
    >
      <AnimatePresence mode="popLayout">
        <motion.img
          key={index}
          src={docs[index]}
          alt={`Documentation ${index + 1}`}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.0, ease: "easeOut" }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60 transition-opacity group-hover:opacity-40" />
      {docs.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {docs.map((_, i) => (
            <motion.div
              key={i}
              className={`h-1.5 rounded-full shadow-sm backdrop-blur-md transition-all duration-500 ${
                i === index ? 'w-8 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'
              }`}
              layout
            />
          ))}
        </div>
      )}

      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/30 backdrop-blur-[2px]">
        <span className="text-white text-xs font-bold border border-white/50 px-5 py-2.5 rounded-full flex items-center gap-2 bg-black/50 shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-transform">
            <i className="fas fa-expand-arrows-alt"></i> Perbesar Foto
        </span>
      </div>
    </div>
  );
};

const Experience = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;

  return (
    <section id="experience" className="py-24 bg-white dark:bg-dark relative overflow-hidden">      
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

      <div className="container mx-auto px-4 max-w-6xl"> 
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-dark dark:text-white mb-4"
          >
            {t('experience.title')}
          </motion.h2>
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: 100 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="h-1.5 bg-gradient-to-r from-primary to-blue-500 mx-auto rounded-full"
          ></motion.div>
        </div>

        <div className="relative pl-8 md:pl-12">          
          <div className="absolute left-[9px] md:left-[11px] top-4 bottom-0 w-0.5 bg-gray-200 dark:bg-slate-800"></div>          
          <motion.div 
             initial={{ height: 0 }}
             whileInView={{ height: "100%" }}
             viewport={{ once: true }}
             transition={{ duration: 2.5, ease: "linear" }}
             className="absolute left-[9px] md:left-[11px] top-4 w-0.5 bg-gradient-to-b from-primary via-blue-500 to-primary origin-top shadow-[0_0_10px_rgba(var(--color-primary),0.5)]"
          ></motion.div>

          <div className="space-y-16">
            {experiences.map((exp, index) => (
              <ExperienceItem 
                key={exp.id} 
                exp={exp} 
                index={index} 
                setSelectedImage={setSelectedImage} 
                lang={currentLang}
                t={t}
              />
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center p-4 backdrop-blur-md"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative max-w-7xl w-full max-h-screen flex justify-center p-2"
                onClick={(e) => e.stopPropagation()} 
            >
                <img
                    src={selectedImage}
                    alt="Preview"
                    className="w-auto h-auto max-h-[90vh] max-w-full object-contain rounded-xl shadow-2xl border border-white/10"
                />
                <button
                    className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors bg-black/50 hover:bg-black/80 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/10"
                    onClick={() => setSelectedImage(null)}
                >
                    <i className="fas fa-times text-xl"></i>
                </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

const ExperienceItem = ({ exp, index, setSelectedImage, lang, t }) => {
    const getData = (data) => {
        if (data && typeof data === 'object' && !Array.isArray(data) && data[lang]) {
            return data[lang];
        }
        return data; 
    };

    const title = getData(exp.title);
    const date = getData(exp.date);
    const description = getData(exp.description);

    return (
        <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="relative group"
        >
            <motion.div 
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
                className="absolute -left-[34px] md:-left-[49px] top-8 w-[22px] h-[22px] bg-white dark:bg-dark rounded-full border-[4px] border-primary shadow-[0_0_0_4px_rgba(var(--color-primary),0.15)] z-10 group-hover:scale-125 transition-transform duration-300"
            ></motion.div>

            <SpotlightCard className="p-0 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl">
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">                    
                    <div className="lg:col-span-7 p-6 md:p-8 flex flex-col justify-between">
                        <div>
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6 border-b border-gray-100 dark:border-slate-700/50 pb-6">
                                <div className="flex items-center gap-4">
                                    <motion.div 
                                      whileHover={{ rotate: 360, scale: 1.1 }}
                                      transition={{ duration: 0.8 }}
                                      className="p-1 bg-white dark:bg-slate-700 rounded-full shadow-sm flex-shrink-0"
                                    >
                                        <img 
                                            src={exp.logo} 
                                            alt={exp.org} 
                                            loading="lazy" 
                                            className="w-14 h-14 rounded-full object-cover" 
                                        />
                                    </motion.div>
                                    <div>
                                        <h3 className="font-bold text-dark dark:text-white text-xl md:text-2xl leading-tight group-hover:text-primary transition-colors">
                                            {title}
                                        </h3>
                                        <p className="text-primary font-semibold text-sm md:text-base mt-1">{exp.org}</p>
                                    </div>
                                </div>
                                
                                <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-gray-50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 text-gray-600 dark:text-gray-300 rounded-full text-xs font-bold uppercase tracking-wide whitespace-nowrap self-start">
                                    <i className="far fa-calendar-alt"></i>
                                    {date}
                                </span>
                            </div>

                            <ul className="space-y-3 mb-6">
                                {Array.isArray(description) && description.map((item, i) => (
                                    <li key={i} className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed flex items-start group/li">
                                        <span className="mr-3 mt-1.5 w-1.5 h-1.5 bg-gray-300 dark:bg-slate-500 rounded-full flex-shrink-0 group-hover/li:bg-primary transition-colors"></span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="lg:hidden mt-4 text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                             <i className="fas fa-images"></i> {t('experience.docs')} &darr;
                        </div>
                    </div>

                    <div className="lg:col-span-5 bg-gray-50 dark:bg-slate-900/50 border-t lg:border-t-0 lg:border-l border-gray-100 dark:border-slate-700 p-2 lg:p-0">
                        {exp.docs && exp.docs.length > 0 ? (
                            <div className="h-full flex flex-col">
                                <DocCarousel docs={exp.docs} setSelectedImage={setSelectedImage} />
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-400 text-sm italic p-10 bg-gray-50 dark:bg-slate-800/30">
                                No documentation available
                            </div>
                        )}
                    </div>
                </div>
            </SpotlightCard>
        </motion.div>
    );
};

export default Experience;