import api from "./api";

// --- Admin Login ---
export async function login({ email, password }) {
  const { data } = await api.post("/auth/admin/login", { email, password });
  return data;
}

// --- Tourist Login & Register ---
export async function loginTourist({ email, password }) {
  const { data } = await api.post("/auth/tourist/login", { email, password });
  return data;
}

export async function registerTourist(payload) {
  const { data } = await api.post("/auth/tourist/register", payload);
  return data;
}

// --- Guide Login, Register & Status ---
export async function loginGuide({ email, password }) {
  const { data } = await api.post("/auth/guide/login", { email, password });
  return data;
}

export async function registerGuide(payload) {
  const { data } = await api.post("/auth/guide/register", payload);
  return data;
}

export async function checkGuideStatus(email) {
  const { data } = await api.get(
    `/auth/guide/status?email=${encodeURIComponent(email)}`,
  );
  return data;
}

// --- Common ---
export async function getProfile(token) {
  const { data } = await api.get("/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

export async function logout() {
  try {
    await api.post("/auth/logout");
  } catch {}
}
