// Server-only migration support for older Netlify deployments. These aliases must
// never be added to Vite's explicit list of public browser environment variables.
const legacyNames = {
  GITHUB_TOKEN: 'VITE_GITHUB_TOKEN',
  TMDB_API_KEY: 'VITE_TMDB_API_KEY',
  SPOTIFY_CLIENT_ID: 'VITE_SPOTIFY_CLIENT_ID',
  SPOTIFY_CLIENT_SECRET: 'VITE_SPOTIFY_CLIENT_SECRET',
};

export function integrationEnv(name) {
  const current = process.env[name]?.trim();
  if (current) return current;
  const legacy = legacyNames[name];
  return legacy ? process.env[legacy]?.trim() || '' : '';
}
