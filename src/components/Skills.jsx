import { skillsData } from "../data/skills";
import { motion } from "framer-motion";
import { useTranslation } from 'react-i18next';

const findSkill = (name) => (
  skillsData.find((skill) => skill.name.toLowerCase() === name.toLowerCase()) || {
    name,
    icon: 'fas fa-code',
  }
);

const Skills = () => {
  const { t } = useTranslation();

  const categories = [
    {
      title: t('skills.categories.frontend.title'),
      desc: t('skills.categories.frontend.desc'),
      icon: 'fas fa-window-maximize',
      skills: ['React', 'JavaScript', 'Tailwind CSS', 'Vite', 'HTML5', 'CSS3'].map(findSkill),
    },
    {
      title: t('skills.categories.mobile.title'),
      desc: t('skills.categories.mobile.desc'),
      icon: 'fas fa-mobile-screen-button',
      skills: ['Kotlin', 'Android Studio', 'Flutter', 'Firebase'].map(findSkill),
    },
    {
      title: t('skills.categories.backend.title'),
      desc: t('skills.categories.backend.desc'),
      icon: 'fas fa-server',
      skills: ['Node.js', 'PHP', 'MySQL', 'Firebase'].map(findSkill),
    },
    {
      title: t('skills.categories.tools.title'),
      desc: t('skills.categories.tools.desc'),
      icon: 'fas fa-screwdriver-wrench',
      skills: ['Git', 'Figma', 'VS Code', 'Python', 'Java'].map(findSkill),
    },
  ];

  return (
    <section id="skills" className="py-24 bg-white dark:bg-dark relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-dark dark:text-white mb-4">
            {t('skills.title')}
          </h2>
          <div className="w-20 h-1.5 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full mb-6"></div>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg">
            {t('skills.description')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.45, delay: index * 0.06 }}
              className="rounded-2xl border border-gray-200 dark:border-slate-700 bg-gray-50/70 dark:bg-slate-900/50 p-5 md:p-6 shadow-sm"
            >
              <div className="flex items-start gap-4 mb-5">
                <div className="w-11 h-11 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-primary dark:text-blue-300 flex items-center justify-center flex-shrink-0">
                  <i className={category.icon}></i>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-dark dark:text-white mb-1">
                    {category.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {category.desc}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {category.skills.map((skill) => (
                  <div
                    key={`${category.title}-${skill.name}`}
                    className="flex items-center gap-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-3 min-h-[52px]"
                  >
                    <i className={`${skill.icon} text-xl`}></i>
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 leading-tight">
                      {skill.name}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
