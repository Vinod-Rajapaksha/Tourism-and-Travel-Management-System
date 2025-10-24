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

export const getPayments = () => api.get("/payments").then((r) => r.data);
export const getPaymentById = (id) => api.get(`/payments/${id}`).then((r) => r.data);
export const getConfirmedPayments = () => api.get("/payments/confirmed").then((r) => r.data);
export const getPaymentsByStatus = (status) => api.get(`/payments/status/${status}`).then((r) => r.data);
export const createPayment = (payload) => api.post("/payments", payload).then((r) => r.data);
export const updatePayment = (id, payload) => api.put(`/payments/${id}`, payload).then((r) => r.data);
export const deletePayment = (id) => api.delete(`/payments/${id}`).then((r) => r.data);

export default {
  getPayments,
  getPaymentById,
  getConfirmedPayments,
  getPaymentsByStatus,
  createPayment,
  updatePayment,
  deletePayment,
};
