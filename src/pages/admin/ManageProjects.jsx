import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useFirebaseInit } from "../../hooks/useFirebaseInit";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { projects as localProjects } from "../../data/projects";

const ManageProjects = () => {
  const [cmsProjects, setCmsProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const { dbFirestore } = useFirebaseInit('dbFirestore');

  const fetchProjects = async () => {
    if (!dbFirestore) return; // Wait for Firebase to load

    try {
      setLoading(true);
      setErrorMsg("");
      const querySnapshot = await getDocs(collection(dbFirestore, "projects"));
      const list = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        source: "cms",
      }));
      setCmsProjects(list);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setErrorMsg("Failed to fetch CMS projects. Showing local projects only.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [dbFirestore]);

  const allProjects = useMemo(() => {
    const normalizedLocal = localProjects.map((project) => ({
      ...project,
      source: "local",
    }));

    return [...cmsProjects, ...normalizedLocal];
  }, [cmsProjects]);

  const handleDelete = async (id) => {
    if (!dbFirestore || deletingId) return;

    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        setDeletingId(id);
        await deleteDoc(doc(dbFirestore, "projects", id));
        setCmsProjects((prev) => prev.filter((project) => project.id !== id));
      } catch (error) {
        console.error("Error deleting:", error);
        alert("Failed to delete project. Please try again.");
      } finally {
        setDeletingId("");
      }
    }
  };

  const getTitle = (project) => {
    if (typeof project?.title === 'object') return project.title?.en || project.title?.id || "Untitled";
    return project?.title || "Untitled";
  };

  const filteredProjects = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return allProjects;

    return allProjects.filter((project) => {
      const title = getTitle(project).toLowerCase();
      const category = String(project?.category || "").toLowerCase();
      const source = String(project?.source || "").toLowerCase();
      return title.includes(keyword) || category.includes(keyword) || source.includes(keyword);
    });
  }, [allProjects, search]);

  const categoryCounts = useMemo(() => {
    return allProjects.reduce((acc, project) => {
      const key = String(project?.category || "other").toLowerCase();
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
  }, [allProjects]);

  const topCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0];

  const categoryBadgeClass = (category) => {
    const value = String(category || "").toLowerCase();
    if (value === 'web') return 'bg-cyan-100 text-cyan-700';
    if (value === 'mobile') return 'bg-emerald-100 text-emerald-700';
    if (value === 'python') return 'bg-yellow-100 text-yellow-700';
    if (value === 'ui') return 'bg-fuchsia-100 text-fuchsia-700';
    if (value === 'flutter') return 'bg-blue-100 text-blue-700';
    if (value === 'game') return 'bg-orange-100 text-orange-700';
    return 'bg-slate-100 text-slate-700';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark px-4 md:px-8 pt-24 pb-10">
      <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
           <Link to="/admin/dashboard" className="text-gray-500 hover:text-primary mb-2 inline-block">← Back to Dashboard</Link>
           <h1 className="text-3xl font-black dark:text-white">Project Manager</h1>
           <p className="text-gray-500 dark:text-gray-400 mt-1">Manage CMS projects shown on your public portfolio.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={fetchProjects} className="px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:border-primary hover:text-primary transition">
            Refresh
          </button>
          <Link to="/admin/add-project" className="bg-primary text-white px-5 py-2 rounded-lg font-bold hover:bg-secondary shadow-lg">
            + Add New Project
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-4">
          <p className="text-xs uppercase tracking-wider text-gray-500">Total Projects</p>
          <p className="text-2xl font-black text-dark dark:text-white mt-1">{allProjects.length}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-4">
          <p className="text-xs uppercase tracking-wider text-gray-500">Filtered Results</p>
          <p className="text-2xl font-black text-dark dark:text-white mt-1">{filteredProjects.length}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-4">
          <p className="text-xs uppercase tracking-wider text-gray-500">Top Category</p>
          <p className="text-2xl font-black text-dark dark:text-white mt-1 uppercase">{topCategory ? topCategory[0] : '-'}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-slate-700">
        <div className="p-4 border-b border-gray-200 dark:border-slate-700">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or category..."
            className="w-full rounded-lg border border-gray-300 dark:border-slate-600 px-4 py-2.5 bg-white dark:bg-slate-900 text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        {errorMsg && <p className="p-4 text-sm text-red-600 bg-red-50 border-b border-red-100">{errorMsg}</p>}

        {loading ? (
           <p className="p-8 text-center">Loading data...</p>
        ) : filteredProjects.length === 0 ? (
           <p className="p-8 text-center text-gray-500">No projects found. Start adding some!</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-200 uppercase text-sm leading-normal">
                  <th className="py-3 px-6">Thumbnail</th>
                  <th className="py-3 px-6">Title</th>
                  <th className="py-3 px-6">Category</th>
                  <th className="py-3 px-6">Source</th>
                  <th className="py-3 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 dark:text-gray-300 text-sm font-light">
                {filteredProjects.map((project) => (
                  <tr key={project.id} className="border-b border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50">
                    <td className="py-3 px-6">
                      <img src={project.image} alt="thumb" className="w-16 h-10 object-cover rounded" onError={(e) => { e.currentTarget.src = '/images/profile.webp'; }} />
                    </td>
                    
                    <td className="py-3 px-6 font-medium">
                        {getTitle(project)}
                    </td>

                    <td className="py-3 px-6">
                        <span className={`py-1 px-3 rounded-full text-xs font-bold uppercase ${categoryBadgeClass(project.category)}`}>
                            {project.category}
                        </span>
                    </td>
                    <td className="py-3 px-6">
                      <span className={`py-1 px-3 rounded-full text-xs font-bold uppercase ${project.source === 'cms' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
                        {project.source === 'cms' ? 'CMS' : 'Local'}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-center">
                      {project.source === 'cms' ? (
                        <div className="flex items-center justify-center gap-2">
                          <Link
                            to={`/admin/edit-project/${project.id}`}
                            className="text-blue-600 hover:text-blue-800 font-bold bg-blue-100 hover:bg-blue-200 py-1 px-3 rounded transition"
                          >
                            Edit
                          </Link>
                          <button 
                            onClick={() => handleDelete(project.id)}
                            disabled={deletingId === project.id}
                            className="text-red-500 hover:text-red-700 font-bold bg-red-100 hover:bg-red-200 py-1 px-3 rounded transition disabled:opacity-70 disabled:cursor-not-allowed"
                          >
                            {deletingId === project.id ? 'Deleting...' : 'Delete'}
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-500">Edit in `src/data/projects.js`</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      </div>
    </div>
  );
};

export default ManageProjects;