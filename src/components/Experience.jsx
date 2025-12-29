import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { experiences } from '../data/experience';
import SpotlightCard from './SpotlightCard';

const Experience = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <section id="experience" className="py-24 bg-white dark:bg-dark relative overflow-hidden">      
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

      <div className="container mx-auto px-4">        
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-dark dark:text-white mb-4"
          >
            Experience
          </motion.h2>
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: 80 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="h-1.5 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full"
          ></motion.div>
        </div>

        <div className="max-w-4xl mx-auto relative">
          <div className="absolute left-[28px] md:left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-slate-700 -translate-x-1/2"></div>          
          <motion.div 
             initial={{ height: 0 }}
             whileInView={{ height: "100%" }}
             viewport={{ once: true }}
             transition={{ duration: 2.5, ease: "easeInOut" }}
             className="absolute left-[28px] md:left-1/2 top-0 w-0.5 bg-gradient-to-b from-primary to-secondary -translate-x-1/2 origin-top"
          ></motion.div>

          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <ExperienceItem key={exp.id} exp={exp} index={index} setSelectedImage={setSelectedImage} />
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
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="relative max-w-5xl w-full max-h-screen"
                onClick={(e) => e.stopPropagation()} 
            >
                <img
                    src={selectedImage}
                    alt="Full Preview"
                    className="w-full h-auto max-h-[90vh] object-contain rounded-xl shadow-2xl"
                />
                <button
                    className="absolute -top-12 right-0 md:-right-10 text-white text-3xl hover:text-primary transition-colors bg-white/10 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md"
                    onClick={() => setSelectedImage(null)}
                >
                    &times;
                </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

const ExperienceItem = ({ exp, index, setSelectedImage }) => {
    const isEven = index % 2 === 0;

    return (
        <motion.div 
            initial={{ opacity: 0, x: isEven ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: index * 0.1, type: "spring", stiffness: 50 }}
            className={`relative flex items-start md:items-center gap-6 md:gap-0 ${isEven ? 'md:flex-row-reverse' : ''}`}
        >
            <div className="hidden md:block md:w-1/2"></div>
            <motion.div 
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
                className="absolute left-[28px] md:left-1/2 -translate-x-1/2 w-4 h-4 bg-primary rounded-full border-4 border-white dark:border-dark shadow-sm z-10"
            ></motion.div>

            <div className="flex-1 ml-12 md:ml-0 md:w-1/2 md:px-10">
                <SpotlightCard className="p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800/50">
                    <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-100 dark:border-slate-700/50 relative z-10">
                        <motion.img 
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.8 }}
                            src={exp.logo} 
                            alt={exp.org} 
                            loading="lazy" 
                            className="w-12 h-12 rounded-full object-cover shadow-sm bg-white" 
                        />
                        <div>
                            <h3 className="font-bold text-dark dark:text-white text-lg leading-tight">{exp.title}</h3>
                            <p className="text-primary text-sm font-medium">{exp.org}</p>
                        </div>
                    </div>

                    <ul className="space-y-2 mb-6 relative z-10">
                        {exp.description.map((item, i) => (
                            <li key={i} className="text-gray-600 dark:text-gray-300 text-sm flex items-start">
                                <span className="mr-2 mt-1.5 w-1.5 h-1.5 bg-primary/60 rounded-full flex-shrink-0"></span>
                                {item}
                            </li>
                        ))}
                    </ul>

                    {exp.docs && exp.docs.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-50 dark:border-slate-700/50">
                            <h6 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <i className="fas fa-camera"></i> Documentation
                            </h6>
                            <div className="flex flex-wrap gap-3">
                                {exp.docs.map((doc, idx) => (
                                    <motion.img
                                        key={idx}
                                        whileHover={{ scale: 1.05, rotate: 2 }}
                                        src={doc}
                                        alt={`Doc ${idx + 1}`}
                                        loading="lazy"
                                        className="w-20 h-14 object-cover rounded-lg border border-gray-200 dark:border-slate-600 cursor-pointer shadow-sm"
                                        onClick={() => setSelectedImage(doc)}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="mt-4 pt-2 text-right">
                        <span className="inline-block px-3 py-1 bg-gray-50 dark:bg-slate-700/50 border border-gray-100 dark:border-slate-600 text-gray-500 dark:text-gray-300 rounded-full text-xs font-medium">
                            <i className="far fa-calendar-alt mr-2"></i>
                            {exp.date}
                        </span>
                    </div>
                </SpotlightCard>
            </div>
        </motion.div>
    );
};

export default Experience;