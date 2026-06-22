/* ── Shared cookie config ── */
export const getCookieOptions = () => {
  // SameSite=None requires Secure for cross-site cookies.
  // Localhost is treated as a secure context in modern browsers.
  return {
    httpOnly: true,
    secure: true,
    sameSite: "lax", // Required for cross-origin requests from React dev server
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };
};

export const getAccessCookieOptions = () => {
  return {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: 15 * 60 * 1000, // 15 minutes
  };
};