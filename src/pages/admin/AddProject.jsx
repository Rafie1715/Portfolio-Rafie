import { useState } from "react";
import { dbFirestore } from "../../config/firebase"; 
import { collection, addDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";

const AddProject = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);   
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState("web");
  const [techStack, setTechStack] = useState("");
  const [liveLink, setLiveLink] = useState("");
  const [githubLink, setGithubLink] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const CLOUD_NAME = "djchoocal"; 
  const UPLOAD_PRESET = "rafie_portfolio";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !imageFile) return alert("Title and Image are required!");

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", imageFile);
      formData.append("upload_preset", UPLOAD_PRESET);

      const xhr = new XMLHttpRequest();
      
      const imageUrl = await new Promise((resolve, reject) => {
        xhr.open("POST", `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`);

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100);
            setUploadProgress(progress);
          }
        };

        xhr.onload = () => {
          if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            resolve(response.secure_url);
          } else {
            reject("Upload failed");
          }
        };

        xhr.onerror = () => reject("Upload error");
        xhr.send(formData);
      });

      const techArray = techStack.split(",").map(item => item.trim()).map(name => ({
         name: name,
         icon: "fas fa-code" 
      }));

      await addDoc(collection(dbFirestore, "projects"), {
        title,
        shortDesc: desc,
        category,
        image: imageUrl,
        techStack: techArray,
        live: liveLink,
        github: githubLink,
        createdAt: new Date()
      });

      alert("Project Added Successfully!");
      navigate("/admin/projects");

    } catch (error) {
      console.error("Error:", error);
      alert("Failed to save project.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark p-8 pt-24 flex justify-center">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700">
        
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold dark:text-white">Add New Project</h1>
            <Link to="/admin/projects" className="text-gray-500 hover:text-red-500 transition-colors">Cancel</Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">          
          <div>
            <label className="block text-gray-600 dark:text-gray-300 text-sm font-bold mb-2">Project Title</label>
            <input 
                type="text" 
                className="w-full p-3 rounded-lg border dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-primary outline-none" 
                placeholder="e.g. CinemaZone Movie App"
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                required 
            />
          </div>

           <div>
             <label className="block text-gray-600 dark:text-gray-300 text-sm font-bold mb-2">Category</label>
             <select 
                className="w-full p-3 rounded-lg border dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-primary outline-none" 
                value={category} 
                onChange={e => setCategory(e.target.value)}
            >
                <option value="web">Web Development</option>
                <option value="mobile">Mobile App</option>
                <option value="ui">UI/UX Design</option>
                <option value="python">Python / AI</option>
             </select>
          </div>

          <div>
            <label className="block text-gray-600 dark:text-gray-300 text-sm font-bold mb-2">Description</label>
            <textarea 
                className="w-full p-3 rounded-lg border dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-primary outline-none" 
                rows="3" 
                placeholder="Briefly describe the project features and goals..."
                value={desc} 
                onChange={e => setDesc(e.target.value)}
            ></textarea>
          </div>

          <div>
            <label className="block text-gray-600 dark:text-gray-300 text-sm font-bold mb-2">Tech Stack (Separate by comma)</label>
            <input 
                type="text" 
                className="w-full p-3 rounded-lg border dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-primary outline-none" 
                placeholder="React, Tailwind CSS, Firebase" 
                value={techStack} 
                onChange={e => setTechStack(e.target.value)} 
            />
          </div>

           <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-600 dark:text-gray-300 text-sm font-bold mb-2">Live URL</label>
                <input 
                    type="url" 
                    className="w-full p-3 rounded-lg border dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-primary outline-none" 
                    placeholder="https://my-project.netlify.app"
                    value={liveLink} 
                    onChange={e => setLiveLink(e.target.value)} 
                />
              </div>
              <div>
                <label className="block text-gray-600 dark:text-gray-300 text-sm font-bold mb-2">GitHub URL</label>
                <input 
                    type="url" 
                    className="w-full p-3 rounded-lg border dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-primary outline-none" 
                    placeholder="https://github.com/Rafie1715/repo"
                    value={githubLink} 
                    onChange={e => setGithubLink(e.target.value)} 
                />
              </div>
          </div>

          <div>
            <label className="block text-gray-600 dark:text-gray-300 text-sm font-bold mb-2">Thumbnail</label>
            <input 
              type="file" 
              accept="image/*"
              className="w-full p-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-primary file:text-white file:font-bold hover:file:bg-secondary cursor-pointer"
              onChange={e => setImageFile(e.target.files[0])}
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full py-4 rounded-xl font-bold text-white shadow-lg mt-4 relative overflow-hidden transition-all ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-primary to-secondary hover:shadow-xl'}`}
          >
            {loading && <div className="absolute top-0 left-0 h-full bg-black/20 transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>}
            <span className="relative z-10">{loading ? `Uploading... ${uploadProgress}%` : "🚀 Publish Project"}</span>
          </button>

        </form>
      </div>
    </div>
  );
};

export default AddProject;