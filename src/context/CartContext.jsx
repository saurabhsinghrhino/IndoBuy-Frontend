import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Initialize cart from localStorage
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem("cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync with localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // ============================================
  // CART ACTIONS
  // ============================================

  // Add item to cart
  const addToCart = (product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);

      if (existing) {
        // Update quantity if already in cart
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }

      // Add new item
      return [...prev, { ...product, quantity }];
    });
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  };

  // Update item quantity
  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity } : item,
      ),
    );
  };

  // Clear entire cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Move item to wishlist (optional)
  const moveToWishlist = (productId) => {
    // Remove from cart - wishlist logic handled separately
    removeFromCart(productId);
  };

  // ============================================
  // COMPUTED VALUES
  // ============================================

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const itemCount = cartItems.length;

  const isInCart = (productId) =>
    cartItems.some((item) => item.id === productId);

  const getItemQuantity = (productId) => {
    const item = cartItems.find((item) => item.id === productId);
    return item?.quantity || 0;
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartTotal,
        itemCount,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        moveToWishlist,
        isInCart,
        getItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook for easy access
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};

export default CartContext;
