import axios from "axios";

const api = axios.create({ baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:8080/api" });

// attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let isRefreshing = false;
let queue = [];

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    const status = error?.response?.status;

    if (status === 401 && !original._retry) {
      original._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const refreshToken = localStorage.getItem("refreshToken");
          const { data } = await axios.post(
            (process.env.REACT_APP_API_BASE_URL || "http://localhost:8080/api") + "/auth/refresh",
            { refreshToken }
          );
          localStorage.setItem("token", data.accessToken);
          queue.forEach((cb) => cb(data.accessToken));
          queue = [];
          return api(original);
        } catch (e) {
          queue = [];
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login";
          return Promise.reject(e);
        } finally {
          isRefreshing = false;
        }
      } else {
        // wait for refresh to complete
        return new Promise((resolve) => {
          queue.push(() => resolve(api(original)));
        });
      }
    }

    return Promise.reject(error);
  }
);

export default api;