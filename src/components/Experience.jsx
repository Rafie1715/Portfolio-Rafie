import { useState } from 'react';
import { experiences } from '../data/experience';

const Experience = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <section id="experience" className="py-24 bg-white dark:bg-dark">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-dark dark:text-white mb-4">Experience</h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
        </div>

        <div className="max-w-4xl mx-auto relative">
          <div className="absolute left-[28px] md:left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-slate-700 -translate-x-1/2 hidden md:block"></div>
          <div className="absolute left-[28px] top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-slate-700 -translate-x-1/2 md:hidden"></div>

          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <div key={exp.id} data-aos={index % 2 === 0 ? "fade-left" : "fade-right"} className={`relative flex items-start md:items-center gap-6 md:gap-0 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                <div className="hidden md:block md:w-1/2"></div>
                
                <div className="absolute left-[28px] md:left-1/2 -translate-x-1/2 w-4 h-4 bg-primary rounded-full border-4 border-white dark:border-dark shadow-sm z-10"></div>

                <div className="flex-1 ml-12 md:ml-0 md:w-1/2 md:px-10">
                  <div className="bg-white dark:bg-darkLight p-6 rounded-xl shadow-md border border-gray-100 dark:border-slate-700 hover:shadow-lg transition-shadow duration-300">
                    <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-100 dark:border-slate-700">
                      <img src={exp.logo} alt={exp.org} loading="lazy" className="w-12 h-12 rounded-full object-cover shadow-sm" />
                      <div>
                        <h3 className="font-bold text-dark dark:text-white text-lg leading-tight">{exp.title}</h3>
                        <p className="text-primary text-sm font-medium">{exp.org}</p>
                      </div>
                    </div>
                    
                    <ul className="space-y-2 mb-6">
                      {exp.description.map((item, i) => (
                        <li key={i} className="text-gray-600 dark:text-gray-300 text-sm flex items-start">
                          <span className="mr-2 mt-1.5 w-1.5 h-1.5 bg-gray-400 rounded-full flex-shrink-0"></span>
                          {item}
                        </li>
                      ))}
                    </ul>

                    {exp.docs && exp.docs.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-50 dark:border-slate-700">
                        <h6 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Documentation:</h6>
                        <div className="flex flex-wrap gap-2">
                          {exp.docs.map((doc, idx) => (
                            <img 
                              key={idx} 
                              src={doc} 
                              alt={`Doc ${idx + 1}`} 
                              loading="lazy"
                              className="w-20 h-14 object-cover rounded-md border border-gray-200 dark:border-slate-600 cursor-pointer hover:scale-110 transition-transform hover:shadow-md"
                              onClick={() => setSelectedImage(doc)}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-4 pt-2 text-right">
                       <span className="inline-block px-3 py-1 bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-300 rounded-full text-xs font-medium">
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