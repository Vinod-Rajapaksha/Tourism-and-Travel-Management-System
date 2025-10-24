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

export const getDailyReport = (days = 30) => api.get(`/reports/daily?days=${days}`).then((r) => r.data);
export const getWeeklyReport = (weeks = 12) => api.get(`/reports/weekly?weeks=${weeks}`).then((r) => r.data);
export const getMonthlyReport = (months = 12) => api.get(`/reports/monthly?months=${months}`).then((r) => r.data);

export const getTotalConfirmedAmount = () => api.get("/payments/reports/total-amount").then((r) => r.data);
export const getTotalConfirmedCount = () => api.get("/payments/reports/total-count").then((r) => r.data);
export const getPackageTotals = () => api.get("/payments/reports/package-totals").then((r) => r.data);
export const getPackageQuantities = () => api.get("/payments/reports/package-quantities").then((r) => r.data);

export const getPaymentsByDateRange = (startDate, endDate) =>
  api.get(`/payments/reports/date-range?startDate=${startDate}&endDate=${endDate}`).then((r) => r.data);

export default {
  getDailyReport,
  getWeeklyReport,
  getMonthlyReport,
  getTotalConfirmedAmount,
  getTotalConfirmedCount,
  getPackageTotals,
  getPackageQuantities,
  getPaymentsByDateRange,
};