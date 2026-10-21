import { portfolioProfile } from './portfolioProfile.js';
import { certifications } from './certifications.js';
import { FEATURED_PROJECT_IDS, projectHighlights } from './projectHighlights.js';
import { projectPath } from '../utils/projectRoutes.js';
import { normalizeLanguage } from '../utils/language.js';

export const summaryLenses = {
  overview: { title: { en: 'Overview', id: 'Ringkasan' }, ids: FEATURED_PROJECT_IDS, headline: portfolioProfile.headline },
  android: {
    title: { en: 'Android', id: 'Android' }, ids: ['OD60ttuTSwZW62TRJFm6', 'mandiri-news', 'planetku'],
    headline: { en: 'Building native Android experiences with Kotlin, clear interfaces, API integration, and practical ML features.', id: 'Membangun pengalaman Android native dengan Kotlin, antarmuka yang jelas, integrasi API, dan fitur ML yang praktis.' },
  },
  frontend: {
    title: { en: 'Front-End & Web', id: 'Front-End & Web' }, ids: ['stLpQKeX8K2JXu8zGb5r', 'portfolio-website', 'computer-crafter'],
    headline: { en: 'Building responsive web interfaces, integrating APIs, and managing application state with React and JavaScript.', id: 'Membangun antarmuka web responsif, mengintegrasikan API, dan mengelola state aplikasi dengan React dan JavaScript.' },
  },
  ai: {
    title: { en: 'AI & Data', id: 'AI & Data' }, ids: ['OD60ttuTSwZW62TRJFm6', 'sentimen-deepseek', 'planetku'],
    headline: { en: 'Evaluating machine learning models and integrating their outputs into applications, with attention to data preparation and understandable results.', id: 'Mengevaluasi model machine learning dan mengintegrasikan hasilnya ke aplikasi, dengan perhatian pada pengolahan data dan hasil yang mudah dipahami.' },
  },
};

// A compact selection of the same skills shown in the portfolio, not proficiency ratings.
const { mobile, web, aiAndData, dataAnalytics, workflow } = portfolioProfile.skills;
const select = (source, names) => source.filter(name => names.includes(name));
const skillGroups = [
  { title: 'Android', items: select(mobile, ['Kotlin', 'XML layouts', 'Jetpack Compose', 'MVVM', 'Retrofit', 'Coroutines', 'Paging 3']) },
  { title: 'Front-End', items: select(web, ['React', 'JavaScript', 'Tailwind CSS', 'Bootstrap']) },
  { title: 'AI & Machine Learning', items: select(aiAndData, ['Python', 'Scikit-Learn', 'Random Forest', 'Prompt Engineering', 'Generative AI']) },
  { title: 'Data Analytics', items: dataAnalytics },
  { title: 'Backend & Data', items: [...select(web, ['Node.js', 'Express.js', 'REST API', 'MySQL']), ...select(aiAndData, ['Firebase'])] },
  { title: 'Tools & Workflow', items: select(workflow, ['Git', 'GitHub', 'VS Code', 'Postman', 'Google Colab', 'Figma']) },
];

export function buildRecruiterSummary(catalog, lens = 'overview', language = 'en') {
  const lang = normalizeLanguage(language);
  const get = value => typeof value === 'string' ? value : value?.[lang] || value?.en || '';
  const config = summaryLenses[lens] || summaryLenses.overview;
  return {
    name: portfolioProfile.name,
    role: lang === 'id' ? 'Developer Android, Web & AI' : 'Android, Web & AI Developer',
    education: `${lang === 'id' ? 'Sarjana Informatika' : portfolioProfile.education.degree} · UPN Veteran Jakarta · ${portfolioProfile.education.graduationYear} · ${lang === 'id' ? 'IPK' : 'GPA'} ${portfolioProfile.education.gpa}`,
    location: portfolioProfile.location,
    availability: get(portfolioProfile.availability),
    focus: get(config.title),
    headline: get(config.headline),
    contact: portfolioProfile.contact,
    skills: skillGroups,
    learning: portfolioProfile.learning,
    credentials: certifications.filter(cert => cert.id === 1 || cert.id === 22).map(cert => ({ title: cert.title, issuer: cert.issuer, href: cert.link })),
    // Never resurrect a draft/unpublished project from the static catalog.
    projects: config.ids.map(id => catalog.find(project => project.id === id)).filter(Boolean).map(project => ({
      id: project.id,
      title: get(project.title),
      description: get(project.shortDesc),
      role: get(project.impactDetails?.role),
      period: get(project.period),
      evidence: get(project.impactDetails?.result) || get(projectHighlights[project.id]?.result),
      path: projectPath(project),
      github: project.github || '',
    })),
  };
}

export function recruiterSummaryText(summary, language = 'en') {
  const id = normalizeLanguage(language) === 'id';
  return [
    summary.name, summary.role, summary.education, summary.location, summary.availability,
    '', `${id ? 'FOKUS' : 'FOCUS'}: ${summary.focus}`, summary.headline,
    '', id ? 'PROYEK PILIHAN' : 'SELECTED PROJECTS',
    ...summary.projects.flatMap(project => [
      project.title, [project.role, project.period].filter(Boolean).join(' · '), project.description,
      project.evidence, `https://rafierb.me${project.path}`, project.github, '',
    ].filter(Boolean)),
    '', id ? 'KETERAMPILAN TEKNIS' : 'TECHNICAL SKILLS',
    ...summary.skills.map(group => `${group.title}: ${group.items.join(', ')}`),
    `${id ? 'Sedang dipelajari' : 'Currently learning'}: ${summary.learning.join(', ')}`,
    '', id ? 'PELATIHAN & SERTIFIKASI' : 'TRAINING & CERTIFICATIONS',
    ...summary.credentials.map(cert => `${cert.title} · ${cert.issuer}${cert.href ? ` · ${cert.href}` : ''}`),
    '', 'https://rafierb.me', summary.contact.email, summary.contact.linkedin, summary.contact.github,
  ].join('\n');
}
