import { HttpError, documentId } from './security.js';
import { safeUrl } from '../../../src/utils/safeUrl.js';

const invalid = () => { throw new HttpError(400, 'Invalid certification data.'); };
const text = (value, max = 1000) => { if (typeof value !== 'string' || value.length > max) invalid(); return value; };
function localized(value) {
  if (typeof value === 'string') return text(value);
  if (!value || typeof value !== 'object' || Array.isArray(value) || Object.keys(value).some(key => !['en', 'id'].includes(key))) invalid();
  return Object.fromEntries(Object.entries(value).map(([key, val]) => [key, text(val)]));
}
function order(value) { if (!Number.isSafeInteger(value) || value < 0 || value > 1000000) invalid(); return value; }
function payload(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) invalid();
  const result = {};
  for (const [key, value] of Object.entries(input)) {
    if (['createdAt', 'updatedAt'].includes(key)) continue; // Server owns timestamps.
    if (['title', 'issuer', 'category', 'alt', 'summary'].includes(key)) result[key] = localized(value);
    else if (['date', 'badge', 'color'].includes(key)) result[key] = text(value, 150);
    else if (['img', 'link'].includes(key)) { if (value !== '' && !safeUrl(value)) invalid(); result[key] = value; }
    else if (['isPublished', 'featured'].includes(key)) { if (typeof value !== 'boolean') invalid(); result[key] = value; }
    else if (key === 'order') result[key] = order(value);
    else if (key === 'localId') result[key] = documentId(String(value));
    else invalid();
  }
  if (!Object.keys(result).length) invalid();
  return result;
}
export function validateCertificationInput(body) {
  const { action } = body;
  if (action === 'create' || action === 'update') {
    const clean = payload(body.payload);
    if (action === 'create' && (!clean.title || !clean.img || typeof clean.isPublished !== 'boolean')) invalid();
    return { action, payload: clean, ...(action === 'update' ? { id: documentId(body.id) } : {}) };
  }
  if (action === 'delete') return { action, id: documentId(body.id) };
  if (action === 'bulkUpdate') {
    if (!Array.isArray(body.ids) || !body.ids.length || body.ids.length > 100) invalid();
    return { action, ids: [...new Set(body.ids.map(documentId))], payload: payload(body.payload) };
  }
  if (action === 'reorder') {
    if (!Array.isArray(body.items) || !body.items.length || body.items.length > 100) invalid();
    return { action, items: body.items.map(item => ({ id: documentId(item?.id), order: order(item?.order) })) };
  }
  invalid();
}
