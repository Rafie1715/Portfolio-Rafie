import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { certifications } from '../data/certifications';

const Certifications = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); 

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
      x: direction > 0 ? 50 : -50, 
      opacity: 0,
      scale: 0.95, 
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 50 : -50, 
      opacity: 0,
      scale: 0.95,
    }),
  };

  return (
    <section id="certifications" className="py-24 bg-white dark:bg-dark overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16" data-aos="fade-down">
          <h2 className="text-3xl md:text-4xl font-bold text-dark dark:text-white mb-4">
            Certifications
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full mt-2"></div>
        </div>

        <div className="max-w-4xl mx-auto relative group" data-aos="zoom-in">
          <div className="w-full h-[300px] md:h-[500px] rounded-2xl bg-gray-50/50 dark:bg-darkLight/50 backdrop-blur-sm border border-gray-200/50 dark:border-slate-700/50 shadow-xl shadow-primary/5 overflow-hidden flex items-center justify-center relative p-6 md:p-10">
            
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.img
                key={currentIndex}
                src={certifications[currentIndex].img}
                alt={certifications[currentIndex].alt}
                loading="lazy"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                  scale: { duration: 0.2 }
                }}
                className="max-w-full max-h-full object-contain drop-shadow-md relative z-10"
              />
            </AnimatePresence>

            <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-secondary/5 rounded-2xl -z-0"></div>
          </div>
            
          <div className="flex justify-center space-x-3 mt-6">
            {certifications.map((_, slideIndex) => (
              <button
                key={slideIndex}
                onClick={() => goToSlide(slideIndex)}
                className={`w-3 h-3 rounded-full transition-all duration-300 hover:scale-150 ${
                  currentIndex === slideIndex 
                    ? 'bg-primary w-8 scale-110 shadow-sm shadow-primary/50'
                    : 'bg-gray-300 hover:bg-primary/50'
                }`}
                aria-label={`Go to slide ${slideIndex + 1}`}
              ></button>
            ))}
          </div>

          <button 
            onClick={prevSlide}
            className="absolute top-1/2 -translate-y-1/2 left-2 md:-left-14 text-2xl p-3 rounded-full bg-white/90 dark:bg-slate-700/90 text-dark dark:text-white hover:text-primary hover:bg-white dark:hover:bg-slate-600 transition-all shadow-md hover:shadow-lg hover:scale-110 active:scale-95 z-20 group-hover:opacity-100 md:opacity-0 transition-opacity duration-300"
          >
            <i className="fas fa-chevron-left"></i>
          </button>

          <button 
            onClick={nextSlide}
            className="absolute top-1/2 -translate-y-1/2 right-2 md:-right-14 text-2xl p-3 rounded-full bg-white/90 dark:bg-slate-700/90 text-dark dark:text-white hover:text-primary hover:bg-white dark:hover:bg-slate-600 transition-all shadow-md hover:shadow-lg hover:scale-110 active:scale-95 z-20 group-hover:opacity-100 md:opacity-0 transition-opacity duration-300"
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Certifications;