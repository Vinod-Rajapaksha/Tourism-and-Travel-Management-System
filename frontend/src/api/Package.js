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

export const getAllPackages = () => api.get("/packages").then((r) => r.data);
export const getPackageById = (id) => api.get(`/packages/${id}`).then((r) => r.data);
export const createPackage = (data) => api.post("/packages", data).then((r) => r.data);
export const updatePackage = (id, data) => api.put(`/packages/${id}`, data).then((r) => r.data);
export const deletePackage = (id) => api.delete(`/packages/${id}`).then((r) => r.data);
export const getMostPopularPackage = () => api.get("/packages/most-popular").then((r) => r.data);

export default {
  getAllPackages,
  getPackageById,
  createPackage,
  updatePackage,
  deletePackage,
  getMostPopularPackage
};
