import { webHandler } from './_shared/webHandler.js';
import { getAdminApp } from './_shared/admin.js';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';
import { json as sendJson, readJson, requireAdmin, errorResponse } from './_shared/security.js';
import { validateCertificationInput } from './_shared/certificationInput.js';
export { isAllowedAdmin } from './_shared/security.js';

export const handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return sendJson(200, { ok: true });
  }

  if (event.httpMethod !== "POST") {
    return sendJson(405, { error: "Method not allowed", code: "method-not-allowed" });
  }

  try {
    const body = validateCertificationInput(readJson(event));
    await requireAdmin(event);
    const app = getAdminApp();

    const db = getFirestore(app);
    const now = FieldValue.serverTimestamp();
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
    return errorResponse(error);
  }
};

export const config = { path: '/api/certifications', rateLimit: { windowLimit: 30, windowSize: 60, aggregateBy: ['ip', 'domain'] } };

export default webHandler(handler);
