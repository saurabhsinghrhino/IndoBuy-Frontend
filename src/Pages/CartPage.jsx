import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import {
  Trash2,
  Minus,
  Plus,
  ShoppingBag,
  ArrowRight,
  Truck,
  Shield,
  RotateCcw,
  Heart,
  Package,
  CreditCard,
  ChevronLeft,
  X,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import Navbar from "../components/Navbar";

const CartPage = () => {
  const navigate = useNavigate();
  const cartRef = useRef(null);

  const {
    cartItems,
    cartCount,
    cartTotal,
    updateQuantity,
    removeFromCart,
    clearCart,
    moveToWishlist,
  } = useCart();

  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // GSAP entrance animation
  useEffect(() => {
    if (cartItems.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.from(".cart-item", {
        x: -30,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out",
      });

      gsap.from(".cart-summary", {
        y: 30,
        opacity: 0,
        duration: 0.6,
        delay: 0.3,
        ease: "power3.out",
      });
    });

    return () => ctx.revert();
  }, [cartItems]);

  // Apply promo code
  const applyPromo = () => {
    if (promoCode.toLowerCase() === "indobuy10") {
      setDiscount(Math.round(cartTotal * 0.1));
    } else {
      alert("Invalid promo code");
    }
  };

  // Calculations
  const deliveryFee = cartTotal > 999 ? 0 : 99;
  const finalTotal = cartTotal - discount + deliveryFee;

  // Empty cart state
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#fefeff]">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh] p-5">
          <div className="text-center max-w-md">
            <div className="w-32 h-32 bg-[#f0eeed] rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-16 h-16 text-gray-400" />
            </div>
            <h2 className="text-3xl font-bold text-black mb-3">
              Your Cart is Empty
            </h2>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added anything to your cart yet.
            </p>
            <button
              onClick={() => navigate("/products")}
              className="bg-black text-white px-8 py-4 rounded-full font-medium hover:scale-105 transition-all flex items-center gap-2 mx-auto"
            >
              Continue Shopping <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fefeff]">
      <Navbar />

      <div ref={cartRef} className="p-5 pt-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold font-sekuya text-black">
                Shopping Cart
              </h1>
              <p className="text-gray-600 mt-1">
                {cartCount} {cartCount === 1 ? "item" : "items"} in your cart
              </p>
            </div>
            <button
              onClick={() => navigate("/products")}
              className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              Continue Shopping
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* LEFT: Cart Items */}
            <div className="flex-1">
              <div className="bg-[#f0eeed] rounded-3xl p-6 shadow-lg shadow-gray-400">
                {/* Clear cart button */}
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-bold text-black">Cart Items</h2>
                  <button
                    onClick={() => setShowClearConfirm(true)}
                    className="text-red-500 text-sm hover:text-red-700 transition-colors flex items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear Cart
                  </button>
                </div>

                {/* Cart Items List */}
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="cart-item bg-white rounded-2xl p-4 flex gap-4 hover:shadow-md transition-shadow"
                    >
                      {/* Product Image */}
                      <div
                        onClick={() => navigate(`/product/${item.id}`)}
                        className="w-24 h-24 bg-gray-50 rounded-xl overflow-hidden shrink-0 cursor-pointer"
                      >
                        {item.image?.startsWith("http") ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-4xl">
                            {item.image || "📦"}
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3
                              onClick={() => navigate(`/product/${item.id}`)}
                              className="font-bold text-black cursor-pointer hover:text-gray-700 transition-colors line-clamp-1"
                            >
                              {item.name}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                              {item.category}
                            </p>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          {/* Quantity Controls */}
                          <div className="flex items-center bg-[#f0eeed] rounded-full">
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded-l-full transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-10 text-center font-bold text-black">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded-r-full transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <p className="font-bold text-black text-lg">
                              ₹{(item.price * item.quantity).toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-500">
                              ₹{item.price.toLocaleString()} each
                            </p>
                          </div>
                        </div>

                        {/* Save for later / Move to wishlist */}
                        <div className="flex gap-4 mt-3">
                          <button
                            onClick={() => moveToWishlist(item.id)}
                            className="text-sm text-gray-500 hover:text-black transition-colors flex items-center gap-1"
                          >
                            <Heart className="w-4 h-4" />
                            Save for later
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="bg-[#f0eeed] rounded-2xl p-4 text-center">
                  <Truck className="w-6 h-6 mx-auto mb-2 text-black" />
                  <p className="text-xs font-medium text-gray-700">
                    Free Delivery
                  </p>
                  <p className="text-xs text-gray-500">On orders above ₹999</p>
                </div>
                <div className="bg-[#f0eeed] rounded-2xl p-4 text-center">
                  <Shield className="w-6 h-6 mx-auto mb-2 text-black" />
                  <p className="text-xs font-medium text-gray-700">
                    Secure Payment
                  </p>
                  <p className="text-xs text-gray-500">100% protected</p>
                </div>
                <div className="bg-[#f0eeed] rounded-2xl p-4 text-center">
                  <RotateCcw className="w-6 h-6 mx-auto mb-2 text-black" />
                  <p className="text-xs font-medium text-gray-700">
                    Easy Returns
                  </p>
                  <p className="text-xs text-gray-500">7 day policy</p>
                </div>
              </div>
            </div>

            {/* RIGHT: Order Summary */}
            <div className="lg:w-96">
              <div className="cart-summary bg-[#f0eeed] rounded-3xl p-6 shadow-lg shadow-gray-400 sticky top-24">
                <h2 className="text-xl font-bold text-black mb-6">
                  Order Summary
                </h2>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({cartCount} items)</span>
                    <span>₹{cartTotal.toLocaleString()}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-₹{discount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Fee</span>
                    <span className={deliveryFee === 0 ? "text-green-600" : ""}>
                      {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                    </span>
                  </div>

                  <div className="border-t border-gray-300 pt-3">
                    <div className="flex justify-between text-xl font-bold text-black">
                      <span>Total</span>
                      <span>₹{finalTotal.toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Including all taxes
                    </p>
                  </div>
                </div>

                {/* Promo Code */}
                <div className="mb-6">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Promo Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Enter code"
                      className="flex-1 px-4 py-2.5 bg-white rounded-xl border-2 border-gray-200 focus:border-black focus:outline-none text-sm"
                    />
                    <button
                      onClick={applyPromo}
                      className="px-4 py-2.5 bg-black text-white rounded-xl font-medium text-sm hover:scale-105 transition-all"
                    >
                      Apply
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Try "INDOBUY10" for 10% off
                  </p>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={() => navigate("/checkout")}
                  className="w-full bg-black text-white py-4 rounded-full font-medium hover:scale-[1.02] transition-all flex items-center justify-center gap-2 mb-4"
                >
                  Proceed to Checkout
                  <CreditCard className="w-5 h-5" />
                </button>

                {/* Payment Icons */}
                <div className="flex justify-center gap-2">
                  <div className="w-10 h-6 bg-white rounded flex items-center justify-center text-xs font-bold">
                    UPI
                  </div>
                  <div className="w-10 h-6 bg-white rounded flex items-center justify-center text-xs font-bold">
                    CARD
                  </div>
                  <div className="w-10 h-6 bg-white rounded flex items-center justify-center text-xs font-bold">
                    COD
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Clear Cart Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#f0eeed] rounded-3xl p-8 max-w-sm w-full shadow-2xl">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-black text-center mb-2">
              Clear Cart?
            </h3>
            <p className="text-gray-600 text-center mb-6">
              All items will be removed from your cart.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-3 rounded-full border-2 border-gray-300 font-medium hover:border-black transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  clearCart();
                  setShowClearConfirm(false);
                }}
                className="flex-1 py-3 rounded-full bg-red-500 text-white font-medium hover:bg-red-600 transition-all"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
