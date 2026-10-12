import axios from "axios";
import { toast } from "../toast";

let pendingRequests = 0;
const spinner = document.createElement("div");
spinner.style.cssText = `
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: #6366f1;
  z-index: 9999;
  opacity: 0;
  transition: opacity 0.3s;
`;
document.body.appendChild(spinner);

const updateSpinner = () => {
  spinner.style.opacity = pendingRequests > 0 ? 1 : 0;
};

axios.interceptors.request.use(
  (config) => {
    pendingRequests++;
    updateSpinner();
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

axios.interceptors.response.use(
  (response) => {
    pendingRequests--;
    updateSpinner();
    return response;
  },
  (error) => {
    pendingRequests--;
    updateSpinner();
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("userRole");
      toast.error("Session expired. Please login again.");
      // window.location.href = "/login";
    } else if (error.response) {
      toast.error(error.response.data.message || "An error occurred");
    } else {
      toast.error("Network error. Please try again.");
    }
    return Promise.reject(error);
  }
);

export default axios.create({
  baseURL: "/api/v1",
});