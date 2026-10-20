const normalize = value => String(value ?? '').toLowerCase().replace(/[^a-z0-9]/g, '');
const aliases = { reactjs: 'react', expressjs: 'express', nodejs: 'node', sklearn: 'scikitlearn' };
const key = value => aliases[normalize(value)] || normalize(value);

// Workflow usage confirmed by the portfolio owner, separate from the product's tech stack.
export const skillUsage = {
  Git: 'git',
  GitHub: 'github',
  'VS Code': 'vscode',
  'Google Colab': 'colab',
  'Prompt Engineering': 'prompt',
  'Generative AI': 'generative_ai',
};

// Only return entries in the supplied public catalog, including for confirmed workflow usage.
export function projectsForSkill(projects, name) {
  const skill = key(name);
  if (skill === 'git' || skill === 'github') return [...projects];
  if (skill === 'vscode' || skill === 'visualstudiocode') return projects.filter(project => project.category === 'web');
  if (skill === 'promptengineering' || skill === 'generativeai') return projects.filter(project => (
    project.id === 'portfolio-website' || project.localId === 'portfolio-website'
  ));
  return projects.filter(project => Array.isArray(project.techStack) && project.techStack.some(technology => (
    key(typeof technology === 'string' ? technology : technology?.name) === key(name)
  )));
}

const googleAI = {
  label: 'Google AI Professional Certificate',
  href: 'https://www.coursera.org/account/accomplishments/professional-cert/DRSPVKPPYRW7',
};

export const skillSources = {
  'Prompt Engineering': [googleAI],
  'Generative AI': [googleAI],
  'XML layouts': [{ label: 'Mandiri News · XML layouts', href: 'https://github.com/Rafie1715/MandiriNewsApp/tree/main/app/src/main/res/layout' }],
  'Jetpack Compose': [{ label: 'RupiahVision · Jetpack Compose', href: 'https://github.com/Rafie1715/RupiahVision/blob/main/app/src/main/java/com/dicoding/myapplication/MainActivity.kt' }],
};
