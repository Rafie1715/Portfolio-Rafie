import { loadEnv } from 'vite';
import { getAuth } from 'firebase-admin/auth';
import { getAdminApp } from '../netlify/functions/_shared/admin.js';

// Operator-only recovery script. Never bundle this into a public HTTP endpoint.
const args = process.argv.slice(2);
const option = (name) => {
  const index = args.indexOf(name);
  const value = index < 0 ? undefined : args[index + 1];
  return value && !value.startsWith('--') ? value : undefined;
};
const email = option('--email')?.trim().toLowerCase();
const expectedProject = option('--project');
const apply = args.includes('--apply');

if (!email || !expectedProject) {
  console.error('Usage: node scripts/set-admin-claim.mjs --email ADMIN_EMAIL --project FIREBASE_PROJECT_ID [--apply]');
  console.error('Without --apply, this only reads the account and shows the proposed admin role.');
  process.exitCode = 1;
} else {
  try {
    const env = loadEnv('production', process.cwd(), '');
    for (const [key, value] of Object.entries(env)) process.env[key] ??= value;
    const app = getAdminApp();
    if (app.options.projectId !== expectedProject) throw new Error('The configured Firebase project does not match --project. No account was changed.');
    const auth = getAuth(app);
    const user = await auth.getUserByEmail(email);
    if (user.disabled) throw new Error('This account is disabled. No account was changed.');
    console.log(JSON.stringify({ project: app.options.projectId, uid: user.uid, email: user.email, emailVerified: user.emailVerified, isAdmin: user.customClaims?.admin === true }, null, 2));
    if (user.customClaims?.admin === true) {
      console.log('This account already has the admin role. Refresh access in the website.');
    } else if (!apply) {
      console.log('Dry run: this account would receive admin: true. Confirm the project and UID above, then repeat with --apply.');
    } else {
      await auth.setCustomUserClaims(user.uid, { ...user.customClaims, admin: true });
      const updated = await auth.getUser(user.uid);
      if (updated.customClaims?.admin !== true) throw new Error('The role update could not be verified.');
      console.log('Admin role confirmed. Sign in again or use Refresh access. Other custom claims were preserved.');
    }
  } catch (error) {
    // Do not log the service account or token contents.
    console.error('Admin role setup failed:', error.code || (error.message.includes('private_key') ? 'Check the server credentials.' : error.message));
    process.exitCode = 1;
  }
}
