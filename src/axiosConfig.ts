import axios from "axios";
import { store } from "./store";
import { logoutUser, logoutAdmin } from "./store/authSlice";

// Set up Axios interceptor
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      const { dispatch } = store;
      const state = store.getState();
      const { isAuthenticatedUser, isAuthenticatedAdmin } = state.auth;

      // Dispatch logout based on user type
      if (isAuthenticatedUser) {
        dispatch(logoutUser());
      } else if (isAuthenticatedAdmin) {
        dispatch(logoutAdmin());
      }
    }
    return Promise.reject(error);
  }
);

export default axios;
