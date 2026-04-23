import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { useFirebaseInit } from "../../hooks/useFirebaseInit";
import { useToast } from "../../components/ToastProvider";
import { createCertification } from "../../utils/certificationAdminApi";

const AddCertification = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { dbFirestore, auth } = useFirebaseInit("all");

  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [autoOrder, setAutoOrder] = useState(1);
  const [translatingFields, setTranslatingFields] = useState({});
  const debounceTimers = useRef({});

  const [formData, setFormData] = useState({
    title: "",
    issuer: "",
    category: "",
    date: "",
    link: "",
    alt: "",
    badge: "🏆",
    color: "from-blue-500 to-blue-600",
    isPublished: true,
    imageFile: null,
  });

  const [localizedFormData, setLocalizedFormData] = useState({
    title: "",
    issuer: "",
    category: "",
    alt: "",
  });

  const CLOUD_NAME = "djchoocal";
  const UPLOAD_PRESET = "rafie_portfolio";
  const MAX_FILE_SIZE = 5 * 1024 * 1024;

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
      } catch (err) {
        console.error("Translation error:", err);
      } finally {
        setTranslatingFields((prev) => ({ ...prev, [fieldName]: false }));
      }
    }, 800);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");

    if (["title", "issuer", "category", "alt"].includes(name)) {
      autoTranslate(name, value);
    }
  };

  const handleLocalizedInputChange = (e) => {
    const { name, value } = e.target;
    setLocalizedFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      setError("Image size must be less than 5MB");
      return;
    }

    setFormData((prev) => ({ ...prev, imageFile: file }));
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    setError("");
  };

  const isValidHttpUrl = (value) => {
    if (!value) return true;
    try {
      const url = new URL(value);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  };

  useEffect(() => {
    const fetchLastOrder = async () => {
      if (!dbFirestore) return;
      try {
        const snapshot = await getDocs(collection(dbFirestore, "certifications"));
        const maxOrder = snapshot.docs.reduce((maxValue, entry) => {
          const currentOrder = entry.data()?.order;
          if (typeof currentOrder === "number") return Math.max(maxValue, currentOrder);
          if (typeof currentOrder === "string") {
            const parsed = Number(currentOrder);
            if (!Number.isNaN(parsed)) return Math.max(maxValue, parsed);
          }
          return maxValue;
        }, 0);

        setAutoOrder(maxOrder + 1);
      } catch (err) {
        console.error("Failed to resolve auto order:", err);
        setAutoOrder(1);
      }
    };

    fetchLastOrder();
  }, [dbFirestore]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!dbFirestore) {
      setError("Firebase is not ready yet. Try again.");
      return;
    }

    if (!formData.title.trim()) {
      setError("Title is required.");
      return;
    }

    if (!formData.issuer.trim()) {
      setError("Issuer is required.");
      return;
    }

    if (!formData.imageFile) {
      setError("Thumbnail image is required.");
      return;
    }

    if (!isValidHttpUrl(formData.link.trim())) {
      setError("Verification link must be a valid URL (http/https).");
      return;
    }

    setLoading(true);
    setError("");

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

      const payload = {
        title: {
          en: formData.title.trim(),
          id: localizedFormData.title.trim() || formData.title.trim(),
        },
        issuer: {
          en: formData.issuer.trim(),
          id: localizedFormData.issuer.trim() || formData.issuer.trim(),
        },
        category: {
          en: formData.category.trim(),
          id: localizedFormData.category.trim() || formData.category.trim(),
        },
        alt: {
          en: formData.alt.trim() || formData.title.trim(),
          id: localizedFormData.alt.trim() || localizedFormData.title.trim() || formData.alt.trim() || formData.title.trim(),
        },
        date: formData.date.trim() || "",
        link: formData.link.trim() || "",
        badge: formData.badge.trim() || "🏆",
        color: formData.color || "from-blue-500 to-blue-600",
        order: autoOrder,
        isPublished: Boolean(formData.isPublished),
        img: imageUrl,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await createCertification({ auth, payload });

      setSuccess("Certification published successfully!");
      showToast({
        type: "success",
        title: "Certification created",
        message: "New certification has been added to CMS.",
      });

      setTimeout(() => navigate("/admin/certifications"), 1200);
    } catch (err) {
      if (err?.code === "permission-denied") {
        setError(
          "Failed to publish certification: Firestore blocked write access (permission-denied). Check Firestore Rules for `certifications` and ensure your account is an admin."
        );
        showToast({
          type: "error",
          title: "Publish failed",
          message: "Firestore denied write access for this account.",
        });
      } else if (err?.code === "unauthenticated") {
        setError("Failed to publish certification: your session has expired. Please login again.");
        showToast({
          type: "error",
          title: "Session expired",
          message: "Please login again before publishing certification.",
        });
      } else {
        setError(`Failed to publish certification: ${err?.message || String(err)}`);
        showToast({
          type: "error",
          title: "Publish failed",
          message: err?.message || String(err),
        });
      }
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  useEffect(() => {
    return () => {
      Object.values(debounceTimers.current).forEach((timerId) => clearTimeout(timerId));
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark px-4 md:px-8 pt-24 pb-10">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link to="/admin/certifications" className="text-gray-500 hover:text-primary mb-2 inline-block">
            ← Back to Certification Manager
          </Link>
          <h1 className="text-3xl md:text-4xl font-black text-dark dark:text-white">Add Certification</h1>
        </div>

        {error && <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700">{error}</div>}
        {success && <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-200 dark:border-slate-700">
            <h2 className="text-lg font-bold text-dark dark:text-white mb-4">English Content</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Issuer *</label>
                <input
                  type="text"
                  name="issuer"
                  value={formData.issuer}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Category</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  placeholder="e.g. Android, Web, AI/ML"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Issued Year</label>
                <input
                  type="text"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  placeholder="2026"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Alt Text</label>
              <input
                type="text"
                name="alt"
                value={formData.alt}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Verification Link</label>
              <input
                type="url"
                name="link"
                value={formData.link}
                onChange={handleInputChange}
                placeholder="https://example.com/certificate"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900"
              />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-200 dark:border-slate-700">
            <h2 className="text-lg font-bold text-dark dark:text-white mb-2">Indonesian Content</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Auto-generated from English. You can edit before save.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Title (ID)</label>
                {translatingFields.title && <p className="text-xs text-amber-600 mb-2">Translating...</p>}
                <input
                  type="text"
                  name="title"
                  value={localizedFormData.title}
                  onChange={handleLocalizedInputChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Issuer (ID)</label>
                {translatingFields.issuer && <p className="text-xs text-amber-600 mb-2">Translating...</p>}
                <input
                  type="text"
                  name="issuer"
                  value={localizedFormData.issuer}
                  onChange={handleLocalizedInputChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Category (ID)</label>
                {translatingFields.category && <p className="text-xs text-amber-600 mb-2">Translating...</p>}
                <input
                  type="text"
                  name="category"
                  value={localizedFormData.category}
                  onChange={handleLocalizedInputChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Alt Text (ID)</label>
                {translatingFields.alt && <p className="text-xs text-amber-600 mb-2">Translating...</p>}
                <input
                  type="text"
                  name="alt"
                  value={localizedFormData.alt}
                  onChange={handleLocalizedInputChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-200 dark:border-slate-700">
            <h2 className="text-lg font-bold text-dark dark:text-white mb-4">Visual Settings</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Badge Emoji</label>
                <input
                  type="text"
                  name="badge"
                  value={formData.badge}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Color Gradient</label>
                <select
                  name="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                >
                  <option value="from-blue-500 to-blue-600">Blue</option>
                  <option value="from-green-500 to-green-600">Green</option>
                  <option value="from-purple-500 to-purple-600">Purple</option>
                  <option value="from-yellow-500 to-yellow-600">Yellow</option>
                  <option value="from-cyan-500 to-cyan-600">Cyan</option>
                  <option value="from-pink-500 to-pink-600">Pink</option>
                  <option value="from-orange-500 to-orange-600">Orange</option>
                  <option value="from-slate-500 to-slate-600">Slate</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/50 px-4 py-2.5">
                <p className="text-xs uppercase tracking-wide text-gray-500">Display Order (Auto)</p>
                <p className="text-sm font-bold text-dark dark:text-white mt-1">{autoOrder}</p>
                <p className="text-xs text-gray-500 mt-1">Automatically set to the next available order.</p>
              </div>
              <div className="flex items-center gap-3 pt-3 md:pt-8">
                <input
                  id="isPublished"
                  type="checkbox"
                  name="isPublished"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData((prev) => ({ ...prev, isPublished: e.target.checked }))}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="isPublished" className="text-sm font-bold text-gray-700 dark:text-gray-300">
                  Publish immediately
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Certificate Thumbnail *</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full text-sm text-gray-600 dark:text-gray-300"
              />
            </div>
            {imagePreview && (
              <div className="mt-3">
                <p className="text-xs text-gray-500 mb-2">Image preview:</p>
                <img src={imagePreview} alt="Preview" className="w-56 h-32 object-cover rounded-lg border" />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <Link
              to="/admin/certifications"
              className="px-5 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 font-semibold"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-lg bg-primary text-white font-bold hover:bg-secondary disabled:opacity-70"
            >
              {loading ? `Uploading... ${uploadProgress}%` : "Publish Certification"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCertification;
