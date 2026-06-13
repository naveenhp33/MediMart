import axios from "axios";

let rawApiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001/api";
if (rawApiUrl && !rawApiUrl.startsWith('http')) {
  rawApiUrl = `https://${rawApiUrl}`;
}
const API = axios.create({
  baseURL: rawApiUrl.endsWith('/api') ? rawApiUrl : `${rawApiUrl}/api`
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = token;
  }
  return config;
});

export default API;

