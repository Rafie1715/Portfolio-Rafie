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
} from 'react-icons/si';

const extractPath = (IconComponent) => {
  try {
    const el = IconComponent({});
    return el?.props?.children?.[0]?.props?.d || null;
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

