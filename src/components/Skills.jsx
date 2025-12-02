import Marquee from "react-fast-marquee"; 
import { skillsData } from "../data/skills";

const Skills = () => {
  return (
    <section id="skills" className="py-24 bg-white dark:bg-dark overflow-hidden">
      <div className="container mx-auto px-4 mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-dark dark:text-white mb-4" data-aos="fade-down">
          Technical Skills
        </h2>
        <div className="w-20 h-1 bg-primary mx-auto rounded-full mb-8" data-aos="fade-down" data-aos-delay="100"></div>
        <p className="text-center text-gray-500 dark:text-gray-400 max-w-2xl mx-auto" data-aos="fade-up">
          Technologies and tools I work with to build comprehensive software solutions.
        </p>
      </div>

      <div className="py-10" data-aos="zoom-in">
        <Marquee gradient={false} speed={50} pauseOnHover={true}>
          {skillsData.map((skill, index) => (
            <div 
              key={index} 
              className="mx-8 flex flex-col items-center justify-center group cursor-pointer p-4 hover:bg-gray-50 dark:hover:bg-darkLight rounded-xl transition-colors"
            >
              <i className={`${skill.icon} text-6xl mb-3 transform group-hover:scale-110 transition-transform duration-300`}></i>
              <span className="text-gray-600 dark:text-gray-300 font-medium text-sm group-hover:text-primary transition-colors">
                {skill.name}
              </span>
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
};

export default Skills;