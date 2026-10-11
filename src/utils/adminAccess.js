export const isAdminUser = async (user) => {
  if (!user) return false;
  const { claims } = await user.getIdTokenResult(true);
  return Boolean(claims?.admin === true);
};

export const getAdminEmails = () => [];

