import { readdir, readFile } from 'node:fs/promises';
import { resolve, relative } from 'node:path';
import { loadEnv } from 'vite';

const env = { ...loadEnv('production', process.cwd(), ''), ...process.env };
const names = ['GEMINI_API_KEY', 'GITHUB_TOKEN', 'TMDB_API_KEY', 'SPOTIFY_CLIENT_SECRET', 'SPOTIFY_REFRESH_TOKEN', 'FIREBASE_PRIVATE_KEY', 'GOOGLE_PRIVATE_KEY', 'CLOUDINARY_API_SECRET', 'FIREBASE_SERVICE_ACCOUNT_JSON', 'GOOGLE_APPLICATION_CREDENTIALS_JSON'];
const secrets = names.flatMap(name => [env[name], env['VITE_' + name]]).filter(value => typeof value === 'string' && value.length >= 8).flatMap(value => [value, JSON.stringify(value).slice(1, -1)]);
const root = resolve('dist');
async function inspect(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) await inspect(path);
    else if (/\.(html|js|mjs|json|map|txt|xml|css)$/i.test(entry.name)) {
      const content = await readFile(path, 'utf8');
      if (secrets.some(value => content.includes(value)) || /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/.test(content)) {
        // Report only the filename, never a matching secret or surrounding text.
        throw new Error(`Server secret detected in public output: ${relative(root, path)}`);
      }
    }
  }
}
await inspect(root);
console.log('Public output checked: no configured server-secret values or private-key blocks found.');
