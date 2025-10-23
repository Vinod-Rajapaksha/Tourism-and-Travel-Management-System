
// Small helpers to parse and check JWT expiry (no external deps)

export function parseJwt(token) {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    return decoded;
  } catch (e) {
    return null;
  }
}

export function isExpired(token) {
  if (!token) return true;
  const decoded = parseJwt(token);
  if (!decoded || !decoded.exp) return true;
  // exp is in seconds since epoch
  return Date.now() >= decoded.exp * 1000;
}
