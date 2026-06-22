import { describe, it, expect, beforeEach, vi } from "vitest";
import { getCart, saveCart } from "../utiles/cart";

describe("Cart Utilities", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe("getCart", () => {
    it("should return an empty array when cart is not in localStorage", () => {
      const cart = getCart();
      expect(cart).toEqual([]);
    });

    it("should return the cart from localStorage", () => {
      const mockCart = [
        { id: 1, name: "Product 1", price: 100 },
        { id: 2, name: "Product 2", price: 200 },
      ];
      localStorage.setItem("cart", JSON.stringify(mockCart));

      const cart = getCart();
      expect(cart).toEqual(mockCart);
      expect(cart.length).toBe(2);
    });
  });

  describe("saveCart", () => {
    it("should save cart to localStorage", () => {
      const mockCart = [{ id: 1, name: "Product 1", price: 100 }];

      saveCart(mockCart);

      expect(localStorage.setItem).toHaveBeenCalledWith(
        "cart",
        JSON.stringify(mockCart),
      );
    });

    it("should handle empty cart", () => {
      saveCart([]);

      expect(localStorage.setItem).toHaveBeenCalledWith("cart", "[]");
    });
  });
});
