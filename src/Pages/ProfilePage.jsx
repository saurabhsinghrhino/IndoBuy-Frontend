import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const data = localStorage.getItem("user");
    return data ? JSON.parse(data) : null;
  });

  console.log(user.lastLogin);

  const [createTime, setCreateTime] = useState(() => {
    const time = user.lastLogin;
    return time.slice(0, 10);
  });
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!user || !token || !createTime) {
      navigate("/signup");
    }
  }, [user, createTime, navigate]);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("cart");
    localStorage.removeItem("email");
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-[#fefeff] p-5 flex items-center justify-center overflow-hidden relative">
      {/* Background Blur Effects */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-gray-300 opacity-20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-gray-400 opacity-20 rounded-full blur-3xl animate-pulse"></div>

      <div className="max-w-4xl w-full mx-auto relative z-10">
        <div className="bg-[#f0eeed]/90 backdrop-blur-lg rounded-3xl p-8 shadow-2xl shadow-gray-400 border border-white/40 transition-all duration-500 hover:shadow-gray-500 animate-[fadeIn_0.7s_ease-in-out]">
          {/* Heading */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl md:text-5xl font-bold font-sekuya text-black tracking-wide">
              My Profile
            </h1>

            <div className="hidden md:block">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
            </div>
          </div>

          {/* Profile Card */}
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 mb-6 shadow-lg border border-gray-200 transition-all duration-500 hover:scale-[1.01] hover:shadow-2xl">
            {/* User Section */}
            <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8">
              {/* Avatar */}
              <div className="relative group">
                <div className="absolute inset-0 rounded-full bg-black opacity-20 blur-xl group-hover:blur-2xl transition-all duration-500"></div>

                <div className="relative w-24 h-24 bg-black text-white rounded-full flex items-center justify-center text-3xl font-bold shadow-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
                  {user.username
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </div>
              </div>

              {/* User Info */}
              <div className="space-y-1">
                <h2 className="text-3xl font-bold text-black tracking-wide">
                  {user.username.toUpperCase()}
                </h2>

                <p className="text-gray-600 text-lg">{user.email}</p>

                <div className="flex items-center gap-2 mt-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-sm text-gray-500">Active User</span>
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid md:grid-cols-2 gap-5">
              <div className="group p-5 bg-[#f0eeed] rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer">
                <p className="text-sm text-gray-500 mb-1">Role</p>

                <p className="font-semibold text-black text-lg group-hover:translate-x-1 transition-all duration-300">
                  {user.role}
                </p>
              </div>

              <div className="group p-5 bg-[#f0eeed] rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer">
                <p className="text-sm text-gray-500 mb-1">Member Since</p>

                <p className="font-semibold text-black text-lg group-hover:translate-x-1 transition-all duration-300">
                  {createTime}
                </p>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            {/* Logout Button */}
            <button
              onClick={() => {
                handleLogout();
                navigate("/signup");
              }}
              className="group flex items-center cursor-pointer gap-2 bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-6 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-red-400/50 hover:scale-105 active:scale-95"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3-3l-3-3m3 3H9"
                />
              </svg>

              <span className="transition-all duration-300 group-hover:tracking-wide">
                Logout
              </span>
            </button>

            {/* Home Button */}
            <button
              onClick={() => navigate("/")}
              className="group cursor-pointer flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-blue-400/50 hover:scale-105 active:scale-95"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.25 19.25L3.75 12m0 0l6.5-7.25M3.75 12h16.5"
                />
              </svg>

              <span className="transition-all duration-300 group-hover:tracking-wide">
                Back to Home
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
