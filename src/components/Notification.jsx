import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react";

// ============================================
// NOTIFICATION COMPONENT - Success/Error/Warning/Info messages
// ============================================
const Notification = ({ type, message, onClose, duration = 5000 }) => {
  const notificationRef = useRef(null);
  const progressRef = useRef(null);

  // Types: 'success' | 'error' | 'warning' | 'info'
  const config = {
    success: {
      icon: <CheckCircle className="w-6 h-6" />,
      bgColor: "bg-green-500",
      lightBg: "bg-green-50",
      borderColor: "border-green-200",
      textColor: "text-green-800",
      iconColor: "text-green-500",
      title: "Success!",
    },
    error: {
      icon: <XCircle className="w-6 h-6" />,
      bgColor: "bg-red-500",
      lightBg: "bg-red-50",
      borderColor: "border-red-200",
      textColor: "text-red-800",
      iconColor: "text-red-500",
      title: "Error!",
    },
    warning: {
      icon: <AlertCircle className="w-6 h-6" />,
      bgColor: "bg-yellow-500",
      lightBg: "bg-yellow-50",
      borderColor: "border-yellow-200",
      textColor: "text-yellow-800",
      iconColor: "text-yellow-500",
      title: "Warning!",
    },
    info: {
      icon: <Info className="w-6 h-6" />,
      bgColor: "bg-blue-500",
      lightBg: "bg-blue-50",
      borderColor: "border-blue-200",
      textColor: "text-blue-800",
      iconColor: "text-blue-500",
      title: "Info",
    },
  };

  const currentConfig = config[type] || config.success;

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance animation - slide in from right with bounce
      gsap.fromTo(
        notificationRef.current,
        {
          x: 100,
          opacity: 0,
          scale: 0.8,
        },
        {
          x: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: "back.out(1.7)",
        },
      );

      // Icon pop animation
      gsap.fromTo(
        ".notification-icon",
        { scale: 0, rotation: -180 },
        {
          scale: 1,
          rotation: 0,
          duration: 0.5,
          delay: 0.2,
          ease: "back.out(2)",
        },
      );

      // Progress bar animation (auto-close timer)
      if (duration > 0 && progressRef.current) {
        gsap.fromTo(
          progressRef.current,
          { scaleX: 1 },
          {
            scaleX: 0,
            duration: duration / 1000,
            ease: "linear",
            onComplete: () => onClose && onClose(),
          },
        );
      }
    });

    return () => ctx.revert();
  }, [duration, onClose]);

  // Manual close animation
  const handleClose = () => {
    gsap.to(notificationRef.current, {
      x: 100,
      opacity: 0,
      scale: 0.8,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => onClose && onClose(),
    });
  };

  return (
    <div
      ref={notificationRef}
      className={`fixed top-24 right-5 z-50 max-w-sm w-full ${currentConfig.lightBg} border-2 ${currentConfig.borderColor} rounded-3xl shadow-2xl shadow-gray-400 overflow-hidden`}
      role="alert"
    >
      {/* Progress bar at top */}
      {duration > 0 && (
        <div
          className={`h-1 ${currentConfig.bgColor} origin-left`}
          ref={progressRef}
        />
      )}

      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Animated Icon Circle */}
          <div
            className={`notification-icon flex-shrink-0 w-12 h-12 ${currentConfig.bgColor} rounded-full flex items-center justify-center text-white shadow-lg`}
          >
            {currentConfig.icon}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h4 className={`font-bold ${currentConfig.textColor} text-lg mb-1`}>
              {currentConfig.title}
            </h4>
            <p
              className={`${currentConfig.textColor} text-sm leading-relaxed opacity-90`}
            >
              {message}
            </p>
          </div>

          {/* Close Button */}
          <button
            onClick={handleClose}
            className={`flex-shrink-0 p-2 rounded-full hover:bg-black/5 transition-colors duration-300 ${currentConfig.textColor}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================
// CENTERED MODAL VERSION - For login/register success
// ============================================
const SuccessModal = ({ isOpen, type, message, onClose, redirectTo }) => {
  const modalRef = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const ctx = gsap.context(() => {
      // Overlay fade in
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3 },
      );

      // Modal scale and fade in
      gsap.fromTo(
        modalRef.current,
        {
          scale: 0.5,
          opacity: 0,
          y: 50,
        },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "back.out(1.7)",
          delay: 0.1,
        },
      );

      // Success icon bounce
      gsap.fromTo(
        ".success-modal-icon",
        { scale: 0, rotation: -360 },
        {
          scale: 1,
          rotation: 0,
          duration: 0.6,
          delay: 0.3,
          ease: "elastic.out(1, 0.5)",
        },
      );

      // Confetti effect (optional celebration)
      gsap.fromTo(
        ".confetti",
        { y: -20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.4,
          stagger: 0.05,
          delay: 0.5,
        },
      );
    });

    // Auto redirect after 3 seconds if redirectTo provided
    let redirectTimer;
    if (redirectTo && type === "success") {
      redirectTimer = setTimeout(() => {
        window.location.href = redirectTo;
      }, 3000);
    }

    return () => {
      ctx.revert();
      clearTimeout(redirectTimer);
    };
  }, [isOpen, type, redirectTo]);

  if (!isOpen) return null;

  const isSuccess = type === "success";
  const isError = type === "error";

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="bg-[#f0eeed] rounded-3xl shadow-2xl shadow-gray-400 max-w-md w-full p-8 text-center relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black/5 to-transparent" />

        {/* Confetti decorations for success */}
        {isSuccess && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {["🎉", "✨", "🎊", "⭐", "🎈"].map((emoji, i) => (
              <span
                key={i}
                className="confetti absolute text-2xl"
                style={{
                  top: `${10 + Math.random() * 20}%`,
                  left: `${10 + i * 20}%`,
                  transform: `rotate(${Math.random() * 360}deg)`,
                }}
              >
                {emoji}
              </span>
            ))}
          </div>
        )}

        {/* Icon */}
        <div
          className={`success-modal-icon w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center shadow-xl ${
            isSuccess
              ? "bg-green-500 text-white"
              : isError
                ? "bg-red-500 text-white"
                : "bg-yellow-500 text-white"
          }`}
        >
          {isSuccess ? (
            <CheckCircle className="w-12 h-12" />
          ) : isError ? (
            <XCircle className="w-12 h-12" />
          ) : (
            <AlertCircle className="w-12 h-12" />
          )}
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold font-sekuya text-black mb-3">
          {isSuccess ? "Welcome Back!" : isError ? "Oops!" : "Attention"}
        </h2>

        {/* Message */}
        <p className="text-gray-600 text-lg mb-8 leading-relaxed">{message}</p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={onClose}
            className={`w-full py-4 rounded-full font-medium transition-all duration-500 hover:scale-105 shadow-lg ${
              isSuccess
                ? "bg-black text-white hover:shadow-[0_0_20px_rgba(0,0,0,0.3)]"
                : "bg-black text-white"
            }`}
          >
            {isSuccess ? "Continue Shopping →" : "Try Again"}
          </button>

          {redirectTo && isSuccess && (
            <p className="text-sm text-gray-500">Redirecting in 3 seconds...</p>
          )}
        </div>

        {/* Close X button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/10 transition-colors duration-300"
        >
          <X className="w-6 h-6 text-gray-500" />
        </button>
      </div>
    </div>
  );
};

// ============================================
// TOAST CONTAINER - Manage multiple notifications
// ============================================
const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-24 right-5 z-50 flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Notification
            type={toast.type}
            message={toast.message}
            onClose={() => removeToast(toast.id)}
            duration={toast.duration}
          />
        </div>
      ))}
    </div>
  );
};

// ============================================
// EXAMPLE USAGE IN LOGIN/REGISTER PAGE
// ============================================
const AuthPageExample = () => {
  const [notification, setNotification] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleLogin = async (credentials) => {
    try {
      // API call...
      const response = await axios.post("/api/login", credentials);

      if (response.data.success) {
        // Show success modal for login
        setShowSuccessModal(true);

        // Or show toast notification
        setNotification({
          type: "success",
          message: "Login successful! Welcome back.",
        });
      }
    } catch (error) {
      // Show error notification
      setNotification({
        type: "error",
        message:
          error.response?.data?.message ||
          "Login failed. Please check your credentials.",
      });
    }
  };

  return (
    <div>
      {/* Your login form here */}

      {/* Toast Notification */}
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
        isOpen={showSuccessModal}
        type="success"
        message="You have successfully logged in! Get ready to explore amazing products."
        onClose={() => setShowSuccessModal(false)}
        redirectTo="/"
      />
    </div>
  );
};

export { Notification, SuccessModal, ToastContainer };
export default Notification;
