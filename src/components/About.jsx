// src/components/About.jsx
import upnLogo from '../assets/images/upnvj_logo.png';
import cvFile from '../assets/CV Rafie Rojagat Bachri.pdf';

const About = () => {
  return (
    <section id="about" className="py-24 bg-white dark:bg-dark">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-dark dark:text-white mb-16">
          About Me
          <div className="w-20 h-1 bg-primary mx-auto rounded-full mt-2"></div>
        </h2>

        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* Kolom Kiri: Deskripsi */}
          <div className="lg:w-7/12" data-aos="fade-right">
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6 text-justify lg:text-left">
              I am an undergraduate student majoring in Informatics at Universitas Pembangunan Nasional 
              “Veteran” Jakarta (UPN “Veteran” Jakarta), with a deep and proven passion for Software 
              Engineering. I have developed a strong proficiency in both mobile and web development, 
              specializing in building full-stack applications.
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-8 text-justify lg:text-left">
              My technical expertise includes various programming languages such as Kotlin, Java, Python, and 
              JavaScript complemented by hands-on experience with modern frameworks and tools like Node.js and 
              Firebase. My projects demonstrate my ability to tackle real-world challenges, from developing 
              the "Planetku" smart waste management app to creating the "Computer Crafter" website.
            </p>

            <a 
              href={cvFile} 
              download="CV Rafie Rojagat Bachri.pdf"
              className="inline-flex items-center px-8 py-3 bg-primary text-white rounded-lg hover:bg-blue-600 transition-all shadow-lg hover:shadow-primary/40 transform hover:-translate-y-1"
            >
              <i className="fas fa-download mr-2"></i> Download CV
            </a>
          </div>

          {/* Kolom Kanan: Edukasi */}
          <div className="lg:w-5/12 text-center" data-aos="fade-left">
            <div className="bg-gray-50 dark:bg-darkLight p-8 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
              <img 
                src={upnLogo} 
                alt="UPN Logo" 
                className="w-48 mx-auto mb-6 drop-shadow-sm" 
              />
              <h4 className="text-xl font-bold text-dark dark:text-white mb-4 border-b pb-2 border-gray-200 dark:border-slate-600 inline-block">Education</h4>
              
              <ul className="space-y-6">
                <li className="relative pl-4">
                  <div className="font-bold text-lg text-dark dark:text-white">Universitas Pembangunan Nasional "Veteran" Jakarta</div>
                  <div className="text-primary font-medium">Informatics (2022 - Present)</div>
                  <div className="text-gray-500 dark:text-gray-400 text-sm mt-1 bg-white dark:bg-slate-700 inline-block px-3 py-1 rounded-full border border-gray-200 dark:border-slate-600">GPA: 3.91/4.00</div>
                </li>
                <li className="relative pl-4">
                  <div className="font-bold text-lg text-dark dark:text-white">SMA Negeri 13 Jakarta</div>
                  <div className="text-gray-500 dark:text-gray-400">Science (2019 - 2022)</div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;