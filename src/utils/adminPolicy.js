export const allowsAdmin = ({ claims = {}, email, emailVerified }, allowlist = []) => (
  claims.admin === true || (
    emailVerified === true
    && Boolean(email)
    && allowlist.includes(String(email).trim().toLowerCase())
  )
);
