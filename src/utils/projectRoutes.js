const legacySlugs = { od60ttutswzw62trjfm6: 'restup' };
const validSlug = value => typeof value === 'string' && /^[a-z0-9][a-z0-9_-]{0,127}$/.test(value);

export function projectSlug(project) {
  const id = String(typeof project === 'string' ? project : project.id).toLowerCase();
  const slug = typeof project === 'object' ? project.slug : '';
  return legacySlugs[id] || (validSlug(slug) ? slug : id);
}
export const projectPath = project => `/project/${encodeURIComponent(projectSlug(project))}`;

export function findProjectByRoute(projects, route) {
  const key = String(route || '').toLowerCase();
  const matches = projects.filter(project => [projectSlug(project), project.id, ...(project.aliases || [])]
    .some(value => String(value).toLowerCase() === key));
  return matches.length === 1 ? matches[0] : undefined;
}

export function projectRedirects(projects) {
  const owners = new Map();
  for (const project of projects) {
    for (const route of [projectSlug(project), project.id, ...(project.aliases || [])]) {
      const key = String(route).toLowerCase();
      if (!validSlug(key)) throw new Error('Invalid public project route.');
      if (owners.has(key) && owners.get(key) !== project.id) throw new Error(`Duplicate project route: ${key}`);
      owners.set(key, project.id);
    }
  }
  const redirects = new Set();
  for (const project of projects) {
    const canonical = projectPath(project);
    for (const alias of [project.id, ...(project.aliases || [])]) {
      for (const value of new Set([alias, alias.toLowerCase()])) {
        const path = `/project/${encodeURIComponent(value)}`;
        if (path === canonical) continue;
        redirects.add(`${path} ${canonical} 301!`);
        redirects.add(`${path}/ ${canonical} 301!`);
      }
    }
  }
  return [...redirects];
}
