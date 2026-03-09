import { signOut } from "firebase/auth";
import { useFirebaseInit } from "../../hooks/useFirebaseInit";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const { auth } = useFirebaseInit('auth');
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (!auth || loggingOut) return;

    try {
      setLoggingOut(true);
      await signOut(auth);
      navigate("/login");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark px-4 md:px-8 pt-24 pb-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-8 md:mb-10">
          <div>
            <p className="text-sm uppercase tracking-wider text-primary font-semibold">Admin Area</p>
            <h1 className="text-3xl md:text-4xl font-black text-dark dark:text-white">Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your portfolio content and keep projects updated.</p>
          </div>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="bg-red-500 text-white px-4 py-2.5 rounded-lg hover:bg-red-600 disabled:opacity-70 disabled:cursor-not-allowed transition"
          >
            {loggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700">
            <div className="w-11 h-11 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
              <i className="fas fa-layer-group"></i>
            </div>
            <h2 className="text-xl font-bold mb-2 dark:text-white">Manage Projects</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-5">Review, search, and delete project entries from your CMS collection.</p>
            <Link to="/admin/projects" className="inline-flex items-center justify-center gap-2 text-center bg-primary text-white px-4 py-2.5 rounded-lg w-full hover:bg-secondary transition font-semibold">
              Open Project Manager <i className="fas fa-arrow-right text-xs"></i>
            </Link>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700">
            <div className="w-11 h-11 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4">
              <i className="fas fa-plus-circle"></i>
            </div>
            <h2 className="text-xl font-bold mb-2 dark:text-white">Add New Project</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-5">Publish a new case study with thumbnail, links, stack, and full details.</p>
            <Link to="/admin/add-project" className="inline-flex items-center justify-center gap-2 text-center bg-emerald-600 text-white px-4 py-2.5 rounded-lg w-full hover:bg-emerald-700 transition font-semibold">
              Create Project <i className="fas fa-wand-magic-sparkles text-xs"></i>
            </Link>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700">
            <div className="w-11 h-11 rounded-lg bg-violet-500/10 text-violet-500 flex items-center justify-center mb-4">
              <i className="fas fa-eye"></i>
            </div>
            <h2 className="text-xl font-bold mb-2 dark:text-white">Preview Public Site</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-5">Open the public portfolio in a new tab and verify content changes quickly.</p>
            <Link to="/projects" className="inline-flex items-center justify-center gap-2 text-center border border-gray-300 dark:border-slate-600 text-dark dark:text-white px-4 py-2.5 rounded-lg w-full hover:border-primary hover:text-primary transition font-semibold">
              Open Projects Page <i className="fas fa-up-right-from-square text-xs"></i>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
