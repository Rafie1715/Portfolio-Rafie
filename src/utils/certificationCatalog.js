import { safeUrl } from './safeUrl.js';

const normalize = value => String(value ?? '').trim().toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
const names = value => (typeof value === 'object' && value !== null ? [value.en, value.id] : [value]).map(normalize).filter(Boolean);
const year = value => String(value ?? '').match(/\b(?:19|20)\d{2}\b/)?.[0];
const overlaps = (left, right) => left.some(value => right.includes(value));

function findMatch(local, item) {
  if (item.localId != null && String(item.localId).trim()) {
    return local.find(entry => String(entry.id) === String(item.localId));
  }

  const matches = local.filter(entry => {
    const titles = [...names(entry.title), ...(entry.titleAliases ?? []).flatMap(names)];
    const issuers = [...names(entry.issuer), ...(entry.issuerAliases ?? []).flatMap(names)];
    const cmsIssuers = names(item.issuer);
    const localYear = year(entry.date);
    const cmsYear = year(item.date);
    return overlaps(titles, names(item.title))
      && (!issuers.length || !cmsIssuers.length || overlaps(issuers, cmsIssuers))
      && (!localYear || !cmsYear || localYear === cmsYear);
  });

  // An ambiguous title must not silently replace a different credential.
  return matches.length === 1 ? matches[0] : undefined;
}

function fillContent(base, override) {
  if (override == null || (typeof override === 'string' && !override.trim())) return base;
  if (typeof override === 'object' && !Array.isArray(override)) {
    const fallback = typeof base === 'object' && base !== null ? base : { en: base, id: base };
    return Object.fromEntries(['en', 'id'].map(language => [language, fillContent(fallback[language], override[language])]));
  }
  return override;
}

/** Shared by the public API and dashboard. CMS IDs and publication controls stay intact. */
export function mergeCertificationRecords(local, cms) {
  const merged = new Map(local.map(item => [`local:${item.id}`, {
    ...item, id: `local-${item.id}`, source: 'local', isPublished: true,
  }]));

  for (const item of cms) {
    const base = findMatch(local, item);
    const result = { ...base, ...item, source: 'cms', isPublished: item.isPublished === true };
    if (base) {
      for (const field of ['title', 'issuer', 'category', 'alt', 'summary', 'img', 'link', 'date']) {
        const value = fillContent(base[field], item[field]);
        if (value !== undefined) result[field] = value;
      }
      // A year-only upload complements, rather than erases, the known issue month.
      if (/^\d{4}$/.test(String(item.date ?? '').trim()) && year(base.date) === year(item.date)) {
        result.date = base.date;
      }
    }
    merged.set(base ? `local:${base.id}` : `cms:${item.id}`, result);
  }
  return [...merged.values()];
}

export function mergeCertificationCatalog(local, cms) {
  const fields = ['id', 'title', 'img', 'alt', 'date', 'issuer', 'category', 'featured', 'summary', 'link', 'order'];
  return mergeCertificationRecords(local, cms)
    .filter(item => item.isPublished)
    .sort((a, b) => (Number(a.order ?? Number.MAX_SAFE_INTEGER) - Number(b.order ?? Number.MAX_SAFE_INTEGER)) || String(b.date || '').localeCompare(String(a.date || '')))
    .map(item => {
      const result = { ...item, id: item.source === 'cms' ? `cms-${item.id}` : item.id };
      for (const field of ['img', 'link']) if (field in result) result[field] = safeUrl(result[field]);
      return Object.fromEntries(fields.filter(field => result[field] !== undefined).map(field => [field, result[field]]));
    });
}
