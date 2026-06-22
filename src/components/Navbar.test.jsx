import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import CartContext from "../context/CartContext";
import Navbar from "./Navbar";

// Mock GSAP
vi.mock("gsap", () => ({
  gsap: {
    context: vi.fn((callback) => {
      callback();
      return { revert: vi.fn() };
    }),
    from: vi.fn(),
  },
}));

describe("Navbar Component", () => {
  it("should render navbar without crashing", () => {
    expect(() => {
      render(
        <BrowserRouter>
          <CartContext.Provider value={{ cartCount: 0, addToCart: vi.fn() }}>
            <Navbar />
          </CartContext.Provider>
        </BrowserRouter>,
      );
    }).not.toThrow();
  });

  it("should render with cart context provider", () => {
    const { container } = render(
      <BrowserRouter>
        <CartContext.Provider value={{ cartCount: 0, addToCart: vi.fn() }}>
          <Navbar />
        </CartContext.Provider>
      </BrowserRouter>,
    );
    expect(container).toBeInTheDocument();
  });
});
