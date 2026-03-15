import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useFirebaseInit } from "../hooks/useFirebaseInit";
import { onAuthStateChanged } from "firebase/auth";
import { getAdminEmails, isAdminUser } from "../utils/adminAccess";

const RequireAuth = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { auth } = useFirebaseInit('auth');
  const adminEmails = getAdminEmails();

  useEffect(() => {
    if (!auth) return; // Wait for Firebase to load

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [auth]);

  if (loading) return <div className="text-center mt-20">Checking access...</div>;

  if (!currentUser) return <Navigate to="/login" />;

  if (!isAdminUser(currentUser)) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark text-dark dark:text-white flex items-center justify-center px-4">
        <div className="max-w-lg w-full rounded-2xl border border-red-200 dark:border-red-900/40 bg-white dark:bg-slate-800 p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">Access Denied</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-3">
            Your account is authenticated but not authorized to access the admin area.
          </p>
          {adminEmails.length > 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Ask the site owner to add your email to <code>VITE_ADMIN_EMAILS</code>.
            </p>
          )}
        </div>
      </div>
    );
  }

  return children;
};

export default RequireAuth;