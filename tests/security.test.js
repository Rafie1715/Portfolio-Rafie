import test from 'node:test';
import assert from 'node:assert/strict';
import { readJson, requireAdmin, errorResponse } from '../netlify/functions/_shared/security.js';
import { validateCertificationInput } from '../netlify/functions/_shared/certificationInput.js';
import { uploadImage } from '../src/utils/uploadImage.js';
import { createEngagementHandler } from '../netlify/functions/engagement.js';
import { webHandler } from '../netlify/functions/_shared/webHandler.js';
import { handler as movies } from '../netlify/functions/movies.js';
import { parseMovieIds } from '../netlify/functions/_shared/upstream.js';
import { safeUrl } from '../src/utils/safeUrl.js';
import { mergeProjectCatalog } from '../src/utils/projectCatalog.js';
import { mergeCertificationCatalog } from '../src/utils/certificationCatalog.js';
import { fetchMovieDetails } from '../src/utils/movieApi.js';
import chatbot from '../netlify/functions/gemini.js';

const event = body => ({ httpMethod: 'POST', headers: { 'content-type': 'application/json', authorization: 'Bearer test-token' }, body: JSON.stringify(body) });
test('admin guard denies missing, revoked and non-admin tokens', async () => {
  let calls = 0;
  await assert.rejects(requireAdmin({ headers: {} }, async () => { calls++; }), error => error.status === 401);
  assert.equal(calls, 0);
  await assert.rejects(requireAdmin(event({}), async () => { throw Error('auth/id-token-revoked'); }), error => error.status === 401);
  await assert.rejects(requireAdmin(event({}), async () => ({ email_verified: false, email: 'admin@example.com' })), error => error.status === 403);
  assert.equal((await requireAdmin(event({}), async () => ({ admin: true }))).admin, true);
});
test('JSON boundary rejects cross-site, malformed, wrong-type and oversized bodies', () => {
  assert.throws(() => readJson({ ...event({}), headers: { 'content-type': 'text/plain' } }), error => error.status === 415);
  assert.throws(() => readJson({ ...event({}), headers: { 'content-type': 'application/json', 'sec-fetch-site': 'cross-site' } }), error => error.status === 403);
  for (const body of ['{', 'null', '[]']) assert.throws(() => readJson({ ...event({}), body }), error => error.status === 400);
  assert.throws(() => readJson(event({ message: 'é'.repeat(500) }), 1000), error => error.status === 413);
});
test('stream limit works without Content-Length and never calls the backend', async () => {
  let calls = 0;
  const handle = webHandler(async () => { calls++; }, 20);
  const result = await handle(new Request('https://portfolio.test/api/test', { method: 'POST', body: 'x'.repeat(21) }));
  assert.equal(result.status, 413); assert.equal(calls, 0);
});
test('certification mutations reject traversal, unknown fields, script URLs and oversized batches', () => {
  for (const id of ['../projects/secret', 'a/b', '', '__x.y__']) assert.throws(() => validateCertificationInput({ action: 'delete', id }));
  for (const payload of [{ admin: true }, { link: 'javascript:alert(1)' }, { order: Infinity }, { isPublished: 'true' }]) assert.throws(() => validateCertificationInput({ action: 'update', id: 'cert', payload }));
  assert.throws(() => validateCertificationInput({ action: 'bulkUpdate', ids: Array(101).fill('cert'), payload: { isPublished: true } }));
  const clean = validateCertificationInput({ action: 'update', id: 'cert', payload: { isPublished: true, updatedAt: 'forged' } });
  assert.deepEqual(clean.payload, { isPublished: true });
});
test('server errors contain no internal secrets', () => {
  assert.equal(errorResponse(Error('private key and upstream details')).body.includes('private key'), false);
});
test('image upload goes directly to the existing unsigned preset without an auth endpoint', async t => {
  const originalXHR = globalThis.XMLHttpRequest;
  const originalFetch = globalThis.fetch;
  t.after(() => {
    if (originalXHR === undefined) delete globalThis.XMLHttpRequest; else globalThis.XMLHttpRequest = originalXHR;
    globalThis.fetch = originalFetch;
  });
  globalThis.fetch = async () => { throw new Error('Upload must not request a server signature.'); };
  let calls = 0;
  globalThis.XMLHttpRequest = class {
    upload = {};
    open(method, url) {
      assert.equal(method, 'POST');
      assert.equal(url, 'https://api.cloudinary.com/v1_1/djchoocal/image/upload');
    }
    send(form) {
      calls++;
      assert.equal(form.get('upload_preset'), 'rafie_portfolio');
      assert.equal(form.has('signature'), false);
      assert.equal(form.has('api_key'), false);
      assert.equal(form.get('file').type, 'image/png');
      this.status = 200;
      this.responseText = JSON.stringify({ secure_url: 'https://res.cloudinary.com/djchoocal/image/upload/test.png' });
      this.onload();
    }
  };
  const url = await uploadImage({ file: new Blob(['test'], { type: 'image/png' }) });
  assert.equal(url, 'https://res.cloudinary.com/djchoocal/image/upload/test.png');
  assert.equal(calls, 1);
  await assert.rejects(uploadImage({ file: new Blob(['test'], { type: 'image/svg+xml' }) }), /JPG, PNG, or WebP/);
  assert.equal(calls, 1);
});
test('public writes cannot choose collection, path, arbitrary counter delta or timestamps', async () => {
  const saved = []; const handle = createEngagementHandler(async input => saved.push(input));
  for (const input of [{ action: 'delete' }, { action: 'like', projectId: '../visitors', delta: 1 }, { action: 'like', projectId: 'restup', delta: 500 }, { action: 'reaction', score: -1, initials: 'RR' }, { action: 'reaction', score: 100, initials: '<img>' }]) assert.equal((await handle(event(input))).statusCode, 400);
  assert.equal(saved.length, 0);
  assert.equal((await handle(event({ action: 'reaction', score: 210, initials: 'RR', createdAt: 'forged', collection: 'projects' }))).statusCode, 200);
  assert.deepEqual(saved, [{ action: 'reaction', score: 210, initials: 'RR' }]);
});
test('movie API rejects amplification and invalid IDs before making upstream calls', async () => {
  assert.deepEqual(parseMovieIds('42,42,7'), [42,7]);
  for (const ids of ['1e10', '1/secret', '0', '-1', '1.2', Array(61).fill('1').join(',')]) assert.equal((await movies({ httpMethod: 'GET', queryStringParameters: { ids } })).statusCode, 400);
  assert.equal((await movies({ httpMethod: 'POST' })).statusCode, 405);
});
test('CMS content rejects executable and ambiguous URLs while preserving normal links', () => {
  for (const input of ['javascript:alert(1)', 'data:text/html,x', '//evil.test', '/\\evil.test', 'java\nscript:alert(1)', 'https://user:password@evil.test']) assert.equal(safeUrl(input), '');
  assert.equal(safeUrl('/images/photo.webp'), '/images/photo.webp');
  const project = mergeProjectCatalog([], [{ id: 'safe-id', isPublished: true, github: 'javascript:alert(1)', gallery: ['/valid.jpg', 'data:x'], evidence: { article: '//evil.test' } }])[0];
  assert.equal(project.github, ''); assert.deepEqual(project.gallery, ['/valid.jpg']); assert.equal(project.evidence.article, '');
  const cert = mergeCertificationCatalog([], [{ id: 'cert', isPublished: true, link: 'javascript:alert(1)' }])[0];
  assert.equal(cert.link, '');
});

