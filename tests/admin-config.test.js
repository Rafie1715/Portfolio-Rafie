import test from 'node:test';
import assert from 'node:assert/strict';
import { generateKeyPairSync } from 'node:crypto';
import { deleteApp } from 'firebase-admin/app';
import { getAdminApp } from '../netlify/functions/_shared/admin.js';

test('Firebase Admin exposes the configured project ID for recovery checks', async () => {
  const keys = ['FIREBASE_SERVICE_ACCOUNT_JSON', 'GOOGLE_APPLICATION_CREDENTIALS_JSON', 'FIREBASE_PROJECT_ID', 'FIREBASE_CLIENT_EMAIL', 'FIREBASE_PRIVATE_KEY'];
  const original = Object.fromEntries(keys.map(key => [key, process.env[key]]));
  const { privateKey } = generateKeyPairSync('rsa', {
    modulusLength: 2048,
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    publicKeyEncoding: { type: 'spki', format: 'pem' },
  });
  let app;
  try {
    delete process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    delete process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
    process.env.FIREBASE_PROJECT_ID = 'portfolio-config-test';
    process.env.FIREBASE_CLIENT_EMAIL = 'test@portfolio-config-test.iam.gserviceaccount.com';
    process.env.FIREBASE_PRIVATE_KEY = privateKey;
    app = getAdminApp();
    assert.equal(app.options.projectId, 'portfolio-config-test');
    assert.equal(getAdminApp(), app);
    await deleteApp(app);
    app = undefined;

    process.env.FIREBASE_SERVICE_ACCOUNT_JSON = JSON.stringify({
      project_id: 'portfolio-json-test',
      client_email: 'test@portfolio-json-test.iam.gserviceaccount.com',
      private_key: privateKey,
    });
    app = getAdminApp();
    assert.equal(app.options.projectId, 'portfolio-json-test');
  } finally {
    if (app) await deleteApp(app);
    for (const key of keys) {
      if (original[key] === undefined) delete process.env[key];
      else process.env[key] = original[key];
    }
  }
});
