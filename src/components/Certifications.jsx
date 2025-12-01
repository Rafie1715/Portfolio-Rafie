import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import bangkitCert from '../assets/images/cert-bangkit.png';
import androidBeginner from '../assets/images/cert-dicoding-android-beginner.png';
import androidFundamental from '../assets/images/cert-dicoding-android-fundamental.png';
import mlAndroid from '../assets/images/cert-dicoding-MLforandroid.png';
import androidIntermediate from '../assets/images/cert-dicoding-android-intermediate.png';
import webBeginner from '../assets/images/cert-dicoding-web-beginner.png';
import frontendBeginner from '../assets/images/cert-dicoding-frontend-beginner.png';
import backendBeginner from '../assets/images/cert-dicoding-backend-beginner.png';
import dataAnalytics from '../assets/images/cert-data-analytics.png';
import englishComp from '../assets/images/cert-english-competition.png';
import toefl from '../assets/images/cert-toefl.png';
import reactBeginner from '../assets/images/cert-dicoding-react-beginner.png';
import reactFundamental from '../assets/images/cert-dicoding-react-fundamental.png';
import flutterBeginner from '../assets/images/cert-dicoding-flutter-beginner.png';
import ibmCode from '../assets/images/cert-ibm-code.png';

const certifications = [
  { id: 1, img: bangkitCert, alt: "Bangkit Academy Certificate" },
  { id: 2, img: androidBeginner, alt: "Dicoding Android Beginner" },
  { id: 3, img: androidFundamental, alt: "Dicoding Android Fundamental" },
  { id: 4, img: mlAndroid, alt: "Dicoding Machine Learning for Android" },
  { id: 5, img: androidIntermediate, alt: "Dicoding Android Intermediate" },
  { id: 6, img: webBeginner, alt: "Dicoding Web Beginner" },
  { id: 7, img: frontendBeginner, alt: "Dicoding Frontend Beginner" },
  { id: 8, img: backendBeginner, alt: "Dicoding Backend Beginner" },
  { id: 9, img: dataAnalytics, alt: "Data Analytics Certificate" },
  { id: 10, img: englishComp, alt: "English Competition Certificate" },
  { id: 11, img: toefl, alt: "TOEFL Certificate" },
  { id: 12, img: reactBeginner, alt: "Dicoding React Beginner" },
  { id: 13, img: reactFundamental, alt: "Dicoding React Fundamental" },
  { id: 14, img: flutterBeginner, alt: "Dicoding Flutter Beginner" },
  { id: 15, img: ibmCode, alt: "IBM Code Certificate" },
];

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