import { webHandler } from './_shared/webHandler.js';
import { getDatabase } from 'firebase-admin/database';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';
import { getAdminApp } from './_shared/admin.js';
import { loadPublicProjects } from './_shared/projects.js';
import { HttpError, documentId, json, readJson, errorResponse } from './_shared/security.js';

export function validateEngagement(body) {
  if (body.action === 'visit') return { action: 'visit' };
  if (body.action === 'like') {
    if (![1, -1].includes(body.delta)) throw new HttpError(400, 'Invalid like action.');
    return { action: 'like', projectId: documentId(body.projectId), delta: body.delta };
  }
  if (body.action === 'reaction') {
    if (!Number.isInteger(body.score) || body.score < 1 || body.score > 5000 || !/^[A-Z]{1,4}$/.test(body.initials || '')) throw new HttpError(400, 'Invalid reaction score.');
    return { action: 'reaction', score: body.score, initials: body.initials };
  }
  throw new HttpError(400, 'Unsupported action.');
}

async function persist(input) {
  const app = getAdminApp();
  if (input.action === 'reaction') {
    await getFirestore(app).collection('reactionScores').add({ score: input.score, initials: input.initials, source: 'afk-reaction-time', createdAt: FieldValue.serverTimestamp() });
    return;
  }
  if (input.action === 'like' && !(await loadPublicProjects()).some(project => project.id === input.projectId)) throw new HttpError(404, 'Project unavailable.');
  const url = process.env.FIREBASE_DATABASE_URL || process.env.VITE_FIREBASE_DATABASE_URL;
  if (!url) throw new Error('Database is not configured');
  const database = getDatabase(app, url);
  const path = input.action === 'visit' ? 'visitors' : `project_likes/${input.projectId}`;
  const delta = input.action === 'visit' ? 1 : input.delta;
  await database.ref(path).transaction(current => Math.max(0, (Number.isSafeInteger(current) && current >= 0 ? current : 0) + delta));
}

export const createEngagementHandler = (write = persist) => async event => {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed.' }, { Allow: 'POST' });
  try {
    const input = validateEngagement(readJson(event, 1024));
    await write(input);
    return json(200, { ok: true });
  } catch (error) { return errorResponse(error); }
};
export const handleEvent = createEngagementHandler();
export const config = { path: '/api/engagement', rateLimit: { windowLimit: 30, windowSize: 60, aggregateBy: ['ip', 'domain'] } };

export default webHandler(handleEvent, 1024);
