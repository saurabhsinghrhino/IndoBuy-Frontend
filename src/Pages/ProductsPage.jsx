import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Search,
  Heart,
  ShoppingCart,
  ShoppingBag,
  Filter,
  X,
  ChevronDown,
  Star,
  Zap,
  ArrowUpDown,
  SlidersHorizontal,
  Loader2,
  AlertCircle,
} from "lucide-react";

import Navbar from "../components/Navbar";
import { getProducts } from "../Services/productService";
import { useCart } from "../context/CartContext"; // ← Global cart context
import { addToCartFunc } from "../Services/cart.Service";
import Notification from "../components/Notification";

gsap.registerPlugin(ScrollTrigger);

// ─── Static Data ──────────────────────────────────────────────────────────────

const CATEGORIES = [
  { id: "all", name: "All Products", icon: "🛍️" },
  { id: "Electronics", name: "Electronics", icon: "🔌" },
  { id: "Fashion", name: "Fashion", icon: "👔" },
  { id: "Home", name: "Home & Living", icon: "🏠" },
  { id: "Sports", name: "Sports", icon: "⚽" },
];

const SORT_OPTIONS = [
  { id: "relevant", name: "Most Relevant", icon: <Star className="w-4 h-4" /> },
  {
    id: "low-high",
    name: "Price: Low to High",
    icon: <ArrowUpDown className="w-4 h-4" />,
  },
  {
    id: "high-low",
    name: "Price: High to Low",
    icon: <ArrowUpDown className="w-4 h-4 rotate-180" />,
  },
  { id: "rating", name: "Highest Rated", icon: <Star className="w-4 h-4" /> },
  { id: "newest", name: "Newest First", icon: <Zap className="w-4 h-4" /> },
];

// ─── API Response Normalizer ──────────────────────────────────────────────────

// Converts raw API data (various shapes) → consistent product objects
const normalizeProducts = (apiData) => {
  const arr = Array.isArray(apiData)
    ? apiData
    : apiData?.data || apiData?.product || [];
  return arr.map((item, i) => ({
    id: item._id || item.id || i + 1,
    name: item.name || item.title || item.productName || "Unnamed Product",
    price: item.price || 0,
    originalPrice: Number(item.originalPrice) || 0,
    description: item.description || item.desc || "No description available",
    image: item.image || item.imageUrl || item.img || "📦",
    category: item.category || item.type || "General",
    rating: Number(item.rating) || Number(item.avgRating) || 4.0,
    reviews: Number(item.reviews) || Number(item.reviewCount) || 10,
    tag: item.tag || item.label || null,
    inStock: item.inStock !== undefined ? item.inStock : item.stock > 0,
    stock: Number(item.stock) || 0,
  }));
};

// ─── Filter + Sort Logic (pure function, no side effects) ─────────────────────

const applyFiltersAndSort = (
  products,
  { searchQuery, selectedCategory, sortBy },
) => {
  let result = [...products];

  // Text search across name, description, category
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q),
    );
  }

  // Category filter
  if (selectedCategory !== "all") {
    result = result.filter((p) => p.category === selectedCategory);
  }

  // Sort
  const sorters = {
    "low-high": (a, b) => Number(a.price) - Number(b.price),
    "high-low": (a, b) => b.price - a.price,
    rating: (a, b) => b.rating - a.rating,
    newest: (a, b) => b.id - a.id,
  };
  if (sorters[sortBy]) result.sort(sorters[sortBy]);

  return result;
};

// ─── Main Page ────────────────────────────────────────────────────────────────

