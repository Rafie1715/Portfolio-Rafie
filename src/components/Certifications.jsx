import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { certifications } from '../data/certifications';

const Certifications = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);   
  const [selectedImage, setSelectedImage] = useState(null);

  const prevSlide = () => {
    setDirection(-1); 
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? certifications.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    setDirection(1); 
    const isLastSlide = currentIndex === certifications.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (slideIndex) => {
    setDirection(slideIndex > currentIndex ? 1 : -1);
    setCurrentIndex(slideIndex);
  }

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
      scale: 0.9, 
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.4 },
        scale: { duration: 0.4 },
      }
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 100 : -100, 
      opacity: 0,
      scale: 0.9,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      }
    }),
  };

  return (
    <section id="certifications" className="py-24 bg-white dark:bg-dark relative overflow-hidden transition-colors duration-300">      
      <AnimatePresence mode='wait'>
         <motion.div 
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] rounded-full blur-[100px] md:blur-[150px] -z-10 pointer-events-none bg-primary/20"
         ></motion.div>
      </AnimatePresence>

      <div className="container mx-auto px-4 max-w-6xl">        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-dark dark:text-white mb-4">
            Certifications
          </h2>
          <div className="w-20 h-1.5 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full"></div>
        </motion.div>

        <div className="relative w-full flex flex-col items-center">            
            <div className="relative w-full min-h-[500px] md:h-[500px] flex items-center justify-center overflow-hidden mb-8">                
                <button 
                    onClick={prevSlide}
                    className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 z-30 p-4 rounded-full bg-white/10 backdrop-blur-md text-dark dark:text-white border border-white/20 hover:bg-white hover:text-primary transition-all shadow-lg hover:scale-110"
                >
                    <i className="fas fa-chevron-left text-xl"></i>
                </button>
                
                <button 
                    onClick={nextSlide}
                    className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 z-30 p-4 rounded-full bg-white/10 backdrop-blur-md text-dark dark:text-white border border-white/20 hover:bg-white hover:text-primary transition-all shadow-lg hover:scale-110"
                >
                    <i className="fas fa-chevron-right text-xl"></i>
                </button>

                <AnimatePresence initial={false} custom={direction} mode="popLayout">
                    <motion.div
                        key={currentIndex}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        className="w-full md:absolute md:inset-0 px-2 md:px-16 flex items-center justify-center"
                    >
                        <div className="w-full max-w-4xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row h-auto md:h-[400px]">                                                        
                            <div className="w-full md:w-3/5 h-[250px] md:h-full bg-gray-100 dark:bg-slate-900 flex items-center justify-center p-4 md:p-6 relative group/img overflow-hidden">
                                <motion.img 
                                    src={certifications[currentIndex].img} 
                                    alt={certifications[currentIndex].alt || "Certificate"}
                                    className="max-w-full max-h-full object-contain shadow-md rounded transition-transform duration-500 group-hover/img:scale-105"
                                    layoutId={`cert-img-${currentIndex}`}
                                />
                                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity duration-300">
                                   <button 
                                      onClick={() => setSelectedImage(certifications[currentIndex].img)}
                                      className="px-5 py-2 bg-white text-dark rounded-full text-sm font-bold flex items-center gap-2 transform translate-y-4 group-hover/img:translate-y-0 transition-transform hover:bg-primary hover:text-white shadow-lg"
                                   >
                                      <i className="fas fa-expand"></i> View
                                   </button>
                                </div>
                            </div>

                            <div className="w-full md:w-2/5 p-6 md:p-8 flex flex-col justify-center border-t md:border-t-0 md:border-l border-gray-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50">
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <h3 className="text-xl font-bold text-dark dark:text-white mb-2 leading-tight">
                                        {certifications[currentIndex].title || "Certificate Title"}
                                    </h3>
                                    <p className="text-primary font-semibold mb-4 text-sm uppercase tracking-wide">
                                        {certifications[currentIndex].issuer || "Issuer Name"}
                                    </p>
                                    
                                    <div className="h-px w-full bg-gray-200 dark:bg-slate-600 mb-4"></div>
                                    
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                                        Issued: <span className="text-dark dark:text-gray-200 font-medium">{certifications[currentIndex].date || "2024"}</span>
                                    </p>
                                    
                                    {certifications[currentIndex].link && (
                                        <a 
                                            href={certifications[currentIndex].link}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center justify-center w-full py-2.5 bg-gray-100 dark:bg-slate-700 text-dark dark:text-white rounded-lg text-sm font-bold hover:bg-primary hover:text-white transition-all gap-2 group/link"
                                        >
                                            Verify Credential <i className="fas fa-external-link-alt group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5 transition-transform"></i>
                                        </a>
                                    )}
                                </motion.div>
                            </div>

                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="flex md:hidden items-center justify-between w-full max-w-xs px-4 mb-6">
                 <button 
                    onClick={prevSlide}
                    className="p-3 rounded-full bg-gray-100 dark:bg-slate-800 text-dark dark:text-white shadow-md active:scale-90 transition-transform"
                >
                    <i className="fas fa-chevron-left"></i>
                </button>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {currentIndex + 1} / {certifications.length}
                </span>
                <button 
                    onClick={nextSlide}
                    className="p-3 rounded-full bg-gray-100 dark:bg-slate-800 text-dark dark:text-white shadow-md active:scale-90 transition-transform"
                >
                    <i className="fas fa-chevron-right"></i>
                </button>
            </div>

            <div className="flex justify-center gap-2">
                {certifications.map((_, slideIndex) => (
                    <button
                        key={slideIndex}
                        onClick={() => goToSlide(slideIndex)}
                        className={`h-2 rounded-full transition-all duration-300 ${
                            currentIndex === slideIndex 
                            ? 'w-8 bg-primary shadow-lg shadow-primary/30' 
                            : 'w-2 bg-gray-300 dark:bg-slate-600 hover:bg-primary/50'
                        }`}
                        aria-label={`Go to slide ${slideIndex + 1}`}
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
            className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center p-4 backdrop-blur-md"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="relative max-w-5xl w-full max-h-screen flex items-center justify-center"
                onClick={(e) => e.stopPropagation()} 
            >
                <img
                    src={selectedImage}
                    alt="Full Preview"
                    className="w-auto h-auto max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl border border-white/10"
                />
                <button
                    className="absolute -top-12 right-0 md:-right-4 text-white/70 hover:text-white transition-colors bg-white/10 hover:bg-white/20 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/10"
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

export default Certifications;