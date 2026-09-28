import { recordEngagement } from '../utils/engagementApi';
import { useEffect, useState } from "react";
import { useFirebaseInit } from "../hooks/useFirebaseInit";
import { ref, onValue } from "firebase/database";

const VisitorCounter = () => {
  const [visits, setVisits] = useState(0);
  const [loading, setLoading] = useState(true);
  const { db } = useFirebaseInit('db');

  useEffect(() => {
    if (!db) return; // Wait for Firebase to load
    
    const visitsRef = ref(db, "visitors");

    const unsubscribe = onValue(visitsRef, (snapshot) => {
      if (snapshot.exists()) {
        setVisits(snapshot.val());
      } else {
        setVisits(0);
      }
      setLoading(false);
    });

    let hasVisited = false;
    try { hasVisited = sessionStorage.getItem("visit_counted"); } catch { /* Storage may be disabled. */ }
    
    if (!hasVisited) {
      recordEngagement({ action: 'visit' }).then(() => {
        try { sessionStorage.setItem('visit_counted', 'true'); } catch { /* Storage may be disabled. */ }
      }).catch(() => { /* Counting is optional; keep the page usable during outages. */ });
    }

    return () => unsubscribe();
  }, [db]);

  if (loading) return null;
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-xs font-medium text-gray-600 dark:text-gray-400">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
      </span>
      <span>{visits.toLocaleString()} Visits</span>
    </div>
  );
};

export default VisitorCounter;