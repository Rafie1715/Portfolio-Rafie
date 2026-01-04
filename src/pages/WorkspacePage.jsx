import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { setupItems } from '../data/setup';
import SEO from '../components/SEO';

const UsesPage = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: { type: "spring", stiffness: 50, damping: 15 } 
    }
  };

  const getSizeClasses = (size) => {
    switch (size) {
      case 'large': return 'md:col-span-2 md:row-span-2'; 
      case 'wide': return 'md:col-span-2 md:row-span-1';  
      case 'tall': return 'md:col-span-1 md:row-span-2';  
      default: return 'md:col-span-1 md:row-span-1';     
    }
  };

  return (
    <div className="bg-white dark:bg-dark min-h-screen pt-24 pb-20 transition-colors duration-300">
      
      <SEO 
        title="Workspace | Rafie Rojagat" 
        description="A visual tour of my desk setup, hardware, and developer tools."
        url="https://rafie-dev.netlify.app/workspace" 
      />

      <div className="container mx-auto px-4 max-w-6xl">        
        <div className="text-center mb-16" data-aos="fade-down">
          <motion.div 
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="inline-block p-4 rounded-3xl bg-gray-100 dark:bg-slate-800 mb-6 border border-gray-200 dark:border-slate-700 shadow-sm"
          >
            <i className="fas fa-laptop-code text-4xl text-dark dark:text-white"></i>
          </motion.div>

          <h1 className="text-4xl md:text-6xl font-bold text-dark dark:text-white mb-6 tracking-tight">
            My <span className="text-primary">Workspace</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            A curated look at the hardware, gadgets, and software that power my daily workflow.
          </p>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 auto-rows-[280px] gap-5"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {setupItems.map((item) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              className={`group relative rounded-3xl overflow-hidden cursor-pointer bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-2xl transition-all duration-500 ${getSizeClasses(item.size)}`}
              onClick={() => setSelectedImage(item)}
              whileHover={{ y: -5 }}
            >
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />

              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300"></div>
              <div className="absolute bottom-0 left-0 w-full p-5 md:translate-y-[40%] md:group-hover:translate-y-0 transition-transform duration-500 bg-black/60 backdrop-blur-md border-t border-white/10">
                
                <div className="flex justify-between items-start mb-1">
                    <div>
                        <span className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1 block">
                        {item.category}
                        </span>
                        <h3 className="text-white text-lg font-bold leading-tight drop-shadow-sm">
                        {item.title}
                        </h3>
                    </div>
                    <i className="fas fa-arrow-up-right-from-square text-white/50 text-xs opacity-0 group-hover:opacity-100 transition-opacity"></i>
                </div>

                <p className="text-gray-300 text-xs line-clamp-2 mt-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 delay-75">
                  {item.desc}
                </p>
              </div>

              <div className="absolute top-4 right-4 bg-black/30 backdrop-blur-md w-8 h-8 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100 border border-white/20">
                <i className="fas fa-expand-alt text-xs"></i>
              </div>
            </motion.div>
          ))}
        </motion.div>
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
              className="relative max-w-5xl w-full max-h-screen flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
               <img 
                 src={selectedImage.image} 
                 alt={selectedImage.title}
                 className="w-auto h-auto max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl border border-white/10 bg-black"
               />
               
               <div className="mt-6 text-center text-white max-w-2xl px-4">
                 <div className="flex items-center justify-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold">{selectedImage.title}</h2>
                    {selectedImage.link && (
                        <a 
                          href={selectedImage.link} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-primary hover:text-white transition-colors"
                          title="View Product"
                        >
                            <i className="fas fa-external-link-alt text-lg"></i>
                        </a>
                    )}
                 </div>
                 <p className="text-gray-300 leading-relaxed">{selectedImage.desc}</p>
               </div>

               <button
                  className="absolute -top-12 right-0 md:-right-10 text-white/50 hover:text-white transition-colors bg-white/10 hover:bg-white/20 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/10"
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

export default UsesPage;