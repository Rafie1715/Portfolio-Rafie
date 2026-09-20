import { projects } from '../../../src/data/projects.js';
import { mergeProjectCatalog } from '../../../src/utils/projectCatalog.js';

export function getContentSource() {
  const hasAdminCredentials = Boolean(process.env.FIREBASE_SERVICE_ACCOUNT_JSON || process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON || process.env.FIREBASE_PRIVATE_KEY || process.env.GOOGLE_PRIVATE_KEY);
  return process.env.PORTFOLIO_CONTENT_SOURCE || (hasAdminCredentials ? 'cms' : 'static');
}
export async function loadPublicProjects() {
  const mode = getContentSource();
  if (mode === 'static') return mergeProjectCatalog(projects, []);
  if (mode !== 'cms') throw new Error('Unsupported portfolio content source.');
  const { getAdminApp } = await import('./admin.js');
  const { getFirestore } = await import('firebase-admin/firestore');
  const snapshot = await getFirestore(getAdminApp()).collection('projects').get();
  return mergeProjectCatalog(projects, snapshot.docs.map((entry) => ({ ...entry.data(), id: entry.id })));
}
