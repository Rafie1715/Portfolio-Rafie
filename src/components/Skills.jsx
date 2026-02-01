import Marquee from "react-fast-marquee"; 
import { skillsData } from "../data/skills";
import { motion } from "framer-motion";
import { useTranslation } from 'react-i18next';

const Skills = () => {
  const { t } = useTranslation();
  const midPoint = Math.ceil(skillsData.length / 2);
  const firstRow = skillsData.slice(0, midPoint);
  const secondRow = skillsData.slice(midPoint);

  return (
    <section id="skills" className="py-24 bg-white dark:bg-dark relative overflow-hidden">      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-primary/20 rounded-full blur-[120px] -z-10 opacity-50"></div>

      <div className="container mx-auto px-4 mb-16">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-dark dark:text-white mb-4">
            {t('skills.title')}
          </h2>
          <div className="w-20 h-1.5 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full mb-6"></div>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg">
            {t('skills.description')}
            {t('skills.description')}
          </p>
        </motion.div>
      </div>

      <div className="relative flex flex-col gap-8 [mask-image:linear-gradient(to_right,transparent,white_5%,white_95%,transparent)]">
        
        <Marquee gradient={false} speed={40} pauseOnHover={true}>
          {firstRow.map((skill, index) => (
            <SkillCard key={index} skill={skill} />
          ))}
        </Marquee>

        <Marquee gradient={false} speed={40} pauseOnHover={true} direction="right">
          {secondRow.map((skill, index) => (
            <SkillCard key={index} skill={skill} />
          ))}
        </Marquee>
        
      </div>
    </section>
  );
};

const SkillCard = ({ skill }) => {
  return (
    <div className="mx-4 group">
      <div className="
        relative flex flex-col items-center justify-center gap-3
        w-32 h-32 sm:w-40 sm:h-40
        rounded-2xl 
        bg-white/50 dark:bg-slate-800/50 
        backdrop-blur-sm
        border border-gray-100 dark:border-slate-700/50
        hover:border-primary/50 dark:hover:border-primary/50
        hover:bg-white dark:hover:bg-slate-800
        hover:shadow-xl hover:shadow-primary/10
        transition-all duration-300
        cursor-pointer
      ">
        <div className="text-5xl sm:text-6xl text-gray-400 dark:text-gray-500 group-hover:text-primary group-hover:scale-110 transition-all duration-300 filter grayscale group-hover:grayscale-0">
          <i className={skill.icon}></i>
        </div>
        
        <span className="text-xs sm:text-sm font-bold text-gray-500 dark:text-gray-400 group-hover:text-dark dark:group-hover:text-white transition-colors">
          {skill.name}
        </span>

        <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-gray-200 dark:bg-slate-700 group-hover:bg-primary transition-colors"></div>
      </div>
    </div>
  );
};

export default Skills;