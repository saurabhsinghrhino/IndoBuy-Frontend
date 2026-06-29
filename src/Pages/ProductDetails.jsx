import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import {
  Heart,
  ShoppingCart,
  ShoppingBag,
  Star,
  Truck,
  Shield,
  RotateCcw,
  Share2,
  ChevronLeft,
  Minus,
  Plus,
  Loader2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { getProductById } from "../Services/productService";
import { useCart } from "../context/CartContext";

const ProductDetails = () => {
  const { addToCart, isInCart, getItemQuantity } = useCart();
  const { id } = useParams(); // Get product ID from URL
  const navigate = useNavigate();
  const pageRef = useRef(null);

  // States
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);

  // Fetch single product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await getProductById(id);

        // Map API data
        const item = response.data?.product || response.data;
        const mappedProduct = {
          id: item._id,
          name: item.name,
          price: Number(item.price?.replace(/,/g, "")) || 0,
          description: item.description,
          image: item.image?.trim(),
          category: item.category,
          stock: Number(item.stock) || 0,
          inStock: Number(item.stock) > 0,
          user: item.user,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        };

        setProduct(mappedProduct);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Unauthorized access. Please log in.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // GSAP animations
  useEffect(() => {
    if (loading || !product) return;

    const ctx = gsap.context(() => {
      gsap.from(".product-image-container", {
        x: -50,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });

      gsap.from(".product-info", {
        x: 50,
        opacity: 0,
        duration: 0.8,
        delay: 0.2,
        ease: "power3.out",
      });

      gsap.from(".feature-badge", {
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        delay: 0.5,
      });
    });

    return () => ctx.revert();
  }, [loading, product]);

  // Handlers
  const handleQuantityChange = (delta) => {
    setQuantity((prev) => {
      const newQty = prev + delta;
      if (newQty < 1) return 1;
      if (newQty > product.stock) return product.stock;
      return newQty;
    });
  };

  const handleAddToCart = async () => {
    // Add to cart logic here
    addToCart(product, quantity);
    setAddingToCart(true);
    handleQuantityChange(1);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    setAddingToCart(false);

    // Show success notification (you can use your Notification component)
    alert(`Added ${quantity} item(s) to cart!`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/checkout");
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#fefeff] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-black animate-spin" />
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#fefeff] flex items-center justify-center p-5">
        <div className="bg-[#f0eeed] rounded-3xl p-12 text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-black mb-3">
            Product Not Found
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate("/products")}
            className="bg-black text-white px-6 py-3 rounded-full font-medium hover:scale-105 transition-all"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  // Calculate discount (if you have original price)
  const discount = 0; // Set if you have original price

  return (
    <div className="min-h-screen bg-[#fefeff]">
      <Navbar />

      <div ref={pageRef} className="p-5 pt-8">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-black mb-6 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Products
          </button>

          {/* Main Product Section */}
          <div className="bg-[#f0eeed] rounded-3xl shadow-lg shadow-gray-400 overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-0">
              {/* LEFT: Image Section */}
              <div className="product-image-container bg-white p-8 lg:p-12">
                {/* Main Image */}
                <div className="aspect-square rounded-2xl overflow-hidden bg-gray-50 mb-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Thumbnail Gallery (if multiple images) */}
                <div className="flex gap-3 justify-center">
                  {[product.image].map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                        activeImage === idx ? "border-black" : "border-gray-200"
                      }`}
                    >
                      <img
                        src={img}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* RIGHT: Product Info */}
              <div className="product-info p-8 lg:p-12 flex flex-col">
                {/* Category & Tag */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-black text-white px-3 py-1 rounded-full text-xs font-medium">
                    {product.category}
                  </span>
                  {product.inStock ? (
                    <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                      <CheckCircle className="w-4 h-4" /> In Stock
                    </span>
                  ) : (
                    <span className="text-red-500 text-sm font-medium">
                      Out of Stock
                    </span>
                  )}
                </div>

                {/* Product Name */}
                <h1 className="text-3xl lg:text-4xl font-bold font-sekuya text-black mb-4">
                  {product.name}
                </h1>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-6">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < 4
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-gray-500 text-sm">(128 reviews)</span>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-4 mb-6">
                  <span className="text-4xl font-bold text-black">
                    ₹{product.price.toLocaleString()}
                  </span>
                  {discount > 0 && (
                    <>
                      <span className="text-xl text-gray-400 line-through">
                        ₹{(product.price * 1.2).toLocaleString()}
                      </span>
                      <span className="bg-red-500 text-white px-2 py-1 rounded-lg text-sm font-bold">
                        -{discount}%
                      </span>
                    </>
                  )}
                </div>

                {/* Description */}
                <p className="text-gray-600 text-lg leading-relaxed mb-8">
                  {product.description}
                </p>

                {/* Quantity Selector */}
                <div className="flex items-center gap-4 mb-8">
                  <span className="font-medium text-black">Quantity:</span>
                  <div className="flex items-center bg-white rounded-full border-2 border-gray-200">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-l-full transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-bold text-black">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-r-full transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-sm text-gray-500">
                    {product.stock} units available
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 mb-8">
                  {isInCart(product.id) && (
                    <button
                      onClick={handleAddToCart}
                      disabled={!product.inStock || addingToCart}
                      className="flex-1 bg-black text-white py-4 rounded-full font-medium hover:scale-105 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {addingToCart ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <ShoppingCart className="w-5 h-5" />
                      )}
                      {addingToCart
                        ? "Adding..."
                        : `${getItemQuantity(product.id)} Item's in cart`}
                    </button>
                  )}

                  <button
                    onClick={handleBuyNow}
                    disabled={!product.inStock}
                    className="flex-1 bg-white text-black border-2 border-black py-4 rounded-full font-medium hover:bg-black hover:text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    Buy Now
                  </button>

                  <button
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className={`w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all ${
                      isWishlisted
                        ? "bg-red-500 border-red-500 text-white"
                        : "border-gray-200 text-gray-400 hover:border-red-500 hover:text-red-500"
                    }`}
                  >
                    <Heart
                      className={`w-6 h-6 ${isWishlisted ? "fill-current" : ""}`}
                    />
                  </button>
                </div>

                {/* Feature Badges */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="feature-badge flex flex-col items-center text-center p-4 bg-white rounded-2xl">
                    <Truck className="w-6 h-6 text-black mb-2" />
                    <span className="text-xs font-medium text-gray-700">
                      Free Delivery
                    </span>
                  </div>
                  <div className="feature-badge flex flex-col items-center text-center p-4 bg-white rounded-2xl">
                    <Shield className="w-6 h-6 text-black mb-2" />
                    <span className="text-xs font-medium text-gray-700">
                      1 Year Warranty
                    </span>
                  </div>
                  <div className="feature-badge flex flex-col items-center text-center p-4 bg-white rounded-2xl">
                    <RotateCcw className="w-6 h-6 text-black mb-2" />
                    <span className="text-xs font-medium text-gray-700">
                      7 Day Return
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info Section */}
          <div className="mt-8 grid md:grid-cols-2 gap-6">
            {/* Product Specifications */}
            <div className="bg-[#f0eeed] rounded-3xl p-8 shadow-lg shadow-gray-400">
              <h3 className="text-2xl font-bold text-black mb-6">
                Product Details
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between py-3 border-b border-gray-200">
                  <span className="text-gray-600">Category</span>
                  <span className="font-medium text-black">
                    {product.category}
                  </span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-200">
                  <span className="text-gray-600">Stock</span>
                  <span className="font-medium text-black">
                    {product.stock} units
                  </span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-200">
                  <span className="text-gray-600">Product ID</span>
                  <span className="font-medium text-black text-sm">
                    {product.id}
                  </span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-200">
                  <span className="text-gray-600">Added On</span>
                  <span className="font-medium text-black">
                    {new Date(product.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Share Section */}
            <div className="bg-[#f0eeed] rounded-3xl p-8 shadow-lg shadow-gray-400">
              <h3 className="text-2xl font-bold text-black mb-6">
                Share Product
              </h3>
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert("Link copied to clipboard!");
                  }}
                  className="flex-1 bg-white py-3 rounded-full font-medium hover:bg-black hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  <Share2 className="w-5 h-5" />
                  Copy Link
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
