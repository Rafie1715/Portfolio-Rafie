import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Contact = () => {
  const [status, setStatus] = useState("");

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
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-dark dark:text-white mb-4">
            Get In Touch
          </h2>
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: 80 }}
            transition={{ duration: 0.8 }}
            className="h-1.5 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full mb-6"
          ></motion.div>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg">
            Have a project in mind? I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-12">          
          <motion.div 
            className="md:w-1/3 space-y-8"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-gray-50/50 dark:bg-darkLight/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-100 dark:border-slate-700/50 shadow-sm hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-xl font-bold text-dark dark:text-white mb-6 flex items-center gap-2">
                <span className="w-2 h-6 bg-primary rounded-full"></span>
                Contact Info
              </h3>
              
              <div className="space-y-6">                
                <motion.div 
                  className="flex items-start space-x-4 p-3 rounded-xl hover:bg-white dark:hover:bg-slate-800 transition-colors"
                  whileHover={{ x: 5 }}
                >
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary flex-shrink-0 shadow-sm">
                    <i className="fas fa-envelope text-lg"></i>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5 uppercase tracking-wide font-bold">Email</p>
                    <a href="mailto:rojagatrafie@gmail.com" className="text-dark dark:text-slate-200 font-medium hover:text-primary transition-colors break-all">
                      rojagatrafie@gmail.com
                    </a>
                  </div>
                </motion.div>

                <motion.div 
                  className="flex items-start space-x-4 p-3 rounded-xl hover:bg-white dark:hover:bg-slate-800 transition-colors"
                  whileHover={{ x: 5 }}
                >
                  <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center text-secondary flex-shrink-0 shadow-sm">
                    <i className="fas fa-map-marker-alt text-lg"></i>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5 uppercase tracking-wide font-bold">Location</p>
                    <p className="text-dark dark:text-slate-200 font-medium">Jakarta, Indonesia</p>
                  </div>
                </motion.div>
              </div>

              <div className="mt-10 pt-6 border-t border-gray-200 dark:border-slate-700/50">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 font-medium">Follow me on:</p>
                <div className="flex space-x-3">
                  {[
                    { icon: "fab fa-linkedin-in", url: "https://linkedin.com/in/rafie-rojagat", color: "hover:bg-[#0077b5]", text: "LinkedIn" },
                    { icon: "fab fa-github", url: "https://github.com/Rafie1715", color: "hover:bg-[#24292e]", text: "GitHub" },
                    { icon: "fab fa-instagram", url: "https://instagram.com/rafie_rb", color: "hover:bg-[#E1306C]", text: "Instagram" }
                  ].map((social, index) => (
                    <motion.a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noreferrer"
                      variants={socialHover}
                      whileHover="hover"
                      className={`w-10 h-10 rounded-lg bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 flex items-center justify-center text-gray-500 transition-all duration-300 hover:text-white hover:border-transparent hover:shadow-lg ${social.color}`}
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
            <form onSubmit={handleSubmit} className="bg-white dark:bg-darkLight p-8 md:p-10 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700/50 relative overflow-hidden">              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <motion.div variants={itemVariants} className="group">
                  <label htmlFor="name" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 transition-colors group-focus-within:text-primary">Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    id="name" 
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-800/50 outline-none transition-all duration-300 focus:bg-white dark:text-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-primary/10 focus:border-primary placeholder-gray-400"
                    placeholder="Enter your full name"
                  />
                </motion.div>
                <motion.div variants={itemVariants} className="group">
                  <label htmlFor="email" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 transition-colors group-focus-within:text-primary">Email</label>
                  <input 
                    type="email" 
                    name="email" 
                    id="email" 
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-800/50 outline-none transition-all duration-300 focus:bg-white dark:text-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-primary/10 focus:border-primary placeholder-gray-400"
                    placeholder="Enter your email address"
                  />
                </motion.div>
              </div>

              <motion.div variants={itemVariants} className="mb-8 group">
                <label htmlFor="message" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 transition-colors group-focus-within:text-primary">Message</label>
                <textarea 
                  name="message" 
                  id="message" 
                  rows="5" 
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-800/50 outline-none transition-all duration-300 focus:bg-white dark:text-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-primary/10 focus:border-primary placeholder-gray-400 resize-none"
                  placeholder="Please write your message or inquiry here..."
                ></textarea>
              </motion.div>

              <motion.div variants={itemVariants} className="text-right relative">
                <motion.button 
                  type="submit" 
                  disabled={status === 'loading'}
                  whileHover={{ scale: 1.02, boxShadow: "0 10px 30px -10px rgba(99, 102, 241, 0.5)" }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative overflow-hidden inline-flex items-center justify-center px-8 py-3.5 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-xl shadow-lg transition-all ${status === 'loading' ? 'opacity-80 cursor-not-allowed' : ''}`}
                >
                  {status === 'loading' && (
                    <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        className="mr-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    />
                  )}
                  
                  {status === 'loading' ? 'Sending...' : 'Send Message'}
                  
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
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute bottom-full right-0 mb-4 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg text-sm font-bold flex items-center shadow-sm"
                    >
                        <i className="fas fa-check-circle mr-2"></i> Message sent successfully!
                    </motion.div>
                    )}
                    {status === 'error' && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute bottom-full right-0 mb-4 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-sm font-bold flex items-center shadow-sm"
                    >
                        <i className="fas fa-exclamation-circle mr-2"></i> Failed to send. Try again.
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