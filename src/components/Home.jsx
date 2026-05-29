import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "./Navbar.jsx";
import Model from "../assets/Model.jpg";
import { useNavigate } from "react-router-dom";

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

const HomePage = () => {
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const productsRef = useRef(null);
  const ctaRef = useRef(null);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isHovered, setIsHovered] = useState(null);

  useEffect(() => {
    // Small delay to ensure DOM is fully ready
    const initTimer = setTimeout(() => {
      const ctx = gsap.context(() => {
        // Hero animations
        gsap.fromTo(
          ".hero-title",
          { y: 100, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.2, ease: "power4.out", delay: 0.2 },
        );

        gsap.fromTo(
          ".hero-subtitle",
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.5 },
        );

        // Floating animation
        gsap.to(".hero-float", {
          y: -20,
          duration: 2,
          ease: "power1.inOut",
          yoyo: true,
          repeat: -1,
        });

        // ✅ FIXED: Features animation with fromTo and immediateRender
        gsap.fromTo(
          ".feature-card",
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ".features-section",
              start: "top 85%",
              toggleActions: "play none none reverse",
              immediateRender: false, // Prevents stuck animation
            },
          },
        );

        // Products animation
        gsap.fromTo(
          ".product-card",
          { scale: 0.9, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: ".products-section",
              start: "top 85%",
              toggleActions: "play none none reverse",
              immediateRender: false,
            },
          },
        );

        // CTA animation
        gsap.fromTo(
          ".cta-content",
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ".cta-section",
              start: "top 85%",
              toggleActions: "play none none reverse",
              immediateRender: false,
            },
          },
        );
      });

      // Refresh after setup
      ScrollTrigger.refresh();
    }, 100);

    // ✅ PROPER CLEANUP
    return () => {
      clearTimeout(initTimer);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const features = [
    {
      icon: "🚀",
      title: "Fast Delivery",
      desc: "Get your products within 24-48 hours",
    },
    {
      icon: "🛡️",
      title: "Secure Payment",
      desc: "100% secure payment methods",
    },
    {
      icon: "🔄",
      title: "Easy Returns",
      desc: "30-day hassle-free return policy",
    },
    {
      icon: "💎",
      title: "Premium Quality",
      desc: "Handpicked products just for you",
    },
  ];

  const products = [
    {
      name: "Wireless Headphones",
      price: "₹2,499",
      tag: "Best Seller",
      image: "🎧",
    },
    { name: "Smart Watch Pro", price: "₹4,999", tag: "New", image: "⌚" },
    { name: "Minimal Backpack", price: "₹1,299", tag: "Trending", image: "🎒" },
    { name: "Desk Lamp LED", price: "₹899", tag: "Sale", image: "💡" },
  ];

  return (
    <div className="min-h-screen bg-[#fefeff] overflow-x-hidden">
      <Navbar />
      {/* Hero Section */}
      <section ref={heroRef} className="sticky px-5 pt-10 pb-20 top-0">
        <div className="max-w-7xl mx-auto">
          <div className="bg-[#f0eeed] rounded-3xl p-8 md:p-16 shadow-lg shadow-gray-400 relative overflow-hidden">
            {/* Animated background shapes */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-gray-200 to-transparent rounded-full blur-3xl opacity-50 animate-pulse" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-gray-300 to-transparent rounded-full blur-2xl opacity-30" />

            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-block bg-black text-white px-4 py-1.5 rounded-full text-sm font-medium mb-2">
                  ✨ New Collection 2024
                </div>
                <h1 className="hero-title font-sekuya text-5xl md:text-7xl font-bold text-black leading-tight">
                  Discover{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-700 to-black">
                    Premium
                  </span>{" "}
                  Living
                </h1>
                <p className="hero-subtitle text-lg md:text-xl text-gray-600 max-w-lg leading-relaxed">
                  Curated essentials for the modern lifestyle. Quality meets
                  affordability in every product we deliver.
                </p>
                <div className="hero-cta flex flex-wrap gap-4 pt-4">
                  <button
                    onClick={() => {
                      navigate("/checkout");
                    }}
                    className="group relative overflow-hidden bg-black text-white px-8 py-4 rounded-full font-medium transition-all duration-500 hover:scale-105 hover:shadow-[0_0_30px_rgba(0,0,0,0.3)]"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      Shop Now
                      <span className="group-hover:translate-x-1 transition-transform duration-300">
                        →
                      </span>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                  </button>
                  <button
                    onClick={() => {
                      navigate("/products");
                    }}
                    className="px-8 py-4 rounded-full border-2 border-black text-black font-medium hover:bg-black hover:text-white transition-all duration-500"
                  >
                    View Collection
                  </button>
                </div>

                {/* Stats */}
                <div className="flex gap-8 pt-8 border-t border-gray-300 mt-8">
                  <div>
                    <p className="text-3xl font-bold text-black">50K+</p>
                    <p className="text-sm text-gray-500">Happy Customers</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-black">10K+</p>
                    <p className="text-sm text-gray-500">Products</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-black">4.9</p>
                    <p className="text-sm text-gray-500">Rating</p>
                  </div>
                </div>
              </div>

              <div className="hero-float relative">
                <div className="relative bg-white rounded-3xl p-6 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-700">
                  <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center text-9xl">
                    <img
                      src="https://i.pinimg.com/1200x/5f/76/89/5f7689b352566d8bfd8062a7d070317d.jpg"
                      alt="Model"
                      className=" bg-cover"
                    />
                  </div>
                  <div className="absolute -bottom-4 -left-4 bg-black text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                    Free Shipping
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="px-5 py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose Us
            </h2>
            <p className="text-gray-600 text-lg">
              Experience shopping like never before
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="feature-card bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2"
                onMouseEnter={() => setIsHovered(index)}
                onMouseLeave={() => setIsHovered(null)}
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section ref={productsRef} className="px-5 py-20 bg-[#f0eeed]">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-black mb-2">
                Featured Products
              </h2>
              <p className="text-gray-600">Handpicked for you this week</p>
            </div>
            <button
              onClick={() => {
                navigate("/products");
              }}
              className="hidden md:flex items-center gap-2 text-black font-medium hover:gap-4 transition-all duration-300"
            >
              View All <span>→</span>
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <div
                key={index}
                className="product-card group bg-[#fefeff] rounded-3xl overflow-hidden shadow-md hover:shadow-xl shadow-gray-400 transition-all duration-700"
              >
                <div className="relative p-6 bg-linear-to-b from-gray-50 to-white">
                  <span className="absolute top-4 left-4 bg-black text-white px-3 py-1 rounded-full text-xs font-medium">
                    {product.tag}
                  </span>
                  <div className="aspect-square flex items-center justify-center text-8xl group-hover:scale-110 transition-transform duration-500">
                    {product.image}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-black mb-1">
                    {product.name}
                  </h3>
                  <div className="flex justify-between items-center">
                    <p className="text-2xl font-bold text-black">
                      {product.price}
                    </p>
                    <button className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center hover:scale-110 hover:shadow-lg transition-all duration-300">
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section ref={ctaRef} className="px-5 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="cta-content bg-black rounded-3xl p-12 md:p-16 text-center relative overflow-hidden shadow-2xl shadow-gray-400">
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-black to-gray-900 opacity-50" />
            <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg%3E%3Cg' fill='none' fill-rule='evenodd%3E%3Cg' fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20" />

            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Stay in the Loop
              </h2>
              <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
                Subscribe to get exclusive offers, early access to new products,
                and insider deals.
              </p>

              <form
                className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto"
                onSubmit={(e) => e.preventDefault()}
              >
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-6 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-white/50 transition-all duration-300"
                />
                <button className="px-8 py-4 bg-white text-black rounded-full font-bold hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-lg">
                  Subscribe
                </button>
              </form>

              <p className="text-gray-500 text-sm mt-6">
                Join 50,000+ subscribers. No spam, ever.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-5 py-12 bg-[#f0eeed] border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold font-sekuya text-black">
                Indo-Buy
              </h3>
              <p className="text-gray-600 text-sm">
                Premium e-commerce experience for the modern Indian consumer.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-black mb-4">Shop</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="hover:text-black cursor-pointer transition-colors">
                  New Arrivals
                </li>
                <li className="hover:text-black cursor-pointer transition-colors">
                  Best Sellers
                </li>
                <li className="hover:text-black cursor-pointer transition-colors">
                  Deals
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-black mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="hover:text-black cursor-pointer transition-colors">
                  Help Center
                </li>
                <li className="hover:text-black cursor-pointer transition-colors">
                  Returns
                </li>
                <li className="hover:text-black cursor-pointer transition-colors">
                  Contact Us
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-black mb-4">Connect</h4>
              <div className="flex gap-4">
                {["📱", "📧", "💬", "📸"].map((icon, i) => (
                  <div
                    key={i}
                    className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300 cursor-pointer"
                  >
                    {icon}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-300 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © 2024 Indo-Buy. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-gray-500">
              <span className="hover:text-black cursor-pointer transition-colors">
                Privacy Policy
              </span>
              <span className="hover:text-black cursor-pointer transition-colors">
                Terms of Service
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
