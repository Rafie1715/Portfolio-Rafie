import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { integrationEnv } from '../netlify/functions/_shared/integrationEnv.js';
import { handleEvent as github } from '../netlify/functions/github.js';
import { handleEvent as movies } from '../netlify/functions/movies.js';
import { handleEvent as spotify } from '../netlify/functions/spotify.js';
import { handleEvent as spotifyTop } from '../netlify/functions/spotify-top.js';

function legacyEnvironment(t) {
  const names = ['GITHUB_TOKEN', 'TMDB_API_KEY', 'SPOTIFY_CLIENT_ID', 'SPOTIFY_CLIENT_SECRET'];
  const keys = [...names, ...names.map(name => 'VITE_' + name), 'SPOTIFY_REFRESH_TOKEN'];
  const original = Object.fromEntries(keys.map(key => [key, process.env[key]]));
  const originalFetch = globalThis.fetch;
  t.after(() => {
    for (const key of keys) {
      if (original[key] === undefined) delete process.env[key]; else process.env[key] = original[key];
    }
    globalThis.fetch = originalFetch;
  });
  for (const name of names) {
    delete process.env[name];
    process.env['VITE_' + name] = 'legacy-' + name;
  }
  process.env.SPOTIFY_REFRESH_TOKEN = 'test-refresh';
}

test('legacy deployment variables work only on server and canonical values take precedence', t => {
  legacyEnvironment(t);
  assert.equal(integrationEnv('GITHUB_TOKEN'), 'legacy-GITHUB_TOKEN');
  process.env.GITHUB_TOKEN = ' current-token ';
  assert.equal(integrationEnv('GITHUB_TOKEN'), 'current-token');
  const config = readFileSync(new URL('../vite.config.js', import.meta.url), 'utf8');
  assert.match(config, /envPrefix:\s*\[\]/);
  for (const name of ['VITE_GITHUB_TOKEN', 'VITE_TMDB_API_KEY', 'VITE_SPOTIFY_CLIENT_SECRET']) {
    assert.equal(config.includes(name), false, name + ' must not enter the public define list');
  }
});

test('GitHub and movies load with legacy Netlify configuration', async t => {
  legacyEnvironment(t);
  globalThis.fetch = async (url, options) => {
    if (url.startsWith('https://api.github.com/')) {
      assert.equal(options.headers.Authorization, 'token legacy-GITHUB_TOKEN');
      return Response.json([
        { id: 1, fork: false, private: false, pushed_at: '2026-01-01' },
        { id: 2, fork: true, private: false }, { id: 3, fork: false, private: true },
      ]);
    }
    assert.equal(new URL(url).searchParams.get('api_key'), 'legacy-TMDB_API_KEY');
    return Response.json({ id: 550, title: 'Example film' });
  };
  const repos = await github({ httpMethod: 'GET' });
  assert.equal(repos.statusCode, 200);
  assert.deepEqual(JSON.parse(repos.body).map(repo => repo.id), [1]);
  const films = await movies({ httpMethod: 'GET', queryStringParameters: { ids: '550' } });
  assert.equal(films.statusCode, 200);
  assert.equal(JSON.parse(films.body)[0].id, 550);
});

test('movie authentication failures are not disguised as an empty successful catalog', async t => {
  legacyEnvironment(t);
  globalThis.fetch = async () => Response.json({ status_message: 'Unauthorized' }, { status: 401 });
  for (const queryStringParameters of [{ ids: '550' }, {}]) {
    const response = await movies({ httpMethod: 'GET', queryStringParameters });
    assert.equal(response.statusCode, 502);
  }
  globalThis.fetch = async () => Response.json({}, { status: 404 });
  assert.deepEqual(JSON.parse((await movies({ httpMethod: 'GET', queryStringParameters: { ids: '550' } })).body), []);
});

test('both Spotify endpoints support legacy credentials and empty listening history', async t => {
  legacyEnvironment(t);
  globalThis.fetch = async (url, options) => {
    if (url.endsWith('/api/token')) {
      const body = new URLSearchParams(options.body);
      assert.equal(body.get('client_id'), 'legacy-SPOTIFY_CLIENT_ID');
      assert.equal(body.get('client_secret'), 'legacy-SPOTIFY_CLIENT_SECRET');
      assert.equal(body.get('refresh_token'), 'test-refresh');
      return Response.json({ access_token: 'test-access' });
    }
    assert.equal(options.headers.Authorization, 'Bearer test-access');
    if (url.endsWith('/currently-playing')) return new Response(null, { status: 204 });
    return Response.json({ items: [] });
  };
  const current = await spotify({ httpMethod: 'GET' });
  assert.equal(current.statusCode, 200);
  assert.deepEqual(JSON.parse(current.body), { item: null, is_playing: false });
  const top = await spotifyTop({ httpMethod: 'GET' });
  assert.equal(top.statusCode, 200);
  assert.deepEqual(JSON.parse(top.body), { items: [] });
});
