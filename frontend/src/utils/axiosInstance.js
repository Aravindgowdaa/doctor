import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8001/api",
  withCredentials: true,
});

export default axiosInstance;

