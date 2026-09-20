import { getContentSource, loadPublicProjects } from './_shared/projects.js';

export const createProjectsHandler = (load = loadPublicProjects) => async (event) => {
  const headers = { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' };
  if (event.httpMethod !== 'GET') return { statusCode: 405, headers: { ...headers, Allow: 'GET' }, body: JSON.stringify({ error: 'Method not allowed' }) };
  try {
    return { statusCode: 200, headers, body: JSON.stringify({ source: getContentSource(), projects: await load() }) };
  } catch {
    // Never expose credentials, private draft data, or a stale static fallback on CMS failure.
    return { statusCode: 503, headers, body: JSON.stringify({ error: 'Projects are temporarily unavailable.' }) };
  }
};
export const handler = createProjectsHandler();
