import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { setupItems } from '../data/setup';
import SEO from '../components/SEO';

const UsesPage = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  // --- ANIMATION VARIANTS ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: "spring", stiffness: 80, damping: 15 } 
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
    <div className="bg-gray-50 dark:bg-dark min-h-screen pt-24 pb-20 transition-colors duration-300 relative overflow-hidden">
      
      <SEO 
        title="Workspace | Rafie Rojagat" 
        description="A visual tour of my desk setup, hardware, and developer tools."
        url="https://rafie-dev.netlify.app/workspace" 
      />

      {/* --- 1. TECH BACKGROUND (Cyber Grid) --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          {/* Radial Gradient untuk memudarkan grid di pinggir */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-transparent to-gray-50 dark:from-dark dark:via-transparent dark:to-dark"></div>
          
          {/* Glowing Orbs */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl relative z-10">        
        
        {/* --- HEADER --- */}
        <div className="text-center mb-20" data-aos="fade-down">
          <motion.div 
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="inline-block relative"
          >
             <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-xl relative z-10">
                <i className="fas fa-laptop-code text-5xl text-dark dark:text-white bg-clip-text bg-gradient-to-r from-primary to-secondary"></i>
             </div>
             {/* Glow Effect behind icon */}
             <div className="absolute inset-0 bg-primary/30 blur-xl rounded-full transform scale-150 z-0 animate-pulse"></div>
          </motion.div>

          <h1 className="mt-8 text-4xl md:text-6xl font-black text-dark dark:text-white mb-6 tracking-tight">
            My <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">Workspace</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            The hardware, gadgets, and software that power my productivity.<br/>
            <span className="text-sm font-mono text-primary bg-primary/10 px-2 py-1 rounded mt-2 inline-block">Updated: 2025</span>
          </p>
        </div>

        {/* --- GRID ITEMS --- */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 auto-rows-[280px] gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {setupItems.map((item) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02, zIndex: 10 }}
              onClick={() => setSelectedImage(item)}
              className={`group relative rounded-3xl overflow-hidden cursor-pointer 
                bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm 
                border border-white/50 dark:border-slate-700/50 
                shadow-lg hover:shadow-2xl hover:shadow-primary/20 
                transition-all duration-500 ${getSizeClasses(item.size)}`}
            >
              {/* Gambar */}
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />

              {/* Overlay Gradient (Selalu ada tapi tipis) */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>

              {/* Konten Text */}
              <div className="absolute bottom-0 left-0 w-full p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                
                {/* Kategori Badge */}
                <div className="mb-2 opacity-0 -translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-100">
                   <span className="text-[10px] font-bold text-black bg-primary px-2 py-0.5 rounded shadow-lg shadow-primary/50 uppercase tracking-wider">
                     {item.category}
                   </span>
                </div>

                {/* Judul */}
                <h3 className="text-white text-xl font-bold leading-tight drop-shadow-md mb-1">
                  {item.title}
                </h3>

                {/* Deskripsi (Hanya muncul saat hover) */}
                <div className="h-0 group-hover:h-auto overflow-hidden transition-all duration-500">
                    <p className="text-gray-300 text-xs line-clamp-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-150 leading-relaxed">
                    {item.desc}
                    </p>
                </div>
                
                {/* Indikator Panah */}
                <div className="absolute right-6 bottom-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200">
                     <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white">
                        <i className="fas fa-arrow-up rotate-45"></i>
                     </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* --- MODAL (POPUP IMAGE) --- */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4 backdrop-blur-xl"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative max-w-5xl w-full flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
               {/* Container Gambar dengan Border Glow */}
               <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-primary/20 border border-white/10 bg-dark">
                  <img 
                    src={selectedImage.image} 
                    alt={selectedImage.title}
                    className="w-auto h-auto max-w-full max-h-[70vh] object-contain"
                  />
                  
                  {/* Watermark/Tag */}
                  <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                      <p className="text-xs font-bold text-white uppercase tracking-wider">{selectedImage.category}</p>
                  </div>
               </div>
               
               {/* Detail Info */}
               <div className="mt-8 text-center text-white max-w-2xl px-4">
                 <motion.h2 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400"
                 >
                    {selectedImage.title}
                 </motion.h2>
                 
                 <motion.p 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-gray-400 leading-relaxed text-lg"
                 >
                    {selectedImage.desc}
                 </motion.p>

                 {/* External Link (Jika ada di data) */}
                 {selectedImage.link && (
                    <motion.a 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        href={selectedImage.link}
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 mt-6 px-6 py-2 bg-primary text-white rounded-full font-bold hover:bg-secondary transition-colors shadow-lg shadow-primary/30"
                    >
                        <i className="fas fa-shopping-bag"></i> View Product
                    </motion.a>
                 )}
               </div>

               {/* Close Button */}
               <button
                 className="absolute -top-16 right-0 md:-right-10 text-white/50 hover:text-white transition-colors bg-white/10 hover:bg-white/20 w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md border border-white/10 group"
                 onClick={() => setSelectedImage(null)}
               >
                 <i className="fas fa-times text-xl group-hover:rotate-90 transition-transform duration-300"></i>
               </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default UsesPage;