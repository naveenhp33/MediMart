import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5001/api"
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

