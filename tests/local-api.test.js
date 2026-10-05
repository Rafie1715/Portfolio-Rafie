import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { once } from 'node:events';
import { createLocalApiMiddleware } from '../scripts/local-api.mjs';

async function serve(t, modules) {
  const middleware = createLocalApiMiddleware(modules);
  const server = http.createServer((req, res) => middleware(req, res, () => res.end('frontend')));
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.after(() => { server.closeAllConnections(); server.close(); });
  return `http://127.0.0.1:${server.address().port}`;
}

test('both URL styles use real function validation without a separate proxy server', async t => {
  const origin = await serve(t);
  for (const name of ['projects', 'public-certifications', 'certifications', 'engagement', 'github', 'movies', 'spotify', 'spotify-top', 'gemini']) {
    const method = ['certifications', 'engagement', 'gemini'].includes(name) ? 'GET' : 'POST';
    for (const path of [`/api/${name === 'gemini' ? 'chat' : name}`, `/.netlify/functions/${name}`]) {
      const res = await fetch(origin + path, { method });
      assert.equal(res.status, 405, path);
      assert.match(res.headers.get('content-type'), /application\/json/);
    }
  }
  const denied = await fetch(origin + '/api/certifications', {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ action: 'delete', id: 'test-cert' }),
  });
  assert.equal(denied.status, 401);
});

test('adapter preserves query, method, auth headers, body and response status/headers', async t => {
  const origin = await serve(t, { movies: {
    config: { path: '/api/movies' },
    default: async request => new Response(JSON.stringify({
      ids: new URL(request.url).searchParams.get('ids'), method: request.method,
      authorization: request.headers.get('authorization'), body: await request.json(),
    }), { status: 202, headers: { 'Content-Type': 'application/json', 'X-Adapter-Test': 'preserved' } }),
  } });
  for (const path of ['/api/movies', '/.netlify/functions/movies']) {
    const res = await fetch(origin + path + '?ids=123,456', {
      method: 'POST', headers: { 'content-type': 'application/json', authorization: 'Bearer test' }, body: '{"sample":true}',
    });
    assert.equal(res.status, 202);
    assert.equal(res.headers.get('x-adapter-test'), 'preserved');
    assert.deepEqual(await res.json(), { ids: '123,456', method: 'POST', authorization: 'Bearer test', body: { sample: true } });
  }
});

test('public mutations retain cross-site and streamed body limits', async t => {
  const origin = await serve(t);
  const crossSite = await fetch(origin + '/api/engagement', {
    method: 'POST', headers: { 'content-type': 'application/json', 'sec-fetch-site': 'cross-site' }, body: '{}',
  });
  assert.equal(crossSite.status, 403);
  const oversized = await fetch(origin + '/api/engagement', {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: new ReadableStream({ start(controller) { controller.enqueue(new TextEncoder().encode('x'.repeat(2048))); controller.close(); } }), duplex: 'half',
  });
  assert.equal(oversized.status, 413);
});

test('unknown APIs return JSON, removed token endpoint stays gone, pages reach Vite', async t => {
  const origin = await serve(t);
  assert.equal((await fetch(origin + '/api/not-real')).status, 404);
  assert.equal((await fetch(origin + '/.netlify/functions/spotify-auth')).status, 410);
  assert.equal(await (await fetch(origin + '/projects')).text(), 'frontend');
});

test('unexpected provider exceptions never leak through the local adapter', async t => {
  const origin = await serve(t, { github: { config: { path: '/api/github' }, default: () => { throw new Error('private-provider-detail'); } } });
  const res = await fetch(origin + '/api/github');
  assert.equal(res.status, 503);
  assert.deepEqual(await res.json(), { error: 'Service temporarily unavailable.' });
});
