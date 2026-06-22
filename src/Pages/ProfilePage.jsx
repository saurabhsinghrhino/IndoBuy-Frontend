import { useEffect, useState, useMemo, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";

const STYLES = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  /* Static "online" indicator: single pulse, then stops.
     Continuous animate-ping / animate-pulse run forever — wasted GPU budget. */
  @keyframes pingOnce {
    0%   { transform: scale(1); opacity: 1; }
    70%  { transform: scale(1.8); opacity: 0; }
    100% { transform: scale(1.8); opacity: 0; }
  }
  .profile-card-enter { animation: fadeIn 0.4s ease-out both; }

  /* CSS-only hover lift — no JS style mutation, no main-thread work.
     translateY is composited (GPU only). */
  .profile-hover-lift {
    transition: transform 0.25s ease;
    will-change: transform;
  }
  .profile-hover-lift:hover { transform: translateY(-2px); }

  /* Avatar spin: small element, low paint area, acceptable */
  .avatar-circle {
    transition: transform 0.3s ease;
    will-change: transform;
  }
  .avatar-circle:hover { transform: scale(1.1) rotate(6deg); }

  /* Grid card hover: border-color change is cheap (no repaint, just composite).
     Removed hover:shadow-md — shadow change forces repaint. */
  .detail-card {
    transition: border-color 0.2s ease;
    border: 1px solid transparent;
  }
  .detail-card:hover { border-color: rgba(0,0,0,0.12); }
  .detail-card:hover .detail-card-text { transform: translateX(2px); }
  .detail-card-text {
    transition: transform 0.2s ease;
    will-change: transform;
  }

  /* Buttons: only transition transform + opacity — both compositable.
     Removed transition-all (watches every property including box-shadow). */
  .btn-action {
    transition: transform 0.15s ease, opacity 0.15s ease;
    will-change: transform;
  }
  .btn-action:hover  { opacity: 0.88; }
  .btn-action:active { transform: scale(0.96); }
  .btn-icon {
    transition: transform 0.2s ease;
    display: inline-block;
  }
  .btn-action:hover .btn-icon-right { transform: translateX(3px); }
  .btn-action:hover .btn-icon-left  { transform: translateX(-3px); }

  /* Removed hover:shadow-red/blue — box-shadow animation = repaint.
     Replace with a subtle ring using outline (compositable in modern browsers). */
  .btn-action:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }

  /* Online dot: runs once, then rests — not forever like animate-ping */
  .online-dot::after {
    content: '';
    position: absolute;
    inset: -3px;
    border-radius: 50%;
    border: 2px solid #22c55e;
    animation: pingOnce 1.2s ease-out 0.5s both;
  }
  .online-dot {
    position: relative;
    display: inline-block;
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }
`;

// Inject once at module level — not inside component (avoids re-inject on re-render)
if (
  typeof document !== "undefined" &&
  !document.getElementById("profile-perf-styles")
) {
  const tag = document.createElement("style");
  tag.id = "profile-perf-styles";
  tag.textContent = STYLES;
  document.head.appendChild(tag);
}

// ─── Component ────────────────────────────────────────────────────────────────

const ProfilePage = () => {
  const navigate = useNavigate();

  // ✅ localStorage read inside useState initializer = runs exactly once, not on re-render
  const [user] = useState(() => {
    try {
      const data = localStorage.getItem("user");
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  });

  // ✅ useMemo is justified here: string slicing + nullish coalescing on a dependency
  const createTime = useMemo(
    () => user?.lastLogin?.slice(0, 10) ?? "N/A",
    [user],
  );

  // ✅ useMemo is justified: split + map + join + toUpperCase on every render otherwise
  const avatarInitials = useMemo(() => {
    if (!user?.username) return "?";
    return user.username
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  }, [user?.username]);

  // ✅ useEffect auth guard — stable deps, no console.log (was leaking PII)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!user || !token) navigate("/signup");
  }, [user, navigate]);

  // ✅ useCallback: stable reference — avoids prop drilling re-renders if child is memo'd
  const handleLogout = useCallback(() => {
    ["user", "cart", "email", "token"].forEach((k) =>
      localStorage.removeItem(k),
    );
    navigate("/signup");
  }, [navigate]);

  // ✅ useCallback: navigate is already stable from react-router, but wrapping
  //    the arrow fn stops a new function object being created on each render
  const goHome = useCallback(() => navigate("/"), [navigate]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 text-lg">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fefeff] p-5 flex items-center justify-center overflow-hidden relative">
      {/*
       * REMOVED blur-3xl filter divs.
       * These static radial gradients achieve the same soft glow effect at
       * zero filter cost — they're just colored circles with opacity, no blur pass.
       * Using pointer-events:none + aria-hidden so they're invisible to a11y tree.
       */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 40,
          left: 40,
          width: 288,
          height: 288,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(180,180,180,0.18) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: 40,
          right: 40,
          width: 288,
          height: 288,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(150,150,150,0.16) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div className="max-w-4xl w-full mx-auto relative z-10">
        {/*
         * REMOVED: backdrop-blur-lg, shadow-2xl shadow-gray-400
         * ADDED: profile-card-enter (fadeIn, runs once), border for depth
         * bg-[#f0eeed] is opaque — no backdrop-blur needed
         */}
        <div
          className="profile-card-enter bg-[#f0eeed] rounded-3xl p-8 border border-white/60"
          style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.10)" }}
        >
          {/* Heading */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl md:text-5xl font-bold font-sekuya text-black tracking-wide">
              My Profile
            </h1>
            {/*
             * REMOVED: animate-ping (infinite)
             * ADDED: .online-dot — pingOnce animation fires once on mount, then static
             */}
            <div className="hidden md:block">
              <span
                className="online-dot w-3 h-3 bg-green-500 rounded-full"
                style={{
                  width: 12,
                  height: 12,
                  display: "inline-block",
                  borderRadius: "50%",
                  background: "#22c55e",
                }}
                aria-hidden="true"
              />
            </div>
          </div>

          {/*
           * REMOVED: backdrop-blur-md, hover onMouseEnter/Leave JS handlers, shadow-lg
           * ADDED: profile-hover-lift (CSS :hover translateY, GPU only)
           * bg-white (opaque) so backdrop-blur is irrelevant
           */}
          <div className="profile-hover-lift bg-white rounded-3xl p-6 mb-6 border border-gray-200">
            {/* User Section */}
            <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8">
              {/* Avatar — small element, scale+rotate on hover is acceptable */}
              <div className="relative shrink-0">
                <div
                  className="avatar-circle w-24 h-24 bg-black text-white rounded-full flex items-center justify-center text-3xl font-bold"
                  style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.18)" }}
                >
                  {avatarInitials}
                </div>
              </div>

              {/* User Info */}
              <div className="space-y-1 min-w-0">
                <h2 className="text-3xl font-bold text-black tracking-wide truncate">
                  {user.username.toUpperCase()}
                </h2>
                <p className="text-gray-600 text-lg truncate">{user.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  {/*
                   * REMOVED: animate-pulse (infinite opacity animation)
                   * Static dot — green color alone communicates "active"
                   */}
                  <div className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                  <span className="text-sm text-gray-500">Active User</span>
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid md:grid-cols-2 gap-5">
              {/*
               * REMOVED: hover:shadow-md (repaint on hover)
               * ADDED: .detail-card — border-color transition (compositor only)
               */}
              <div className="detail-card group p-5 bg-[#f0eeed] rounded-2xl cursor-pointer">
                <p className="text-sm text-gray-500 mb-1">Role</p>
                <p className="detail-card-text font-semibold text-black text-lg">
                  {user.role ?? "User"}
                </p>
              </div>

              <div className="detail-card group p-5 bg-[#f0eeed] rounded-2xl cursor-pointer">
                <p className="text-sm text-gray-500 mb-1">Member Since</p>
                <p className="detail-card-text font-semibold text-black text-lg">
                  {createTime}
                </p>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            {/*
             * REMOVED: transition-all (watches all properties incl. non-compositable)
             * REMOVED: hover:shadow-red-400/50 (box-shadow change = repaint)
             * ADDED: .btn-action — transition: transform + opacity only
             */}
            <button
              onClick={handleLogout}
              className="btn-action flex items-center gap-2 bg-red-500 text-white font-medium py-3 px-6 rounded-2xl"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-5 h-5 btn-icon btn-icon-right"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3-3l-3-3m3 3H9"
                />
              </svg>
              <span>Logout</span>
            </button>

            <button
              onClick={goHome}
              className="btn-action flex items-center gap-2 bg-blue-500 text-white font-medium py-3 px-6 rounded-2xl"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-5 h-5 btn-icon btn-icon-left"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.25 19.25L3.75 12m0 0l6.5-7.25M3.75 12h16.5"
                />
              </svg>
              <span>Back to Home</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// React.memo: prevents re-render if a parent re-renders with identical props.
// ProfilePage takes no props so this is effectively "never re-render unless
// internal state changes" — appropriate here.
export default memo(ProfilePage);
