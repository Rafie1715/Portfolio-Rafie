const admin = require("firebase-admin");

const parseAllowlist = () => {
  const raw = process.env.VITE_ADMIN_EMAILS || process.env.ADMIN_EMAILS || "";
  return raw
    .split(",")
    .map((email) => String(email || "").trim().toLowerCase())
    .filter(Boolean);
};

const getPrivateKey = () => {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY || process.env.GOOGLE_PRIVATE_KEY || "";
  return privateKey.replace(/\\n/g, "\n");
};

const getServiceAccountFromJson = () => {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON || process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON || "";
  if (!raw.trim()) return null;

  const parsed = JSON.parse(raw);
  if (!parsed.projectId || !parsed.clientEmail || !parsed.privateKey) {
    throw new Error("Invalid Firebase service account JSON.");
  }

  return {
    projectId: parsed.projectId,
    clientEmail: parsed.clientEmail,
    privateKey: String(parsed.privateKey).replace(/\\n/g, "\n"),
  };
};

const getAdminApp = () => {
  if (admin.apps.length) return admin.app();

  const serviceAccount = getServiceAccountFromJson();
  const projectId = serviceAccount?.projectId || process.env.FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID;
  const clientEmail = serviceAccount?.clientEmail || process.env.FIREBASE_CLIENT_EMAIL || process.env.GOOGLE_CLIENT_EMAIL;
  const privateKey = serviceAccount?.privateKey || getPrivateKey();

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error("Missing Firebase Admin credentials.");
  }

  return admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });
};

const sendJson = (statusCode, body) => ({
  statusCode,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Content-Type": "application/json",
  },
  body: JSON.stringify(body),
});

const isAllowedAdmin = (decodedToken) => {
  if (decodedToken?.admin === true) return true;

  const allowlist = parseAllowlist();
  const email = String(decodedToken?.email || "").trim().toLowerCase();
  if (!email || allowlist.length === 0) return false;

  return allowlist.includes(email);
};

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return sendJson(200, { ok: true });
  }

  if (event.httpMethod !== "POST") {
    return sendJson(405, { error: "Method not allowed", code: "method-not-allowed" });
  }

  try {
    const authHeader = event.headers.authorization || event.headers.Authorization || "";
    if (!authHeader.startsWith("Bearer ")) {
      return sendJson(401, { error: "Missing authorization token.", code: "unauthenticated" });
    }

    const idToken = authHeader.slice("Bearer ".length).trim();
    if (!idToken) {
      return sendJson(401, { error: "Missing authorization token.", code: "unauthenticated" });
    }

    const app = getAdminApp();
    const decodedToken = await admin.auth(app).verifyIdToken(idToken);

    if (!isAllowedAdmin(decodedToken)) {
      return sendJson(403, { error: "Account is not allowed to write certifications.", code: "permission-denied" });
    }

    const db = admin.firestore(app);
    const now = admin.firestore.FieldValue.serverTimestamp();
    const body = event.body ? JSON.parse(event.body) : {};
    const { action, id, payload = {}, ids = [], items = [] } = body;

    if (action === "create") {
      const docRef = await db.collection("certifications").add({
        ...payload,
        createdAt: now,
        updatedAt: now,
      });

      return sendJson(200, { ok: true, id: docRef.id });
    }

    if (action === "update") {
      if (!id) {
        return sendJson(400, { error: "Missing certification id.", code: "invalid-argument" });
      }

      await db.collection("certifications").doc(id).set(
        {
          ...payload,
          updatedAt: now,
        },
        { merge: true }
      );

      return sendJson(200, { ok: true, id });
    }

    if (action === "delete") {
      if (!id) {
        return sendJson(400, { error: "Missing certification id.", code: "invalid-argument" });
      }

      await db.collection("certifications").doc(id).delete();
      return sendJson(200, { ok: true, id });
    }

    if (action === "bulkUpdate") {
      if (!Array.isArray(ids) || ids.length === 0) {
        return sendJson(400, { error: "No certification ids provided.", code: "invalid-argument" });
      }

      const batch = db.batch();
      ids.forEach((certId) => {
        batch.set(
          db.collection("certifications").doc(certId),
          {
            ...payload,
            updatedAt: now,
          },
          { merge: true }
        );
      });

      await batch.commit();
      return sendJson(200, { ok: true, ids });
    }

    if (action === "reorder") {
      if (!Array.isArray(items) || items.length === 0) {
        return sendJson(400, { error: "No certification order provided.", code: "invalid-argument" });
      }

      const batch = db.batch();
      items.forEach((item) => {
        if (!item?.id) return;
        batch.set(
          db.collection("certifications").doc(item.id),
          {
            order: item.order,
            updatedAt: now,
          },
          { merge: true }
        );
      });

      await batch.commit();
      return sendJson(200, { ok: true, count: items.length });
    }

    return sendJson(400, { error: "Unsupported action.", code: "invalid-argument" });
  } catch (error) {
    console.error("certifications function error:", error);
    return sendJson(500, {
      error: error?.message || "Internal server error.",
      code: error?.code || "internal",
    });
  }
};