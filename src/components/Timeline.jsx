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
      className="relative w-full h-48 sm:h-56 rounded-xl overflow-hidden group cursor-pointer shadow-inner border border-gray-200 dark:border-slate-700 bg-gray-100 dark:bg-slate-800 mt-4"
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
    <div className="relative container mx-auto px-4 py-12 max-w-5xl">
      <div className="absolute left-4 md:left-1/2 top-0 h-full w-0.5 bg-gray-200 dark:bg-gray-700 transform md:-translate-x-1/2"></div>

      <div className="space-y-16">
        {experiences.map((exp, index) => {
          const isEven = index % 2 === 0;
          const title = getData(exp.title);
          const date = getData(exp.date);
          const descList = getDescList(exp.description);

          return (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative flex flex-col md:flex-row items-center ${
                isEven ? "md:flex-row-reverse" : ""
              }`}
            >
              <div className="hidden md:block w-1/2" />

              <div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 -translate-y-1/2 md:translate-y-0 top-0 md:top-auto w-12 h-12 rounded-full border-4 border-white dark:border-dark bg-white shadow-lg z-10 overflow-hidden flex items-center justify-center">
                <img src={exp.logo} alt="Logo" className="w-full h-full object-contain p-1" />
              </div>

              <div className="w-full pl-12 md:pl-0 md:w-1/2 md:px-10 mt-6 md:mt-0">
                <div className={`p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700 hover:shadow-xl hover:border-primary/30 transition-all relative group ${isEven ? 'md:text-right' : 'md:text-left'}`}>
                  
                  <div className={`hidden md:block absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white dark:bg-slate-800 rotate-45 border-b border-l border-gray-100 dark:border-slate-700 ${isEven ? '-right-2 border-r-0 border-t-0' : '-left-2 border-b-0 border-l-0'}`}></div>

                  <div className={`flex flex-col ${isEven ? 'md:items-end' : 'md:items-start'}`}>
                      <span className="inline-block px-3 py-1 text-xs font-bold rounded-full mb-2 bg-primary/10 text-primary">
                        {date}
                      </span>
                      <h3 className="text-lg font-bold text-dark dark:text-white mb-1 group-hover:text-primary transition-colors">
                        {title}
                      </h3>
                      <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-4">
                        {exp.org}
                      </p>
                  </div>

                  <ul className={`space-y-2 mb-4 list-none`}>
                    {descList.slice(0, 3).map((point, i) => ( 
                        <li key={i} className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed flex gap-2">
                            {!isEven && <span className="mt-1.5 w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0"></span>}
                            <span>{point}</span>
                            {isEven && <span className="mt-1.5 w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0"></span>}
                        </li>
                    ))}
                  </ul>

                  {exp.docs && exp.docs.length > 0 && (
                      <div className="w-full">
                          <DocCarousel docs={exp.docs} setSelectedImage={setSelectedImage} />
                      </div>
                  )}

                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

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