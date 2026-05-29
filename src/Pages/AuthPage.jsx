import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Notification, SuccessModal } from "../components/Notification";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowRight,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../Services/authService";

// ============================================
// AUTH PAGE COMPONENT - Main container for Login/Register
// ============================================
const AuthPage = () => {
  // State to toggle between login and register forms
  // 'login' | 'register' - controls which form is visible
  const [activeTab, setActiveTab] = useState("register");

  // Loading state for API calls - shows spinner when true
  const [isLoading, setIsLoading] = useState(false);

  // State to store success/error messages from API responses
  const [message, setMessage] = useState({ type: "", text: "" });

  // ============================================
  // GSAP ANIMATION REFS - References to DOM elements for animations
  // ============================================
  const containerRef = useRef(null); // Main container reference
  const formRef = useRef(null); // Form wrapper reference
  const imageRef = useRef(null); // Left side image/illustration reference

  // ============================================
  // USEEFFECT - Runs animations when component mounts or tab changes
  // ============================================
  useEffect(() => {
    // Create GSAP context for proper cleanup
    const ctx = gsap.context(() => {
      // Initial entrance animation for the main container
      // Slides up from 50px with fade in, lasts 1 second
      gsap.from(containerRef.current, {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });

      // Staggered animation for form elements
      // Each child element animates in sequence with 0.1s delay between them
      gsap.from(".form-element", {
        y: 30,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
      });

      // Floating animation for the illustration side
      // Moves up and down continuously for visual appeal
      gsap.to(".floating-element", {
        y: -15,
        duration: 2,
        ease: "power1.inOut",
        yoyo: true, // Reverses animation back and forth
        repeat: -1, // Infinite loop
      });
    });

    // Cleanup function - removes all GSAP animations when component unmounts
    // Prevents memory leaks and animation conflicts
    return () => ctx.revert();
  }, [activeTab]); // Re-run animations when tab changes (login <-> register)

  // ============================================
  // RENDER - Main component render with split-screen layout
  // ============================================
  return (
    <div className="min-h-screen bg-[#fefeff] flex items-center justify-center p-4 md:p-8">
      {/* Main Card Container - Uses your warm gray color #f0eeed */}
      <div
        ref={containerRef}
        className="w-full max-w-6xl bg-[#f0eeed] rounded-3xl shadow-2xl shadow-gray-400 overflow-hidden flex flex-col lg:flex-row min-h-150"
      >
        {/* LEFT SIDE - Visual/Illustration Section */}
        {/* Hidden on mobile, visible on large screens */}
        <div
          ref={imageRef}
          className="hidden lg:flex lg:w-1/2 bg-black relative items-center justify-center p-12 overflow-hidden"
        >
          {/* Animated background gradient for visual depth */}
          <div className="absolute inset-0 bg-linear-to-br from-gray-900 via-black to-gray-800" />

          {/* Decorative circles with blur effect */}
          <div className="absolute top-20 right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 left-20 w-48 h-48 bg-gray-700/20 rounded-full blur-2xl" />

          {/* Content container with floating animation */}
          <div className="floating-element relative z-10 text-center text-white space-y-6">
            {/* Large emoji/icon as brand illustration */}
            <div className="text-9xl mb-4">🛍️</div>
            <h2 className="text-4xl font-bold font-sekuya">
              Welcome to Indo-Buy
            </h2>
            <p className="text-gray-400 text-lg max-w-sm mx-auto leading-relaxed">
              {activeTab === "login"
                ? "Sign in to access your orders, wishlist, and exclusive deals."
                : "Join thousands of happy customers and start your shopping journey today."}
            </p>

            {/* Feature bullets with checkmarks */}
            <div className="flex flex-col gap-3 mt-8 text-left max-w-xs mx-auto">
              <div className="flex items-center gap-3 text-gray-300">
                <CheckCircle className="w-5 h-5 text-white" />
                <span className="text-sm">
                  Free shipping on orders above ₹999
                </span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <CheckCircle className="w-5 h-5 text-white" />
                <span className="text-sm">Exclusive member-only discounts</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <CheckCircle className="w-5 h-5 text-white" />
                <span className="text-sm">Easy 30-day returns policy</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - Form Section */}
        <div className="w-full lg:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          {/* Tab Switcher - Toggle between Login and Register */}
          {/* Uses your navbar's rounded-full and transition styling */}
          <div className="form-element flex p-1.5 bg-white rounded-full shadow-inner mb-8 max-w-sm mx-auto w-full">
            <button
              onClick={() => setActiveTab("login")}
              className={`flex-1 py-3 px-6 rounded-full text-sm font-medium transition-all cursor-pointer duration-700 ${
                activeTab === "login"
                  ? "bg-black text-white shadow-lg" // Active state - black bg like your SignUp button
                  : "text-gray-600 hover:text-black" // Inactive state
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setActiveTab("register")}
              className={`flex-1 py-3 px-6 rounded-full text-sm font-medium transition-all cursor-pointer duration-700 ${
                activeTab === "register"
                  ? "bg-black text-white shadow-lg"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              Register
            </button>
          </div>

          {/* Form Container with AnimatePresence-like effect using GSAP */}
          <div ref={formRef} className="max-w-sm mx-auto w-full">
            {/* Conditional rendering based on active tab */}
            {activeTab === "login" ? (
              <LoginForm
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                message={message}
                setMessage={setMessage}
              />
            ) : (
              <RegisterForm
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                message={message}
                setMessage={setMessage}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// LOGIN FORM COMPONENT - Handles user authentication
// ============================================
const LoginForm = ({ isLoading, setIsLoading, message, setMessage }) => {
  // Check is user is logged in or not...

  const navigate = useNavigate();
  // State for form inputs - controlled components pattern
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // State to toggle password visibility (show/hide)
  const [showPassword, setShowPassword] = useState(false);

  // ============================================
  // HANDLE INPUT CHANGE - Updates state when user types
  // ============================================
  const handleChange = (e) => {
    // Destructure name and value from the input event
    const { name, value } = e.target;

    // Update formData state while preserving other fields
    // [name] is dynamic key - works for both email and password
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear any previous error messages when user starts typing
    if (message.text) setMessage({ type: "", text: "" });
  };

  // ============================================
  // HANDLE LOGIN SUBMIT - API call with Axios
  // ============================================
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission (page reload)

    // Basic client-side validation before API call
    if (!formData.email || !formData.password) {
      setMessage({ type: "error", text: "Please fill in all fields" });
      return;
    }

    // Set loading state to true - shows spinner, disables button
    setIsLoading(true);

    // Clear any previous messages
    setMessage({ type: "", text: "" });

    try {
      // ============================================
      // AXIOS POST REQUEST - Send login data to backend
      // ============================================
      // In production, replace with your actual API endpoint
      const response = await loginUser(formData);

      const token = response.data.user.token;

      console.log(response);
      // Success response handling
      if (token) {
        setMessage({
          type: "success",
          text: "Login successful! Redirecting...",
        });

        // Store auth token in localStorage for persistent login
        // Token used for authenticated requests throughout the app
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        // GSAP success animation - green checkmark bounce
        gsap.from(".success-icon", {
          scale: 0,
          duration: 0.5,
          ease: "back.out(1.7)",
        });

        // Redirect to homepage after 1.5 seconds
        setIsLoading(true);
        setTimeout(() => {
          navigate("/");
        }, 1500);
      }
    } catch (error) {
      // Error handling - different messages for different error types
      let errorMsg = "Login failed. Please try again.";

      if (error.response) {
        // Server responded with error status (4xx, 5xx)
        errorMsg = error.response.data.message || "Invalid credentials";
      } else if (error.request) {
        // Request made but no response (network error)
        errorMsg = "Network error. Please check your connection.";
      }

      setMessage({ type: "error", text: errorMsg });

      // Shake animation for error feedback
      gsap.to(".form-container", {
        x: [-10, 10, -10, 10, 0],
        duration: 0.4,
        ease: "power2.inOut",
      });
    } finally {
      // Always set loading to false when done (success or error)
      setIsLoading(false);
    }
  };

  return (
    <div className="form-container space-y-6">
      {/* Header text */}
      <div className="form-element text-center mb-8">
        <h3 className="text-3xl font-bold text-black mb-2">Welcome Back</h3>
        <p className="text-gray-600">
          Enter your credentials to access your account
        </p>
      </div>

      {/* Message Alert - Shows success or error messages */}
      {message.text && (
        <div
          className={`form-element flex items-center gap-2 p-4 rounded-2xl text-sm ${
            message.type === "success"
              ? "bg-green-100 text-green-800 border border-green-200"
              : "bg-red-100 text-red-800 border border-red-200"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle className="w-5 h-5 success-icon" />
          ) : (
            <XCircle className="w-5 h-5" />
          )}
          {message.text}
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email Input Field */}
        <div className="form-element space-y-2">
          <label className="text-sm font-medium text-gray-700 ml-1">
            Email Address
          </label>
          <div className="relative group">
            {/* Mail icon positioned absolutely on the left */}
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-black transition-colors duration-300" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border-2 border-gray-200 focus:border-black focus:outline-none transition-all duration-300 shadow-sm hover:shadow-md"
              required // HTML5 validation
            />
          </div>
        </div>

        {/* Password Input Field with Toggle Visibility */}
        <div className="form-element space-y-2">
          <label className="text-sm font-medium text-gray-700 ml-1">
            Password
          </label>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-black transition-colors duration-300" />
            <input
              type={showPassword ? "text" : "password"} // Toggle between text and password type
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full pl-12 pr-12 py-4 bg-white rounded-2xl border-2 border-gray-200 focus:border-black focus:outline-none transition-all duration-300 shadow-sm hover:shadow-md"
              required
            />
            {/* Eye icon button to toggle password visibility */}
            <button
              type="button" // Important: type="button" prevents form submission
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Forgot Password Link */}
        <div className="form-element flex justify-end">
          <a
            href="#"
            className="text-sm text-gray-600 hover:text-black transition-colors duration-300 underline-offset-4 hover:underline"
          >
            Forgot password?
          </a>
        </div>

        {/* Submit Button with Loading State */}
        <button
          type="submit"
          disabled={isLoading} // Disable button while loading
          className="form-element w-full bg-black text-white py-4 rounded-full font-medium shadow-lg shadow-gray-400 hover:shadow-xl hover:scale-[1.02] transition-all duration-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
        >
          {isLoading ? (
            // Loading Spinner - shown when isLoading is true
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Signing in...</span>
            </>
          ) : (
            // Normal button content
            <>
              <span>Sign In</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};

// ============================================
// REGISTER FORM WITH GOOGLE AUTH
// ============================================
const RegisterForm = ({ isLoading, setIsLoading, message, setMessage }) => {
  const [notification, setNotification] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    type: "success",
    message: "",
  });
  const navigate = useNavigate();
  // Extended form data for registration (more fields than login)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Same change handler pattern as login
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (message.text) setMessage({ type: "", text: "" });
  };

  // ============================================
  // HANDLE REGISTER SUBMIT - API call with validation
  // ============================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation: Check if all fields are filled
    if (!formData.username || !formData.email || !formData.password) {
      setMessage({ type: "error", text: "Please fill in all fields" });
      return;
    }

    // Validation: Password match check
    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" });
      return;
    }

    // Validation: Password strength (minimum 6 characters)
    if (formData.password.length < 6) {
      setMessage({
        type: "error",
        text: "Password must be at least 6 characters",
      });
      return;
    }

    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      // ============================================
      // AXIOS POST REQUEST - Send registration data
      // ============================================
      const response = await registerUser(
        {
          username: formData.username,
          email: formData.email,
          password: formData.password,
        },
        {
          headers: { "Content-Type": "application/json" },
          timeout: 10000,
        },
      );

      localStorage.setItem("user", JSON.stringify(formData.sername));
      localStorage.setItem("email", JSON.stringify(formData.email));
      localStorage.setItem(
        "createdAt",
        JSON.stringify(response.data.user.lastLogin),
      );
      // Show success modal
      setModalConfig({
        type: "success",
        message: "Welcome back! You have successfully logged in.",
      });
      setShowModal(true);

      if (response) {
        setMessage({
          type: "success",
          text: "Account created successfully! Please login.",
        });

        // GSAP celebration animation
        gsap.from(".success-icon", {
          scale: 0,
          rotation: 360,
          duration: 0.6,
          ease: "back.out(1.7)",
        });

        // Clear form after successful registration
        setFormData({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        // Optional: Auto-switch to login tab after 2 seconds
        setTimeout(() => {
          // You can call setActiveTab("login") here if you lift state up
        }, 2000);
      }
      return (
        <div className="min-h-screen bg-[#fefeff]">
          {/* Your existing form code */}

          {/* Error Notification (Toast) */}
          {notification && (
            <Notification
              type={notification.type}
              message={notification.message}
              onClose={() => setNotification(null)}
              duration={5000}
            />
          )}

          {/* Success Modal */}
          <SuccessModal
            isOpen={showModal}
            type={modalConfig.type}
            message={modalConfig.message}
            onClose={() => {
              setShowModal(false);
              navigate("/"); // Redirect after closing
            }}
            redirectTo="/"
          />
        </div>
      );
    } catch (error) {
      let errorMsg = "Registration failed. Please try again.";

      if (error.response) {
        // Handle specific backend errors (e.g., email already exists)
        if (error.response.status === 409) {
          errorMsg = "Email already registered. Please login.";
        } else {
          errorMsg = error.response.data.message || errorMsg;
        }
      } else if (error.request) {
        errorMsg = "Network error. Please check your connection.";
      }

      setMessage({ type: "error", text: errorMsg });

      // Error shake animation
      gsap.to(".form-container", {
        x: [-10, 10, -10, 10, 0],
        duration: 0.4,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-container space-y-5">
      {/* Header */}
      <div className="form-element text-center mb-6">
        <h3 className="text-3xl font-bold text-black mb-2">Create Account</h3>
        <p className="text-gray-600">Join Indo-Buy for exclusive benefits</p>
      </div>

      {/* Alert Message */}
      {message.text && (
        <div
          className={`form-element flex items-center gap-2 p-4 rounded-2xl text-sm ${
            message.type === "success"
              ? "bg-green-100 text-green-800 border border-green-200"
              : "bg-red-100 text-red-800 border border-red-200"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle className="success-icon w-5 h-5" />
          ) : (
            <XCircle className="w-5 h-5" />
          )}
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name Input */}
        <div className="form-element space-y-2">
          <label className="text-sm font-medium text-gray-700 ml-1">
            Full Name
          </label>
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-black transition-colors" />
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="John Doe"
              className="w-full pl-12 pr-4 py-3.5 bg-white rounded-2xl border-2 border-gray-200 focus:border-black focus:outline-none transition-all shadow-sm hover:shadow-md"
              required
            />
          </div>
        </div>

        {/* Email Input */}
        <div className="form-element space-y-2">
          <label className="text-sm font-medium text-gray-700 ml-1">
            Email Address
          </label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-black transition-colors" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full pl-12 pr-4 py-3.5 bg-white rounded-2xl border-2 border-gray-200 focus:border-black focus:outline-none transition-all shadow-sm hover:shadow-md"
              required
            />
          </div>
        </div>

        {/* Password Input */}
        <div className="form-element space-y-2">
          <label className="text-sm font-medium text-gray-700 ml-1">
            Password
          </label>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-black transition-colors" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Min. 6 characters"
              className="w-full pl-12 pr-12 py-3.5 bg-white rounded-2xl border-2 border-gray-200 focus:border-black focus:outline-none transition-all shadow-sm hover:shadow-md"
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Confirm Password Input */}
        <div className="form-element space-y-2">
          <label className="text-sm font-medium text-gray-700 ml-1">
            Confirm Password
          </label>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-black transition-colors" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              className="w-full pl-12 pr-12 py-3.5 bg-white rounded-2xl border-2 border-gray-200 focus:border-black focus:outline-none transition-all shadow-sm hover:shadow-md"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
            >
              {showConfirmPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Terms Checkbox */}
        <div className="form-element flex items-start gap-3 py-2">
          <input
            type="checkbox"
            id="terms"
            className="mt-1 w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
            required
          />
          <div className="text-sm text-gray-600 leading-tight">
            I agree to the{" "}
            <a
              onClick={() => {
                navigate("/termscondition");
              }}
              className="text-black underline hover:no-underline cursor-pointer"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              onClick={() => {
                navigate("/termscondition");
              }}
              className="text-black underline hover:no-underline cursor-pointer"
            >
              Privacy Policy
            </a>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="form-element w-full bg-black text-white py-3.5 rounded-full font-medium shadow-lg shadow-gray-400 hover:shadow-xl hover:scale-[1.02] transition-all duration-700 disabled:opacity-50 flex items-center justify-center gap-2 group cursor-pointer"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Creating account...</span>
            </>
          ) : (
            <>
              <span>Create Account</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default AuthPage;
