import { motion, useReducedMotion } from "framer-motion";
import {
  BrainCircuit,
  Database,
  MonitorSmartphone,
  Smartphone,
  Wrench,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { skillsData } from "../data/skills";

const findSkill = (name) => (
  skillsData.find((skill) => skill.name.toLowerCase() === name.toLowerCase()) || {
    name,
    icon: "fas fa-code text-gray-500",
  }
);

const Skills = () => {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const categories = [
    {
      key: "mobile",
      Icon: Smartphone,
      color: "text-blue-600 bg-blue-50 dark:bg-blue-950/40",
      skills: ["Kotlin", "Jetpack Compose", "Android Studio", "Retrofit", "MVVM", "Coroutines", "Paging 3", "Material Design"],
    },
    {
      key: "frontend",
      Icon: MonitorSmartphone,
      color: "text-cyan-700 bg-cyan-50 dark:bg-cyan-950/40",
      skills: ["React.js", "Next.js", "JavaScript", "Tailwind CSS", "Bootstrap"],
    },
    {
      key: "ai",
      Icon: BrainCircuit,
      color: "text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40",
      skills: ["Python", "Machine Learning", "Scikit-Learn", "Prompt Engineering", "Generative AI"],
    },
    {
      key: "backend",
      Icon: Database,
      color: "text-amber-700 bg-amber-50 dark:bg-amber-950/40",
      skills: ["Node.js", "Express.js", "REST API", "MySQL", "Firebase"],
    },
    {
      key: "tools",
      Icon: Wrench,
      color: "text-rose-700 bg-rose-50 dark:bg-rose-950/40",
      skills: ["Git", "GitHub", "Postman", "VS Code", "Figma"],
    },
  ];

  return (
    <section id="skills" className="scroll-mt-24 bg-gray-50 py-16 dark:bg-slate-950 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 max-w-2xl"
        >
          <p className="mb-3 text-sm font-bold uppercase text-primary">{t("skills.eyebrow")}</p>
          <h2 className="text-3xl font-bold text-dark dark:text-white sm:text-4xl">{t("skills.title")}</h2>
          <p className="mt-4 text-base leading-7 text-gray-600 dark:text-gray-400">
            {t("skills.description")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {categories.map((category, index) => (
            <motion.article
              key={category.key}
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.35, delay: index * 0.04 }}
              className="rounded-lg border border-gray-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900 sm:p-6"
            >
              <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-lg ${category.color}`}>
                <category.Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold text-dark dark:text-white">
                {t(`skills.categories.${category.key}.title`)}
              </h3>
              <p className="mt-2 min-h-[44px] text-sm leading-6 text-gray-600 dark:text-gray-400">
                {t(`skills.categories.${category.key}.desc`)}
              </p>

              <div className="mt-5 border-t border-gray-100 pt-2 dark:border-slate-800">
                {category.skills.map((skillName) => {
                  const skill = findSkill(skillName);
                  return (
                    <div
                      key={`${category.key}-${skill.name}`}
                      className="flex min-h-10 items-center gap-3 border-b border-gray-100 py-2 last:border-0 dark:border-slate-800"
                    >
                      <i className={`${skill.icon} w-5 text-center text-lg`} aria-hidden="true" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{skill.name}</span>
                    </div>
                  );
                })}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
