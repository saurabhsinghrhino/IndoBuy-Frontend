import axios from "axios";
const api = axios.create({
  baseURL: "https://indobuy-backend.onrender.com/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getProducts = () => api.get("/products/get-product");

export const getProductById = (id) =>
  api.get(`/products/${id}`, {
    withCredentials: true,
  });
