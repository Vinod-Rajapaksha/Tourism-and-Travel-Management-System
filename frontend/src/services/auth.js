import api from "./api";

export async function login({ email , password }) {
  const { data } = await api.post("/auth/admin/login", { email , password });
  return data;
}

export async function getProfile(token) {
  const { data } = await api.get("/auth/me", { headers: { Authorization: `Bearer ${token}` } });
  return data; 
}

export async function logout() {
  try { await api.post("/auth/logout"); } catch {}
}