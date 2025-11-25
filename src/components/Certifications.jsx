// src/components/Certifications.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // <-- Import penting

// Import semua gambar sertifikat (sama seperti sebelumnya)
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
];

const Certifications = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  // Kita butuh state arah untuk menentukan animasi slide ke kiri atau kanan
  const [direction, setDirection] = useState(0); 

  const prevSlide = () => {
    setDirection(-1); // Set arah ke kiri
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? certifications.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    setDirection(1); // Set arah ke kanan
    const isLastSlide = currentIndex === certifications.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (slideIndex) => {
    // Tentukan arah berdasarkan index tujuan vs index sekarang
    setDirection(slideIndex > currentIndex ? 1 : -1);
    setCurrentIndex(slideIndex);
  }

  // Konfigurasi Animasi Framer Motion
  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 50 : -50, // Masuk dari kanan (+50) atau kiri (-50)
      opacity: 0,
      scale: 0.95, // Sedikit lebih kecil saat masuk
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 50 : -50, // Keluar ke kanan (+50) atau kiri (-50) berkebalikan dari masuk
      opacity: 0,
      scale: 0.95, // Mengecil sedikit saat keluar
    }),
  };

  return (
    <section id="certifications" className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16" data-aos="fade-down">
          <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">
            Certifications
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full mt-2"></div>
        </div>

        <div className="max-w-4xl mx-auto relative group" data-aos="zoom-in">
          {/* Container Gambar Utama dengan efek Glow halus */}
          <div className="w-full h-[300px] md:h-[500px] rounded-2xl bg-gray-50/50 backdrop-blur-sm border border-gray-200/50 shadow-xl shadow-primary/5 overflow-hidden flex items-center justify-center relative p-6 md:p-10">
            
            {/* AnimatePresence menangani komponen saat keluar dari DOM */}
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.img
                key={currentIndex} // Key penting agar React tahu gambar berubah
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
            
            {/* Efek background blur di belakang gambar */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-secondary/5 rounded-2xl -z-0"></div>
          </div>
            
          {/* Indikator Slide (Dots) dengan animasi hover */}
          <div className="flex justify-center space-x-3 mt-6">
            {certifications.map((_, slideIndex) => (
              <button
                key={slideIndex}
                onClick={() => goToSlide(slideIndex)}
                className={`w-3 h-3 rounded-full transition-all duration-300 hover:scale-150 ${
                  currentIndex === slideIndex 
                    ? 'bg-primary w-8 scale-110 shadow-sm shadow-primary/50' // Dot aktif lebih lebar
                    : 'bg-gray-300 hover:bg-primary/50'
                }`}
                aria-label={`Go to slide ${slideIndex + 1}`}
              ></button>
            ))}
          </div>

          {/* Tombol Previous dengan animasi hover & click */}
          <button 
            onClick={prevSlide}
            className="absolute top-1/2 -translate-y-1/2 left-2 md:-left-14 text-2xl p-3 rounded-full bg-white/90 text-dark hover:text-primary hover:bg-white transition-all shadow-md hover:shadow-lg hover:scale-110 active:scale-95 z-20 group-hover:opacity-100 md:opacity-0 transition-opacity duration-300"
          >
            <i className="fas fa-chevron-left"></i>
          </button>

          {/* Tombol Next dengan animasi hover & click */}
          <button 
            onClick={nextSlide}
            className="absolute top-1/2 -translate-y-1/2 right-2 md:-right-14 text-2xl p-3 rounded-full bg-white/90 text-dark hover:text-primary hover:bg-white transition-all shadow-md hover:shadow-lg hover:scale-110 active:scale-95 z-20 group-hover:opacity-100 md:opacity-0 transition-opacity duration-300"
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Certifications;