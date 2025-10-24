import axios from "axios";

const api = axios.create({ 
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:8080/api" 
});

// Add request interceptor to include JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle authentication errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear invalid token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Only redirect if we're not already on a public page
      if (!window.location.pathname.includes('/auth/') && !window.location.pathname.includes('/customer/packages')) {
        // Show big error message before redirect
        const errorDiv = document.createElement('div');
        errorDiv.innerHTML = `
          <div style="
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
          ">
            <div style="
              background: linear-gradient(135deg, rgba(244, 67, 54, 0.95) 0%, rgba(229, 57, 53, 0.95) 100%);
              border: 3px solid #d32f2f;
              border-radius: 20px;
              padding: 3rem;
              text-align: center;
              color: white;
              max-width: 500px;
              box-shadow: 0 20px 40px rgba(244, 67, 54, 0.3);
              animation: shake 0.5s ease-in-out;
            ">
              <h2 style="font-size: 2rem; margin-bottom: 1rem;">🚨 Session Expired!</h2>
              <p style="font-size: 1.2rem; margin-bottom: 2rem;">Your session has expired. Please login again to continue.</p>
              <button onclick="this.parentElement.parentElement.remove(); window.location.href='/auth/customer/login';" 
                style="
                  background: rgba(255, 255, 255, 0.2);
                  border: none;
                  color: white;
                  padding: 1rem 2rem;
                  border-radius: 10px;
                  font-size: 1.1rem;
                  cursor: pointer;
                  font-weight: bold;
                ">
                🔄 Go to Login
              </button>
            </div>
          </div>
          <style>
            @keyframes shake {
              0%, 100% { transform: translateX(0); }
              10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
              20%, 40%, 60%, 80% { transform: translateX(5px); }
            }
          </style>
        `;
        document.body.appendChild(errorDiv);
        
        // Auto redirect after 5 seconds
        setTimeout(() => {
          window.location.href = '/auth/customer/login';
        }, 5000);
      }
    } else if (error.response?.status === 403) {
      // Show access denied error
      const errorDiv = document.createElement('div');
      errorDiv.innerHTML = `
        <div style="
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        ">
          <div style="
            background: linear-gradient(135deg, rgba(255, 152, 0, 0.95) 0%, rgba(255, 143, 0, 0.95) 100%);
            border: 3px solid #f57c00;
            border-radius: 20px;
            padding: 3rem;
            text-align: center;
            color: white;
            max-width: 500px;
            box-shadow: 0 20px 40px rgba(255, 152, 0, 0.3);
            animation: shake 0.5s ease-in-out;
          ">
            <h2 style="font-size: 2rem; margin-bottom: 1rem;">⚠️ Access Denied!</h2>
            <p style="font-size: 1.2rem; margin-bottom: 2rem;">You don't have permission to access this resource.</p>
            <button onclick="this.parentElement.parentElement.remove(); window.history.back();" 
              style="
                background: rgba(255, 255, 255, 0.2);
                border: none;
                color: white;
                padding: 1rem 2rem;
                border-radius: 10px;
                font-size: 1.1rem;
                cursor: pointer;
                font-weight: bold;
              ">
              ← Go Back
            </button>
          </div>
        </div>
        <style>
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
          }
        </style>
      `;
      document.body.appendChild(errorDiv);
    } else if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
      // Show network error
      const errorDiv = document.createElement('div');
      errorDiv.innerHTML = `
        <div style="
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        ">
          <div style="
            background: linear-gradient(135deg, rgba(33, 150, 243, 0.95) 0%, rgba(30, 136, 229, 0.95) 100%);
            border: 3px solid #1976d2;
            border-radius: 20px;
            padding: 3rem;
            text-align: center;
            color: white;
            max-width: 500px;
            box-shadow: 0 20px 40px rgba(33, 150, 243, 0.3);
            animation: shake 0.5s ease-in-out;
          ">
            <h2 style="font-size: 2rem; margin-bottom: 1rem;">🌐 Network Error!</h2>
            <p style="font-size: 1.2rem; margin-bottom: 2rem;">Unable to connect to the server. Please check your internet connection and try again.</p>
            <button onclick="this.parentElement.parentElement.remove(); window.location.reload();" 
              style="
                background: rgba(255, 255, 255, 0.2);
                border: none;
                color: white;
                padding: 1rem 2rem;
                border-radius: 10px;
                font-size: 1.1rem;
                cursor: pointer;
                font-weight: bold;
              ">
              🔄 Retry
            </button>
          </div>
        </div>
        <style>
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
          }
        </style>
      `;
      document.body.appendChild(errorDiv);
    }
    return Promise.reject(error);
  }
);

export default api;