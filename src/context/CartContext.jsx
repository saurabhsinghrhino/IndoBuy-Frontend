import { createContext, useContext, useState } from "react";
import { getCartFunc } from "../Services/cart.Service";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await getCartFunc();
      console.log(response.data.cart.items);
      setCartItems(response.data.cart.items);
    } catch (err) {
      console.error(err);
      const msg = err.response
        ? err.response.data?.message || `Server error ${err.response.status}`
        : "Cannot connect to server. Check your connection.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartCount,
        cartItems,
        fetchCart,
        loading,
        error,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
