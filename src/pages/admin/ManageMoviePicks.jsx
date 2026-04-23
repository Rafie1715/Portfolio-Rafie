import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import { useFirebaseInit } from "../../hooks/useFirebaseInit";
import { useToast } from "../../components/ToastProvider";

const defaultFormState = {
  movieId: "",
  note: "",
  order: "",
  isPublished: true,
};

const normalizeOrder = (value, fallback = Number.MAX_SAFE_INTEGER) => {
  if (typeof value === "number") return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (!Number.isNaN(parsed)) return parsed;
  }
  return fallback;
};

const ManageMoviePicks = () => {
  const { dbFirestore } = useFirebaseInit("dbFirestore");
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState("picks");
  const [picks, setPicks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [savingId, setSavingId] = useState("");
  const [form, setForm] = useState(defaultFormState);

  const isWatchlist = activeTab === "watchlist";
  const collectionName = isWatchlist ? "movieWatchlist" : "moviePicks";
  const managerTitle = isWatchlist ? "Watchlist Manager" : "Rafie's Picks Manager";
  const addTitle = isWatchlist ? "Add Watchlist Item" : "Add New Pick";
  const listTitle = isWatchlist ? "Watchlist Items" : "Existing Picks";
  const itemLabel = isWatchlist ? "item" : "pick";

  const fetchPicks = async ({ silent = false } = {}) => {
    if (!dbFirestore) return;

    try {
      setLoading(true);
      const snapshot = await getDocs(collection(dbFirestore, collectionName));
      const list = snapshot.docs
        .map((entry) => ({ id: entry.id, ...entry.data() }))
        .sort((a, b) => {
          const orderDiff = normalizeOrder(a?.order) - normalizeOrder(b?.order);
          if (orderDiff !== 0) return orderDiff;

          const left = a?.createdAt?.toDate ? a.createdAt.toDate().getTime() : 0;
          const right = b?.createdAt?.toDate ? b.createdAt.toDate().getTime() : 0;
          return right - left;
        })
        .map((item) => ({
          ...item,
          movieId: Number(item.movieId || 0),
          note: item.note || "",
          order: Number.isFinite(Number(item.order)) ? Number(item.order) : "",
          isPublished: item.isPublished !== false,
        }));

      setPicks(list);
      if (!silent) {
        showToast({
          type: "success",
          title: `${isWatchlist ? "Watchlist" : "Movie picks"} refreshed`,
          message: `Latest ${isWatchlist ? "watchlist items" : "curated picks"} are loaded.`,
          duration: 2200,
        });
      }
    } catch (error) {
      console.error(`Error fetching ${collectionName}:`, error);
      showToast({
        type: "error",
        title: "Refresh failed",
        message: `Could not load ${isWatchlist ? "watchlist" : "movie picks"} from Firestore.`,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPicks({ silent: true });
  }, [dbFirestore, collectionName]);

  const publishedCount = useMemo(
    () => picks.filter((item) => item.isPublished !== false).length,
    [picks]
  );

  const resetForm = () => {
    setForm(defaultFormState);
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    if (!dbFirestore || submitting) return;

    const movieId = Number.parseInt(form.movieId, 10);
    if (!Number.isFinite(movieId) || movieId <= 0) {
      showToast({ type: "error", title: "Invalid movie ID", message: "Enter a valid TMDB movie ID." });
      return;
    }

    const orderValue = form.order.trim() === "" ? null : Number.parseInt(form.order, 10);
    if (orderValue !== null && (!Number.isFinite(orderValue) || orderValue < 1)) {
      showToast({ type: "error", title: "Invalid order", message: "Order must be 1 or greater." });
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        movieId,
        note: form.note.trim(),
        order: orderValue ?? picks.length + 1,
        isPublished: form.isPublished,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const docRef = await addDoc(collection(dbFirestore, collectionName), payload);

      setPicks((prev) =>
        [...prev, { ...payload, id: docRef.id }].sort(
          (a, b) => normalizeOrder(a?.order) - normalizeOrder(b?.order)
        )
      );
      resetForm();
      showToast({
        type: "success",
        title: isWatchlist ? "Watchlist item added" : "Pick added",
        message: isWatchlist ? "Movie has been added to watchlist." : "Movie pick has been added to Rafie's Picks.",
      });
    } catch (error) {
      console.error(`Error adding ${itemLabel}:`, error);
      showToast({
        type: "error",
        title: "Create failed",
        message: `Could not create ${itemLabel}.`,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSave = async (pick) => {
    if (!dbFirestore || savingId) return;

    const movieId = Number.parseInt(String(pick.movieId), 10);
    const orderValue = Number.parseInt(String(pick.order), 10);

    if (!Number.isFinite(movieId) || movieId <= 0) {
      showToast({ type: "error", title: "Invalid movie ID", message: "Enter a valid TMDB movie ID." });
      return;
    }

    if (!Number.isFinite(orderValue) || orderValue < 1) {
      showToast({ type: "error", title: "Invalid order", message: "Order must be 1 or greater." });
      return;
    }

    try {
      setSavingId(pick.id);
      await updateDoc(doc(dbFirestore, collectionName, pick.id), {
        movieId,
        note: String(pick.note || "").trim(),
        order: orderValue,
        isPublished: pick.isPublished !== false,
        updatedAt: new Date(),
      });

      setPicks((prev) =>
        [...prev]
          .map((item) =>
            item.id === pick.id
              ? { ...item, movieId, note: String(pick.note || "").trim(), order: orderValue }
              : item
          )
          .sort((a, b) => normalizeOrder(a?.order) - normalizeOrder(b?.order))
      );

      showToast({ type: "success", title: isWatchlist ? "Item saved" : "Pick saved", message: `${isWatchlist ? "Watchlist item" : "Movie pick"} updated successfully.` });
    } catch (error) {
      console.error(`Error updating ${itemLabel}:`, error);
      showToast({ type: "error", title: "Save failed", message: `Could not update ${itemLabel}.` });
    } finally {
      setSavingId("");
    }
  };

  const handleTogglePublish = async (pick) => {
    if (!dbFirestore || savingId) return;

    const nextState = pick.isPublished === false;
    try {
      setSavingId(pick.id);
      await updateDoc(doc(dbFirestore, collectionName, pick.id), {
        isPublished: nextState,
        updatedAt: new Date(),
      });
      setPicks((prev) =>
        prev.map((item) => (item.id === pick.id ? { ...item, isPublished: nextState } : item))
      );
      showToast({
        type: "success",
        title: nextState ? `${isWatchlist ? "Item" : "Pick"} published` : `${isWatchlist ? "Item" : "Pick"} hidden`,
        message: nextState ? `${isWatchlist ? "Item" : "Pick"} is visible on AFK page.` : `${isWatchlist ? "Item" : "Pick"} is hidden from AFK page.`,
      });
    } catch (error) {
      console.error(`Error toggling ${itemLabel} publish state:`, error);
      showToast({ type: "error", title: "Update failed", message: "Could not update publish state." });
    } finally {
      setSavingId("");
    }
  };

  const handleDelete = async (id) => {
    if (!dbFirestore || deletingId) return;
    if (!window.confirm(`Delete this ${itemLabel}?`)) return;

    try {
      setDeletingId(id);
      await deleteDoc(doc(dbFirestore, collectionName, id));
      setPicks((prev) => prev.filter((item) => item.id !== id));
      showToast({ type: "success", title: `${isWatchlist ? "Item" : "Pick"} deleted`, message: `${isWatchlist ? "Watchlist item" : "Movie pick"} removed successfully.` });
    } catch (error) {
      console.error(`Error deleting ${itemLabel}:`, error);
      showToast({ type: "error", title: "Delete failed", message: `Could not delete ${itemLabel}.` });
    } finally {
      setDeletingId("");
    }
  };

  const updateDraft = (id, key, value) => {
    setPicks((prev) => prev.map((item) => (item.id === id ? { ...item, [key]: value } : item)));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark px-4 md:px-8 pt-24 pb-10">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <Link to="/admin/dashboard" className="text-gray-500 hover:text-primary mb-2 inline-block">
              ← Back to Dashboard
            </Link>
            <h1 className="text-3xl font-black dark:text-white">{managerTitle}</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Curate movie lists for AFK page by TMDB ID, note, and display order.
            </p>
          </div>

          <button
            type="button"
            onClick={() => fetchPicks()}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:border-primary hover:text-primary transition"
          >
            Refresh
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-4">
            <p className="text-xs uppercase tracking-wider text-gray-500">Total Picks</p>
            <p className="text-2xl font-black text-dark dark:text-white mt-1">{picks.length}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-4">
            <p className="text-xs uppercase tracking-wider text-gray-500">Published Picks</p>
            <p className="text-2xl font-black text-dark dark:text-white mt-1">{publishedCount}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-3 inline-flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("picks")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              !isWatchlist
                ? "bg-primary text-white"
                : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700"
            }`}
          >
            Watched Picks
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("watchlist")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              isWatchlist
                ? "bg-primary text-white"
                : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700"
            }`}
          >
            Want to Watch
          </button>
        </div>

        <form
          onSubmit={handleCreate}
          className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-5 space-y-4"
        >
          <h2 className="text-lg font-bold dark:text-white">{addTitle}</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">TMDB Movie ID</label>
              <input
                type="number"
                min="1"
                value={form.movieId}
                onChange={(event) => setForm((prev) => ({ ...prev, movieId: event.target.value }))}
                placeholder="e.g. 299534"
                className="w-full rounded-lg border border-gray-300 dark:border-slate-600 px-3 py-2.5 bg-white dark:bg-slate-900 text-dark dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">Order</label>
              <input
                type="number"
                min="1"
                value={form.order}
                onChange={(event) => setForm((prev) => ({ ...prev, order: event.target.value }))}
                placeholder="Auto"
                className="w-full rounded-lg border border-gray-300 dark:border-slate-600 px-3 py-2.5 bg-white dark:bg-slate-900 text-dark dark:text-white"
              />
            </div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300 mt-7">
              <input
                type="checkbox"
                checked={form.isPublished}
                onChange={(event) => setForm((prev) => ({ ...prev, isPublished: event.target.checked }))}
                className="w-4 h-4"
              />
              Publish now
            </label>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">Note</label>
            <textarea
              value={form.note}
              onChange={(event) => setForm((prev) => ({ ...prev, note: event.target.value }))}
              rows={2}
                placeholder={isWatchlist ? "Why you want to watch this movie..." : "Why this movie is on your picks..."}
              className="w-full rounded-lg border border-gray-300 dark:border-slate-600 px-3 py-2.5 bg-white dark:bg-slate-900 text-dark dark:text-white"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="bg-primary text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-secondary disabled:opacity-70"
            >
              {submitting ? "Saving..." : isWatchlist ? "Add to Watchlist" : "Add Pick"}
            </button>
          </div>
        </form>

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-slate-700">
            <h2 className="text-lg font-bold dark:text-white">{listTitle}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              You can edit movie ID, note, and order inline, then click Save.
            </p>
          </div>

          {loading ? (
            <p className="p-8 text-center text-gray-500">Loading {isWatchlist ? "watchlist..." : "picks..."}</p>
          ) : picks.length === 0 ? (
            <p className="p-8 text-center text-gray-500">No {isWatchlist ? "watchlist items" : "picks"} yet. Add your first one above.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 dark:bg-slate-900/40">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">TMDB ID</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Order</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Note</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Status</th>
                    <th className="text-right px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {picks.map((pick) => (
                    <tr key={pick.id} className="border-t border-gray-100 dark:border-slate-700/70">
                      <td className="px-4 py-3 align-top">
                        <input
                          type="number"
                          min="1"
                          value={pick.movieId}
                          onChange={(event) => updateDraft(pick.id, "movieId", event.target.value)}
                          className="w-28 rounded-lg border border-gray-300 dark:border-slate-600 px-2.5 py-2 bg-white dark:bg-slate-900 text-dark dark:text-white"
                        />
                      </td>
                      <td className="px-4 py-3 align-top">
                        <input
                          type="number"
                          min="1"
                          value={pick.order}
                          onChange={(event) => updateDraft(pick.id, "order", event.target.value)}
                          className="w-24 rounded-lg border border-gray-300 dark:border-slate-600 px-2.5 py-2 bg-white dark:bg-slate-900 text-dark dark:text-white"
                        />
                      </td>
                      <td className="px-4 py-3 align-top min-w-[300px]">
                        <textarea
                          value={pick.note || ""}
                          rows={2}
                          onChange={(event) => updateDraft(pick.id, "note", event.target.value)}
                          className="w-full rounded-lg border border-gray-300 dark:border-slate-600 px-2.5 py-2 bg-white dark:bg-slate-900 text-dark dark:text-white"
                        />
                      </td>
                      <td className="px-4 py-3 align-top">
                        <button
                          type="button"
                          onClick={() => handleTogglePublish(pick)}
                          disabled={savingId === pick.id}
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                            pick.isPublished
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                              : "bg-gray-200 text-gray-700 dark:bg-slate-700 dark:text-gray-300"
                          }`}
                        >
                          {pick.isPublished ? "Published" : "Hidden"}
                        </button>
                      </td>
                      <td className="px-4 py-3 align-top">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleSave(pick)}
                            disabled={savingId === pick.id}
                            className="px-3 py-2 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-secondary disabled:opacity-70"
                          >
                            {savingId === pick.id ? "Saving..." : "Save"}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(pick.id)}
                            disabled={deletingId === pick.id}
                            className="px-3 py-2 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-700 disabled:opacity-70"
                          >
                            {deletingId === pick.id ? "Deleting..." : "Delete"}
                          </button>
                        </div>
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

export default ManageMoviePicks;
