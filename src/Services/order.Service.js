import axios from "axios";
const api = axios.create({
  baseURL: "http://localhost:3000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const bookOrder = (formData) =>
  api.post("/orders/booking", formData, {
    withCredentials: true,
  });

export const getOrder = () =>
  api.get("/orders/all-order", {
    withCredentials: true,
  });

export const getOrderById = (id) =>
  api.get(`/orders/details/${id}`, {
    withCredentials: true,
  });

export const updateOrderStatus = (id, status) =>
  api.put(
    `/orders/${id}/status`,
    { status },
    {
      withCredentials: true,
    },
  );
