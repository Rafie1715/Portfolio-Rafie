import { Readable } from 'node:stream';
import * as projects from '../netlify/functions/projects.js';
import * as publicCertifications from '../netlify/functions/public-certifications.js';
import * as certifications from '../netlify/functions/certifications.js';
import * as engagement from '../netlify/functions/engagement.js';
import * as github from '../netlify/functions/github.js';
import * as movies from '../netlify/functions/movies.js';
import * as spotify from '../netlify/functions/spotify.js';
import * as spotifyTop from '../netlify/functions/spotify-top.js';
import * as gemini from '../netlify/functions/gemini.js';

const endpoints = { projects, 'public-certifications': publicCertifications, certifications,
  engagement, github, movies, spotify, 'spotify-top': spotifyTop, gemini };
const json = (status, error) => new Response(JSON.stringify({ error }), {
  status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' },
});

// Local adapter only. Production continues to use Netlify's function runtime.
// Reuse the modern entry points to preserve validation and admin authorization.
export function createLocalApiMiddleware(modules = endpoints) {
  const routes = new Map();
  for (const [name, endpoint] of Object.entries(modules)) {
    routes.set(endpoint.config.path, endpoint.default);
    routes.set(`/.netlify/functions/${name}`, endpoint.default);
  }
  return async (request, response, next) => {
    const url = new URL(request.url, 'http://localhost');
    const path = url.pathname.replace(/\/$/, '');
    if (!path.startsWith('/api/') && !path.startsWith('/.netlify/functions/')) return next();
    let result;
    try {
      const handler = routes.get(path);
      if (path === '/.netlify/functions/spotify-auth' || path === '/api/spotify-auth') {
        result = json(410, 'This endpoint is no longer available.');
      } else if (!handler) {
        result = json(404, 'API endpoint not found.');
      } else {
        const headers = new Headers();
        for (const [key, value] of Object.entries(request.headers)) {
          if (value !== undefined) headers.set(key, Array.isArray(value) ? value.join(', ') : value);
        }
        const hasBody = !['GET', 'HEAD'].includes(request.method);
        result = await handler(new Request(url, {
          method: request.method, headers,
          ...(hasBody ? { body: Readable.toWeb(request), duplex: 'half' } : {}),
        }));
      }
    } catch {
      // Do not expose credentials or provider stack traces through Vite errors.
      result = json(503, 'Service temporarily unavailable.');
    }
    if (response.destroyed) return;
    response.writeHead(result.status, Object.fromEntries(result.headers));
    response.end(Buffer.from(await result.arrayBuffer()));
  };
}

export function localApi() {
  const mount = server => { server.middlewares.use(createLocalApiMiddleware()); };
  return { name: 'local-netlify-api', configureServer: mount, configurePreviewServer: mount };
}
