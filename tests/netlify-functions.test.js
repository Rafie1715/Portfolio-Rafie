import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

test('Netlify endpoints cold-start without experimental require(esm) and expose only the modern entry point', () => {
  // Lambda disables require(esm). A normal Node import hides the jwks-rsa/jose crash.
  // A named `handler` makes Netlify classify even an ESM default export as v1,
  // silently dropping config.path and rateLimit.
  const output = execFileSync(process.execPath, ['--no-experimental-require-module', '--input-type=module', '-e', `
    import assert from 'node:assert/strict';
    for (const name of ['projects', 'public-certifications', 'certifications', 'engagement', 'github', 'movies', 'spotify', 'spotify-top', 'gemini']) {
      const endpoint = await import('./netlify/functions/' + name + '.js');
      assert.equal(Object.hasOwn(endpoint, 'handler'), false, name + ' must not export the legacy handler');
      assert.equal(typeof endpoint.default, 'function', name);
      assert.equal(endpoint.config.path, '/api/' + (name === 'gemini' ? 'chat' : name));
      assert.ok(endpoint.config.rateLimit.windowLimit > 0, name);
      const method = ['certifications', 'engagement', 'gemini'].includes(name) ? 'GET' : 'POST';
      const result = await endpoint.default(new Request('https://portfolio.test' + endpoint.config.path, { method }));
      assert.equal(result.status, 405, name);
    }
    const { default: certifications } = await import('./netlify/functions/certifications.js');
    const denied = await certifications(new Request('https://portfolio.test/api/certifications', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ action: 'delete', id: 'test-cert' }),
    }));
    assert.equal(denied.status, 401);
    console.log('All modern endpoints started; unauthenticated mutation denied.');
  `], { cwd: fileURLToPath(new URL('..', import.meta.url)), encoding: 'utf8', timeout: 60000 });
  assert.match(output, /All modern endpoints started/);
});

test('Firebase auth JWKS dependency imports RSA signing keys with the compatibility override', () => {
  execFileSync(process.execPath, ['--no-experimental-require-module', '--input-type=module', '-e', `
    import assert from 'node:assert/strict';
    import { createRequire } from 'node:module';
    import { generateKeyPairSync, createPublicKey, sign, verify } from 'node:crypto';
    const requireAuth = createRequire(import.meta.resolve('firebase-admin/auth'));
    const jwksClient = requireAuth('jwks-rsa');
    const { publicKey, privateKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
    const jwk = { ...publicKey.export({ format: 'jwk' }), kid: 'test-key', alg: 'RS256', use: 'sig' };
    const client = jwksClient({ jwksUri: 'https://unused.test/jwks', getKeysInterceptor: async () => [jwk] });
    const key = await client.getSigningKey('test-key');
    assert.deepEqual(createPublicKey(key.getPublicKey()).export({ format: 'jwk' }), publicKey.export({ format: 'jwk' }));
    const message = Buffer.from('local compatibility test');
    const signature = sign('RSA-SHA256', message, privateKey);
    assert.equal(verify('RSA-SHA256', message, key.getPublicKey(), signature), true);
    assert.equal(verify('RSA-SHA256', Buffer.from('tampered'), key.getPublicKey(), signature), false);
  `], { cwd: fileURLToPath(new URL('..', import.meta.url)), encoding: 'utf8', timeout: 60000 });
});
