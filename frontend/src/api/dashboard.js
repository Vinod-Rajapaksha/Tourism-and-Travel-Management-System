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

export async function fetchDashboard({ months = 8, recent = 7, activeDays = 90, packageMonths = 6, packageLimit = 5 } = {}) {
  const { data } = await api.get("/manager/dashboard", {
    params: { months, recent, activeDays, packageMonths, packageLimit },
  });
  return data;
}
