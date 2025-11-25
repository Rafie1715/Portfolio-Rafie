// src/components/Experience.jsx
import { useState } from 'react';

// Import Logo
import ksmLogo from '../assets/images/ksm-logo.jpg';
import hmifLogo from '../assets/images/hmif-logo.jpg';
import bangkitLogo from '../assets/images/bangkit_academy-logo.jpg';

// Import Dokumentasi KSM
import ksmDoc1 from '../assets/images/ksm-doc1.png';
import ksmDoc2 from '../assets/images/ksm-doc2.png';
import ksmDoc3 from '../assets/images/ksm-doc3.png';
import ksmDoc4 from '../assets/images/ksm-doc4.png';
import ksmDoc5 from '../assets/images/ksm-doc5.jpg';
import ksmDoc6 from '../assets/images/ksm-doc6.jpeg';

// Import Dokumentasi HMIF
import hmifDoc1 from '../assets/images/hmif-doc1.png';
import hmifDoc2 from '../assets/images/hmif-doc2.jpg';
import hmifDoc3 from '../assets/images/hmif-doc3.png';
import hmifDoc4 from '../assets/images/hmif-doc4.png';
import hmifDoc5 from '../assets/images/hmif-doc5.jpg';
import hmifDoc6 from '../assets/images/hmif-doc6.jpeg';

// Import Dokumentasi Bangkit
import bangkitDoc1 from '../assets/images/bangkit-doc1.png';
import bangkitDoc2 from '../assets/images/bangkit-doc2.png';
import bangkitDoc3 from '../assets/images/bangkit-doc3.png';
import bangkitDoc4 from '../assets/images/bangkit-doc4.png';

const experiences = [
  {
    id: 1,
    logo: ksmLogo,
    title: "Head of Web Development Class",
    org: "Kelompok Studi Mahasiswa (KSM) Multimedia UPNVJ",
    date: "Feb 2025 - Present",
    description: [
      "Led and coordinated a team of 2 mentors.",
      "Instructed 28 students in front-end web development curriculum (HTML, CSS, JavaScript).",
      "Developed and managed all learning materials and assessments.",
      "Actively served on various committees for KSM Multimedia programs and events."
    ],
    docs: [ksmDoc1, ksmDoc2, ksmDoc3, ksmDoc4, ksmDoc5, ksmDoc6] // Data dokumentasi
  },
  {
    id: 2,
    logo: hmifLogo,
    title: "Staff of Information and Technology",
    org: "Himpunan Mahasiswa Informatika (HMIF) UPNVJ",
    date: "Jan 2025 - Present",
    description: [
      "Managed the 'CodeVox' educational program, creating and editing video tutorials for the HMIF YouTube channel.",
      "Actively served on various committees for HMIF programs and events."
    ],
    docs: [hmifDoc1, hmifDoc2, hmifDoc3, hmifDoc4, hmifDoc5, hmifDoc6] // Data dokumentasi
  },
  {
    id: 3,
    logo: bangkitLogo,
    title: "Mobile Development Cohort",
    org: "Bangkit Academy by Google, GoTo, Traveloka",
    date: "Sep 2024 - Jan 2025",
    description: [
      "Completed 900+ hours of intensive curriculum in Android Development.",
      "Developed 'Planetku' capstone project with Machine Learning integration.",
      "Gained soft skills and career readiness training from industry experts."
    ],
    docs: [bangkitDoc1, bangkitDoc2, bangkitDoc3, bangkitDoc4] // Data dokumentasi
  }
];

const Experience = () => {
  // State untuk fitur zoom gambar (Lightbox sederhana)
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <section id="experience" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">Experience</h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
        </div>

        <div className="max-w-4xl mx-auto relative">
          {/* Vertical Line */}
          <div className="absolute left-[28px] md:left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 -translate-x-1/2 hidden md:block"></div>
          <div className="absolute left-[28px] top-0 bottom-0 w-0.5 bg-gray-200 -translate-x-1/2 md:hidden"></div>

          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <div key={exp.id} data-aos={index % 2 === 0 ? "fade-left" : "fade-right"} className={`relative flex items-start md:items-center gap-6 md:gap-0 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                
                {/* Empty Spacer for Desktop */}
                <div className="hidden md:block md:w-1/2"></div>
                
                {/* Timeline Dot */}
                <div className="absolute left-[28px] md:left-1/2 -translate-x-1/2 w-4 h-4 bg-primary rounded-full border-4 border-white shadow-sm z-10"></div>

                {/* Content Card */}
                <div className="flex-1 ml-12 md:ml-0 md:w-1/2 md:px-10">
                  <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                    <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-100">
                      <img src={exp.logo} alt={exp.org} className="w-12 h-12 rounded-full object-cover shadow-sm" />
                      <div>
                        <h3 className="font-bold text-dark text-lg leading-tight">{exp.title}</h3>
                        <p className="text-primary text-sm font-medium">{exp.org}</p>
                      </div>
                    </div>
                    
                    <ul className="space-y-2 mb-6">
                      {exp.description.map((item, i) => (
                        <li key={i} className="text-gray-600 text-sm flex items-start">
                          <span className="mr-2 mt-1.5 w-1.5 h-1.5 bg-gray-400 rounded-full flex-shrink-0"></span>
                          {item}
                        </li>
                      ))}
                    </ul>

                    {/* Section Dokumentasi Baru */}
                    {exp.docs && exp.docs.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-50">
                        <h6 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Documentation:</h6>
                        <div className="flex flex-wrap gap-2">
                          {exp.docs.map((doc, idx) => (
                            <img 
                              key={idx} 
                              src={doc} 
                              alt={`Doc ${idx + 1}`} 
                              className="w-20 h-14 object-cover rounded-md border border-gray-200 cursor-pointer hover:scale-110 transition-transform hover:shadow-md"
                              onClick={() => setSelectedImage(doc)}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-4 pt-2 text-right">
                       <span className="inline-block px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-xs font-medium">
                         {exp.date}
                       </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal Lightbox Sederhana untuk Zoom Gambar */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl w-full max-h-screen">
            <img 
              src={selectedImage} 
              alt="Full Preview" 
              className="w-full h-auto max-h-[90vh] object-contain rounded-lg shadow-2xl"
            />
            <button 
              className="absolute -top-10 right-0 text-white text-3xl hover:text-gray-300 transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              &times;
            </button>
            <p className="text-center text-gray-400 mt-2 text-sm">Click anywhere to close</p>
          </div>
        </div>
      )}
    </section>
  );
};

export default Experience;