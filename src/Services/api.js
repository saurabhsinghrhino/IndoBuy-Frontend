import axios from "axios";

const API = axios.create({
  baseURL: "https://indobuy-backend.onrender.com/api",

  withCredentials: true, // VERY IMPORTANT 🔥 (for cookies)
});

export default API;
