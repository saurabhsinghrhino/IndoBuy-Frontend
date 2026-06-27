import axios from "axios";
const api = axios.create({
  baseURL: "http://localhost:3000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const addToCartFunc = (productId, quantity) =>
  api.post(
    "/products/add-cart",
    {
      productId: productId,
      quantity: quantity,
    },
    {
      withCredentials: true,
    },
  );

export const getCartFunc = () =>
  api.get("/products/get-cart", {
    withCredentials: true,
  });
