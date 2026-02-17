import { motion } from 'framer-motion';
import upnLogo from '/images/upnvj_logo.webp';
import galasLogo from '/images/sman13-logo.webp';
const cvFile = "/assets/CV Rafie Rojagat Bachri.pdf";
import IDCard from './IDCard';
import { useTranslation, Trans } from 'react-i18next';

const About = () => {
  const { t } = useTranslation();

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
            {t('about.title')}
          </h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 80 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-1.5 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full mt-3"
          ></motion.div>
        </motion.div>

        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12 lg:gap-20">

          <motion.div
            className="lg:w-5/12 w-full flex justify-center order-1 sticky top-24 z-10"
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
          >

            <div className="py-10 w-full flex justify-center">
              <IDCard />
            </div>
          </motion.div>

          <motion.div
            className="lg:w-7/12 order-2"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="mb-12">
              <motion.h3 variants={itemVariants} className="text-2xl font-bold text-dark dark:text-white mb-4">
                {t('about.hello')} <span className="text-primary inline-block">Rafie! 👋</span>
              </motion.h3>

              <motion.p variants={itemVariants} className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                <Trans i18nKey="about.desc1">
                  I'm a final-year <span className="font-semibold text-primary">Informatics student</span> at UPN “Veteran” Jakarta with a strong interest in <span className="font-semibold text-dark dark:text-white">Front-End and Mobile Development</span>.
                </Trans>
                <br /><br />
                <Trans i18nKey="about.desc2">
                  Skilled in building responsive apps using <span className="text-yellow-600 dark:text-yellow-400 font-medium">JavaScript</span>, <span className="text-blue-500 font-medium">React</span>, and <span className="text-blue-600 font-medium">Kotlin</span>. Highly motivated to enhance technical skills through internship opportunities to create impactful digital solutions.
                </Trans>
              </motion.p>

              <motion.div variants={itemVariants}>
                <a
                  href={cvFile}
                  download="CV_Rafie_Rojagat_Bachri.pdf"
                  className="inline-flex items-center px-8 py-3 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-medium hover:shadow-lg hover:shadow-primary/30 transition-all transform hover:-translate-y-1 group"
                >
                  <i className="fas fa-download mr-2 group-hover:animate-bounce"></i> {t('about.download_cv')}
                </a>
              </motion.div>
            </div>

            <div className="relative pl-4 md:pl-0">
              <motion.div variants={itemVariants} className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <i className="fas fa-graduation-cap text-xl"></i>
                </div>
                <h3 className="text-2xl font-bold text-dark dark:text-white">{t('about.edu_title')}</h3>
              </motion.div>

              <div className="absolute left-8 md:left-9 top-16 bottom-10 w-[2px] bg-gray-200 dark:bg-slate-700"></div>

              <div className="space-y-8 relative">

                <motion.div
                  variants={itemVariants}
                  className="relative pl-12 md:pl-16"
                >
                  <div className="absolute left-[13px] md:left-[33px] top-6 w-4 h-4 rounded-full bg-primary border-4 border-white dark:border-dark z-10 shadow-sm"></div>

                  <div className="bg-white/80 dark:bg-darkLight/50 backdrop-blur-sm p-5 rounded-2xl border border-primary/20 dark:border-primary/20 shadow-lg hover:shadow-primary/10 transition-all duration-300 group hover:-translate-y-1">
                    <div className="flex items-start gap-4">
                      <div className="bg-white p-2 rounded-xl shadow-sm w-14 h-14 flex items-center justify-center flex-shrink-0 border border-gray-100">
                        <img src={upnLogo} alt="UPN Logo" className="w-full h-full object-contain" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-dark dark:text-white group-hover:text-primary transition-colors">
                          {t('about.uni_name')}
                        </h4>
                        <p className="text-primary font-medium text-sm mt-1">{t('about.uni_major')}</p>
                        <div className="mt-3 flex items-center gap-2">
                          <span className="text-xs font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-slate-700/50 px-3 py-1 rounded-full border border-gray-200 dark:border-slate-600">
                            GPA: 3.89 / 4.00 ⭐
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="relative pl-12 md:pl-16"
                >
                  <div className="absolute left-[13px] md:left-[33px] top-6 w-4 h-4 rounded-full bg-gray-300 dark:bg-slate-600 border-4 border-white dark:border-dark z-10"></div>

                  <div className="bg-white/60 dark:bg-darkLight/30 backdrop-blur-sm p-5 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-300 group hover:-translate-y-1">
                    <div className="flex items-center gap-4">
                      <div className="bg-white p-2 rounded-xl shadow-sm w-12 h-12 flex items-center justify-center flex-shrink-0 border border-gray-100 grayscale group-hover:grayscale-0 transition-all duration-300">
                        <img src={galasLogo} alt="SMA Logo" className="w-full h-full object-contain" />
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-dark dark:text-white group-hover:text-primary transition-colors">
                          {t('about.hs_name')}
                        </h4>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">{t('about.hs_major')}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;