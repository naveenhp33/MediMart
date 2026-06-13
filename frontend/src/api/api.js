import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.MODE === 'development' ? 'http://localhost:5001/api' : '/api'
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

