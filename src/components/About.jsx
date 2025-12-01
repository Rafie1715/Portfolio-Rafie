import upnLogo from '../assets/images/upnvj_logo.png';
import cvFile from '../assets/CV Rafie Rojagat Bachri.pdf';
import Nametag from './NameTag';

const About = () => {
  return (
    <section id="about" className="py-24 bg-white dark:bg-dark overflow-visible">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-dark dark:text-white mb-16" data-aos="fade-down">
          About Me
          <div className="w-20 h-1 bg-primary mx-auto rounded-full mt-2"></div>
        </h2>

        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          <div className="lg:w-5/12 w-full flex justify-center order-1 h-[550px]" data-aos="fade-right">
             <Nametag />
          </div>

          <div className="lg:w-7/12 order-2" data-aos="fade-left">
            <div className="mb-10">
                <h3 className="text-2xl font-bold text-dark dark:text-white mb-4">
                    Hello, I'm <span className="text-primary">Rafie!</span>
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                  I'm a final-year Informatics student at Universitas Pembangunan Nasional “Veteran” Jakarta with a strong interest in Front-End and Mobile Development. Skilled in building responsive, user-friendly applications using Kotlin and JavaScript. Highly motivated to enhance technical and collaborative skills through internship opportunities that contribute to creating innovative and impactful digital solutions.
                </p>
                <a 
                  href={cvFile} 
                  download="CV Rafie Rojagat Bachri.pdf"
                  className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-600 transition-all shadow-lg transform hover:-translate-y-1"
                >
                  <i className="fas fa-download mr-2"></i> Download CV
                </a>
            </div>

            <div className="bg-gray-50 dark:bg-darkLight p-6 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm">
              <div className="flex items-start gap-4">
                  <div className="bg-white p-2 rounded-lg shadow-sm w-16 h-16 flex items-center justify-center flex-shrink-0">
                      <img src={upnLogo} alt="UPN Logo" className="w-full h-full object-contain" />
                  </div>
                  <div>
                      <h4 className="text-lg font-bold text-dark dark:text-white">Education</h4>
                      <p className="font-semibold text-gray-800 dark:text-gray-200 mt-1">
                        Universitas Pembangunan Nasional "Veteran" Jakarta
                      </p>
                      <p className="text-primary text-sm font-medium">Informatics (2022 - Present)</p>
                      <div className="mt-2 inline-block bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 px-3 py-1 rounded-full text-xs text-gray-500 dark:text-gray-300">
                        GPA: 3.91/4.00
                      </div>
                  </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700">
                  <div className="flex items-start gap-4">
                      <div className="w-16 flex-shrink-0 text-center text-2xl text-gray-400">
                        <i className="fas fa-school"></i>
                      </div>
                      <div>
                          <p className="font-semibold text-gray-800 dark:text-gray-200">SMA Negeri 13 Jakarta</p>
                          <p className="text-gray-500 dark:text-gray-400 text-sm">Science (2019 - 2022)</p>
                      </div>
                  </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default About;