// src/axiosConfig.ts
import axios from "axios";
import { store } from "./store";
import { logoutUser, logoutAdmin } from "./store/authSlice";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 || err.response?.status === 403) {
      const { dispatch } = store;
      const { isAuthenticatedUser, isAuthenticatedAdmin } = store.getState().auth;
      if (isAuthenticatedUser) dispatch(logoutUser());
      else if (isAuthenticatedAdmin) dispatch(logoutAdmin());
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;
