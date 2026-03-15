const normalizeEmail = (value) => String(value || "").trim().toLowerCase();

const parseAdminEmails = () => {
  const raw = import.meta.env.VITE_ADMIN_EMAILS || "";
  return raw
    .split(",")
    .map((email) => normalizeEmail(email))
    .filter(Boolean);
};

export const isAdminUser = (user) => {
  if (!user?.email) return false;

  const adminEmails = parseAdminEmails();

  // If allowlist is empty, fall back to authenticated-only behavior to avoid lockout.
  if (adminEmails.length === 0) return true;

  return adminEmails.includes(normalizeEmail(user.email));
};

export const getAdminEmails = () => parseAdminEmails();
