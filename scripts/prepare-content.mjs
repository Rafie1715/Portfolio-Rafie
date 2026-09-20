import { mkdir, writeFile } from 'node:fs/promises';
import { loadEnv } from 'vite';
import { loadPublicProjects } from '../netlify/functions/_shared/projects.js';
Object.assign(process.env, loadEnv('production', process.cwd(), ''));
const projects = await loadPublicProjects();
await mkdir('.generated', { recursive: true });
await writeFile('.generated/public-projects.json', JSON.stringify(projects));
await import('./generate-sitemap.mjs');
console.log('Prepared ' + projects.length + ' public projects.');
