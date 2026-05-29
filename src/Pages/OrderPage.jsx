import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { bookOrder, getOrder } from "../Services/order.Service";
import { getProductById } from "../Services/productService";

const OrderPage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");
  // Fetch latest order on mount
  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    try {
      // or however you store auth
      const response = await getOrder({
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response);

      if (!response.status == 200) throw new Error("Failed to fetch order");
      setOrder(response.data.orders);
      setUserData(response.data.user);
    } catch (err) {
      setError("No Order Found");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Create new order (call this from checkout)
    const createOrder = async () => {
      try {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];

        const items = cart.map((item) => ({
          product: item._id,
          quantity: item.quantity,
        }));

        const totalAmount = cart.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0,
        );

        const response = await bookOrder(
          {
            items,
            totalAmount,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        console.log(response.data);

        setOrder(response.data.data);
      } catch (err) {
        console.log(err);
        setError(err.message);
      }
    };
    // createOrder();
  }, []);

  const formatDate = (isoString) => {
    if (!isoString) return "-";
    const date = new Date(isoString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "Confirmed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Shipped":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Delivered":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "Cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return "⏳";
      case "Confirmed":
        return "✅";
      case "Shipped":
        return "🚚";
      case "Delivered":
        return "🎉";
      case "Cancelled":
        return "❌";
      default:
        return "📋";
    }
  };

  // Mock product data (replace with your actual product fetch)
  const getProductImage = async (productId) => {
    // In real app, fetch from your products API
    const response = await getProductById(productId);
    console.log(response.data.product.image);

    const images = response.data.product.image;
    return images;
  };

  const getProductName = (productId) => {
    const names = {
      "69f6221b54a759b05eb2f791": "Wireless Headphones",
      "69f6221b54a759b05eb2f792": "Smart Watch Pro",
    };
    return names[productId] || "Premium Product";
  };

  const getProductPrice = (productId) => {
    const prices = {
      "69f6221b54a759b05eb2f791": 2499,
      "69f6221b54a759b05eb2f792": 4999,
    };
    return prices[productId] || 999;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fefeff] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading your order...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#fefeff] flex items-center justify-center px-5">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
            ⚠️
          </div>
          <h2 className="text-2xl font-bold text-black mb-2 font-sekuya">
            Oops!
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate("/products")}
            className="bg-black text-white px-8 py-3 rounded-full font-medium hover:scale-105 transition-transform"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  if (!order) return null;

  const orders = Array.isArray(order) ? order : [order];

  const latestOrder = orders[0];

  const orderStatus = latestOrder?.status || "Pending";

  const orderId = latestOrder?._id?.slice(-10).toUpperCase();

  const totalAmount = latestOrder?.totalAmount || 0;

  const orderItems = latestOrder?.items || [];

  return (
    <div className="min-h-screen bg-[#fefeff] overflow-x-hidden">
      <Navbar />

      <div className="px-5 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Top Success Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-black text-white px-5 py-2 rounded-full text-sm font-medium mb-4">
              <span>🎉</span>
              <span>Order Placed Successfully</span>
            </div>
            <h1 className="font-sekuya text-3xl md:text-5xl font-bold text-black mb-2">
              Thank You, {userData?.username}!
            </h1>
            <p className="text-gray-600 text-lg">
              Your order has been received and is being processed.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* LEFT: Order Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Info Bar */}
              <div className="bg-white rounded-2xl p-6 shadow-lg shadow-gray-300 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                    Order Number
                  </p>
                  <p className="font-mono font-bold text-black text-lg">
                    #{orderId || "N/A"}
                  </p>
                </div>
                <div
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border ${getStatusColor(orderStatus)}`}
                >
                  <span>{getStatusIcon(orderStatus)}</span>
                  <span className="font-medium text-sm">{orderStatus}</span>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                    Order Date
                  </p>
                  <p className="font-medium text-black">
                    {formatDate(latestOrder?.createdAt)}
                  </p>
                </div>
              </div>

              {/* Items with Images */}
              <div className="bg-white rounded-2xl p-6 shadow-lg shadow-gray-300">
                <h2 className="font-sekuya text-xl font-bold text-black mb-6 flex items-center gap-2">
                  <span>📦</span> Order Items ({orderItems.length})
                </h2>

                <div className="space-y-4">
                  {orderItems.map((item, index) => {
                    const product = item.product;

                    const productName = product?.name || "Product";

                    const productImage = product?.image || "";

                    const unitPrice = product?.price || 0;

                    const itemTotal = unitPrice * item.quantity;

                    return (
                      <div
                        key={index}
                        className="flex gap-4 p-4 bg-[#f8f7f6] rounded-xl hover:bg-[#f0eeed] transition-colors duration-300"
                      >
                        {/* Product Image */}
                        <div className="w-24 h-24 md:w-28 md:h-28 bg-white rounded-xl overflow-hidden shrink-0 shadow-sm">
                          <img
                            src={productImage}
                            alt={productName}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src =
                                "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400&auto=format&fit=crop&q=80";
                            }}
                          />
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 flex flex-col justify-between py-1">
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="font-bold text-black text-lg leading-tight">
                                {productName}
                              </h3>
                              <span className="bg-black text-white text-xs px-2 py-1 rounded-full font-medium">
                                Qty: {item.quantity}
                              </span>
                            </div>
                            <p className="text-gray-500 text-sm mt-1">
                              Product ID: #
                              {product?._id?.slice(-6).toUpperCase()}
                            </p>
                          </div>

                          <div className="flex items-end justify-between mt-3">
                            <div>
                              <p className="text-xs text-gray-500">
                                Unit Price
                              </p>
                              <p className="text-sm font-medium text-gray-700">
                                ₹{unitPrice}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-gray-500">Total</p>
                              <p className="text-xl font-bold text-black font-sekuya">
                                ₹{itemTotal}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-2xl p-6 shadow-lg shadow-gray-300">
                <h2 className="font-sekuya text-xl font-bold text-black mb-4 flex items-center gap-2">
                  <span>🚚</span> Shipping Details
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-[#f8f7f6] rounded-xl p-5">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                      Deliver To
                    </p>
                    <p className="font-bold text-black">{userData?.username}</p>
                    <p className="text-gray-600 text-sm mt-1">
                      {userData?.email}
                    </p>
                  </div>
                  <div className="bg-[#f8f7f6] rounded-xl p-5">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                      Delivery Method
                    </p>
                    <p className="font-bold text-black">Standard Shipping</p>
                    <p className="text-emerald-600 text-sm font-medium mt-1">
                      Free Delivery
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-lg shadow-gray-300 sticky top-6">
                <h2 className="font-sekuya text-xl font-bold text-black mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      Items (
                      {orderItems.reduce((acc, item) => acc + item.quantity, 0)}
                      )
                    </span>
                    <span className="text-black font-medium">
                      ₹{totalAmount}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-emerald-600 font-medium">FREE</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax (GST)</span>
                    <span className="text-black font-medium">Included</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Discount</span>
                    <span className="text-gray-400 font-medium">—</span>
                  </div>
                </div>

                <div className="border-t-2 border-gray-200 pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-black text-lg">
                      Grand Total
                    </span>
                    <span className="text-3xl font-bold text-black font-sekuya">
                      ₹{totalAmount}
                    </span>
                  </div>
                </div>

                {/* Payment Status */}
                <div className="bg-[#f0eeed] rounded-xl p-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-black text-sm">
                        Payment Successful
                      </p>
                      <p className="text-gray-500 text-xs">Paid via Razorpay</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <button
                    onClick={() => navigate("/products")}
                    className="w-full bg-black text-white py-3.5 rounded-full font-medium hover:scale-[1.02] transition-transform duration-300"
                  >
                    Continue Shopping
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="w-full border-2 border-black text-black py-3.5 rounded-full font-medium hover:bg-black hover:text-white transition-all duration-300"
                  >
                    Print Invoice
                  </button>
                </div>

                {/* Help */}
                <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                  <p className="text-gray-500 text-sm mb-2">Need help?</p>
                  <button
                    onClick={() => navigate("/contact")}
                    className="text-black font-medium text-sm hover:underline"
                  >
                    Contact Support →
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Tracking Timeline */}
          <div className="mt-8 bg-white rounded-2xl p-6 md:p-8 shadow-lg shadow-gray-300">
            <h2 className="font-sekuya text-xl font-bold text-black mb-8 flex items-center gap-2">
              <span>📍</span> Order Tracking
            </h2>

            <div className="relative">
              {/* Progress Line */}
              <div className="absolute left-4 md:left-8 top-0 bottom-0 w-0.5 bg-gray-200" />

              {[
                {
                  step: "Order Placed",
                  time: formatDate(latestOrder?.createdAt),
                  done: true,
                  icon: "📝",
                },
                {
                  step: "Payment Confirmed",
                  time: "Just now",
                  done: true,
                  icon: "💳",
                },
                {
                  step: "Processing",
                  time: "Pending",
                  done: orderStatus !== "Pending",
                  icon: "⚙️",
                },
                {
                  step: "Shipped",
                  time: "Pending",
                  done: ["Shipped", "Delivered"].map(
                    (val) => val == orderStatus,
                  ),
                  icon: "🚚",
                },
                {
                  step: "Delivered",
                  time: "Pending",
                  done: orderStatus == "Delivered",
                  icon: "🏠",
                },
              ].map((track, index) => (
                <div
                  key={index}
                  className="relative flex items-start gap-4 md:gap-6 mb-8 last:mb-0"
                >
                  <div
                    className={`relative z-10 w-8 h-8 md:w-16 md:h-16 rounded-full flex items-center justify-center text-lg md:text-2xl shrink-0 ${
                      track.done
                        ? "bg-black text-white"
                        : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    {track.done ? "✓" : track.icon}
                  </div>
                  <div className="pt-1 md:pt-3">
                    <h3
                      className={`font-bold text-base md:text-lg ${track.done ? "text-black" : "text-gray-400"}`}
                    >
                      {track.step}
                    </h3>
                    <p className="text-sm text-gray-500">{track.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="px-5 py-12 bg-[#f0eeed] border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="text-2xl font-bold font-sekuya text-black mb-2">
            Indo-Buy
          </h3>
          <p className="text-gray-600 text-sm mb-6">
            Premium e-commerce experience for the modern Indian consumer.
          </p>
          <div className="flex gap-4 justify-center mb-8">
            {["📱", "📧", "💬", "📸"].map((icon, i) => (
              <div
                key={i}
                className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300 cursor-pointer"
              >
                {icon}
              </div>
            ))}
          </div>
          <p className="text-gray-500 text-sm">
            © 2024 Indo-Buy. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default OrderPage;
