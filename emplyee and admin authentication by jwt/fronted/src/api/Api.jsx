

import axios from "axios";

// Create an Axios instance
const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

//  Add Authorization header with token on every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle expired JWT or unauthorized responses globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message;

    // If token is expired or unauthorized, log out user
    if (status === 401 && message === "jwt expired") {
      console.warn("JWT expired. Logging out user.");
      localStorage.clear(); // Remove token and user data
      window.location.href = "/login"; // Redirect to login
    }

    return Promise.reject(error);
  }
);

export default API;
