import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { experiences } from '../data/experience';
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
      className="relative w-full aspect-video rounded-xl overflow-hidden group cursor-pointer shadow-inner border border-gray-200 dark:border-slate-700 bg-gray-100 dark:bg-slate-800 mt-4"
      onClick={(e) => {
        e.stopPropagation();
        setSelectedImage(docs[index]);
      }}
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

      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 transition-opacity group-hover:opacity-40" />
      
      {docs.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {docs.map((_, i) => (
            <motion.div
              key={i}
              className={`h-1 rounded-full shadow-sm backdrop-blur-md transition-all duration-500 ${
                i === index ? 'w-6 bg-white' : 'w-1.5 bg-white/50 hover:bg-white/80'
              }`}
              layout
            />
          ))}
        </div>
      )}

      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 backdrop-blur-[1px]">
        <span className="text-white text-[10px] font-bold border border-white/50 px-3 py-1.5 rounded-full flex items-center gap-2 bg-black/50 shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform">
            <i className="fas fa-expand-arrows-alt"></i> Zoom
        </span>
      </div>
    </div>
  );
};

const Timeline = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || 'en';
  const [selectedImage, setSelectedImage] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const getData = (data) => {
    if (!data) return "";
    if (typeof data === 'object' && !Array.isArray(data)) {
      return data[currentLang] || data.en || "";
    }
    return data;
  };

  const getDescList = (descData) => {
    if (!descData) return [];
    if (Array.isArray(descData)) return descData;
    return descData[currentLang] || descData.en || [];
  };

  return (
    <div className="relative container mx-auto px-4 py-12 max-w-4xl">
      {/* Timeline Vertical Line */}
      <div className="absolute left-8 md:left-1/2 md:-translate-x-1/2 top-0 h-full w-1.5 bg-gradient-to-b from-transparent via-primary to-transparent z-0"
        style={{ 
          boxShadow: '0 0 20px rgba(37, 99, 235, 0.6)'
        }}
      ></div>

      <div className="space-y-16">
        {experiences.map((exp, index) => {
          const title = getData(exp.title);
          const date = getData(exp.date);
          const descList = getDescList(exp.description);
          const isHovered = hoveredIndex === index;

          return (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="relative"
            >
              {/* Mobile Layout */}
              <div className="md:hidden flex gap-6">
                {/* Logo */}
                <div className="relative flex-shrink-0">
                  <motion.div 
                    className="w-16 h-16 rounded-full border-4 border-white dark:border-dark bg-white dark:bg-slate-800 shadow-lg z-20 overflow-hidden flex items-center justify-center"
                    animate={isHovered ? { scale: 1.2, boxShadow: '0 0 25px rgba(37, 99, 235, 0.8)' } : { scale: 1, boxShadow: 'none' }}
                    transition={{ duration: 0.3 }}
                  >
                    <img src={exp.logo} alt="Logo" loading="lazy" className="w-full h-full object-contain p-2" />
                  </motion.div>

                  {/* Pulse */}
                  <motion.div
                    className="absolute inset-0 w-16 h-16 rounded-full border-2 border-primary/40 pointer-events-none"
                    animate={isHovered ? { scale: 1.5, opacity: 0 } : { scale: 1, opacity: 0.6 }}
                    transition={{ duration: 0.6, repeat: Infinity }}
                  />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <motion.div
                    animate={isHovered ? { y: -4 } : { y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="p-5 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-100 dark:border-slate-700 hover:shadow-xl transition-shadow"
                  >
                    <motion.p 
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className="text-xs font-bold text-primary mb-1"
                    >
                      {date}
                    </motion.p>
                    <motion.h3 
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 0.15 }}
                      className="text-lg font-bold text-dark dark:text-white mb-0.5"
                    >
                      {title}
                    </motion.h3>
                    <motion.p 
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-3"
                    >
                      {exp.org}
                    </motion.p>

                    <ul className="space-y-2">
                      {descList.map((point, i) => ( 
                        <motion.li 
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.25 + i * 0.05 }}
                          className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed flex gap-2"
                        >
                          <span className="mt-1.5 w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0"></span>
                          <span>{point}</span>
                        </motion.li>
                      ))}
                    </ul>

                    {exp.docs && exp.docs.length > 0 && (
                      <DocCarousel docs={exp.docs} setSelectedImage={setSelectedImage} />
                    )}
                  </motion.div>
                </div>
              </div>

              {/* Desktop Layout */}
              <div className="hidden md:flex gap-8 items-start">
                {/* Left Side Content */}
                <div className={`flex-1 text-right pr-8 ${index % 2 !== 0 ? 'visible' : 'hidden'}`}>
                  {index % 2 !== 0 && (
                    <motion.div
                      animate={isHovered ? { y: -4 } : { y: 0 }}
                      transition={{ duration: 0.2 }}
                      className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-100 dark:border-slate-700 hover:shadow-xl transition-shadow"
                    >
                      <motion.p 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-xs font-bold text-primary mb-1"
                      >
                        {date}
                      </motion.p>
                      <motion.h3 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.15 }}
                        className="text-lg font-bold text-dark dark:text-white mb-0.5"
                      >
                        {title}
                      </motion.h3>
                      <motion.p 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-3"
                      >
                        {exp.org}
                      </motion.p>

                      <ul className="space-y-2 text-left">
                        {descList.map((point, i) => ( 
                          <motion.li 
                            key={i}
                            initial={{ opacity: 0, x: 10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.25 + i * 0.05 }}
                            className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed flex gap-2 justify-end"
                          >
                            <span>{point}</span>
                            <span className="mt-1.5 w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0"></span>
                          </motion.li>
                        ))}
                      </ul>

                      {exp.docs && exp.docs.length > 0 && (
                        <DocCarousel docs={exp.docs} setSelectedImage={setSelectedImage} />
                      )}
                    </motion.div>
                  )}
                </div>

                {/* Center Logo */}
                <div className="relative flex-shrink-0 flex items-center justify-center">
                  <motion.div 
                    className="w-16 h-16 rounded-full border-4 border-white dark:border-dark bg-white dark:bg-slate-800 shadow-lg z-20 overflow-hidden flex items-center justify-center"
                    animate={isHovered ? { scale: 1.2, boxShadow: '0 0 25px rgba(37, 99, 235, 0.8)' } : { scale: 1, boxShadow: 'none' }}
                    transition={{ duration: 0.3 }}
                  >
                    <img src={exp.logo} alt="Logo" loading="lazy" className="w-full h-full object-contain p-2" />
                  </motion.div>

                  {/* Pulse */}
                  <motion.div
                    className="absolute inset-0 w-16 h-16 rounded-full border-2 border-primary/40 pointer-events-none"
                    animate={isHovered ? { scale: 1.5, opacity: 0 } : { scale: 1, opacity: 0.6 }}
                    transition={{ duration: 0.6, repeat: Infinity }}
                  />
                </div>

                {/* Right Side Content */}
                <div className={`flex-1 pl-8 ${index % 2 === 0 ? 'visible' : 'hidden'}`}>
                  {index % 2 === 0 && (
                    <motion.div
                      animate={isHovered ? { y: -4 } : { y: 0 }}
                      transition={{ duration: 0.2 }}
                      className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-100 dark:border-slate-700 hover:shadow-xl transition-shadow"
                    >
                      <motion.p 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-xs font-bold text-primary mb-1"
                      >
                        {date}
                      </motion.p>
                      <motion.h3 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.15 }}
                        className="text-lg font-bold text-dark dark:text-white mb-0.5"
                      >
                        {title}
                      </motion.h3>
                      <motion.p 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-3"
                      >
                        {exp.org}
                      </motion.p>

                      <ul className="space-y-2">
                        {descList.map((point, i) => ( 
                          <motion.li 
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.25 + i * 0.05 }}
                            className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed flex gap-2"
                          >
                            <span className="mt-1.5 w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0"></span>
                            <span>{point}</span>
                          </motion.li>
                        ))}
                      </ul>

                      {exp.docs && exp.docs.length > 0 && (
                        <DocCarousel docs={exp.docs} setSelectedImage={setSelectedImage} />
                      )}
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Image Zoom Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center p-4 backdrop-blur-md"
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
                    alt="Full Preview"
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
    </div>
  );
};

export default Timeline;