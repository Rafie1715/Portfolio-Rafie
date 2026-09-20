export const normalizeLanguage = (language) => String(language || '').toLowerCase().split('-')[0] === 'id' ? 'id' : 'en';
