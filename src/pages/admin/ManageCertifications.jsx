import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { useFirebaseInit } from "../../hooks/useFirebaseInit";
import { useToast } from "../../components/ToastProvider";
import { certifications as localCertifications } from "../../data/certifications";
import {
  bulkUpdateCertifications,
  deleteCertification,
  reorderCertifications,
  updateCertification,
} from "../../utils/certificationAdminApi";

const ManageCertifications = () => {
  const { dbFirestore, auth } = useFirebaseInit("all");
  const { showToast } = useToast();

  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState("");
  const [publishingId, setPublishingId] = useState("");
  const [draggingId, setDraggingId] = useState("");
  const [savingOrder, setSavingOrder] = useState(false);
  const [selectedCertificationIds, setSelectedCertificationIds] = useState([]);
  const [bulkPublishing, setBulkPublishing] = useState(false);

  const getText = (value) => {
    if (!value) return "";
    if (typeof value === "object") return value.en || value.id || "";
    return String(value);
  };

  const getOrder = (cert) => {
    if (typeof cert?.order === "number") return cert.order;
    if (typeof cert?.order === "string" && cert.order.trim() !== "") {
      const parsed = Number(cert.order);
      if (!Number.isNaN(parsed)) return parsed;
    }
    return Number.MAX_SAFE_INTEGER;
  };

  const fetchCertifications = async ({ silent = false } = {}) => {
    if (!dbFirestore) return;

    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(dbFirestore, "certifications"));
      const list = querySnapshot.docs
        .map((entry) => ({ id: entry.id, ...entry.data() }))
        .sort((a, b) => {
          const orderDiff = getOrder(a) - getOrder(b);
          if (orderDiff !== 0) return orderDiff;
          const left = a?.createdAt?.toDate ? a.createdAt.toDate().getTime() : 0;
          const right = b?.createdAt?.toDate ? b.createdAt.toDate().getTime() : 0;
          return right - left;
        });
      setCertifications(list);

      if (!silent) {
        showToast({
          type: "success",
          title: "Certifications refreshed",
          message: "CMS certification list is up to date.",
          duration: 2200,
        });
      }
    } catch (error) {
      console.error("Error fetching certifications:", error);
      showToast({
        type: "error",
        title: "Refresh failed",
        message: "Could not load certifications from CMS.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertifications({ silent: true });
  }, [dbFirestore]);

  useEffect(() => {
    setSelectedCertificationIds((prev) => prev.filter((id) => certifications.some((item) => item.id === id)));
  }, [certifications]);

  const allCertifications = useMemo(() => {
    const normalizedLocal = localCertifications.map((cert, index) => ({
      ...cert,
      id: `local-${cert.id || index + 1}`,
      source: "local",
      isPublished: true,
    }));

    const normalizedCms = certifications.map((cert) => ({ ...cert, source: "cms" }));
    return [...normalizedCms, ...normalizedLocal];
  }, [certifications]);

  const filteredCertifications = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return allCertifications;

    return allCertifications.filter((cert) => {
      const title = getText(cert.title).toLowerCase();
      const issuer = getText(cert.issuer).toLowerCase();
      const category = getText(cert.category).toLowerCase();
      const source = String(cert.source || "").toLowerCase();
      return title.includes(keyword) || issuer.includes(keyword) || category.includes(keyword) || source.includes(keyword);
    });
  }, [allCertifications, search]);

  const handleDelete = async (id) => {
    if (!dbFirestore || deletingId) return;
    if (!window.confirm("Delete this certification?")) return;

    try {
      setDeletingId(id);
      await deleteCertification({ auth, id });
      setCertifications((prev) => prev.filter((item) => item.id !== id));
      showToast({
        type: "success",
        title: "Certification deleted",
        message: "The certification was removed from CMS.",
      });
    } catch (error) {
      console.error("Error deleting certification:", error);
      showToast({
        type: "error",
        title: "Delete failed",
        message: "Failed to delete the selected certification.",
      });
    } finally {
      setDeletingId("");
    }
  };

  const handleTogglePublish = async (cert) => {
    if (!dbFirestore || publishingId) return;
    const nextPublishedState = cert.isPublished !== false ? false : true;

    try {
      setPublishingId(cert.id);
      await updateCertification({ auth, id: cert.id, payload: { isPublished: nextPublishedState } });

      setCertifications((prev) =>
        prev.map((item) =>
          item.id === cert.id ? { ...item, isPublished: nextPublishedState, updatedAt: new Date() } : item
        )
      );

      showToast({
        type: "success",
        title: nextPublishedState ? "Certification published" : "Certification unpublished",
        message: nextPublishedState
          ? "Certification is now visible on public page."
          : "Certification is now hidden from public page.",
      });
    } catch (error) {
      console.error("Error toggling publish state:", error);
      showToast({
        type: "error",
        title: "Update failed",
        message: "Could not update publish status.",
      });
    } finally {
      setPublishingId("");
    }
  };

  const handleBulkPublish = async (publishState) => {
    if (!dbFirestore || bulkPublishing || selectedCertificationIds.length === 0) return;

    const actionLabel = publishState ? "publish" : "unpublish";
    if (!window.confirm(`${actionLabel} ${selectedCertificationIds.length} selected certification(s)?`)) return;

    try {
      setBulkPublishing(true);
      await bulkUpdateCertifications({ auth, ids: selectedCertificationIds, payload: { isPublished: publishState } });

      setCertifications((prev) =>
        prev.map((item) =>
          selectedCertificationIds.includes(item.id)
            ? { ...item, isPublished: publishState, updatedAt: new Date() }
            : item
        )
      );

      showToast({
        type: "success",
        title: publishState ? "Bulk publish complete" : "Bulk unpublish complete",
        message: `${selectedCertificationIds.length} certification(s) updated.`,
      });
      setSelectedCertificationIds([]);
    } catch (error) {
      console.error("Error during bulk publish/unpublish:", error);
      showToast({
        type: "error",
        title: "Bulk update failed",
        message: "Could not update selected certifications.",
      });
    } finally {
      setBulkPublishing(false);
    }
  };

  const persistOrder = async (orderedList) => {
    if (!dbFirestore) return;
    try {
      setSavingOrder(true);
      const cmsOrderedList = orderedList
        .filter((item) => item.source === "cms")
        .map((item, index) => ({ id: item.id, order: index + 1 }));

      await reorderCertifications({ auth, items: cmsOrderedList });
      setCertifications(orderedList.map((item, index) => ({ ...item, order: index + 1 })));
      showToast({
        type: "success",
        title: "Order updated",
        message: "Certification sequence has been saved.",
      });
    } catch (error) {
      console.error("Error saving order:", error);
      showToast({
        type: "error",
        title: "Order save failed",
        message: "Could not save drag-and-drop order.",
      });
    } finally {
      setSavingOrder(false);
      setDraggingId("");
    }
  };

  const handleDrop = async (targetId) => {
    if (!draggingId || draggingId === targetId || savingOrder || search.trim()) return;

    const updated = [...certifications];
    const draggedIndex = updated.findIndex((item) => item.id === draggingId);
    const targetIndex = updated.findIndex((item) => item.id === targetId);
    if (draggedIndex < 0 || targetIndex < 0) return;

    const [draggedItem] = updated.splice(draggedIndex, 1);
    updated.splice(targetIndex, 0, draggedItem);

    setCertifications(updated);
    await persistOrder(updated);
  };

  const cmsItemsOnTable = useMemo(
    () => filteredCertifications.filter((item) => item.source === "cms").map((item) => item.id),
    [filteredCertifications]
  );

  const areAllCmsSelected =
    cmsItemsOnTable.length > 0 && cmsItemsOnTable.every((id) => selectedCertificationIds.includes(id));

  const toggleSelectAllCms = () => {
    setSelectedCertificationIds((prev) => {
      if (areAllCmsSelected) {
        return prev.filter((id) => !cmsItemsOnTable.includes(id));
      }
      return [...new Set([...prev, ...cmsItemsOnTable])];
    });
  };

  const toggleSelection = (id) => {
    setSelectedCertificationIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark px-4 md:px-8 pt-24 pb-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div>
            <Link to="/admin/dashboard" className="text-gray-500 hover:text-primary mb-2 inline-block">
              ← Back to Dashboard
            </Link>
            <h1 className="text-3xl font-black dark:text-white">Certification Manager</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Manage certification entries shown in the About page slider.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => fetchCertifications()}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:border-primary hover:text-primary transition"
            >
              Refresh
            </button>
            <Link
              to="/admin/add-certification"
              className="bg-primary text-white px-5 py-2 rounded-lg font-bold hover:bg-secondary shadow-lg"
            >
              + Add Certification
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-4">
            <p className="text-xs uppercase tracking-wider text-gray-500">Total Certifications</p>
            <p className="text-2xl font-black text-dark dark:text-white mt-1">{allCertifications.length}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-4">
            <p className="text-xs uppercase tracking-wider text-gray-500">Filtered Results</p>
            <p className="text-2xl font-black text-dark dark:text-white mt-1">{filteredCertifications.length}</p>
          </div>
        </div>

        {search.trim() && (
          <div className="mb-4 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm">
            Drag-and-drop reorder is temporarily disabled while search filter is active.
          </div>
        )}

        <div className="mb-4 p-3 rounded-lg bg-sky-50 border border-sky-200 text-sky-800 text-sm">
          Drag using the grip icon in the Order column to reorder CMS certifications.
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-slate-700">
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_auto] gap-3">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title, issuer, or category..."
                className="w-full rounded-lg border border-gray-300 dark:border-slate-600 px-4 py-2.5 bg-white dark:bg-slate-900 text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
              {selectedCertificationIds.length > 0 && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleBulkPublish(true)}
                    disabled={bulkPublishing}
                    className="px-3 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition disabled:opacity-70"
                  >
                    {bulkPublishing ? "Updating..." : `Publish Selected (${selectedCertificationIds.length})`}
                  </button>
                  <button
                    onClick={() => handleBulkPublish(false)}
                    disabled={bulkPublishing}
                    className="px-3 py-2 rounded-lg bg-slate-700 text-white text-sm font-semibold hover:bg-slate-800 transition disabled:opacity-70"
                  >
                    {bulkPublishing ? "Updating..." : "Unpublish Selected"}
                  </button>
                </div>
              )}
            </div>
          </div>

          {loading ? (
            <p className="p-8 text-center">Loading data...</p>
          ) : filteredCertifications.length === 0 ? (
            <p className="p-8 text-center text-gray-500">No certifications found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-200 uppercase text-sm leading-normal">
                    <th className="py-3 px-4 text-center">
                      <input
                        type="checkbox"
                        checked={areAllCmsSelected}
                        onChange={toggleSelectAllCms}
                        disabled={cmsItemsOnTable.length === 0}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        aria-label="Select all CMS certifications"
                      />
                    </th>
                    <th className="py-3 px-4 text-center">Order</th>
                    <th className="py-3 px-6">Thumbnail</th>
                    <th className="py-3 px-6">Title</th>
                    <th className="py-3 px-6">Issuer</th>
                    <th className="py-3 px-6">Category</th>
                    <th className="py-3 px-6">Status</th>
                    <th className="py-3 px-6">Source</th>
                    <th className="py-3 px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 dark:text-gray-300 text-sm font-light">
                  {filteredCertifications.map((cert) => (
                    <tr
                      key={cert.id}
                      draggable={cert.source === "cms" && !search.trim() && !savingOrder}
                      onDragStart={() => {
                        if (cert.source === "cms") setDraggingId(cert.id);
                      }}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => {
                        if (cert.source === "cms") handleDrop(cert.id);
                      }}
                      onDragEnd={() => setDraggingId("")}
                      className="border-b border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50"
                    >
                      <td className="py-3 px-4 text-center">
                        {cert.source === "cms" ? (
                          <input
                            type="checkbox"
                            checked={selectedCertificationIds.includes(cert.id)}
                            onChange={() => toggleSelection(cert.id)}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            aria-label={`Select ${getText(cert.title) || "certification"}`}
                          />
                        ) : (
                          <span className="text-xs text-gray-300 dark:text-gray-600">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-gray-500">
                        <div className={`inline-flex items-center gap-2 ${cert.source === "cms" ? "cursor-grab active:cursor-grabbing" : ""}`}>
                          {cert.source === "cms" && <i className="fas fa-grip-vertical text-gray-400"></i>}
                          <span>{cert.source === "cms" && getOrder(cert) !== Number.MAX_SAFE_INTEGER ? getOrder(cert) : "-"}</span>
                        </div>
                      </td>
                      <td className="py-3 px-6">
                        <img
                          src={cert.img || "/images/profile.webp"}
                          alt={getText(cert.alt) || "thumb"}
                          className="w-20 h-12 object-cover rounded"
                          onError={(e) => {
                            e.currentTarget.src = "/images/profile.webp";
                          }}
                        />
                      </td>
                      <td className="py-3 px-6 font-medium">{getText(cert.title) || "Untitled"}</td>
                      <td className="py-3 px-6">{getText(cert.issuer) || "-"}</td>
                      <td className="py-3 px-6">{getText(cert.category) || "-"}</td>
                      <td className="py-3 px-6">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${cert.isPublished === false ? "bg-slate-100 text-slate-600" : "bg-emerald-100 text-emerald-700"}`}>
                          {cert.isPublished === false ? "Draft" : "Published"}
                        </span>
                      </td>
                      <td className="py-3 px-6">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase ${cert.source === "cms" ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-700"}`}>
                          {cert.source === "cms" ? "CMS" : "Local"}
                        </span>
                      </td>
                      <td className="py-3 px-6 text-center">
                        {cert.source === "cms" ? (
                          <div className="flex items-center justify-center gap-2">
                            <Link
                              to={`/admin/edit-certification/${cert.id}`}
                              className="text-blue-600 hover:text-blue-800 font-bold bg-blue-100 hover:bg-blue-200 py-1 px-3 rounded transition"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => handleTogglePublish(cert)}
                              disabled={publishingId === cert.id}
                              className={`font-bold py-1 px-3 rounded transition disabled:opacity-70 disabled:cursor-not-allowed ${cert.isPublished === false ? "text-emerald-700 hover:text-emerald-900 bg-emerald-100 hover:bg-emerald-200" : "text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200"}`}
                            >
                              {publishingId === cert.id ? "Saving..." : cert.isPublished === false ? "Publish" : "Unpublish"}
                            </button>
                            <button
                              onClick={() => handleDelete(cert.id)}
                              disabled={deletingId === cert.id}
                              className="text-red-500 hover:text-red-700 font-bold bg-red-100 hover:bg-red-200 py-1 px-3 rounded transition disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                              {deletingId === cert.id ? "Deleting..." : "Delete"}
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-500">Edit in src/data/certifications.js</span>
                        )}
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

export default ManageCertifications;
