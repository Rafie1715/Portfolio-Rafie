import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../config/firebase";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("Logged in:", user);
        navigate("/admin/dashboard");
      })
      .catch((error) => {
        setError(true);
        console.error("Error:", error.message);
      });
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-dark">
      <form onSubmit={handleLogin} className="p-8 bg-white dark:bg-slate-800 rounded-xl shadow-xl w-80">
        <h2 className="text-2xl font-bold mb-6 text-center dark:text-white">Admin Login</h2>
        
        <input 
          type="email" 
          placeholder="Email" 
          className="w-full mb-4 p-2 border rounded dark:bg-slate-700 dark:text-white"
          onChange={e => setEmail(e.target.value)}
        />
        <input 
          type="password" 
          placeholder="Password" 
          className="w-full mb-6 p-2 border rounded dark:bg-slate-700 dark:text-white"
          onChange={e => setPassword(e.target.value)}
        />
        
        {error && <span className="text-red-500 text-sm block mb-2">Wrong email or password!</span>}
        
        <button type="submit" className="w-full bg-primary text-white py-2 rounded font-bold hover:bg-secondary transition">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;