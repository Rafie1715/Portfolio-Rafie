import {
  SiKotlin,
  SiReact,
  SiPython,
  SiThreedotjs,
  SiTailwindcss,
  SiFirebase,
  SiAndroidstudio,
  SiGradle,
  SiTensorflow,
  SiJavascript,
  SiVite,
  SiPhp,
  SiMysql,
  SiScikitlearn,
  SiPandas,
  SiJetpackcompose,
  SiMaterialdesign,
  SiAndroid,
  SiBootstrap,
  SiNextdotjs,
  SiGooglegemini,
  SiOpenai,
  SiNumpy,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
  SiPostgresql,
  SiGit,
  SiGithub,
  SiPostman,
  SiGooglecolab,
  SiFigma,
  SiHtml5,
  SiCss3,
  SiLinux,
  SiCplusplus,
  SiUnity,
  SiIntellijidea,
} from 'react-icons/si';

import {
  FaBolt,
  FaPlug,
  FaLayerGroup,
  FaBrain,
  FaChartLine,
  FaFilter,
  FaMagnifyingGlassChart,
  FaChartColumn,
  FaServer,
  FaMobileScreen,
  FaLaptopCode,
  FaChartPie,
  FaDatabase,
  FaWrench,
  FaJava,
  FaCode,
} from 'react-icons/fa6';

import { TbBrandCSharp } from 'react-icons/tb';
import { VscVscode } from 'react-icons/vsc';

const extractPath = (IconComponent) => {
  try {
    const el = IconComponent({});
    return el?.props?.children?.[0]?.props?.d || null;
  } catch {
    return null;
  }
};

const extractIconInfo = (IconComponent) => {
  try {
    const el = IconComponent({});
    const vb = el?.props?.attr?.viewBox || el?.props?.viewBox || '0 0 24 24';
    const isStroke = el?.props?.attr?.fill === 'none';
    const [minX, minY, w, h] = vb.split(' ').map(Number);
    const ch = el?.props?.children;
    let d = '';
    if (Array.isArray(ch)) {
      d = ch.map((c) => c?.props?.d).filter(Boolean).join(' ');
    } else {
      d = ch?.props?.d || '';
    }
    return d ? { d, minX: minX || 0, minY: minY || 0, w: w || 24, h: h || 24, isStroke } : null;
  } catch {
    return null;
  }
};

export const technologyIcons = {
  kotlin: extractPath(SiKotlin),
  react: extractPath(SiReact),
  python: extractPath(SiPython),
  threejs: extractPath(SiThreedotjs),
  tailwind: extractPath(SiTailwindcss),
  firebase: extractPath(SiFirebase),
  android_studio: extractPath(SiAndroidstudio),
  gradle: extractPath(SiGradle),
  tensorflow: extractPath(SiTensorflow),
  javascript: extractPath(SiJavascript),
  vite: extractPath(SiVite),
  php: extractPath(SiPhp),
  mysql: extractPath(SiMysql),
  scikit_learn: extractPath(SiScikitlearn),
  pandas: extractPath(SiPandas),
};

export const getTechnologyIconPath = (id) => technologyIcons[id] || null;

// Comprehensive logo path & viewBox registry for all 38 portfolio skills
export const skillIcons = {
  // Mobile Android
  'Kotlin': extractIconInfo(SiKotlin),
  'Jetpack Compose': extractIconInfo(SiJetpackcompose),
  'Android Studio': extractIconInfo(SiAndroidstudio),
  'Material Design': extractIconInfo(SiMaterialdesign),
  'XML layouts': extractIconInfo(SiAndroid),
  'Coroutines': extractIconInfo(FaBolt),
  'Retrofit': extractIconInfo(FaPlug),
  'MVVM': extractIconInfo(FaLayerGroup),
  'Paging 3': extractIconInfo(FaLayerGroup),

  // Frontend Engineering
  'React.js': extractIconInfo(SiReact),
  'JavaScript': extractIconInfo(SiJavascript),
  'Tailwind CSS': extractIconInfo(SiTailwindcss),
  'HTML5': extractIconInfo(SiHtml5),
  'CSS3': extractIconInfo(SiCss3),
  'Bootstrap': extractIconInfo(SiBootstrap),
  'Next.js': extractIconInfo(SiNextdotjs),

  // AI & Machine Learning
  'Python': extractIconInfo(SiPython),
  'Scikit-Learn': extractIconInfo(SiScikitlearn),
  'Machine Learning': extractIconInfo(FaBrain),
  'Prompt Engineering': extractIconInfo(SiGooglegemini),
  'Generative AI': extractIconInfo(SiOpenai),

  // Data Analytics
  'Pandas': extractIconInfo(SiPandas),
  'NumPy': extractIconInfo(SiNumpy),
  'Matplotlib': extractIconInfo(FaChartLine),
  'Data Cleaning': extractIconInfo(FaFilter),
  'Exploratory Data Analysis (EDA)': extractIconInfo(FaMagnifyingGlassChart),
  'Data Visualization': extractIconInfo(FaChartColumn),

  // Backend & Data
  'Node.js': extractIconInfo(SiNodedotjs),
  'Express.js': extractIconInfo(SiExpress),
  'REST API': extractIconInfo(FaServer),
  'SQL': extractIconInfo(FaDatabase),
  'MySQL': extractIconInfo(SiMysql),
  'Firebase': extractIconInfo(SiFirebase),
  'MongoDB': extractIconInfo(SiMongodb),
  'PostgreSQL': extractIconInfo(SiPostgresql),

  // Tools & Workflow
  'Git': extractIconInfo(SiGit),
  'GitHub': extractIconInfo(SiGithub),
  'Postman': extractIconInfo(SiPostman),
  'VS Code': extractIconInfo(VscVscode),
  'IntelliJ IDEA': extractIconInfo(SiIntellijidea),
  'Google Colab': extractIconInfo(SiGooglecolab),
  'Linux': extractIconInfo(SiLinux),
  'Figma': extractIconInfo(SiFigma),

  // Software, OOP & Interactive Systems
  'Java': extractIconInfo(FaJava),
  'C++': extractIconInfo(SiCplusplus),
  'C#': extractIconInfo(TbBrandCSharp),
  'Unity': extractIconInfo(SiUnity),
};

export const getSkillIconInfo = (name) => skillIcons[name] || null;

// Category Core Icons
export const categoryIcons = {
  mobile: extractIconInfo(FaMobileScreen),
  frontend: extractIconInfo(FaLaptopCode),
  ai: extractIconInfo(FaBrain),
  analytics: extractIconInfo(FaChartPie),
  backend: extractIconInfo(FaDatabase),
  tools: extractIconInfo(FaWrench),
  software: extractIconInfo(FaCode),
};

export const getCategoryIconInfo = (key) => categoryIcons[key] || null;
