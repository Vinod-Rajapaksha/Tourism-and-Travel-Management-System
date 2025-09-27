import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem("authToken");
    }
    return Promise.reject(error);
  }
);

export const fetchClients = (params = {}) =>
  api.get("/clients", { params }).then((r) => r.data);

export const createClient = (payload) =>
  api.post("/clients", payload).then((r) => r.data);

export const updateClient = (id, payload) =>
  api.put(`/clients/${id}`, payload).then((r) => r.data);

export const changePassword = (id, { currentPassword, newPassword }) =>
  api.patch(`/clients/${id}/password`, { currentPassword, newPassword })
     .then((r) => r.data);

export const deleteClient = (id) =>
  api.delete(`/clients/${id}`).then((r) => r.data);