test('large curated movie lists are split into bounded requests without losing order', async t => {
  const original = globalThis.fetch; const sizes = [];
  t.after(() => { globalThis.fetch = original; });
  globalThis.fetch = async url => {
    const ids = new URL(url, 'https://portfolio.test').searchParams.get('ids').split(',').map(Number);
    sizes.push(ids.length);
    return new Response(JSON.stringify(ids.map(id => ({ id, title: `Movie ${id}` }))));
  };
  const ids = Array.from({ length: 65 }, (_, i) => i + 1);
  assert.deepEqual((await fetchMovieDetails(ids)).map(item => item.id), ids);
  assert.deepEqual(sizes, [60, 5]);
});

test('chatbot rejects cross-site and oversized streams before invoking the paid API', async () => {
  const request = headers => new Request('https://portfolio.test/api/chat', { method: 'POST', headers, body: JSON.stringify({ message: 'Hello' }) });
  assert.equal((await chatbot(request({ 'content-type': 'text/plain' }))).status, 415);
  assert.equal((await chatbot(request({ 'content-type': 'application/json', 'sec-fetch-site': 'cross-site' }))).status, 403);
  const oversized = new Request('https://portfolio.test/api/chat', { method: 'POST', headers: { 'content-type': 'application/json' }, body: 'x'.repeat(16001) });
  assert.equal((await chatbot(oversized)).status, 413);
});

test('modern function routes enforce methods and return JSON security headers', async () => {
  for (const name of ['projects', 'public-certifications', 'movies', 'github', 'spotify', 'spotify-top', 'engagement', 'certifications']) {
    const endpoint = await import(`../netlify/functions/${name}.js`);
    const method = ['engagement', 'certifications'].includes(name) ? 'GET' : 'POST';
    const response = await endpoint.default(new Request(`https://portfolio.test/api/${name}`, { method }));
    assert.equal(response.status, 405, name);
    assert.equal(response.headers.get('content-type'), 'application/json', name);
    assert.equal(response.headers.get('x-content-type-options'), 'nosniff', name);
    assert.equal(endpoint.config.path, `/api/${name}`);
    assert.ok(endpoint.config.rateLimit.windowLimit > 0);
  }
});
