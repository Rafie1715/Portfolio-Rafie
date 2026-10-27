const normalize = value => value.toLowerCase().replace(/#/g, 'sharp').replace(/\+/g, 'plus').replace(/[^a-z0-9]/g, '');
const blue = 'text-blue-600 dark:text-blue-400';
const cyan = 'text-cyan-700 dark:text-cyan-400';
const green = 'text-emerald-700 dark:text-emerald-400';
const purple = 'text-violet-600 dark:text-violet-400';
const orange = 'text-orange-600 dark:text-orange-400';
const neutral = 'text-slate-700 dark:text-slate-300';

// A local allowlist: public rendering never downloads an icon URL from CMS data.
const entries = [
  ['HTML5', 'html5', orange, ['HTML']],
  ['CSS3', 'css3', blue, ['CSS']],
  ['JavaScript', 'javascript', 'text-yellow-700 dark:text-yellow-400', ['JS', 'JavaScript ES6', 'ES6']],
  ['TypeScript', 'typescript', blue, ['TS']],
  ['React', 'react', cyan, ['React.js', 'ReactJS', 'React Native']],
  ['Next.js', 'nextjs', neutral, ['Next', 'NextJS']],
  ['Node.js', 'nodejs', green, ['Node', 'NodeJS']],
  ['Express', 'express', neutral, ['Express.js', 'ExpressJS']],
  ['Tailwind CSS', 'tailwindcss', cyan, ['Tailwind']],
  ['Vite', 'vitejs', purple, ['Vite.js']],
  ['Bootstrap', 'bootstrap', purple, []],
  ['Kotlin', 'kotlin', purple, []],
  ['Jetpack Compose', 'jetpackcompose', blue, []],
  ['Android', 'android', green, []],
  ['Android Studio', 'androidstudio', green, []],
  ['Java', 'java', orange, []],
  ['C++', 'cplusplus', blue, ['CPP', 'CPlusPlus']],
  ['IntelliJ IDEA', 'intellij', neutral, ['IntelliJ', 'IntellijIDEA']],
  ['Linux', 'linux', orange, []],
  ['Firebase', 'firebase', 'text-amber-600 dark:text-amber-400', []],
  ['Flutter', 'flutter', blue, []],
  ['Dart', 'dart', cyan, []],
  ['Python', 'python', blue, []],
  ['PHP', 'php', purple, []],
  ['MySQL', 'mysql', blue, []],
  ['PostgreSQL', 'postgresql', blue, ['Postgres']],
  ['MongoDB', 'mongodb', green, ['Mongo']],
  ['Supabase', 'supabase', green, []],
  ['TensorFlow', 'tensorflow', orange, ['TensorFlow Lite', 'TFLite']],
  ['Scikit-Learn', 'scikitlearn', orange, ['sklearn']],
  ['Pandas', 'pandas', purple, []],
  ['NumPy', 'numpy', blue, []],
  ['Google Colab', 'googlecolab', orange, ['Colab', 'Google Colaboratory']],
  ['OpenCV', 'opencv', green, []],
  ['Unity', 'unity', neutral, []],
  ['C#', 'csharp', purple, ['C Sharp']],
  ['Three.js', 'threejs', neutral, ['ThreeJS']],
  ['Figma', 'figma', purple, []],
  ['Postman', 'postman', orange, []],
  ['VS Code', 'vscode', blue, ['Visual Studio Code']],
  ['Git', 'git', orange, []],
  ['GitHub', 'github', neutral, []],
  ['Docker', 'docker', blue, []],
  ['Netlify', 'netlify', cyan, []],
];
const registry = new Map();
for (const [name, key, color, aliases] of entries) {
  const entry = { icon: `devicon-${key}-plain`, color };
  for (const alias of [name, ...aliases]) registry.set(normalize(alias), entry);
}
// Concepts/libraries without a dedicated logo get a recognizable semantic icon.
for (const [name, icon] of [['Machine Learning', 'fas fa-brain'], ['Retrofit', 'fas fa-plug'], ['Coroutines', 'fas fa-bolt'], ['Paging 3', 'fas fa-layer-group'], ['ProBuilder', 'fas fa-cubes']]) {
  registry.set(normalize(name), { icon, color: blue });
}
for (const [name, icon, color] of [
  ['XML layouts', 'fas fa-code', blue],
  ['MVVM', 'fas fa-layer-group', blue],
  ['Material Design', 'fas fa-shapes', purple],
  ['REST API', 'fas fa-plug', blue],
  ['SQL', 'fas fa-database', blue],
  ['Prompt Engineering', 'fas fa-message', cyan],
  ['Generative AI', 'fas fa-wand-magic-sparkles', purple],
  ['Matplotlib', 'fas fa-chart-line', blue],
  ['Data Cleaning', 'fas fa-eraser', green],
  ['Exploratory Data Analysis (EDA)', 'fas fa-search', cyan],
  ['EDA', 'fas fa-search', cyan],
  ['Data Visualization', 'fas fa-chart-line', purple],
]) registry.set(normalize(name), { icon, color });

export function technologyDetails(technology) {
  const raw = typeof technology === 'string' ? technology : technology?.name;
  const name = typeof raw === 'string' ? raw.trim() : '';
  return { name, ...(registry.get(normalize(name)) || { icon: 'fas fa-code', color: neutral }) };
}

export function toTechnologyEntry(technology) {
  const { name, icon } = technologyDetails(technology);
  return { name, icon };
}
