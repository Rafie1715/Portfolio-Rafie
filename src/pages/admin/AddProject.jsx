import { useState } from "react";
import { dbFirestore } from "../../config/firebase"; 
import { collection, addDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";

const AddProject = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const [title, setTitle] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [fullDesc, setFullDesc] = useState(""); 
  const [challenges, setChallenges] = useState(""); 
  const [solution, setSolution] = useState(""); 
  const [features, setFeatures] = useState("");
  
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

      const imageUrl = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
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

      const techArray = techStack.split(",").map(item => ({
         name: item.trim(),
         icon: "fas fa-code"
      }));

      const featuresArray = features.split("\n").filter(f => f.trim() !== "");

      await addDoc(collection(dbFirestore, "projects"), {
        title: { en: title, id: title },
        shortDesc: { en: shortDesc, id: shortDesc },
        fullDesc: { en: fullDesc, id: fullDesc },
        challenges: { en: challenges, id: challenges },
        solution: { en: solution, id: solution },
        features: { en: featuresArray, id: featuresArray },
        category,
        image: imageUrl,
        techStack: techArray,
        live: liveLink,
        github: githubLink,
        gallery: [],
        createdAt: new Date()
      });

      alert("Project Added Successfully!");
      navigate("/admin/projects");

    } catch (error) {
      console.error("Error:", error);
      alert("Failed to save project: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark p-8 pt-24 flex justify-center">
      <div className="w-full max-w-3xl bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700">
        
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold dark:text-white">Add Complete Project</h1>
            <Link to="/admin/projects" className="text-gray-500 hover:text-red-500 transition-colors">Cancel</Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="label-style">Project Title</label>
                <input type="text" className="input-style" placeholder="Project Name" value={title} onChange={e => setTitle(e.target.value)} required />
            </div>
            <div>
                <label className="label-style">Category</label>
                <select className="input-style" value={category} onChange={e => setCategory(e.target.value)}>
                    <option value="web">Web Development</option>
                    <option value="mobile">Mobile App</option>
                    <option value="ui">UI/UX Design</option>
                    <option value="python">Python / AI</option>
                </select>
            </div>
          </div>

          <div>
            <label className="label-style">Short Description (Card)</label>
            <textarea className="input-style" rows="2" placeholder="Brief summary..." value={shortDesc} onChange={e => setShortDesc(e.target.value)} required></textarea>
          </div>

          <div>
            <label className="label-style">Full Overview (Detail Page)</label>
            <textarea className="input-style" rows="5" placeholder="Detailed explanation..." value={fullDesc} onChange={e => setFullDesc(e.target.value)} required></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
                <label className="label-style">Challenge</label>
                <textarea className="input-style" rows="3" placeholder="What was hard?" value={challenges} onChange={e => setChallenges(e.target.value)}></textarea>
             </div>
             <div>
                <label className="label-style">Solution</label>
                <textarea className="input-style" rows="3" placeholder="How did you fix it?" value={solution} onChange={e => setSolution(e.target.value)}></textarea>
             </div>
          </div>

          <div>
            <label className="label-style">Features (Satu fitur per baris / Enter)</label>
            <textarea className="input-style" rows="4" placeholder="Login System&#10;Dark Mode&#10;Realtime Chat" value={features} onChange={e => setFeatures(e.target.value)}></textarea>
          </div>

          <div>
            <label className="label-style">Tech Stack (Comma separated)</label>
            <input type="text" className="input-style" placeholder="React, Firebase, Tailwind" value={techStack} onChange={e => setTechStack(e.target.value)} />
          </div>

           <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label-style">Live URL</label>
                <input type="url" className="input-style" placeholder="https://..." value={liveLink} onChange={e => setLiveLink(e.target.value)} />
              </div>
              <div>
                <label className="label-style">GitHub URL</label>
                <input type="url" className="input-style" placeholder="https://github.com/..." value={githubLink} onChange={e => setGithubLink(e.target.value)} />
              </div>
          </div>

          <div>
            <label className="label-style">Thumbnail Image</label>
            <input type="file" accept="image/*" className="w-full p-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white" onChange={e => setImageFile(e.target.files[0])} required />
          </div>

          <button type="submit" disabled={loading} className={`w-full py-4 rounded-xl font-bold text-white shadow-lg mt-4 relative overflow-hidden transition-all ${loading ? 'bg-gray-400' : 'bg-gradient-to-r from-primary to-secondary hover:shadow-xl'}`}>
            {loading ? `Uploading... ${uploadProgress}%` : "🚀 Publish Project"}
          </button>

        </form>
      </div>
      
      <style>{`
        .label-style { display: block; color: #4b5563; font-size: 0.875rem; font-weight: 700; margin-bottom: 0.5rem; }
        .dark .label-style { color: #d1d5db; }
        .input-style { width: 100%; padding: 0.75rem; border-radius: 0.5rem; border: 1px solid #e5e7eb; outline: none; transition: ring 2px; }
        .dark .input-style { background-color: #334155; border-color: #475569; color: white; }
        .input-style:focus { ring: 2px; ring-color: #6366f1; }
      `}</style>
    </div>
  );
};

export default AddProject;