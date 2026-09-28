// CMS links may be changed independently of the application deployment.
export function safeUrl(value, { local = true } = {}) {
  if (typeof value !== 'string' || value.length > 4096 || [...value].some(char => char.charCodeAt(0) <= 32 || char.charCodeAt(0) === 127 || char === '\\')) return '';
  if (local && /^\/(?!\/)/.test(value)) return value;
  try {
    const url = new URL(value);
    return ['https:', 'http:'].includes(url.protocol) && !url.username && !url.password ? value : '';
  } catch { return ''; }
}
