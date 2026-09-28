import { getAuth } from 'firebase-admin/auth';
import { getAdminApp } from './admin.js';
import { allowsAdmin } from '../../../src/utils/adminPolicy.js';

export class HttpError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}

export const json = (statusCode, body, headers = {}) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', ...headers },
  body: JSON.stringify(body),
});

export function errorResponse(error) {
  // Never expose provider errors, credentials, database paths or stack traces.
  return json(error instanceof HttpError ? error.status : 503, {
    error: error instanceof HttpError ? error.message : 'Service temporarily unavailable.',
  });
}

export function readJson(event, maxBytes = 32768) {
  const headers = event.headers || {};
  if (headers['sec-fetch-site'] === 'cross-site') throw new HttpError(403, 'Cross-site request denied.');
  const type = headers['content-type'] || headers['Content-Type'] || '';
  if (!/^application\/json(?:\s*;|$)/i.test(type)) throw new HttpError(415, 'JSON content type required.');
  const raw = event.isBase64Encoded ? Buffer.from(event.body || '', 'base64').toString('utf8') : event.body || '';
  if (Buffer.byteLength(raw, 'utf8') > maxBytes) throw new HttpError(413, 'Request body too large.');
  let body;
  try { body = JSON.parse(raw); } catch { throw new HttpError(400, 'Invalid JSON.'); }
  if (!body || typeof body !== 'object' || Array.isArray(body)) throw new HttpError(400, 'JSON object required.');
  return body;
}

export function isAllowedAdmin(token) {
  const emails = (process.env.ADMIN_EMAILS || process.env.VITE_ADMIN_EMAILS || '').split(',').map(value => value.trim().toLowerCase()).filter(Boolean);
  return allowsAdmin({ claims: token, email: token?.email, emailVerified: token?.email_verified }, emails);
}

export async function requireAdmin(event, verifyToken = token => getAuth(getAdminApp()).verifyIdToken(token, true)) {
  const authorization = event.headers?.authorization || event.headers?.Authorization || '';
  const token = /^Bearer ([^\s]+)$/i.exec(authorization)?.[1];
  if (!token || token.length > 8192) throw new HttpError(401, 'Sign in again to continue.');
  let decoded;
  try { decoded = await verifyToken(token); } catch { throw new HttpError(401, 'Session expired or revoked. Sign in again.'); }
  if (!isAllowedAdmin(decoded)) throw new HttpError(403, 'Admin access required.');
  return decoded;
}

export function documentId(value) {
  if (typeof value !== 'string' || !/^[a-zA-Z0-9_-]{1,128}$/.test(value)) throw new HttpError(400, 'Invalid document ID.');
  return value;
}
