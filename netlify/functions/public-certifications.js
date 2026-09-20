import { certifications } from '../../src/data/certifications.js';
import { mergeCertificationCatalog } from '../../src/utils/certificationCatalog.js';
import { getContentSource } from './_shared/projects.js';
export const handler = async event => {
 const headers = { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' };
 if (event.httpMethod !== 'GET') return { statusCode: 405, headers: { ...headers, Allow: 'GET' }, body: '{}' };
 try {
  const source = getContentSource();
  if (!['static', 'cms'].includes(source)) throw new Error('Invalid content source');
  let cms = [];
  if (source === 'cms') {
    const { getAdminApp } = await import('./_shared/admin.js');
    const { getFirestore } = await import('firebase-admin/firestore');
    const snapshot = await getFirestore(getAdminApp()).collection('certifications').get();
    cms = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
  }
  return { statusCode: 200, headers, body: JSON.stringify({ certifications: mergeCertificationCatalog(certifications, cms) }) };
 } catch { return { statusCode: 503, headers, body: JSON.stringify({ error: 'Certifications are temporarily unavailable.' }) }; }
};
