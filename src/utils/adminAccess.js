import { allowsAdmin } from './adminPolicy';
const normalizeEmail = (value) => String(value || "").trim().toLowerCase();

const parseAdminEmails = () => {
  const raw = import.meta.env.VITE_ADMIN_EMAILS || "";
  return raw
    .split(",")
    .map((email) => normalizeEmail(email))
    .filter(Boolean);
};

export const isAdminUser = async (user) => {
  if (!user) return false;
  const { claims } = await user.getIdTokenResult();
  return allowsAdmin({ claims, email: user.email, emailVerified: user.emailVerified }, parseAdminEmails());
};

export const getAdminEmails = () => parseAdminEmails();
