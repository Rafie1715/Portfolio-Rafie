const key = item => String(item.title?.en || item.title?.id || item.title || '').trim().toLowerCase();
export function mergeCertificationCatalog(local, cms) {
 const merged = new Map(local.map(item => [String(item.id), { ...item, id: 'local-' + item.id, isPublished: true }]));
 for (const item of cms) {
   const base = local.find(entry => String(entry.id) === String(item.localId) || (key(entry) && key(entry) === key(item)));
   merged.set(String(base?.id ?? item.id), { ...base, ...item, id: 'cms-' + item.id, isPublished: item.isPublished === true });
 }
 const fields = ['id','title','img','alt','date','issuer','category','featured','summary','link','order'];
 return [...merged.values()].filter(item => item.isPublished).sort((a, b) => (Number(a.order ?? Number.MAX_SAFE_INTEGER) - Number(b.order ?? Number.MAX_SAFE_INTEGER)) || String(b.date || '').localeCompare(String(a.date || ''))).map(item => Object.fromEntries(fields.filter(field => item[field] !== undefined).map(field => [field,item[field]])));
}
