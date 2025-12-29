import { useEffect, useState } from "react";
import { db } from "../config/firebase";
import { ref, onValue, runTransaction } from "firebase/database";

const VisitorCounter = () => {
  const [visits, setVisits] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const visitsRef = ref(db, "visitors");

    const unsubscribe = onValue(visitsRef, (snapshot) => {
      if (snapshot.exists()) {
        setVisits(snapshot.val());
      } else {
        setVisits(0);
      }
      setLoading(false);
    });

    const hasVisited = sessionStorage.getItem("visit_counted");
    
    if (!hasVisited) {
      runTransaction(visitsRef, (currentVisits) => {
        return (currentVisits || 0) + 1;
      }).then(() => {
        sessionStorage.setItem("visit_counted", "true");
      });
    }

    return () => unsubscribe();
  }, []);

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