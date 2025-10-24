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

export const getReservations = () =>
  api.get("/reservations").then((r) => r.data);

export const getReservationById = (id) =>
  api.get(`/reservations/${id}`).then((r) => r.data);

export const updateReservationStatus = (id, status) =>
  api.put(`/reservations/${id}/status`, { status }).then((r) => r.data);

export const assignGuideToReservation = (id, guideId) =>
  api.put(`/reservations/${id}/assign-guide`, { guideId }).then((r) => r.data);

export const deleteReservation = (id) =>
  api.delete(`/reservations/${id}`).then((r) => r.data);

export const getGuides = () => api.get("/guides").then((r) => r.data);

export default {
  getReservations,
  getReservationById,
  updateReservationStatus,
  assignGuideToReservation,
  deleteReservation,
  getGuides,
};
