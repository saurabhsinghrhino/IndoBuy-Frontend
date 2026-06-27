import axios from "axios";

const API = axios.create({
  baseURL: "https://indobuy-backend.onrender.com/api",
  withCredentials: true,
});

export default API;
