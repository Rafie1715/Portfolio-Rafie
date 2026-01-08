import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { dbFirestore } from "../../config/firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

const ManageProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      const querySnapshot = await getDocs(collection(dbFirestore, "projects"));
      const list = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProjects(list);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await deleteDoc(doc(dbFirestore, "projects", id));
        fetchProjects(); 
        alert("Project deleted!");
      } catch (error) {
        console.error("Error deleting:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark p-8 pt-24">
      <div className="flex justify-between items-center mb-8 max-w-6xl mx-auto">
        <div>
           <Link to="/admin/dashboard" className="text-gray-500 hover:text-primary mb-2 inline-block">← Back to Dashboard</Link>
           <h1 className="text-3xl font-bold dark:text-white">All Projects</h1>
        </div>
        <Link to="/admin/add-project" className="bg-primary text-white px-6 py-2 rounded-lg font-bold hover:bg-secondary shadow-lg">
          + Add New Project
        </Link>
      </div>

      <div className="max-w-6xl mx-auto bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden">
        {loading ? (
           <p className="p-8 text-center">Loading data...</p>
        ) : projects.length === 0 ? (
           <p className="p-8 text-center text-gray-500">No projects found. Start adding some!</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-200 uppercase text-sm leading-normal">
                  <th className="py-3 px-6">Thumbnail</th>
                  <th className="py-3 px-6">Title</th>
                  <th className="py-3 px-6">Category</th>
                  <th className="py-3 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 dark:text-gray-300 text-sm font-light">
                {projects.map((project) => (
                  <tr key={project.id} className="border-b border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50">
                    <td className="py-3 px-6">
                      <img src={project.image} alt="thumb" className="w-16 h-10 object-cover rounded" />
                    </td>
                    <td className="py-3 px-6 font-medium">{project.title}</td>
                    <td className="py-3 px-6">
                        <span className="bg-blue-100 text-blue-600 py-1 px-3 rounded-full text-xs font-bold">
                            {project.category}
                        </span>
                    </td>
                    <td className="py-3 px-6 text-center">
                      <button 
                        onClick={() => handleDelete(project.id)}
                        className="text-red-500 hover:text-red-700 font-bold bg-red-100 hover:bg-red-200 py-1 px-3 rounded transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageProjects;