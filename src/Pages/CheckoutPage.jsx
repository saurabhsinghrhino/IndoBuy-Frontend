import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");

  // Load cart & token on mount
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);

    const authToken = localStorage.getItem("token") || "";
    setToken(authToken);
  }, []);

  // Calculate totals
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shipping = subtotal > 999 ? 0 : 99;
  const tax = Math.round(subtotal * 0.05); // 5% GST
  const totalAmount = subtotal + shipping + tax;

  // Update quantity
  const updateQty = (id, delta) => {
    const updated = cart.map((item) => {
      if (item._id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    });
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  // Remove item
  const removeItem = (id) => {
    const updated = cart.filter((item) => item._id !== id);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  console.log(token);

  // Your Razorpay payment handler
  const handlePayment = async () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    if (!token) {
      alert("Please login first!");
      navigate("/login");
      return;
    }

    setLoading(true);

    try {
      const items = cart.map((item) => ({
        product: item._id,
        quantity: item.quantity,
      }));

      //     // Create Razorpay order
      const { data } = await axios.post(
        "http://localhost:3000/api/payment/create-order",
        { amount: totalAmount },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      console.log("Order created:", data);

      const options = {
        key: "RAZORPAY_KEY_ID",
        amount: data.order.amount,
        currency: data.order.currency,
        name: "Indo-Buy",
        description: "Order Payment",
        order_id: data.order.id,

        handler: async function (response) {
          // Verify payment
          const verifyRes = await axios.post(
            "http://localhost:3000/api/payment/verify-payment",
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              items,
              totalAmount,
            },
            { headers: { Authorization: `Bearer ${token}` } },
          );

          console.log(verifyRes.data);

          // Clear cart & redirect
          localStorage.removeItem("cart");
          navigate("/orders");
        },

        theme: { color: "#000000" },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (error) {
      console.error("Payment failed:", error);
      alert("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#fefeff]">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh] px-5">
          <div className="text-center">
            <div className="text-8xl mb-6">🛒</div>
            <h2 className="font-sekuya text-3xl font-bold text-black mb-3">
              Your Cart is Empty
            </h2>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added anything yet.
            </p>
            <button
              onClick={() => navigate("/products")}
              className="bg-black text-white px-8 py-4 rounded-full font-medium hover:scale-105 transition-transform"
            >
              Start Shopping →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fefeff]">
      <Navbar />

      <div className="px-5 py-8 md:py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="font-sekuya text-4xl md:text-5xl font-bold text-black mb-2">
              Checkout
            </h1>
            <p className="text-gray-600">
              Review your items and complete your purchase
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* LEFT: Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-2xl p-6 shadow-lg shadow-gray-300">
                <h2 className="font-sekuya text-xl font-bold text-black mb-6 flex items-center gap-2">
                  <span>🛍️</span> Your Items ({cart.length})
                </h2>

                <div className="space-y-4">
                  {cart.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex gap-4 p-4 bg-[#f8f7f6] rounded-xl hover:bg-[#f0eeed] transition-colors"
                    >
                      {/* Product Image */}
                      <div className="w-24 h-24 bg-white rounded-lg overflow-hidden shrink-0 shadow-sm">
                        <img
                          src={
                            item.image ||
                            "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400&auto=format&fit=crop&q=80"
                          }
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src =
                              "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400&auto=format&fit=crop&q=80";
                          }}
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-bold text-black">
                              {item.name}
                            </h3>
                            <button
                              onClick={() => removeItem(item._id)}
                              className="text-red-500 hover:text-red-700 text-sm hover:scale-110 transition-transform"
                            >
                              ✕
                            </button>
                          </div>
                          <p className="text-gray-500 text-sm mt-1">
                            ₹{item.price} / unit
                          </p>
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-3 bg-white rounded-full px-1 py-1 shadow-sm">
                            <button
                              onClick={() => updateQty(item._id, -1)}
                              className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                            >
                              −
                            </button>
                            <span className="font-bold text-black w-6 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQty(item._id, 1)}
                              className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                            >
                              +
                            </button>
                          </div>

                          <p className="text-xl font-bold text-black font-sekuya">
                            ₹{item.price * item.quantity}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Info */}
              <div className="bg-white rounded-2xl p-6 shadow-lg shadow-gray-300">
                <h2 className="font-sekuya text-xl font-bold text-black mb-4 flex items-center gap-2">
                  <span>🚚</span> Delivery
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-[#f8f7f6] rounded-xl p-4">
                    <p className="text-xs text-gray-500 uppercase mb-1">
                      Estimated Delivery
                    </p>
                    <p className="font-bold text-black">3-5 Business Days</p>
                  </div>
                  <div className="bg-[#f8f7f6] rounded-xl p-4">
                    <p className="text-xs text-gray-500 uppercase mb-1">
                      Free Shipping
                    </p>
                    <p className="font-bold text-black">
                      {subtotal > 999
                        ? "✅ Eligible"
                        : `Add ₹${999 - subtotal} more`}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-lg shadow-gray-300 sticky top-6">
                <h2 className="font-sekuya text-xl font-bold text-black mb-6">
                  Order Summary
                </h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-black font-medium">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span
                      className={
                        shipping === 0
                          ? "text-emerald-600 font-medium"
                          : "text-black font-medium"
                      }
                    >
                      {shipping === 0 ? "FREE" : `₹${shipping}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">GST (5%)</span>
                    <span className="text-black font-medium">₹{tax}</span>
                  </div>
                  {subtotal < 999 && (
                    <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded-lg">
                      Add ₹{999 - subtotal} more for free shipping!
                    </p>
                  )}
                </div>

                <div className="border-t-2 border-gray-200 pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-black text-lg">Total</span>
                    <span className="text-3xl font-bold text-black font-sekuya">
                      ₹{totalAmount}
                    </span>
                  </div>
                </div>

                {/* Pay Button */}
                <button
                  onClick={handlePayment}
                  disabled={loading}
                  className="w-full bg-black text-white py-4 rounded-full font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200 disabled:opacity-70 disabled:cursor-not-allowed relative overflow-hidden"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Pay ₹{totalAmount}
                      <span>→</span>
                    </span>
                  )}
                </button>

                {/* Secure Badge */}
                <div className="flex items-center justify-center gap-2 mt-4 text-gray-500 text-xs">
                  <span>🔒</span>
                  <span>Secure payment by Razorpay</span>
                </div>

                {/* Trust Icons */}
                <div className="flex justify-center gap-4 mt-4 pt-4 border-t border-gray-200">
                  <div className="w-10 h-6 bg-gray-200 rounded flex items-center justify-center text-xs font-bold text-gray-600">
                    UPI
                  </div>
                  <div className="w-10 h-6 bg-gray-200 rounded flex items-center justify-center text-xs font-bold text-gray-600">
                    CARD
                  </div>
                  <div className="w-10 h-6 bg-gray-200 rounded flex items-center justify-center text-xs font-bold text-gray-600">
                    NB
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="px-5 py-8 bg-[#f0eeed] border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-500 text-sm">
            © 2024 Indo-Buy. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default CheckoutPage;
