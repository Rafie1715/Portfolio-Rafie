// src/components/Skills.jsx
import Marquee from "react-fast-marquee"; // <-- Import Marquee

const Skills = () => {
  const skillsData = [
    { name: "HTML5", icon: "devicon-html5-plain colored" },
    { name: "CSS3", icon: "devicon-css3-plain colored" },
    { name: "JavaScript", icon: "devicon-javascript-plain colored" },
    { name: "Bootstrap", icon: "devicon-bootstrap-plain colored" },
    { name: "Node.js", icon: "devicon-nodejs-plain colored" },
    { name: "PHP", icon: "devicon-php-plain colored" },
    { name: "Kotlin", icon: "devicon-kotlin-plain colored" },
    { name: "Android Studio", icon: "devicon-androidstudio-plain colored" },
    { name: "Java", icon: "devicon-java-plain colored" },
    { name: "Python", icon: "devicon-python-plain colored" },
    { name: "MySQL", icon: "devicon-mysql-plain colored" },
    { name: "Git", icon: "devicon-git-plain colored" },
    { name: "Figma", icon: "devicon-figma-plain colored" },
    { name: "Firebase", icon: "devicon-firebase-plain colored" },
    { name: "VS Code", icon: "devicon-vscode-plain colored" },
    { name: "Flutter", icon: "devicon-flutter-plain colored" },
    { name: "Tailwind CSS", icon: "devicon-tailwindcss-plain colored" },
    { name: "React", icon: "devicon-react-original colored" },
  ];

  return (
    <section id="skills" className="py-24 bg-white dark:bg-dark overflow-hidden">
      <div className="container mx-auto px-4 mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-dark dark:text-white mb-4" data-aos="fade-down">
          Technical Skills
        </h2>
        <div className="w-20 h-1 bg-primary mx-auto rounded-full mb-8" data-aos="fade-down" data-aos-delay="100"></div>
        <p className="text-center text-gray-500 dark:text-gray-300 max-w-2xl mx-auto" data-aos="fade-up">
          Technologies and tools I work with to build comprehensive software solutions.
        </p>
      </div>

      {/* Marquee Slider */}
      <div className="py-10" data-aos="zoom-in">
        <Marquee gradientColor={[255, 255, 255, 0]} speed={50} pauseOnHover={true}>
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