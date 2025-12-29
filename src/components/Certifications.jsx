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
      scale: 0.8,
      rotateY: direction > 0 ? 15 : -15, 
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
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
      scale: 0.8,
      rotateY: direction < 0 ? 15 : -15,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      }
    }),
  };

  return (
    <section id="certifications" className="py-24 bg-white dark:bg-dark relative overflow-hidden">      
      <AnimatePresence mode='wait'>
         <motion.div 
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[150px] -z-10 pointer-events-none bg-primary/20"
         ></motion.div>
      </AnimatePresence>

      <div className="container mx-auto px-4">        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-dark dark:text-white mb-4">
            Certifications
          </h2>
          <div className="w-20 h-1.5 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full"></div>
        </motion.div>

        <div className="max-w-5xl mx-auto relative group">
            
            <div className="relative w-full aspect-[16/9] md:aspect-[21/9] h-[400px] md:h-[550px] flex items-center justify-center">
                
                <button 
                    onClick={prevSlide}
                    className="absolute left-2 md:-left-12 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/10 backdrop-blur-md text-dark dark:text-white border border-white/20 hover:bg-white hover:text-primary transition-all shadow-lg hover:scale-110"
                >
                    <i className="fas fa-chevron-left text-xl"></i>
                </button>
                
                <button 
                    onClick={nextSlide}
                    className="absolute right-2 md:-right-12 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/10 backdrop-blur-md text-dark dark:text-white border border-white/20 hover:bg-white hover:text-primary transition-all shadow-lg hover:scale-110"
                >
                    <i className="fas fa-chevron-right text-xl"></i>
                </button>

                <AnimatePresence initial={false} custom={direction} mode="wait">
                    <motion.div
                        key={currentIndex}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        className="absolute inset-0 p-4 md:p-8 flex flex-col items-center justify-center"
                    >
                        <div className="relative w-full h-full max-w-4xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-gray-200 dark:border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">                            
                            <div className="w-full md:w-2/3 h-2/3 md:h-full bg-gray-50 dark:bg-slate-900/50 flex items-center justify-center p-6 relative overflow-hidden group/img">
                                <motion.img 
                                    src={certifications[currentIndex].img} 
                                    alt={certifications[currentIndex].alt || "Certificate"}
                                    className="max-w-full max-h-full object-contain shadow-lg rounded-lg transition-transform duration-500 group-hover/img:scale-105"
                                    layoutId={`cert-img-${currentIndex}`}
                                />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity duration-300">
                                   <button 
                                      onClick={() => setSelectedImage(certifications[currentIndex].img)}
                                      className="px-4 py-2 bg-white text-dark rounded-full text-sm font-bold flex items-center gap-2 transform translate-y-4 group-hover/img:translate-y-0 transition-transform hover:bg-primary hover:text-white cursor-pointer"
                                   >
                                      <i className="fas fa-expand"></i> View
                                   </button>
                                </div>
                            </div>

                            <div className="w-full md:w-1/3 h-1/3 md:h-full p-6 md:p-8 flex flex-col justify-center border-t md:border-t-0 md:border-l border-gray-200 dark:border-slate-700 bg-white/40 dark:bg-slate-800/40">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <h3 className="text-xl md:text-2xl font-bold text-dark dark:text-white mb-2 leading-tight">
                                        {certifications[currentIndex].title || "Certificate Title"}
                                    </h3>
                                    <p className="text-primary font-medium mb-4">
                                        {certifications[currentIndex].issuer || "Issuer Name"}
                                    </p>
                                    
                                    <div className="h-px w-full bg-gray-200 dark:bg-slate-700 mb-4"></div>
                                    
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Issued: <span className="text-dark dark:text-gray-200 font-medium">{certifications[currentIndex].date || "2024"}</span>
                                    </p>
                                    
                                    {certifications[currentIndex].link && (
                                        <a 
                                            href={certifications[currentIndex].link}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="mt-6 inline-flex items-center text-sm font-bold text-primary hover:underline gap-1 group/link"
                                        >
                                            Verify Credential <i className="fas fa-external-link-alt group-hover/link:translate-x-1 transition-transform"></i>
                                        </a>
                                    )}
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="flex justify-center gap-3 mt-8">
                {certifications.map((_, slideIndex) => (
                    <button
                        key={slideIndex}
                        onClick={() => goToSlide(slideIndex)}
                        className={`h-2 rounded-full transition-all duration-300 ${
                            currentIndex === slideIndex 
                            ? 'w-8 bg-primary shadow-lg shadow-primary/30' 
                            : 'w-2 bg-gray-300 dark:bg-slate-700 hover:bg-primary/50'
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

export default Certifications;