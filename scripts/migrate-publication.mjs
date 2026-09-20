import { loadEnv } from 'vite';
import { getFirestore } from 'firebase-admin/firestore';
import { getAdminApp } from '../netlify/functions/_shared/admin.js';
Object.assign(process.env, loadEnv('production', process.cwd(), ''));
const apply = process.argv.includes('--apply');
const db = getFirestore(getAdminApp());
let total = 0;
for (const name of ['projects', 'certifications', 'moviePicks', 'movieWatchlist']) {
 const snapshot = await db.collection(name).get();
 const missing = snapshot.docs.filter(doc => typeof doc.data().isPublished !== 'boolean');
 console.log(name + ': ' + missing.length + ' legacy public records lack an explicit publication flag.');
 if (apply) for (let start = 0; start < missing.length; start += 400) {
   const batch = db.batch(); missing.slice(start, start + 400).forEach(doc => batch.update(doc.ref, { isPublished: true })); await batch.commit();
 }
 total += missing.length;
}
console.log((apply ? 'Updated ' : 'Dry run only: ') + total + ' records. Existing draft flags remain unchanged.');