const ProductsPage = () => {
  const navigate = useNavigate();
  const gridRef = useRef(null);

  // API state
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // UI filter/sort state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("relevant");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Local wishlist (page-scoped; move to context if needed across pages)
  const [wishlist, setWishlist] = useState([]);

  // Global cart from CartContext
  const { cartCount } = useCart();

  // ── Fetch products once on mount ──────────────────────────────────────────
  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await getProducts();
        const data = normalizeProducts(res.data.product);
        setProducts(data);
        setFilteredProducts(data);
      } catch (err) {
        // Distinguish network errors from server errors
        const msg = err.response
          ? err.response.data?.message || `Server error ${err.response.status}`
          : "Cannot connect to server. Check your connection.";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  // ── Re-filter whenever search/category/sort/products change ───────────────
  useEffect(() => {
    const result = applyFiltersAndSort(products, {
      searchQuery,
      selectedCategory,
      sortBy,
    });
    setFilteredProducts(result);

    // Animate new cards in after filter update
    if (gridRef.current && result.length > 0) {
      gsap.fromTo(
        ".product-card",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: "power2.out" },
      );
    }
  }, [searchQuery, selectedCategory, sortBy, products]);

  // ── Entrance animation (runs once after loading completes) ────────────────
  useEffect(() => {
    if (loading) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".products-header",
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
      );
    });
    return () => ctx.revert(); // Cleanup to avoid memory leaks
  }, [loading]);

  // ── Wishlist toggle ───────────────────────────────────────────────────────
  const toggleWishlist = (id) =>
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  // ── Buy Now: add to cart then redirect ───────────────────────────────────
  const buyNow = (product) => {
    addToCart(product, 1);
    navigate("/checkout");
  };

  // const handleAddToCart = async () => {};

  const currentSortName = SORT_OPTIONS.find((s) => s.id === sortBy)?.name;

  // ── Loading screen ────────────────────────────────────────────────────────
  if (loading)
    return (
      <div className="min-h-screen bg-[#fefeff] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-black animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading products...</p>
        </div>
      </div>
    );

  // ── Error screen ──────────────────────────────────────────────────────────
  if (error)
    return (
      <div className="min-h-screen bg-[#fefeff] flex items-center justify-center p-5">
        <div className="bg-[#f0eeed] rounded-3xl p-12 shadow-lg shadow-gray-400 text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-black mb-3">Oops!</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-black text-white px-6 py-3 rounded-full font-medium hover:scale-105 transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );

  // ── Main render ───────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#fefeff]">
      <Navbar />
      <div className="p-5 pt-8">
        <div className="max-w-7xl mx-auto">
          {/* ── Page Header ── */}
          <div className="products-header mb-10">
            <div className="bg-[#f0eeed] rounded-3xl p-8 md:p-12 shadow-lg shadow-gray-400 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-linear-to-br from-gray-200 to-transparent rounded-full blur-3xl opacity-50" />
              <div className="relative z-10">
                <h1 className="text-4xl md:text-6xl font-bold text-black mb-4">
                  Our{" "}
                  <span className="text-transparent bg-clip-text bg-linear-to-r from-gray-700 to-black">
                    Products
                  </span>
                </h1>
                <p className="text-gray-600 text-lg max-w-xl">
                  Discover our curated collection of premium products
                </p>
              </div>
            </div>
          </div>

          {/* ── Search & Sort Bar ── */}
          <div className="bg-[#f0eeed] rounded-3xl p-6 shadow-lg shadow-gray-400 mb-8">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              {/* Search Input */}
              <div className="flex-1 w-full relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-10 py-3.5 bg-white rounded-2xl border-2 border-gray-200 focus:border-black focus:outline-none transition-all text-black placeholder-gray-400"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                )}
              </div>

              {/* Sort Dropdown */}
              <div className="relative w-full lg:w-auto">
                <button
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                  className="w-full lg:w-auto flex items-center justify-between gap-3 bg-white px-5 py-3.5 rounded-2xl border-2 border-gray-200 hover:border-black transition-all"
                >
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-black">
                      {currentSortName}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform ${showSortDropdown ? "rotate-180" : ""}`}
                  />
                </button>

                {showSortDropdown && (
                  <div className="absolute top-full left-0 right-0 lg:w-56 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                    {SORT_OPTIONS.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => {
                          setSortBy(opt.id);
                          setShowSortDropdown(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-[#f0eeed] transition-colors ${sortBy === opt.id ? "bg-[#f0eeed] font-medium" : ""}`}
                      >
                        {opt.icon}
                        <span className="text-black">{opt.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Mobile filter toggle */}
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="lg:hidden flex items-center gap-2 bg-black text-white px-5 py-3.5 rounded-2xl font-medium"
              >
                <Filter className="w-5 h-5" /> Filters
              </button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* ── Sidebar ── */}
            <aside
              className={`lg:w-64 shrink-0 ${isFilterOpen ? "block" : "hidden lg:block"}`}
            >
              <div className="space-y-6 sticky top-24">
                {/* Category Filter */}
                <div className="bg-[#f0eeed] rounded-3xl p-6 shadow-lg shadow-gray-400">
                  <h3 className="text-lg font-bold text-black mb-4 flex items-center gap-2">
                    <Filter className="w-5 h-5" /> Categories
                  </h3>
                  <div className="space-y-2">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 ${
                          selectedCategory === cat.id
                            ? "bg-black text-white shadow-lg"
                            : "hover:bg-white text-gray-700"
                        }`}
                      >
                        <span className="text-xl">{cat.icon}</span>
                        <span className="font-medium">{cat.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Wishlist Panel */}
                <div className="bg-[#f0eeed] rounded-3xl p-6 shadow-lg shadow-gray-400">
                  <h3 className="text-lg font-bold text-black mb-4 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-red-500" />
                    Wishlist
                    {wishlist.length > 0 && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        {wishlist.length}
                      </span>
                    )}
                  </h3>
                  {wishlist.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center py-4">
                      No items yet
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {products
                        .filter((p) => wishlist.includes(p.id))
                        .map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-3 bg-white p-3 rounded-2xl shadow-sm"
                          >
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm text-black truncate">
                                {item.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                ₹{item.price.toLocaleString()}
                              </p>
                            </div>
                            <button
                              onClick={() => {
                                toggleWishlist(item.id);
                              }}
                              className="p-1.5 rounded-full hover:bg-red-50 text-red-500"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                    </div>
                  )}
                </div>

                {/* Cart Summary — sourced from CartContext */}
                {cartCount > 0 && (
                  <div className="bg-black rounded-3xl p-6 shadow-lg shadow-gray-400 text-white">
                    <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                      <ShoppingCart className="w-5 h-5" />
                      Cart ({cartCount})
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">
                      ₹{cartTotal.toLocaleString()}
                    </p>
                    <button
                      onClick={() => navigate("/cart")}
                      className="w-full bg-white text-black py-3 rounded-full font-medium hover:bg-gray-100 transition-all"
                    >
                      View Cart →
                    </button>
                  </div>
                )}
              </div>
            </aside>

            {/* ── Product Grid ── */}
            <main className="flex-1" ref={gridRef}>
              {/* Result count + clear filter */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-gray-600">
                  Showing{" "}
                  <span className="font-bold text-black">
                    {filteredProducts.length}
                  </span>{" "}
                  products
                </p>
                {selectedCategory !== "all" && (
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className="text-sm text-black underline hover:no-underline"
                  >
                    Clear filter
                  </button>
                )}
              </div>

              {/* Empty state */}
              {filteredProducts.length === 0 && (
                <div className="bg-[#f0eeed] rounded-3xl p-12 text-center shadow-lg shadow-gray-400">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-2xl font-bold text-black mb-2">
                    No products found
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your search or filters
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("all");
                    }}
                    className="bg-black text-white px-6 py-3 rounded-full font-medium hover:scale-105 transition-all"
                  >
                    Clear All
                  </button>
                </div>
              )}

              {/* Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isWishlisted={wishlist.includes(product.id)}
                    onToggleWishlist={() => toggleWishlist(product.id)}
                    onBuyNow={() => buyNow(product)}
                  />
                ))}
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Product Card ─────────────────────────────────────────────────────────────

const ProductCard = ({ product, isWishlisted, onToggleWishlist, onBuyNow }) => {
  const navigate = useNavigate();
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  // Pull cart helpers from context
  // const { addToCart, isInCart, getItemQuantity } = useCart();
  // const inCart = isInCart(product.id);
  // const qty = getItemQuantity(product.id);

  // GSAP hover lift animation
  useEffect(() => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, {
      y: isHovered ? -8 : 0,
      scale: isHovered ? 1.02 : 1,
      duration: 0.3,
      ease: "power2.out",
    });
  }, [isHovered]);

  // Add to cart with brief loading state for UX feedback
  const handleAddToCart = async (e) => {
    try {
      const token = localStorage.getItem("token");

      const response = await addToCartFunc(product.id, 1);

      // Notification({
      //   type: "success",
      //   message: response.data.message || "Added to cart",
      // });

      e.stopPropagation(); // Prevent card click → navigate
      await new Promise((r) => setTimeout(r, 300));
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  const hasDiscount = product.originalPrice > product.price;

  return (
    <div
      ref={cardRef}
      className="product-card bg-[#f0eeed] rounded-3xl overflow-hidden shadow-md shadow-gray-400 hover:shadow-xl transition-shadow duration-500 group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ── Image Section ── */}
      <div className="relative bg-linear-to-b from-gray-50 to-white p-6">
        {/* Tag badges (top-left) */}
        <div className="absolute top-4 left-4 flex gap-2 z-10">
          {product.tag && (
            <span className="bg-black text-white px-3 py-1 rounded-full text-xs font-medium">
              {product.tag}
            </span>
          )}
        </div>

        {/* Wishlist button (top-right) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist();
          }}
          className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 z-10 ${
            isWishlisted
              ? "bg-red-500 text-white"
              : "bg-white/80 text-gray-400 hover:bg-red-50 hover:text-red-500"
          }`}
        >
          <Heart className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`} />
        </button>

        {/* Product image — URL or emoji fallback */}
        <div className="aspect-square flex items-center justify-center text-8xl group-hover:scale-110 transition-transform duration-500">
          {product.image?.startsWith("http") ? (
            <img
              onClick={() => navigate(`/product/${product.id}`)}
              src={product.image}
              alt={product.name}
              className="w-full h-full object-contain rounded-2xl"
            />
          ) : (
            <span>{product.image || "📦"}</span>
          )}
        </div>

        {/* Hover action buttons (slide up on hover) */}
        <div className="absolute inset-x-4 bottom-4 flex gap-2 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock || isAdding}
            className="flex-1 bg-black text-white py-3 rounded-full font-medium text-sm hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isAdding ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ShoppingCart className="w-4 h-4" />
            )}
            {/* {inCart ? "Add More" : "Add to Cart"} */}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onBuyNow();
            }}
            disabled={!product.inStock}
            className="flex-1 bg-white text-black border-2 border-black py-3 rounded-full font-medium text-sm hover:bg-black hover:text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <ShoppingBag className="w-4 h-4" /> Buy Now
          </button>
        </div>
      </div>

      {/* ── Card Content ── */}
      <div className="p-6">
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">
          {product.category}
        </p>
        <h3 className="text-lg font-bold text-black mb-2 line-clamp-1">
          {product.name}
        </h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {product.description}
        </p>

        {/* Star Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${i < Math.floor(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-500">
            {product.rating} ({product.reviews})
          </span>
        </div>

        {/* Price (with optional strikethrough original price) */}
        <div className="flex items-baseline gap-3 mb-3">
          <span className="text-2xl font-bold text-black">
            ₹{product.price.toLocaleString()}
          </span>
          {hasDiscount && (
            <span className="text-sm text-gray-400 line-through">
              ₹{product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        {!product.inStock && (
          <p className="text-red-500 text-sm font-medium mb-3">Out of Stock</p>
        )}

        {/* Mobile-only buttons (hover overlay doesn't work on touch) */}
        <div className="flex gap-2 lg:hidden">
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock || isAdding}
            className="flex-1 bg-black text-white py-3 rounded-full font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isAdding ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ShoppingCart className="w-4 h-4" />
            )}
            {/* {isAdding ? "..." : "More" : "Add"} */}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onBuyNow();
            }}
            disabled={!product.inStock}
            className="flex-1 border-2 border-black text-black py-3 rounded-full font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            Buy
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
