import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { setupItems } from '../data/setup';
import SEO from '../components/SEO';
import { useTranslation } from 'react-i18next';
import PageTransition from '../components/PageTransition';
import GitHubActivity from '../components/GitHubActivity';

const WorkspacePage = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;

  const getData = (data) => {
    if (!data) return "";
    
    // If it's an object with language keys, get the appropriate translation
    if (typeof data === 'object' && !Array.isArray(data)) {
      const value = data[currentLang] || data.en || data.id;
      return typeof value === 'string' ? value : String(value || "");
    }
    
    // If it's already a string, return as is
    if (typeof data === 'string') {
      return data;
    }
    
    // Fallback: convert to string
    return String(data || "");
  };

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
      case 'large': return 'sm:col-span-2 lg:col-span-2 lg:row-span-2';
      case 'wide': return 'sm:col-span-2 lg:col-span-2 lg:row-span-1';
      case 'tall': return 'sm:col-span-1 lg:col-span-1 lg:row-span-2';
      default: return 'col-span-1 row-span-1';
    }
  };

  const categories = [
    { id: 'all', label: currentLang === 'id' ? 'Semua' : 'All' },
    { id: 'Daily Driver', label: currentLang === 'id' ? 'Laptop Utama' : 'Daily Driver' },
    { id: 'Tablet', label: 'Tablet' },
    { id: 'Mobile', label: currentLang === 'id' ? 'Ponsel' : 'Mobile' },
    { id: 'Audio', label: currentLang === 'id' ? 'Audio' : 'Audio' },
    { id: 'Editor', label: 'Editor' },
    { id: 'IDE', label: 'IDE' },
    { id: 'DevOps', label: 'DevOps' },
    { id: 'Productivity', label: currentLang === 'id' ? 'Produktivitas' : 'Productivity' },
    { id: 'Testing', label: 'Testing' },
    { id: 'Backend', label: 'Backend' },
    { id: 'Design', label: currentLang === 'id' ? 'Desain' : 'Design' },
    { id: 'Music', label: currentLang === 'id' ? 'Musik' : 'Music' },
    { id: 'Social', label: currentLang === 'id' ? 'Sosial' : 'Social' },
  ];

  const filteredItems = selectedCategory === 'all' 
    ? setupItems 
    : setupItems.filter((item) => {
        try {
          const categoryData = item?.category;
          if (!categoryData) return false;
          
          const categoryLabel = categories.find((c) => c.id === selectedCategory)?.label;
          if (!categoryLabel) return false;
          
          const categoryText = typeof categoryData === 'object' && categoryData
            ? (categoryData[currentLang] || categoryData.en || categoryData.id)
            : categoryData;
          
          return String(categoryText || "") === String(categoryLabel || "");
        } catch (err) {
          console.warn('Filter error for item:', item, err);
          return false;
        }
      });

  return (
    <PageTransition>
      <div className="bg-gray-50 dark:bg-dark min-h-screen pt-20 md:pt-24 pb-12 md:pb-20 transition-colors duration-300 relative overflow-hidden">

        <SEO
          title="Workspace & Development Setup | Rafie Rojagat"
          description="Explore my development workspace and tools. A visual tour of my desk setup, hardware, software, and developer tools I use daily for Mobile & Web Development."
          url="https://rafie-dev.netlify.app/workspace"
          keywords="Developer Workspace, Desk Setup, Development Tools, Software Engineer Setup, Hardware Setup, Coding Environment, Developer Gear"
          type="website"
        />

        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-transparent to-gray-50 dark:from-dark dark:via-transparent dark:to-dark"></div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/10 blur-[120px] rounded-full"></div>
        </div>

        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="text-center mb-12 md:mb-20">
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="inline-block relative"
            >
              <div className="p-4 md:p-5 rounded-2xl md:rounded-3xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-xl relative z-10">
                <i className="fas fa-laptop-code text-3xl md:text-5xl text-dark dark:text-white bg-clip-text bg-gradient-to-r from-primary to-secondary"></i>
              </div>
              <div className="absolute inset-0 bg-primary/30 blur-xl rounded-full transform scale-150 z-0 animate-pulse"></div>
            </motion.div>

            <h1 className="mt-6 md:mt-8 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-dark dark:text-white mb-4 md:mb-6 tracking-tight px-4">
              {t('workspace.title_prefix')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">{t('workspace.title_highlight')}</span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed px-4">
              {t('workspace.subtitle')}<br />
              <span className="text-xs sm:text-sm font-mono text-primary bg-primary/10 px-2 py-1 rounded mt-2 inline-block">
                {t('workspace.updated')}: 2025
              </span>
            </p>
          </div>

          <div className="mb-12 overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0">
            <div className="flex md:flex-wrap md:justify-center gap-2 sm:gap-3 min-w-max md:min-w-0">
              {categories.map((cat) => (
                <motion.button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 sm:px-5 sm:py-2.5 rounded-full font-semibold text-xs sm:text-sm transition-all whitespace-nowrap ${
                    selectedCategory === cat.id
                      ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/30'
                      : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-slate-700 hover:border-primary/50 dark:hover:border-primary/50'
                  }`}
                >
                  {cat.label}
                </motion.button>
              ))}
            </div>
          </div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-[200px] sm:auto-rows-[240px] md:auto-rows-[280px] gap-4 md:gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            key={selectedCategory}
          >
            {filteredItems.map((item) => {
              const desc = getData(item.desc);
              const category = getData(item.category);

              const handleItemClick = () => {
                setSelectedImage({
                  ...item,
                  desc: String(desc || ""),
                  category: String(category || "")
                });
              };

              return (
                <motion.div
                  key={item.id}
                  variants={itemVariants}
                  whileHover={{ y: -4, scale: 1.01 }}
                  onClick={handleItemClick}
                  className={`group relative rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer 
                    bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm 
                    border border-white/50 dark:border-slate-700/50 
                    shadow-lg hover:shadow-xl md:hover:shadow-2xl hover:shadow-primary/20 
                    transition-all duration-300 ${getSizeClasses(item.size)}`}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>

                  <div className="absolute bottom-0 left-0 w-full p-4 md:p-6 transform translate-y-1 md:translate-y-2 group-hover:translate-y-0 transition-transform duration-300">

                    <div className="mb-1 md:mb-2 opacity-0 -translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-100">
                      <span className="text-[9px] sm:text-[10px] font-bold text-black bg-primary px-2 py-0.5 rounded shadow-lg shadow-primary/50 uppercase tracking-wider">
                        {category}
                      </span>
                    </div>

                    <h3 className="text-white text-base sm:text-lg md:text-xl font-bold leading-tight drop-shadow-md mb-1">
                      {item.title}
                    </h3>

                    <div className="h-0 group-hover:h-auto overflow-hidden transition-all duration-500">
                      <p className="text-gray-300 text-xs line-clamp-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-150 leading-relaxed">
                        {desc}
                      </p>
                    </div>

                    <div className="absolute right-6 bottom-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200">
                      <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white">
                        <i className="fas fa-arrow-up rotate-45"></i>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        <div className="mt-16 md:mt-28 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent rounded-3xl -z-10 blur-2xl"></div>
          
          <div className="relative mb-12 md:mb-20">
            <div className="flex items-center gap-3 md:gap-4 mb-8 md:mb-12">
              <div className="flex-1 h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
              <div className="text-primary/40">
                <i className="fas fa-code text-xl md:text-2xl"></i>
              </div>
              <div className="flex-1 h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12 md:mb-16 px-4"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-dark dark:text-white mb-3 md:mb-4 tracking-tight">
                Development <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">Activity</span>
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                {currentLang === 'id' 
                  ? 'Pantau perjalanan coding saya - kontribusi konsisten, proyek aktif, dan komitmen terhadap pertumbuhan berkelanjutan.'
                  : 'Track my coding journey - consistent contributions, active projects, and commitment to continuous growth.'}
              </p>
            </motion.div>
          </div>

          <GitHubActivity />
        </div>

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
                <div className="relative rounded-xl md:rounded-2xl overflow-hidden shadow-2xl shadow-primary/20 border border-white/10 bg-dark max-h-[70vh] md:max-h-auto">
                  <img
                    src={selectedImage.image}
                    alt={selectedImage.title}
                    className="w-full h-auto max-h-[60vh] md:max-h-[70vh] object-contain"
                  />

                  <div className="absolute top-3 left-3 md:top-4 md:left-4 bg-black/50 backdrop-blur-md px-2 py-0.5 md:px-3 md:py-1 rounded-full border border-white/10">
                    <p className="text-[10px] md:text-xs font-bold text-white uppercase tracking-wider">{selectedImage.category}</p>
                  </div>
                </div>

                <div className="mt-6 md:mt-8 text-center text-white max-w-2xl px-4">
                  <motion.h2
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400"
                  >
                    {selectedImage.title}
                  </motion.h2>

                  <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-sm sm:text-base md:text-lg text-gray-400 leading-relaxed"
                  >
                    {selectedImage.desc}
                  </motion.p>

                  {selectedImage.link && (
                    <motion.a
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      href={selectedImage.link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 mt-4 md:mt-6 px-5 py-2 md:px-6 text-sm md:text-base bg-primary text-white rounded-full font-bold hover:bg-secondary transition-colors shadow-lg shadow-primary/30"
                    >
                      <i className="fas fa-shopping-bag"></i> {t('workspace.view_product')}
                    </motion.a>
                  )}
                </div>

                <button
                  className="absolute top-4 right-4 md:-top-16 md:right-0 md:-right-10 text-white/80 md:text-white/50 hover:text-white transition-colors bg-white/10 hover:bg-white/20 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center backdrop-blur-md border border-white/10 group"
                  onClick={() => setSelectedImage(null)}
                >
                  <i className="fas fa-times text-lg md:text-xl group-hover:rotate-90 transition-transform duration-300"></i>
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
};

export default WorkspacePage;