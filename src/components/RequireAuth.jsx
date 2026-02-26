import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useFirebaseInit } from "../hooks/useFirebaseInit";
import { onAuthStateChanged } from "firebase/auth";

const RequireAuth = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { auth } = useFirebaseInit('auth');

  useEffect(() => {
    if (!auth) return; // Wait for Firebase to load

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [auth]);

  if (loading) return <div className="text-center mt-20">Checking access...</div>;

  return currentUser ? children : <Navigate to="/login" />;
};

export default RequireAuth;