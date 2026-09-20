import test from 'node:test';
import assert from 'node:assert/strict';
import { allowsAdmin } from '../src/utils/adminPolicy.js';
import { mergeProjectCatalog } from '../src/utils/projectCatalog.js';
import { normalizeLanguage } from '../src/utils/language.js';
import { handler as retiredToken } from '../netlify/functions/spotify-auth.js';
import { createProjectsHandler } from '../netlify/functions/projects.js';
import { projects } from '../src/data/projects.js';
import { blogs } from '../src/data/blogs.js';
import { getContentSource } from '../netlify/functions/_shared/projects.js';

const local = [{ id: 'restup', title: { en: 'RestUP' }, shortDesc: { en: 'Original' }, gallery: ['/cover.jpg'], evidence: { contribution: { en: 'Independent project' } } }];
test('partial Firebase credentials keep the public catalog on static content', () => {
 const original = {
  source: process.env.PORTFOLIO_CONTENT_SOURCE,
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY,
 };
 delete process.env.PORTFOLIO_CONTENT_SOURCE;
 process.env.FIREBASE_PROJECT_ID = 'test-project';
 process.env.FIREBASE_CLIENT_EMAIL = 'test@example.com';
 delete process.env.FIREBASE_PRIVATE_KEY;
 assert.equal(getContentSource(), 'static');
 if (original.source === undefined) delete process.env.PORTFOLIO_CONTENT_SOURCE; else process.env.PORTFOLIO_CONTENT_SOURCE = original.source;
 if (original.projectId === undefined) delete process.env.FIREBASE_PROJECT_ID; else process.env.FIREBASE_PROJECT_ID = original.projectId;
 if (original.clientEmail === undefined) delete process.env.FIREBASE_CLIENT_EMAIL; else process.env.FIREBASE_CLIENT_EMAIL = original.clientEmail;
 if (original.privateKey === undefined) delete process.env.FIREBASE_PRIVATE_KEY; else process.env.FIREBASE_PRIVATE_KEY = original.privateKey;
});
test('empty allowlist and unverified email fail closed; claim and verified allowlist succeed', () => {
 assert.equal(allowsAdmin({ email: 'owner@example.com', emailVerified: true }), false);
 assert.equal(allowsAdmin({ email: 'owner@example.com', emailVerified: false }, ['owner@example.com']), false);
 assert.equal(allowsAdmin({ email: ' Owner@Example.com ', emailVerified: true }, ['owner@example.com']), true);
 assert.equal(allowsAdmin({ claims: { admin: true } }), true);
 assert.equal(allowsAdmin({ claims: { admin: 'true' } }), false);
});
test('CMS edits override a local project while retaining untouched evidence and stable URLs', () => {
 const result = mergeProjectCatalog(local, [{ id: 'cms-id', localId: 'restup', title: { en: 'Renamed' }, shortDesc: { en: 'Updated' }, isPublished: true }]);
 assert.equal(result.length, 1); assert.equal(result[0].id, 'restup'); assert.equal(result[0].shortDesc.en, 'Updated'); assert.equal(result[0].title.en, 'Renamed'); assert.deepEqual(result[0].gallery, ['/cover.jpg']); assert.equal(result[0].evidence.contribution.en, 'Independent project');
});
test('a draft override hides the local project instead of resurrecting static content', () => {
 assert.deepEqual(mergeProjectCatalog(local, [{ id: 'restup', isPublished: false }]), []);
 assert.deepEqual(mergeProjectCatalog(local, [{ id: 'legacy-id', title: { en: 'RestUP' }, isPublished: false }]), []);
});
test('CMS records require explicit publication and private fields never enter public payloads', () => {
 const result = mergeProjectCatalog([], [{ id: 'draft', title: 'Draft' }, { id: 'live', title: 'Live', isPublished: true, privateNotes: 'secret', ownerEmail: 'private@example.com' }]);
 assert.deepEqual(result, [{ id: 'live', title: 'Live' }]);
});
test('regional language preferences normalize to supported content languages', () => {
 assert.equal(normalizeLanguage('en-US'), 'en'); assert.equal(normalizeLanguage('id-ID'), 'id'); assert.equal(normalizeLanguage('ID-id'), 'id'); assert.equal(normalizeLanguage('fr'), 'en');
});
test('retired Spotify endpoint never requests or returns a token', async () => {
 const response = await retiredToken(); assert.equal(response.statusCode, 410); assert.equal(response.headers['Cache-Control'], 'no-store'); assert.equal('access_token' in JSON.parse(response.body), false);
});
test('public catalog rejects writes and masks loader errors without static fallback', async () => {
 let calls = 0;
 const handler = createProjectsHandler(async () => { calls++; throw Error('private credentials'); });
 assert.equal((await handler({ httpMethod: 'POST' })).statusCode, 405); assert.equal(calls, 0);
 const response = await handler({ httpMethod: 'GET' }); assert.equal(response.statusCode, 503); assert.ok(!response.body.includes('private credentials')); assert.ok(!response.body.includes('projects'));
});
test('public catalog returns the loader result and disables stale HTTP cache', async () => {
 const handler = createProjectsHandler(async () => local);
 const response = await handler({ httpMethod: 'GET' }); assert.equal(response.statusCode, 200); assert.deepEqual(JSON.parse(response.body).projects, local); assert.equal(response.headers['Cache-Control'], 'no-store');
});
test('every added case-study article points to an existing article', () => {
 for (const project of projects) if (project.evidence?.article) assert.ok(blogs.some(blog => '/blog/' + blog.slug === project.evidence.article), project.id);
});

import { mergeCertificationCatalog } from '../src/utils/certificationCatalog.js';
test('an unpublished certification override does not resurrect the repository version', () => {
 const local = [{ id: 1, title: 'Certificate', featured: true }];
 assert.deepEqual(mergeCertificationCatalog(local, [{ id: 'cms', title: 'Certificate', isPublished: false }]), []);
 const visible = mergeCertificationCatalog(local, [{ id: 'cms', title: 'Certificate', isPublished: true, featured: false, privateNotes: 'hidden' }]);
 assert.equal(visible[0].featured, false); assert.equal('privateNotes' in visible[0], false);
});
