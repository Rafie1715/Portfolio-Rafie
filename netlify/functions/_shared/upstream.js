export function fetchUpstream(url, options = {}) {
  return fetch(url, { ...options, signal: AbortSignal.timeout(10000) });
}

export function parseMovieIds(raw = '') {
  if (!raw) return [];
  if (typeof raw !== 'string' || raw.length > 1024) throw new Error('Invalid movie IDs.');
  const parts = raw.split(',');
  if (parts.length > 60 || parts.some(id => !/^[1-9][0-9]{0,9}$/.test(id.trim()))) throw new Error('Use at most 60 positive movie IDs.');
  return [...new Set(parts.map(id => Number(id.trim())))];
}
