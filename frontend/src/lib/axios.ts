import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // Always send/receive cookies
  headers: {
  },
});

// Attach access token from localStorage to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401 and it's not the refresh-token request itself
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes("/api/auth/refresh-token")) {
      originalRequest._retry = true;

      try {
        // Attempt to get a new access token using the refresh token (which is in a cookie)
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/refresh-token`, {
          withCredentials: true,
        });

        const newToken = data.token;
        localStorage.setItem("accessToken", newToken);

        // Update the original request's authorization header
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, clear token and handle logout
        localStorage.removeItem("accessToken");
        // Optionally redirect to login or let the component handle it
        // window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
