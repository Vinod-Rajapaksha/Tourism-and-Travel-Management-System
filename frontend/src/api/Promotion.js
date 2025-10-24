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

export const getPromotions = () => api.get("/promotions").then((r) => r.data);
export const getActivePromotions = () => api.get("/promotions/active").then((r) => r.data);
export const createPromotion = (promotion) => api.post("/promotions", promotion).then((r) => r.data);
export const updatePromotion = (id, promotion) => api.put(`/promotions/${id}`, promotion).then((r) => r.data);
export const deletePromotion = (id) => api.delete(`/promotions/${id}`).then((r) => r.data);

export default {
  getPromotions,
  getActivePromotions,
  createPromotion,
  updatePromotion,
  deletePromotion
};
