import { useState, useEffect, useRef } from "react";
import { useFirebaseInit } from "../../hooks/useFirebaseInit";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../components/ToastProvider";

const AddProject = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [techItems, setTechItems] = useState([]);
  const [translatingFields, setTranslatingFields] = useState({});
  const debounceTimers = useRef({});
  const [newTechInput, setNewTechInput] = useState("");
  const [localizedFormData, setLocalizedFormData] = useState({
    title: "",
    shortDesc: "",
    fullDesc: "",
    challenges: "",
    solution: "",
    features: "",
  });
  const { dbFirestore, auth } = useFirebaseInit("all");

  const [formData, setFormData] = useState({
    title: "",
    shortDesc: "",
    fullDesc: "",
    challenges: "",
    solution: "",
    features: "",
    category: "web",
    liveLink: "",
    githubLink: "",
    imageFile: null,
  });

  const CLOUD_NAME = "djchoocal";
  const UPLOAD_PRESET = "rafie_portfolio";
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setHasUnsavedChanges(true);
    setError("");
  };

  const handleLocalizedInputChange = (e) => {
    const { name, value } = e.target;
    setLocalizedFormData((prev) => ({ ...prev, [name]: value }));
    setHasUnsavedChanges(true);
    setError("");
  };

    const autoTranslate = async (fieldName, englishText) => {
      if (!englishText.trim()) {
        setLocalizedFormData((prev) => ({ ...prev, [fieldName]: "" }));
        return;
      }
      if (debounceTimers.current[fieldName]) {
        clearTimeout(debounceTimers.current[fieldName]);
      }
      setTranslatingFields((prev) => ({ ...prev, [fieldName]: true }));
      debounceTimers.current[fieldName] = setTimeout(async () => {
        try {
          const response = await fetch(
            `https://api.mymemory.translated.net/get?q=${encodeURIComponent(englishText)}&langpair=en|id`
          );
          const result = await response.json();
          if (result.responseStatus === 200) {
            const translatedText = result.responseData.translatedText;
            setLocalizedFormData((prev) => ({ ...prev, [fieldName]: translatedText }));
          }
        } catch(err) {
          console.error("Translation error:", err);
        } finally {
          setTranslatingFields((prev) => ({ ...prev, [fieldName]: false }));
        }
      }, 800);
    };

    const handleInputChangeWithAutoTranslate = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      setHasUnsavedChanges(true);
      setError("");
      if (["title", "shortDesc", "fullDesc", "challenges", "solution", "features"].includes(name)) {
        autoTranslate(name, value);
      }
    };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      setError("Image size must be less than 5MB");
      return;
    }

    setFormData((prev) => ({ ...prev, imageFile: file }));
    setHasUnsavedChanges(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target?.result);
    };
    reader.readAsDataURL(file);
  };

  const addTechItem = () => {
    if (!newTechInput.trim()) return;
    setTechItems((prev) => [...prev, newTechInput.trim()]);
    setNewTechInput("");
    setHasUnsavedChanges(true);
  };

  const removeTechItem = (index) => {
    setTechItems((prev) => prev.filter((_, i) => i !== index));
    setHasUnsavedChanges(true);
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError("Project title is required");
      return false;
    }
    if (!formData.shortDesc.trim()) {
      setError("Short description is required");
      return false;
    }
    if (!formData.fullDesc.trim()) {
      setError("Full description is required");
      return false;
    }
    if (!formData.imageFile) {
      setError("Thumbnail image is required");
      return false;
    }
    if (formData.liveLink && !isValidUrl(formData.liveLink)) {
      setError("Live URL format is invalid");
      return false;
    }
    if (formData.githubLink && !isValidUrl(formData.githubLink)) {
      setError("GitHub URL format is invalid");
      return false;
    }
    return true;
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) return;
    if (!dbFirestore) {
      setError("Firebase not ready. Please refresh and try again.");
      return;
    }
    if (!auth?.currentUser) {
      setError("Your login session is not active. Please login again.");
      return;
    }

    setLoading(true);

    try {
      const imgFormData = new FormData();
      imgFormData.append("file", formData.imageFile);
      imgFormData.append("upload_preset", UPLOAD_PRESET);

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
            reject("Image upload failed");
          }
        };

        xhr.onerror = () => reject("Network error during upload");
        xhr.send(imgFormData);
      });

      const techArray = techItems.map((name) => ({
        name: name.trim(),
        icon: "fas fa-code",
      }));

      const featuresArray = formData.features
        .split("\n")
        .map((f) => f.trim())
        .filter((f) => f !== "");

      const localizedFeaturesArray = localizedFormData.features
        .split("\n")
        .map((f) => f.trim())
        .filter((f) => f !== "");

      const titleEn = formData.title.trim();
      const shortDescEn = formData.shortDesc.trim();
      const fullDescEn = formData.fullDesc.trim();
      const challengesEn = formData.challenges.trim();
      const solutionEn = formData.solution.trim();
      const featuresEn = featuresArray;

      const titleId = localizedFormData.title.trim() || titleEn;
      const shortDescId = localizedFormData.shortDesc.trim() || shortDescEn;
      const fullDescId = localizedFormData.fullDesc.trim() || fullDescEn;
      const challengesId = localizedFormData.challenges.trim() || challengesEn;
      const solutionId = localizedFormData.solution.trim() || solutionEn;
      const featuresId = localizedFeaturesArray.length > 0 ? localizedFeaturesArray : featuresEn;

      await addDoc(collection(dbFirestore, "projects"), {
        title: { en: titleEn, id: titleId },
        shortDesc: { en: shortDescEn, id: shortDescId },
        fullDesc: { en: fullDescEn, id: fullDescId },
        challenges: { en: challengesEn, id: challengesId },
        solution: { en: solutionEn, id: solutionId },
        features: { en: featuresEn, id: featuresId },
        category: formData.category,
        image: imageUrl,
        techStack: techArray,
        live: formData.liveLink || null,
        github: formData.githubLink || null,
        gallery: [],
        createdAt: new Date(),
      });

      setSuccess("Project published successfully!");
      showToast({
        type: "success",
        title: "Project published",
        message: "Your new project has been added to the CMS.",
      });
      setHasUnsavedChanges(false);
      setLocalizedFormData({
        title: "",
        shortDesc: "",
        fullDesc: "",
        challenges: "",
        solution: "",
        features: "",
      });
      setTimeout(() => {
        navigate("/admin/projects");
      }, 1500);
    } catch (error) {
      if (error?.code === "permission-denied") {
        setError(
          "Failed to publish project: Firestore blocked write access (permission-denied). Check Firestore Rules and ensure your account is allowed to write to `projects`."
        );
        showToast({
          type: "error",
          title: "Publish failed",
          message: "Firestore denied write access for this account.",
        });
      } else if (error?.code === "unauthenticated") {
        setError("Failed to publish project: your session has expired. Please login again.");
        showToast({
          type: "error",
          title: "Session expired",
          message: "Please login again before publishing a project.",
        });
      } else {
        setError(`Failed to publish project: ${error.message || error}`);
        showToast({
          type: "error",
          title: "Publish failed",
          message: error?.message || String(error),
        });
      }
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const handleCancel = () => {
    if (hasUnsavedChanges && !window.confirm("Discard unsaved changes?")) {
      return;
    }
    navigate("/admin/projects");
  };

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  useEffect(() => {
    return () => {
      Object.values(debounceTimers.current).forEach((timerId) => clearTimeout(timerId));
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark px-4 md:px-8 pt-24 pb-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={handleCancel}
            className="w-10 h-10 rounded-lg border border-gray-300 dark:border-slate-600 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 transition flex items-center justify-center"
          >
            <i className="fas fa-arrow-left"></i>
          </button>
          <div>
            <p className="text-sm uppercase tracking-wider text-primary font-semibold">Create Content</p>
            <h1 className="text-3xl md:text-4xl font-black text-dark dark:text-white">New Project</h1>
          </div>
          {hasUnsavedChanges && (
            <span className="ml-auto text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-3 py-1 rounded-full">
              Unsaved changes
            </span>
          )}
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-start gap-3">
            <i className="fas fa-circle-exclamation text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5"></i>
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 flex items-start gap-3">
            <i className="fas fa-check-circle text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5"></i>
            <p className="text-emerald-700 dark:text-emerald-300">{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-200 dark:border-slate-700">
            <h2 className="text-lg font-bold text-dark dark:text-white mb-6 flex items-center gap-2">
              <i className="fas fa-pen-nib text-primary"></i> Project Basics
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Project Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                   onChange={handleInputChangeWithAutoTranslate}
                  placeholder="e.g., Personal Portfolio Website"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
                >
                  <option value="web">Web Development</option>
                  <option value="mobile">Mobile App</option>
                  <option value="ui">UI/UX Design</option>
                  <option value="python">Python / AI</option>
                  <option value="java">Java</option>
                  <option value="flutter">Flutter</option>
                  <option value="game">Game Development</option>
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                Short Description (Card Preview) <span className="text-red-500">*</span>
              </label>
              <textarea
                name="shortDesc"
                value={formData.shortDesc}
                 onChange={handleInputChangeWithAutoTranslate}
                placeholder="Brief summary shown on project card..."
                rows="2"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/40 transition resize-none"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                Full Description (Detail Page) <span className="text-red-500">*</span>
              </label>
              <textarea
                name="fullDesc"
                value={formData.fullDesc}
                 onChange={handleInputChangeWithAutoTranslate}
                placeholder="Detailed explanation of the project..."
                rows="5"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/40 transition resize-none"
              ></textarea>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-200 dark:border-slate-700">
            <h2 className="text-lg font-bold text-dark dark:text-white mb-2 flex items-center gap-2">
              <i className="fas fa-language text-primary"></i> Indonesian Content
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Fill the Indonesian version here. Leave blank to reuse the English content.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Title (ID)
                </label>
                  {translatingFields.title && (
                    <span className="text-xs text-amber-600 dark:text-amber-400 mb-2 block">
                      <i className="fas fa-spinner fa-spin mr-1"></i> Translating...
                    </span>
                  )}
                <input
                  type="text"
                  name="title"
                  value={localizedFormData.title}
                  onChange={handleLocalizedInputChange}
                  placeholder="Judul proyek dalam Bahasa Indonesia"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Short Description (ID)
                </label>
                  {translatingFields.shortDesc && (
                    <span className="text-xs text-amber-600 dark:text-amber-400 mb-2 block">
                      <i className="fas fa-spinner fa-spin mr-1"></i> Translating...
                    </span>
                  )}
                <textarea
                  name="shortDesc"
                  value={localizedFormData.shortDesc}
                  onChange={handleLocalizedInputChange}
                  placeholder="Ringkasan singkat untuk kartu proyek"
                  rows="2"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/40 transition resize-none"
                ></textarea>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                Full Description (ID)
              </label>
                {translatingFields.fullDesc && (
                  <span className="text-xs text-amber-600 dark:text-amber-400 mb-2 block">
                    <i className="fas fa-spinner fa-spin mr-1"></i> Translating...
                  </span>
                )}
              <textarea
                name="fullDesc"
                value={localizedFormData.fullDesc}
                onChange={handleLocalizedInputChange}
                placeholder="Penjelasan lengkap proyek dalam Bahasa Indonesia"
                rows="5"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/40 transition resize-none"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Challenge (ID)</label>
                  {translatingFields.challenges && (
                    <span className="text-xs text-amber-600 dark:text-amber-400 mb-2 block">
                      <i className="fas fa-spinner fa-spin mr-1"></i> Translating...
                    </span>
                  )}
                <textarea
                  name="challenges"
                  value={localizedFormData.challenges}
                  onChange={handleLocalizedInputChange}
                  placeholder="Masalah yang dihadapi"
                  rows="3"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/40 transition resize-none"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Solution (ID)</label>
                  {translatingFields.solution && (
                    <span className="text-xs text-amber-600 dark:text-amber-400 mb-2 block">
                      <i className="fas fa-spinner fa-spin mr-1"></i> Translating...
                    </span>
                  )}
                <textarea
                  name="solution"
                  value={localizedFormData.solution}
                  onChange={handleLocalizedInputChange}
                  placeholder="Bagaimana solusinya"
                  rows="3"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/40 transition resize-none"
                ></textarea>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                Features (ID) <span className="text-xs font-normal text-gray-500">(one per line)</span>
              </label>
              {translatingFields.features && (
                <span className="text-xs text-amber-600 dark:text-amber-400 mb-2 block">
                  <i className="fas fa-spinner fa-spin mr-1"></i> Translating...
                </span>
              )}
              <textarea
                name="features"
                value={localizedFormData.features}
                onChange={handleLocalizedInputChange}
                placeholder="Login System&#10;Dark Mode&#10;Real-time Chat"
                rows="4"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/40 transition resize-none"
              ></textarea>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-200 dark:border-slate-700">
            <h2 className="text-lg font-bold text-dark dark:text-white mb-6 flex items-center gap-2">
              <i className="fas fa-lightbulb text-primary"></i> Challenge & Solution
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Challenge</label>
                <textarea
                  name="challenges"
                  value={formData.challenges}
                   onChange={handleInputChangeWithAutoTranslate}
                  placeholder="What problem did you face?"
                  rows="3"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/40 transition resize-none"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Solution</label>
                <textarea
                  name="solution"
                  value={formData.solution}
                   onChange={handleInputChangeWithAutoTranslate}
                  placeholder="How did you solve it?"
                  rows="3"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/40 transition resize-none"
                ></textarea>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-200 dark:border-slate-700">
            <h2 className="text-lg font-bold text-dark dark:text-white mb-6 flex items-center gap-2">
              <i className="fas fa-wrench text-primary"></i> Tech Stack & Features
            </h2>

            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Technologies Used</label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newTechInput}
                  onChange={(e) => setNewTechInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTechItem();
                    }
                  }}
                  placeholder="e.g., React, Firebase, Tailwind"
                  className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/40 transition text-sm"
                />
                <button
                  type="button"
                  onClick={addTechItem}
                  className="px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-secondary transition font-semibold text-sm"
                >
                  Add
                </button>
              </div>

              {techItems.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {techItems.map((tech, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/30 text-primary rounded-lg text-sm"
                    >
                      <span>{tech}</span>
                      <button
                        type="button"
                        onClick={() => removeTechItem(idx)}
                        className="hover:text-red-600 transition"
                      >
                        <i className="fas fa-times text-xs"></i>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                Features <span className="text-xs font-normal text-gray-500">(one per line)</span>
              </label>
              <textarea
                name="features"
                value={formData.features}
                onChange={handleInputChangeWithAutoTranslate}
                placeholder="Login System&#10;Dark Mode&#10;Real-time Chat"
                rows="4"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/40 transition resize-none"
              ></textarea>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-200 dark:border-slate-700">
            <h2 className="text-lg font-bold text-dark dark:text-white mb-6 flex items-center gap-2">
              <i className="fas fa-image text-primary"></i> Thumbnail & Links
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Thumbnail Image <span className="text-red-500">*</span>
                  <span className="text-xs font-normal text-gray-500"> (max 5MB)</span>
                </label>
                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-xl cursor-pointer hover:border-primary/50 transition">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <i className="fas fa-cloud-arrow-up text-3xl text-gray-400 mb-2"></i>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Click to upload</p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Live Demo URL</label>
                  <input
                    type="url"
                    name="liveLink"
                    value={formData.liveLink}
                    onChange={handleInputChange}
                    placeholder="https://example.com"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">GitHub Repository</label>
                  <input
                    type="url"
                    name="githubLink"
                    value={formData.githubLink}
                    onChange={handleInputChange}
                    placeholder="https://github.com/user/repo"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 sticky bottom-10">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 px-6 py-3 rounded-xl border border-gray-300 dark:border-slate-600 text-dark dark:text-white font-semibold hover:bg-gray-100 dark:hover:bg-slate-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 px-6 py-3 rounded-xl text-white font-semibold text-lg transition flex items-center justify-center gap-2 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-primary/30"
              }`}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner animate-spin"></i>
                  Uploading... {uploadProgress}%
                </>
              ) : (
                <>
                  <i className="fas fa-rocket"></i>
                  Publish Project
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProject;
