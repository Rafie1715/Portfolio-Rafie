import { motion } from 'framer-motion';
import upnLogo from '/images/upnvj_logo.webp';
import galasLogo from '/images/sman13-logo.webp';
const cvFile = "/assets/CV Rafie Rojagat Bachri.pdf";
import Nametag from './Nametag';

const About = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 50, damping: 20 }
    },
  };

  return (
    <section id="about" className="py-24 bg-white dark:bg-dark overflow-hidden relative">
      <div className="absolute top-20 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
      <div className="absolute bottom-20 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

      <div className="container mx-auto px-4">

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-dark dark:text-white">
            About Me
          </h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 80 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-1.5 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full mt-3"
          ></motion.div>
        </motion.div>

        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

          <motion.div
            className="lg:w-5/12 w-full flex justify-center order-1 h-[400px] md:h-[550px] relative z-10"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
            >
              <Nametag />
            </motion.div>
          </motion.div>

          <motion.div
            className="lg:w-7/12 order-2"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="mb-10">
              <motion.h3 variants={itemVariants} className="text-2xl font-bold text-dark dark:text-white mb-4">
                Hello, I'm <span className="text-primary inline-block">Rafie! 👋</span>
              </motion.h3>

              <motion.p variants={itemVariants} className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                I'm a final-year <span className="font-semibold text-primary">Informatics student</span> at UPN “Veteran” Jakarta with a strong interest in <span className="font-semibold text-dark dark:text-white">Front-End and Mobile Development</span>.
                <br /><br />
                Skilled in building responsive apps using <span className="text-yellow-600 dark:text-yellow-400 font-medium">JavaScript</span>, <span className="text-blue-500 font-medium">React</span>, and <span className="text-purple-500 font-medium">Kotlin</span>. Highly motivated to enhance technical skills through internship opportunities to create impactful digital solutions.
              </motion.p>

              <motion.div variants={itemVariants}>
                <a
                  href={cvFile}
                  download="CV_Rafie_Rojagat_Bachri.pdf"
                  className="inline-flex items-center px-8 py-3 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-medium hover:shadow-lg hover:shadow-primary/30 transition-all transform hover:-translate-y-1 group"
                >
                  <i className="fas fa-download mr-2 group-hover:animate-bounce"></i> Download CV
                </a>
              </motion.div>
            </div>

            <motion.div
              variants={itemVariants}
              whileHover={{ y: -5, scale: 1.01 }}
              className="bg-white/80 dark:bg-darkLight/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all duration-300 group"
            >
              <div className="flex items-start gap-4">
                <div className="bg-white p-2 rounded-xl shadow-sm w-16 h-16 flex items-center justify-center flex-shrink-0 border border-gray-100">
                  <img src={upnLogo} alt="UPN Logo" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-dark dark:text-white group-hover:text-primary transition-colors">Education</h4>
                  <p className="font-semibold text-gray-800 dark:text-gray-200 mt-1">
                    Universitas Pembangunan Nasional "Veteran" Jakarta
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className="text-primary text-sm font-medium bg-primary/10 px-3 py-1 rounded-full">
                      Informatics (2022 - Present)
                    </span>
                    <span className="text-xs font-bold text-gray-500 dark:text-gray-300 border border-gray-200 dark:border-slate-600 px-3 py-1 rounded-full">
                      GPA: 3.91/4.00 🌟
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-700/50">
                <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400">
                  <div className="bg-white p-2 rounded-xl shadow-sm w-16 h-16 flex items-center justify-center flex-shrink-0 border border-gray-100">
                    <img src={galasLogo} alt="SMA Negeri 13 Jakarta Logo" className="w-full h-full object-contain" />
                  </div>
                  <div className="text-sm">
                    <p className="font-medium text-gray-700 dark:text-gray-300">SMA Negeri 13 Jakarta</p>
                    <p>Science (2019 - 2022)</p>
                  </div>
                </div>
              </div>
            </motion.div>

          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;