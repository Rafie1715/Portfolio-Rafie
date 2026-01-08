import { signOut } from "firebase/auth";
import { auth } from "../../config/firebase";
import { useNavigate, Link } from "react-router-dom";

const Dashboard = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        signOut(auth).then(() => {
            navigate("/login");
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark p-8 pt-24">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold dark:text-white">Admin Dashboard</h1>
                <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                    Logout
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700">
                    <h2 className="text-xl font-bold mb-4 dark:text-white">Manage Projects</h2>
                    <p className="text-gray-500 mb-4">Add, edit, or remove your portfolio projects.</p>
                    <Link to="/admin/projects" className="block text-center bg-primary text-white px-4 py-2 rounded w-full hover:bg-secondary transition">
                        Go to Projects
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;