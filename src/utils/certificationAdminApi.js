const CERTIFICATIONS_FUNCTION_URL = "/.netlify/functions/certifications";

const normalizeResponseError = async (response) => {
  try {
    const data = await response.json();
    const error = new Error(data?.error || "Certification write failed.");
    error.code = data?.code || data?.errorCode || "unknown";
    return error;
  } catch {
    const error = new Error("Certification write failed.");
    error.code = response.status === 401 ? "unauthenticated" : "unknown";
    return error;
  }
};

const callCertificationAdminAction = async ({ auth, action, id, payload, ids, items }) => {
  const currentUser = auth?.currentUser;
  if (!currentUser) {
    const error = new Error("You must be signed in to update certifications.");
    error.code = "unauthenticated";
    throw error;
  }

  const token = await currentUser.getIdToken(true);

  const response = await fetch(CERTIFICATIONS_FUNCTION_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ action, id, payload, ids, items }),
  });

  if (!response.ok) {
    throw await normalizeResponseError(response);
  }

  return response.json();
};

export const createCertification = ({ auth, payload }) =>
  callCertificationAdminAction({ auth, action: "create", payload });

export const updateCertification = ({ auth, id, payload }) =>
  callCertificationAdminAction({ auth, action: "update", id, payload });

export const deleteCertification = ({ auth, id }) =>
  callCertificationAdminAction({ auth, action: "delete", id });

export const bulkUpdateCertifications = ({ auth, ids, payload }) =>
  callCertificationAdminAction({ auth, action: "bulkUpdate", ids, payload });

export const reorderCertifications = ({ auth, items }) =>
  callCertificationAdminAction({ auth, action: "reorder", items });