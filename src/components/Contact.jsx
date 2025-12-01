// src/components/Contact.jsx
import { motion } from 'framer-motion'; // Pastikan sudah install framer-motion

const Contact = () => {
  return (
    <section id="contact" className="py-24 bg-white relative overflow-hidden dark:bg-dark">
      {/* Background Decoration (Opsional: Blob samar di belakang) */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-secondary/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16" data-aos="fade-down">
          <h2 className="text-3xl md:text-4xl font-bold text-dark dark:text-white mb-4">
            Get In Touch
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full mb-6"></div>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg">
            Have a project in mind or just want to say hi? I'm always open to discussing new projects, creative ideas or opportunities to be part of your visions.
          </p>
        </div>

        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-12">
          
          {/* Bagian Kiri: Info Kontak & Sosmed */}
          <div className="md:w-1/3 space-y-8" data-aos="fade-right">
            <div className="bg-gray-50 dark:bg-darkLight p-8 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm">
              <h3 className="text-xl font-bold text-dark dark:text-white mb-6">Contact Info</h3>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary flex-shrink-0">
                    <i className="fas fa-envelope text-lg"></i>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Email</p>
                    <a href="mailto:rojagatrafie@gmail.com" className="text-dark dark:text-slate-200 font-medium hover:text-primary transition-colors">
                      rojagatrafie@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary flex-shrink-0">
                    <i className="fas fa-map-marker-alt text-lg"></i>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Location</p>
                    <p className="text-dark dark:text-slate-200 font-medium">Jakarta, Indonesia</p>
                  </div>
                </div>
              </div>

              {/* Social Icons dengan Animasi */}
              <div className="mt-10">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Follow me on:</p>
                <div className="flex space-x-4">
                  {[
                    { icon: "fab fa-linkedin-in", url: "https://linkedin.com/in/rafie-rojagat", color: "hover:bg-[#0077b5]" },
                    { icon: "fab fa-github", url: "https://github.com/Rafie1715", color: "hover:bg-[#333]" },
                    { icon: "fab fa-instagram", url: "https://instagram.com/rafie_rb", color: "hover:bg-[#E1306C]" } // Contoh tambah IG
                  ].map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noreferrer"
                      className={`w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 flex items-center justify-center text-gray-500 transition-all duration-300 hover:text-white hover:border-transparent hover:-translate-y-1 shadow-sm ${social.color}`}
                    >
                      <i className={`${social.icon} text-lg`}></i>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bagian Kanan: Form */}
          <div className="md:w-2/3" data-aos="fade-left">
            <form action="https://formspree.io/f/xanjlvvr" method="POST" className="bg-white dark:bg-darkLight p-8 md:p-10 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 relative">
              
              {/* Grid Layout untuk Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="group">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors group-focus-within:text-primary">Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    id="name" 
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-800 outline-none transition-all duration-300 focus:bg-white dark:text-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:shadow-lg"
                    placeholder="Your Name"
                  />
                </div>
                <div className="group">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors group-focus-within:text-primary">Email</label>
                  <input 
                    type="email" 
                    name="email" 
                    id="email" 
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 dark:bg-slate-800 outline-none transition-all duration-300 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary focus:shadow-lg"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <div className="mb-8 group">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2 transition-colors group-focus-within:text-primary">Message</label>
                <textarea 
                  name="message" 
                  id="message" 
                  rows="5" 
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 dark:bg-slate-800 outline-none transition-all duration-300 focus:bg-white dark:border-slate-600 dark:text-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:shadow-lg resize-none"
                  placeholder="Write your message here..."
                ></textarea>
              </div>

              {/* Animated Send Button */}
              <div className="text-right">
                <motion.button 
                  type="submit" 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center justify-center px-8 py-3.5 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all"
                >
                  Send Message 
                  <motion.i 
                    className="fas fa-paper-plane ml-2"
                    initial={{ x: 0, y: 0 }}
                    whileHover={{ x: 3, y: -3 }} // Animasi pesawat terbang saat hover
                    transition={{ type: "spring", stiffness: 300 }}
                  ></motion.i>
                </motion.button>
              </div>

            </form>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Contact;