import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useFirebaseInit } from "../../hooks/useFirebaseInit";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { auth, loading } = useFirebaseInit('auth');

  const handleLogin = (e) => {
    e.preventDefault();
    if (!auth || submitting) return;
    setSubmitting(true);
    setError(false);
    
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        navigate("/admin/dashboard");
      })
      .catch(() => {
        setError(true);
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <div className="admin-page flex min-h-[100svh] items-center justify-center px-4 py-8 bg-gray-100 dark:bg-dark">
      <form onSubmit={handleLogin} className="w-full max-w-sm p-5 sm:p-8 bg-white dark:bg-slate-800 rounded-xl shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-center dark:text-white">Admin Login</h2>
        
        <input 
          type="email" 
          autoComplete="username"
          aria-label="Email"
          required
          placeholder="Email" 
          className="w-full mb-4 p-2 border rounded dark:bg-slate-700 dark:text-white"
          onChange={e => setEmail(e.target.value)}
        />
        <input 
          type="password" 
          autoComplete="current-password"
          aria-label="Password"
          required
          placeholder="Password" 
          className="w-full mb-6 p-2 border rounded dark:bg-slate-700 dark:text-white"
          onChange={e => setPassword(e.target.value)}
        />
        
        {error && <span className="text-red-500 text-sm block mb-2">Wrong email or password!</span>}
        
        <button
          type="submit"
          disabled={!auth || loading || submitting}
          className="w-full bg-primary text-white py-2 rounded font-bold hover:bg-secondary transition disabled:cursor-wait disabled:opacity-60"
        >
          {loading ? "Preparing login..." : submitting ? "Signing in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
