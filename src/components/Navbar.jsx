import { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";
import { useNavigate } from "react-router-dom";
import { Menu, X, User, ShoppingCart, LogOut } from "lucide-react";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const { cartCount } = useCart();;
  const navbarRef = useRef(null);
  const navigate = useNavigate();

  // State for mobile menu
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // State to track if user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  // GSAP animation for navbar entrance
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(navbarRef.current, {
        y: -100,
        opacity: 0,
        duration: 1.2,
        ease: "power4.out",
        delay: 0.2,
      });
    });
    return () => ctx.revert();
  }, []);

  // Check screen size and login status on mount
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 850);
    };

    // Check if user is logged in (token exists in localStorage)
    const checkAuthStatus = () => {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");

      if (token && user) {
        setIsLoggedIn(true);
        setUserData(JSON.parse(user));
      } else {
        setIsLoggedIn(false);
        setUserData(null);
      }
    };

    checkScreenSize();
    checkAuthStatus();

    // Add event listeners
    window.addEventListener("resize", checkScreenSize);

    // Listen for storage changes (login/logout from other tabs)
    window.addEventListener("storage", checkAuthStatus);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
      window.removeEventListener("storage", checkAuthStatus);
    };
  }, []);

  // Handle navigation and close mobile menu
  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("cart");
    localStorage.removeItem("email");

    setIsLoggedIn(false);
    setUserData(null);
    navigate("/signup");
    setIsMobileMenuOpen(false);
  };

  // Toggle mobile menu with animation
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);

    if (!isMobileMenuOpen) {
      gsap.fromTo(
        ".mobile-menu-item",
        { x: -30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.4, stagger: 0.1, ease: "power2.out" },
      );
    }
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (userData?.username.toUpperCase()) {
      return userData.username
        .toUpperCase()
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return `${userData?.username[0].toUpperCase()}`;
  };

  return (
    <div ref={navbarRef} className="navbar bg-[#fefeff] sticky top-0 z-50">
      <div className="p-5">
        <nav className="bg-[#f0eeed] p-5 rounded-3xl flex items-center justify-between shadow-lg shadow-gray-400">
          {/* Logo */}
          <div>
            <h1
              onClick={() => handleNavigation("/")}
              className="text-3xl font-bold font-sekuya cursor-pointer"
            >
              Indo-Buy
            </h1>
          </div>

          {/* DESKTOP NAVIGATION */}
          <div className="hidden md:flex items-center gap-4">
            <ul className="flex space-x-4">
              <li>
                <a
                  onClick={() => handleNavigation("/")}
                  className="text-black hover:bg-black py-2.5 px-5 rounded-full hover:text-white transition-all duration-700 cursor-pointer"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  onClick={() => handleNavigation("/products")}
                  className="text-black hover:bg-black py-2.5 px-5 rounded-full hover:text-white transition-all duration-700 cursor-pointer"
                >
                  Products
                </a>
              </li>
              <li>
                <a
                  onClick={() => handleNavigation("/orders")}
                  className="text-black hover:bg-black py-2.5 px-5 rounded-full hover:text-white transition-all duration-700 cursor-pointer"
                >
                  Order
                </a>
              </li>
              <li>
                <a
                  onClick={() => handleNavigation("/about")}
                  className="text-black hover:bg-black py-2.5 px-5 rounded-full hover:text-white transition-all duration-700 cursor-pointer"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  onClick={() => handleNavigation("/contact")}
                  className="text-black hover:bg-black py-2.5 px-5 rounded-full hover:text-white transition-all duration-700 cursor-pointer"
                >
                  Contact
                </a>
              </li>
            </ul>

            {/* User Profile Section - Shows when logged in */}
            {isLoggedIn ? (
              <div className="flex items-center gap-3 pl-4 border-l border-gray-300">
                {/* Cart Icon */}
                <button
                  onClick={() => handleNavigation("/cart")}
                  className="p-2.5 rounded-full hover:bg-black hover:text-white transition-all duration-700 relative"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {/* Cart badge - optional */}
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                      {cartCount}
                    </span>
                  )}
                </button>

                {/* Profile Avatar */}
                <div className="relative group">
                  <button
                    onClick={() => handleNavigation("/profile")}
                    className="flex items-center gap-2 pl-2 pr-4 py-2 rounded-full bg-black text-white hover:scale-105 transition-all duration-300 shadow-lg"
                  >
                    {/* Avatar Circle */}
                    <div className="w-8 h-8 bg-white text-black rounded-full flex items-center justify-center font-bold text-sm">
                      {userData.username[0].toUpperCase()}
                    </div>
                    <span className="font-medium text-sm max-w-25 truncate">
                      {userData?.username.toUpperCase() || "User"}
                    </span>
                  </button>

                  {/* Dropdown Menu on Hover */}
                  <div className="absolute right-0 top-full mt-2 w-48 bg-[#f0eeed] rounded-2xl shadow-xl shadow-gray-400 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right">
                    <div className="p-2">
                      <button
                        onClick={() => handleNavigation("/profile")}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white transition-all duration-300 text-left"
                      >
                        <User className="w-5 h-5" />
                        <span className="font-medium">My Profile</span>
                      </button>
                      <button
                        onClick={() => handleNavigation("/orders")}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white transition-all duration-300 text-left"
                      >
                        <ShoppingCart className="w-5 h-5" />
                        <span className="font-medium">My Orders</span>
                      </button>
                      <hr className="my-2 border-gray-300" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 text-red-600 transition-all duration-300 text-left"
                      >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Logout</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* SignUp Button - Shows when NOT logged in */
              <a
                onClick={() => handleNavigation("/signup")}
                className="relative overflow-hidden bg-black px-5 py-2.5 rounded-full text-white transition-all duration-300 hover:scale-110 hover:shadow-[0_0_20px_rgba(0,0,0,0.5)] cursor-pointer"
              >
                SignUp
              </a>
            )}
          </div>

          {/* MOBILE HAMBURGER BUTTON */}
          <div className="md:hidden flex items-center gap-3">
            {/* Mobile Cart Icon (if logged in) */}
            {isLoggedIn && (
              <button
                onClick={() => handleNavigation("/cart")}
                className="p-2 rounded-full hover:bg-black hover:text-white transition-all duration-700 relative"
              >
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              </button>
            )}

            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-full hover:bg-black hover:text-white transition-all duration-700"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </nav>

        {/* MOBILE MENU DROPDOWN */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 bg-[#f0eeed] rounded-3xl shadow-lg shadow-gray-400 p-6 overflow-hidden">
            <ul className="flex flex-col space-y-4">
              {/* Mobile Profile Section (if logged in) */}
              {isLoggedIn && (
                <li className="mobile-menu-item pb-4 border-b border-gray-300">
                  <div
                    onClick={() => handleNavigation("/profile")}
                    className="flex items-center gap-4 p-4 bg-white rounded-2xl cursor-pointer hover:shadow-md transition-all duration-300"
                  >
                    <div className="w-14 h-14 bg-black text-white rounded-full flex items-center justify-center font-bold text-lg">
                      {getUserInitials()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-black truncate">
                        {userData?.username?.toUpperCase() || "User"}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        View Profile →
                      </p>
                    </div>
                  </div>
                </li>
              )}

              <li className="mobile-menu-item">
                <a
                  onClick={() => handleNavigation("/")}
                  className="block text-black hover:bg-black py-3 px-5 rounded-full hover:text-white transition-all duration-700 cursor-pointer text-center"
                >
                  Home
                </a>
              </li>

              <li className="mobile-menu-item">
                <a
                  onClick={() => handleNavigation("/products")}
                  className="block text-black hover:bg-black py-3 px-5 rounded-full hover:text-white transition-all duration-700 cursor-pointer text-center"
                >
                  Products
                </a>
              </li>

              <li className="mobile-menu-item">
                <a
                  onClick={() => handleNavigation("/about")}
                  className="block text-black hover:bg-black py-3 px-5 rounded-full hover:text-white transition-all duration-700 cursor-pointer text-center"
                >
                  About
                </a>
              </li>

              <li className="mobile-menu-item">
                <a
                  onClick={() => handleNavigation("/contact")}
                  className="block text-black hover:bg-black py-3 px-5 rounded-full hover:text-white transition-all duration-700 cursor-pointer text-center"
                >
                  Contact
                </a>
              </li>

              {/* Mobile Orders Link (if logged in) */}
              {isLoggedIn && (
                <li className="mobile-menu-item">
                  <a
                    onClick={() => handleNavigation("/orders")}
                    className="block text-black hover:bg-black py-3 px-5 rounded-full hover:text-white transition-all duration-700 cursor-pointer text-center"
                  >
                    My Orders
                  </a>
                </li>
              )}

              {/* SignUp or Logout Button */}
              <li className="mobile-menu-item pt-4 border-t border-gray-300">
                {isLoggedIn ? (
                  <a
                    onClick={handleLogout}
                    className="block bg-red-50 text-red-600 py-3 px-5 rounded-full hover:bg-red-100 transition-all duration-700 cursor-pointer text-center font-medium"
                  >
                    Logout
                  </a>
                ) : (
                  <a
                    onClick={() => handleNavigation("/signup")}
                    className="block bg-black text-white py-3 px-5 rounded-full transition-all duration-300 hover:scale-105 cursor-pointer text-center font-medium"
                  >
                    SignUp
                  </a>
                )}
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
