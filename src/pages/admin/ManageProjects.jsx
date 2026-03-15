import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useFirebaseInit } from "../../hooks/useFirebaseInit";
import { collection, getDocs, deleteDoc, doc, addDoc, writeBatch } from "firebase/firestore";
import { projects as localProjects } from "../../data/projects";
import { useToast } from "../../components/ToastProvider";

const ManageProjects = () => {
  const [cmsProjects, setCmsProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState("");
  const [duplicatingId, setDuplicatingId] = useState("");
  const [selectedProjectIds, setSelectedProjectIds] = useState([]);
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  const { dbFirestore } = useFirebaseInit('dbFirestore');
  const { showToast } = useToast();
  const pageSize = 8;

  const getProjectDate = (value) => {
    if (!value) return 0;
    if (value?.toDate && typeof value.toDate === 'function') return value.toDate().getTime();
    if (value instanceof Date) return value.getTime();
    if (typeof value === 'number') return value;
    const parsed = new Date(value).getTime();
    return Number.isNaN(parsed) ? 0 : parsed;
  };

  const fetchProjects = async ({ silent = false } = {}) => {
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
      setSelectedProjectIds((prev) => prev.filter((id) => list.some((project) => project.id === id)));
      if (!silent) {
        showToast({ type: "success", title: "Projects refreshed", message: "CMS project list is up to date.", duration: 2200 });
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      setErrorMsg("Failed to fetch CMS projects. Showing local projects only.");
      if (!silent) {
        showToast({ type: "error", title: "Refresh failed", message: "Could not load CMS projects. Using local data only." });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects({ silent: true });
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
        setSelectedProjectIds((prev) => prev.filter((projectId) => projectId !== id));
        showToast({ type: "success", title: "Project deleted", message: "The project was removed from the CMS." });
      } catch (error) {
        console.error("Error deleting:", error);
        showToast({ type: "error", title: "Delete failed", message: "Failed to delete the selected project." });
      } finally {
        setDeletingId("");
      }
    }
  };

  const handleDuplicate = async (project) => {
    if (!dbFirestore || duplicatingId) return;

    try {
      setDuplicatingId(project.id);
      const localizedTitle = typeof project?.title === 'object'
        ? {
            en: `${project.title?.en || project.title?.id || 'Untitled'} Copy`,
            id: `${project.title?.id || project.title?.en || 'Untitled'} Copy`,
          }
        : `${project?.title || 'Untitled'} Copy`;

      const payload = {
        ...project,
        title: localizedTitle,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      delete payload.id;
      delete payload.source;

      const docRef = await addDoc(collection(dbFirestore, "projects"), payload);

      setCmsProjects((prev) => [
        {
          ...payload,
          id: docRef.id,
          source: 'cms',
        },
        ...prev,
      ]);
      showToast({ type: "success", title: "Project duplicated", message: "A copy was created in the CMS." });
    } catch (error) {
      console.error("Error duplicating project:", error);
      showToast({ type: "error", title: "Duplicate failed", message: "Could not duplicate the selected project." });
    } finally {
      setDuplicatingId("");
    }
  };

  const toggleSelection = (projectId) => {
    setSelectedProjectIds((prev) => (
      prev.includes(projectId)
        ? prev.filter((id) => id !== projectId)
        : [...prev, projectId]
    ));
  };

  const handleBulkDelete = async () => {
    if (!dbFirestore || bulkDeleting || selectedProjectIds.length === 0) return;

    if (!window.confirm(`Delete ${selectedProjectIds.length} selected CMS project(s)?`)) {
      return;
    }

    try {
      setBulkDeleting(true);
      const batch = writeBatch(dbFirestore);

      selectedProjectIds.forEach((projectId) => {
        batch.delete(doc(dbFirestore, 'projects', projectId));
      });

      await batch.commit();

      setCmsProjects((prev) => prev.filter((project) => !selectedProjectIds.includes(project.id)));
      setSelectedProjectIds([]);
      showToast({
        type: 'success',
        title: 'Bulk delete complete',
        message: `${selectedProjectIds.length} project(s) were removed from the CMS.`,
      });
    } catch (error) {
      console.error('Error deleting selected projects:', error);
      showToast({
        type: 'error',
        title: 'Bulk delete failed',
        message: 'Failed to delete one or more selected projects.',
      });
    } finally {
      setBulkDeleting(false);
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

  const sortedProjects = useMemo(() => {
    const list = [...filteredProjects];

    list.sort((left, right) => {
      if (sortBy === 'title-asc') return getTitle(left).localeCompare(getTitle(right));
      if (sortBy === 'title-desc') return getTitle(right).localeCompare(getTitle(left));
      if (sortBy === 'category') return String(left.category || '').localeCompare(String(right.category || ''));
      if (sortBy === 'source') return String(left.source || '').localeCompare(String(right.source || ''));
      if (sortBy === 'oldest') return getProjectDate(left.createdAt) - getProjectDate(right.createdAt);
      return getProjectDate(right.createdAt) - getProjectDate(left.createdAt);
    });

    return list;
  }, [filteredProjects, sortBy]);

  const totalPages = Math.max(1, Math.ceil(sortedProjects.length / pageSize));
  const paginatedProjects = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    return sortedProjects.slice(startIndex, startIndex + pageSize);
  }, [page, sortedProjects]);

  const cmsProjectsOnPage = useMemo(
    () => paginatedProjects.filter((project) => project.source === 'cms').map((project) => project.id),
    [paginatedProjects]
  );

  const areAllCmsProjectsOnPageSelected = cmsProjectsOnPage.length > 0
    && cmsProjectsOnPage.every((projectId) => selectedProjectIds.includes(projectId));

  const toggleSelectAllOnPage = () => {
    setSelectedProjectIds((prev) => {
      if (areAllCmsProjectsOnPageSelected) {
        return prev.filter((id) => !cmsProjectsOnPage.includes(id));
      }

      return [...new Set([...prev, ...cmsProjectsOnPage])];
    });
  };

  useEffect(() => {
    setPage(1);
  }, [search, sortBy]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

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
          <button onClick={() => fetchProjects()} className="px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:border-primary hover:text-primary transition">
            Refresh
          </button>
          {selectedProjectIds.length > 0 && (
            <button
              onClick={handleBulkDelete}
              disabled={bulkDeleting}
              className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {bulkDeleting ? 'Deleting selected...' : `Delete Selected (${selectedProjectIds.length})`}
            </button>
          )}
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
        <div className="p-4 border-b border-gray-200 dark:border-slate-700 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_220px] gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or category..."
            className="w-full rounded-lg border border-gray-300 dark:border-slate-600 px-4 py-2.5 bg-white dark:bg-slate-900 text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full rounded-lg border border-gray-300 dark:border-slate-600 px-4 py-2.5 bg-white dark:bg-slate-900 text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <option value="newest">Sort: Newest</option>
            <option value="oldest">Sort: Oldest</option>
            <option value="title-asc">Sort: Title A-Z</option>
            <option value="title-desc">Sort: Title Z-A</option>
            <option value="category">Sort: Category</option>
            <option value="source">Sort: Source</option>
          </select>
        </div>

        {errorMsg && <p className="p-4 text-sm text-red-600 bg-red-50 border-b border-red-100">{errorMsg}</p>}

        {loading ? (
           <p className="p-8 text-center">Loading data...</p>
        ) : sortedProjects.length === 0 ? (
           <p className="p-8 text-center text-gray-500">No projects found. Start adding some!</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-200 uppercase text-sm leading-normal">
                  <th className="py-3 px-4 text-center">
                    <input
                      type="checkbox"
                      checked={areAllCmsProjectsOnPageSelected}
                      onChange={toggleSelectAllOnPage}
                      disabled={cmsProjectsOnPage.length === 0}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      aria-label="Select all CMS projects on this page"
                    />
                  </th>
                  <th className="py-3 px-6">Thumbnail</th>
                  <th className="py-3 px-6">Title</th>
                  <th className="py-3 px-6">Category</th>
                  <th className="py-3 px-6">Source</th>
                  <th className="py-3 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 dark:text-gray-300 text-sm font-light">
                {paginatedProjects.map((project) => (
                  <tr key={project.id} className="border-b border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50">
                    <td className="py-3 px-4 text-center">
                      {project.source === 'cms' ? (
                        <input
                          type="checkbox"
                          checked={selectedProjectIds.includes(project.id)}
                          onChange={() => toggleSelection(project.id)}
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          aria-label={`Select ${getTitle(project)}`}
                        />
                      ) : (
                        <span className="text-xs text-gray-300 dark:text-gray-600">-</span>
                      )}
                    </td>
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
                            onClick={() => handleDuplicate(project)}
                            disabled={duplicatingId === project.id}
                            className="text-violet-600 hover:text-violet-800 font-bold bg-violet-100 hover:bg-violet-200 py-1 px-3 rounded transition disabled:opacity-70 disabled:cursor-not-allowed"
                          >
                            {duplicatingId === project.id ? 'Duplicating...' : 'Duplicate'}
                          </button>
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
            <div className="flex flex-col gap-3 border-t border-gray-200 dark:border-slate-700 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Showing {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, sortedProjects.length)} of {sortedProjects.length} projects
              </p>
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  disabled={page === 1}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:text-gray-200"
                >
                  Previous
                </button>
                <span className="min-w-20 text-center text-sm font-medium text-gray-600 dark:text-gray-300">
                  Page {page} / {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                  disabled={page === totalPages}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:text-gray-200"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
  );
};

export default ManageProjects;