import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";

const NotFoundPage = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. GLITCH TEXT EFFECT — rapid color shifts
      const glitchTl = gsap.timeline({ repeat: -1, repeatDelay: 2 });
      glitchTl
        .to(".glitch-404", {
          x: -5,
          skewX: 20,
          duration: 0.05,
          ease: "power4.inOut",
        })
        .to(".glitch-404", {
          x: 5,
          skewX: -20,
          duration: 0.05,
          ease: "power4.inOut",
        })
        .to(".glitch-404", {
          x: -3,
          skewX: 10,
          duration: 0.05,
          ease: "power4.inOut",
        })
        .to(".glitch-404", {
          x: 0,
          skewX: 0,
          duration: 0.05,
          ease: "power4.inOut",
        })
        .to(".glitch-404", { opacity: 0.8, duration: 0.05 })
        .to(".glitch-404", { opacity: 1, duration: 0.05 })
        .to(".glitch-404", { scale: 1.02, duration: 0.1 })
        .to(".glitch-404", { scale: 1, duration: 0.1 });

      // 2. FLOATING PARTICLES — random orbits
      gsap.utils.toArray(".particle").forEach((particle, i) => {
        gsap.to(particle, {
          x: `random(-300, 300)`,
          y: `random(-300, 300)`,
          rotation: `random(-360, 360)`,
          scale: `random(0.5, 2)`,
          duration: `random(3, 6)`,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 0.2,
        });
      });

      // 3. BOUNCING EMOJIS
      gsap.utils.toArray(".bounce-emoji").forEach((emoji, i) => {
        gsap.to(emoji, {
          y: -40,
          duration: 0.6,
          repeat: -1,
          yoyo: true,
          ease: "power2.inOut",
          delay: i * 0.15,
        });
      });

      // 4. SPINNING GEOMETRIC SHAPES
      gsap.to(".spin-shape", {
        rotation: 360,
        duration: 20,
        repeat: -1,
        ease: "none",
      });

      gsap.to(".spin-shape-reverse", {
        rotation: -360,
        duration: 15,
        repeat: -1,
        ease: "none",
      });

      // 5. PULSE RINGS
      gsap.to(".pulse-ring", {
        scale: 2,
        opacity: 0,
        duration: 2,
        repeat: -1,
        ease: "power2.out",
        stagger: 0.5,
      });

      // 6. TYPING EFFECT for subtitle
      const subtitle = "Looks like this page took a wrong turn...";
      const subtitleEl = document.querySelector(".typewriter-text");
      subtitleEl.textContent = "";
      let charIndex = 0;
      const typeInterval = setInterval(() => {
        if (charIndex < subtitle.length) {
          subtitleEl.textContent += subtitle[charIndex];
          charIndex++;
        } else {
          clearInterval(typeInterval);
          // Blink cursor
          gsap.to(".cursor-blink", {
            opacity: 0,
            duration: 0.5,
            repeat: -1,
            yoyo: true,
          });
        }
      }, 50);

      // 7. SHAKING BUTTON on hover
      const btn = document.querySelector(".shake-btn");
      btn.addEventListener("mouseenter", () => {
        gsap.to(btn, {
          x: "random(-5, 5)",
          y: "random(-5, 5)",
          rotation: "random(-5, 5)",
          duration: 0.1,
          repeat: 5,
          yoyo: true,
          ease: "power1.inOut",
        });
      });

      // 8. BACKGROUND MORPHING BLOBS
      gsap.to(".blob-1", {
        borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%",
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.to(".blob-2", {
        borderRadius: "30% 60% 70% 40% / 50% 60% 30% 60%",
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      return () => clearInterval(typeInterval);
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Mouse parallax effect
  const handleMouseMove = (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 30;
    const y = (e.clientY / window.innerHeight - 0.5) * 30;
    setMousePos({ x, y });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="min-h-screen bg-[#fefeff] overflow-hidden relative flex items-center justify-center"
    >
      {/* === CRAZY BACKGROUND ELEMENTS === */}

      {/* Morphing Blobs */}
      <div
        className="blob-1 absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-gray-200 to-gray-300 opacity-40 blur-3xl"
        style={{
          borderRadius: "40% 60% 70% 30% / 40% 50% 60% 50%",
          transform: `translate(${mousePos.x * 0.5}px, ${mousePos.y * 0.5}px)`,
        }}
      />
      <div
        className="blob-2 absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-gray-300 to-gray-400 opacity-30 blur-3xl"
        style={{
          borderRadius: "50% 50% 20% 80% / 25% 80% 20% 75%",
          transform: `translate(${mousePos.x * -0.5}px, ${mousePos.y * -0.5}px)`,
        }}
      />

      {/* Spinning Geometric Shapes */}
      <div className="spin-shape absolute top-32 right-32 w-24 h-24 border-4 border-black/10 rotate-45" />
      <div className="spin-shape-reverse absolute bottom-40 left-20 w-32 h-32 rounded-full border-4 border-dashed border-black/10" />
      <div className="spin-shape absolute top-1/2 left-10 w-16 h-16 bg-black/5 rotate-12" />

      {/* Floating Particles */}
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="particle absolute w-3 h-3 bg-black rounded-full opacity-20"
          style={{
            left: `${10 + Math.random() * 80}%`,
            top: `${10 + Math.random() * 80}%`,
          }}
        />
      ))}

      {/* Pulse Rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="pulse-ring absolute w-64 h-64 border-2 border-black/10 rounded-full"
            style={{ left: "-8rem", top: "-8rem" }}
          />
        ))}
      </div>

      {/* === MAIN CONTENT === */}
      <div className="relative z-10 text-center px-5 max-w-3xl mx-auto">
        {/* Bouncing Emojis Above */}
        <div className="flex justify-center gap-4 mb-6 text-4xl">
          <span className="bounce-emoji">🚀</span>
          <span className="bounce-emoji">💥</span>
          <span className="bounce-emoji">🤯</span>
          <span className="bounce-emoji">🌀</span>
        </div>

        {/* GLITCH 404 */}
        <div className="relative mb-4">
          <h1 className="glitch-404 font-sekuya text-[10rem] md:text-[16rem] font-black text-black leading-none select-none">
            404
          </h1>
          {/* Glitch shadow copies */}
          <span
            className="absolute top-0 left-0 w-full text-[10rem] md:text-[16rem] font-black text-red-400/30 leading-none -translate-x-2 glitch-clone"
            aria-hidden
          >
            404
          </span>
          <span
            className="absolute top-0 left-0 w-full text-[10rem] md:text-[16rem] font-black text-blue-400/30 leading-none translate-x-2 glitch-clone"
            aria-hidden
          >
            404
          </span>
        </div>

        {/* Typewriter Subtitle */}
        <div className="h-8 mb-8">
          <p className="typewriter-text text-xl md:text-2xl text-gray-600 font-medium inline" />
          <span className="cursor-blink inline-block w-0.5 h-6 bg-black ml-1 align-middle" />
        </div>

        {/* Lost Items Grid — Interactive hover */}
        <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mb-10 max-w-lg mx-auto opacity-60">
          {[
            "👟",
            "🎧",
            "⌚",
            "🎒",
            "💡",
            "📱",
            "💻",
            "🕶️",
            "⌨️",
            "🖱️",
            "🔌",
            "📦",
            "🏷️",
            "💳",
            "🛒",
          ].map((item, i) => (
            <div
              key={i}
              className="w-12 h-12 md:w-14 md:h-14 bg-[#f0eeed] rounded-xl flex items-center justify-center text-2xl hover:bg-black hover:text-white hover:scale-125 hover:rotate-12 transition-all duration-300 cursor-pointer"
              onMouseEnter={(e) => {
                gsap.to(e.target, {
                  y: -10,
                  duration: 0.3,
                  ease: "back.out(2)",
                });
              }}
              onMouseLeave={(e) => {
                gsap.to(e.target, { y: 0, duration: 0.3, ease: "power2.out" });
              }}
            >
              {item}
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => navigate("/")}
            className="shake-btn group relative overflow-hidden bg-black text-white px-10 py-4 rounded-full font-bold text-lg transition-all duration-300 hover:shadow-[0_0_40px_rgba(0,0,0,0.4)]"
          >
            <span className="relative z-10 flex items-center gap-2">
              🏠 Take Me Home
              <span className="group-hover:translate-x-1 transition-transform duration-300">
                →
              </span>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
          </button>

          <button
            onClick={() => navigate("/products")}
            className="px-10 py-4 rounded-full border-2 border-black text-black font-bold text-lg hover:bg-black hover:text-white transition-all duration-500"
          >
            🛍️ Browse Products
          </button>
        </div>

        {/* Fun Fact */}
        <div className="mt-12 p-4 bg-[#f0eeed] rounded-2xl inline-block">
          <p className="text-sm text-gray-500">
            <span className="font-bold text-black">Fun Fact:</span> You've
            discovered a black hole in our website.
            <span className="block mt-1 text-xs">
              Error ID: {Math.random().toString(36).substring(7).toUpperCase()}
            </span>
          </p>
        </div>
      </div>

      {/* Corner Decorations */}
      <div className="absolute top-5 left-5 text-6xl opacity-10 rotate-12">
        ❓
      </div>
      <div className="absolute top-5 right-5 text-6xl opacity-10 -rotate-12">
        ❗
      </div>
      <div className="absolute bottom-5 left-5 text-6xl opacity-10 -rotate-12">
        🗺️
      </div>
      <div className="absolute bottom-5 right-5 text-6xl opacity-10 rotate-12">
        🧭
      </div>

      {/* Scanline Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px]" />
    </div>
  );
};

export default NotFoundPage;
