import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const Contact = () => {
  const { t } = useTranslation();
  const [status, setStatus] = useState("");
  const [focusedField, setFocusedField] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    setStatus("loading");

    const data = new FormData(form);

    try {
      const response = await fetch("https://formspree.io/f/xanjlvvr", {
        method: "POST",
        body: data,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setStatus("success");
        form.reset(); 
        setTimeout(() => setStatus(""), 5000);
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 50 }
    }
  };

  const socialHover = {
    hover: { 
      y: -5, 
      scale: 1.05,
      transition: { type: "spring", stiffness: 300 } 
    }
  };

  return (
    <section id="contact" className="py-24 bg-white dark:bg-dark relative overflow-hidden transition-colors duration-300">      
      <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none"
      ></motion.div>
      <motion.div 
          animate={{ scale: [1, 1.5, 1], rotate: [0, -45, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/5 rounded-full blur-[100px] pointer-events-none"
      ></motion.div>

      <div className="container mx-auto px-4 relative z-10">        
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-12">          
          <motion.div 
            className="md:w-1/3 space-y-8"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 dark:bg-gradient-to-br dark:from-primary/5 dark:to-secondary/5 backdrop-blur-sm p-8 rounded-2xl border border-primary/20 dark:border-primary/10 shadow-md hover:shadow-xl hover:border-primary/40 transition-all duration-300">
              <h3 className="text-xl font-bold text-dark dark:text-white mb-6 flex items-center gap-2">
                <span className="w-2 h-6 bg-gradient-to-b from-primary to-secondary rounded-full"></span>
                {t('contact.info_title')}
              </h3>
              
              <div className="space-y-6">                
                <motion.a 
                  href="mailto:rojagatrafie@gmail.com"
                  className="flex items-start space-x-4 p-4 rounded-xl hover:bg-white dark:hover:bg-slate-800 transition-all group cursor-pointer"
                  whileHover={{ x: 8, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center text-primary flex-shrink-0 shadow-sm group-hover:from-primary group-hover:to-primary group-hover:text-white transition-all">
                    <i className="fas fa-envelope text-lg"></i>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide font-bold">Email</p>
                    <p className="text-dark dark:text-slate-200 font-medium hover:text-primary transition-colors break-all">
                      rojagatrafie@gmail.com
                    </p>
                  </div>
                </motion.a>

                <motion.div 
                  className="flex items-start space-x-4 p-4 rounded-xl hover:bg-white dark:hover:bg-slate-800 transition-all"
                  whileHover={{ x: 8, scale: 1.02 }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-xl flex items-center justify-center text-secondary flex-shrink-0 shadow-sm group-hover:from-secondary group-hover:to-secondary group-hover:text-white transition-all">
                    <i className="fas fa-map-marker-alt text-lg"></i>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide font-bold">{t('contact.location')}</p>
                    <p className="text-dark dark:text-slate-200 font-medium">Jakarta, Indonesia 🇮🇩</p>
                  </div>
                </motion.div>

                <motion.div 
                  className="flex items-start space-x-4 p-4 rounded-xl hover:bg-white dark:hover:bg-slate-800 transition-all"
                  whileHover={{ x: 8, scale: 1.02 }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400/20 to-blue-400/10 rounded-xl flex items-center justify-center text-blue-500 flex-shrink-0 shadow-sm">
                    <i className="fas fa-clock text-lg"></i>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide font-bold">Response Time</p>
                    <p className="text-dark dark:text-slate-200 font-medium">Usually within 24 hours ⚡</p>
                  </div>
                </motion.div>
              </div>

              <div className="mt-10 pt-6 border-t border-gray-200 dark:border-slate-700/50">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 font-medium">{t('contact.follow_me')}</p>
                <div className="flex space-x-3 flex-wrap gap-3">
                  {[
                    { icon: "fab fa-linkedin-in", url: "https://linkedin.com/in/rafie-rojagat", color: "from-[#0077b5] to-[#0066cc]", text: "LinkedIn" },
                    { icon: "fab fa-github", url: "https://github.com/Rafie1715", color: "from-[#24292e] to-[#0d1117]", text: "GitHub" },
                    { icon: "fab fa-instagram", url: "https://instagram.com/rafie_rb", color: "from-[#E1306C] to-[#C13584]", text: "Instagram" }
                  ].map((social, index) => (
                    <motion.a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noreferrer"
                      whileHover={{ y: -8, scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${social.color} flex items-center justify-center text-white transition-all duration-300 hover:shadow-lg hover:shadow-primary/30 border border-white/20`}
                      title={social.text}
                    >
                      <i className={`${social.icon} text-lg`}></i>
                    </motion.a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
             className="md:w-2/3"
             variants={containerVariants}
             initial="hidden"
             whileInView="visible"
             viewport={{ once: true }}
          >
            <form onSubmit={handleSubmit} className="bg-gradient-to-br from-white to-gray-50/50 dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-800/50 p-8 md:p-10 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700/50 relative overflow-hidden">
              
              {/* Animated border */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-secondary/20 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <motion.div 
                  variants={itemVariants} 
                  className="group relative"
                >
                  <label htmlFor="name" className={`block text-sm font-bold mb-2 transition-colors duration-300 ${focusedField === 'name' ? 'text-primary' : 'text-gray-700 dark:text-gray-300'}`}>
                    {t('contact.form.name_label')}
                    <span className="text-primary ml-1">*</span>
                  </label>
                  <div className="relative">
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={focusedField === 'name' ? { scaleX: 1 } : { scaleX: 0 }}
                      transition={{ duration: 0.3 }}
                      className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-primary to-secondary origin-left rounded-full"
                    ></motion.div>
                    <input 
                      type="text" 
                      name="name" 
                      id="name" 
                      required
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700/50 outline-none transition-all duration-300 focus:bg-white dark:text-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-primary/30 focus:border-primary placeholder-gray-400 dark:placeholder-gray-500"
                      placeholder={t('contact.form.name_placeholder')}
                    />
                  </div>
                </motion.div>

                <motion.div 
                  variants={itemVariants} 
                  className="group relative"
                >
                  <label htmlFor="email" className={`block text-sm font-bold mb-2 transition-colors duration-300 ${focusedField === 'email' ? 'text-primary' : 'text-gray-700 dark:text-gray-300'}`}>
                    {t('contact.form.email_label')}
                    <span className="text-primary ml-1">*</span>
                  </label>
                  <div className="relative">
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={focusedField === 'email' ? { scaleX: 1 } : { scaleX: 0 }}
                      transition={{ duration: 0.3 }}
                      className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-primary to-secondary origin-left rounded-full"
                    ></motion.div>
                    <input 
                      type="email" 
                      name="email" 
                      id="email" 
                      required
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700/50 outline-none transition-all duration-300 focus:bg-white dark:text-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-primary/30 focus:border-primary placeholder-gray-400 dark:placeholder-gray-500"
                      placeholder={t('contact.form.email_placeholder')}
                    />
                  </div>
                </motion.div>
              </div>

              <motion.div 
                variants={itemVariants} 
                className="mb-8 group relative"
              >
                <label htmlFor="message" className={`block text-sm font-bold mb-2 transition-colors duration-300 ${focusedField === 'message' ? 'text-primary' : 'text-gray-700 dark:text-gray-300'}`}>
                  {t('contact.form.message_label')}
                  <span className="text-primary ml-1">*</span>
                </label>
                <div className="relative">
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={focusedField === 'message' ? { scaleX: 1 } : { scaleX: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-primary to-secondary origin-left rounded-full"
                  ></motion.div>
                  <textarea 
                    name="message" 
                    id="message" 
                    rows="5" 
                    required
                    onFocus={() => setFocusedField('message')}
                    onBlur={() => setFocusedField(null)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700/50 outline-none transition-all duration-300 focus:bg-white dark:text-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-primary/30 focus:border-primary placeholder-gray-400 dark:placeholder-gray-500 resize-none"
                    placeholder={t('contact.form.message_placeholder')}
                  ></textarea>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="text-right relative">
                <motion.button 
                  type="submit" 
                  disabled={status === 'loading'}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative overflow-hidden inline-flex items-center justify-center px-8 py-3.5 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:shadow-primary/40 transition-all ${status === 'loading' ? 'opacity-80 cursor-not-allowed' : ''}`}
                >
                  {status === 'loading' && (
                    <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        className="mr-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    />
                  )}
                  
                  {status === 'loading' ? t('contact.form.sending') : t('contact.form.send_btn')}
                  
                  {!status && (
                    <motion.i 
                      className="fas fa-paper-plane ml-2"
                      initial={{ x: 0, y: 0 }}
                      whileHover={{ x: 5, y: -5 }}
                    ></motion.i>
                  )}
                </motion.button>

                <AnimatePresence>
                    {status === 'success' && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.9 }}
                        className="absolute bottom-full right-0 mb-4 px-4 py-3 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-600 dark:text-green-400 rounded-xl text-sm font-bold flex items-center shadow-md border border-green-200 dark:border-green-800/30"
                    >
                        <i className="fas fa-check-circle mr-2"></i> {t('contact.form.success')}
                    </motion.div>
                    )}
                    {status === 'error' && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.9 }}
                        className="absolute bottom-full right-0 mb-4 px-4 py-3 bg-gradient-to-r from-red-100 to-orange-100 dark:from-red-900/30 dark:to-orange-900/30 text-red-600 dark:text-red-400 rounded-xl text-sm font-bold flex items-center shadow-md border border-red-200 dark:border-red-800/30"
                    >
                        <i className="fas fa-exclamation-circle mr-2"></i> {t('contact.form.error')}
                    </motion.div>
                    )}
                </AnimatePresence>
              </motion.div>

            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;