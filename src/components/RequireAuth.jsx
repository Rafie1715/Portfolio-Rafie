import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useFirebaseInit } from "../hooks/useFirebaseInit";
import { onAuthStateChanged, reload, signOut } from "firebase/auth";
import { getAdminEmails, isAdminUser } from "../utils/adminAccess";

const RequireAuth = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const [checking, setChecking] = useState(false);
  const [accessError, setAccessError] = useState('');
  const { auth, loading: initializing } = useFirebaseInit('auth');
  const adminEmails = getAdminEmails();

  useEffect(() => {
    if (!auth) return; // Wait for Firebase to load

    let active = true;
    let request = 0;
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      const currentRequest = ++request;
      setLoading(true);
      let authorized = false;
      try { authorized = await isAdminUser(user); } catch { /* Fail closed. */ }
      if (!active || currentRequest !== request) return;
      setCurrentUser(user);
      setAllowed(authorized);
      setLoading(false);
    });
    return () => { active = false; unsubscribe(); };
  }, [auth]);

  const refreshAccess = async () => {
    const user = auth?.currentUser;
    if (!user || checking) return;
    setChecking(true);
    setAccessError('');
    try {
      await reload(user);
      const authorized = await isAdminUser(user);
      if (auth.currentUser?.uid !== user.uid) return;
      setCurrentUser(user);
      setAllowed(authorized);
      if (!authorized) setAccessError('Access is still unavailable. Check the admin role or email verification for this account.');
    } catch {
      setAccessError('Unable to refresh access. Check your connection and try again.');
    } finally {
      setChecking(false);
    }
  };

  const switchAccount = async () => {
    setChecking(true);
    setAccessError('');
    try { await signOut(auth); }
    catch { setAccessError('Unable to sign out. Please try again.'); }
    finally { setChecking(false); }
  };

  if (!initializing && !auth) return <div role="alert" className="p-12">Unable to check access. Please reload and try again.</div>;
  if (loading) return <div className="text-center mt-20">Checking access...</div>;

  if (!currentUser) return <Navigate to="/login" />;

  if (!allowed) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark text-dark dark:text-white flex items-center justify-center px-4">
        <div className="max-w-lg w-full rounded-2xl border border-red-200 dark:border-red-900/40 bg-white dark:bg-slate-800 p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">Access Denied</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-3">
            Your account is authenticated but not authorized to access the admin area.
          </p>
          {currentUser.email && (
            <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">
              Signed in as <strong>{currentUser.email}</strong>{currentUser.emailVerified ? '' : ' (email not verified)'}.
            </p>
          )}
          <p className="mb-3 text-sm text-gray-600 dark:text-gray-300">
            {!currentUser.emailVerified
              ? 'Email-based admin access requires a verified email address. If this is a login-only address, the Firebase project owner can assign the admin role to this account instead.'
              : adminEmails.includes(currentUser.email?.trim().toLowerCase())
                ? 'This email is listed, but access could not be confirmed. Refresh access or ask the Firebase project owner to check the account role.'
                : 'This account needs the Firebase admin role, or its verified email must be added to the admin allowlist.'}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">After the account role or email verification is updated, refresh access below.</p>
          {accessError && <p role="alert" className="mt-4 text-sm text-red-600 dark:text-red-400">{accessError}</p>}
          <div className="mt-5 flex flex-wrap gap-3">
            <button type="button" disabled={checking} onClick={refreshAccess} className="min-h-11 rounded-lg bg-primary px-4 py-2 font-semibold text-white disabled:opacity-60">{checking ? 'Please wait...' : 'Refresh access'}</button>
            <button type="button" disabled={checking} onClick={switchAccount} className="min-h-11 rounded-lg border border-gray-300 px-4 py-2 font-semibold dark:border-slate-600 disabled:opacity-60">Sign out</button>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default RequireAuth;
