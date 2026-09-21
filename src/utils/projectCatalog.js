const titleKey = (project) => String(project.title?.en || project.title?.id || project.title || '').toLowerCase().replace(/[^a-z0-9]/g, '');
const publicFields = ['id', 'title', 'category', 'image', 'imageFit', 'featuredOrder', 'year', 'impact', 'impactDetails', 'shortDesc', 'fullDesc', 'challenges', 'solution', 'lessonLearned', 'decisionReplay', 'features', 'techStack', 'github', 'live', 'figma', 'prototype', 'gallery', 'conceptualCover', 'evidence', 'evaluation', 'createdAt', 'updatedAt'];

// Only explicit CMS publication decisions override reviewed repository content.
// Legacy records without a flag must neither hide local projects nor expose CMS data.
export function mergeProjectCatalog(localProjects, cmsProjects) {
  const merged = new Map(localProjects.map((project) => [project.id, { ...project, isPublished: true }]));
  for (const project of cmsProjects) {
    const local = localProjects.find((entry) => entry.id === project.id || entry.id === project.localId)
      || localProjects.find((entry) => titleKey(entry) && titleKey(entry) === titleKey(project));
    if (typeof project.isPublished !== 'boolean') continue;
    const id = local?.id || project.id;
    merged.set(id, { ...local, ...project, id, isPublished: project.isPublished === true });
  }
  return [...merged.values()]
    .filter((project) => project.isPublished === true)
    .map((project) => Object.fromEntries(publicFields.filter((key) => project[key] !== undefined).map((key) => [key, project[key]])));
}
