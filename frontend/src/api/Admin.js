import api from "../services/api";

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

export const fetchAdmins = (params = {}) =>
  api.get("/adminmanagement", { params }).then((r) => r.data);

export const createAdmin = (payload) =>
  api.post("/adminmanagement", payload).then((r) => r.data);

export const updateAdmin = (id, payload) =>
  api.put(`/adminmanagement/${id}`, payload).then((r) => r.data);

export const changeAdminPassword = (id, { currentPassword, newPassword }) =>
  api.patch(`/adminmanagement/${id}/password`, { currentPassword, newPassword })
     .then((r) => r.data);

export const deleteAdmin = (id) =>
  api.delete(`/adminmanagement/${id}`).then((r) => r.data);
