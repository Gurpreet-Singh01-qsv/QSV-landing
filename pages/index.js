import React, { useEffect, useState } from "react";

const Home = () => {
  // Scroll-based parallax & card rotation
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    const handleScroll = () => setOffset(window.scrollY * 0.2);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950/90 via-purple-900/80 to-black text-white qsv-star-bg relative overflow-hidden">

      {/* Floating particles */}
      <div className="qsv-particle" style={{ top: '10%', left: '20%' }}></div>
      <div className="qsv-particle" style={{ top: '50%', left: '70%' }}></div>
      <div className="qsv-particle" style={{ top: '80%', left: '40%' }}></div>
      <div className="qsv-particle" style={{ top: '30%', left: '50%' }}></div>
      <div className="qsv-particle" style={{ top: '60%', left: '15%' }}></div>

      {/* Hero Section */}
      <section className="text-center py-24 px-4">
        <h1 className="text-5xl sm:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-violet-500 to-fuchsia-600 animate-text fade-up">
          Shop the Multiverse
        </h1>
        <p className="mt-4 text-lg text-slate-300 max-w-2xl mx-auto fade-up" style={{ animationDelay: '0.3s' }}>
          Experience shopping like never before — explore immersive 3D worlds, interact with products in real-time, and feel presence beyond the screen.
        </p>
        <button className="mt-6 px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-sky-500 to-violet-600 hover:from-fuchsia-500 hover:to-sky-600 transform hover:scale-105 transition-all duration-300 shadow-lg fade-up" style={{ animationDelay: '0.6s' }}>
          Join Waitlist
        </button>
      </section>

      {/* VR Card / Mockup Section */}
      <section className="flex justify-center py-16 px-4">
        <div
          className="relative w-80 h-80 backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl transform transition-transform"
          style={{ transform: `translateY(${offset}px) rotateY(${offset * 0.05}deg)` }}
        >
          {/* Main card cube */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-40 h-40 bg-gradient-to-tr from-sky-400 to-violet-600 rounded-3xl shadow-lg float-medium"></div>
          </div>

          {/* Floating rectangles */}
          <div className="absolute top-8 left-6 w-12 h-6 bg-white/20 rounded-lg float-slow"></div>
          <div className="absolute top-20 right-10 w-16 h-8 bg-white/25 rounded-lg float-medium"></div>
          <div className="absolute bottom-16 left-12 w-20 h-10 bg-white/15 rounded-lg float-fast"></div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-12 text-slate-400">
        © 2025 QSV Multiverse. All rights reserved.
      </footer>

      {/* Global styles */}
      <style jsx global>{`
        /* Hero text shimmer */
        @keyframes text {
          0%, 100% { background-size: 200% 200%; background-position: left center; }
          50% { background-position: right center; }
        }
        .animate-text { animation: text 6s ease-in-out infinite; }

        /* Floating rectangles */
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        .float-slow { animation: float 4s ease-in-out infinite; }
        .float-medium { animation: float 3s ease-in-out infinite; }
        .float-fast { animation: float 2.5s ease-in-out infinite; }

        /* Entrance animations */
        @keyframes fadeUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 1.2s ease-out forwards; }

        /* Starfield background */
        .qsv-star-bg {
          background-image:
            radial-gradient(2px 2px at 10% 20%, rgba(255,255,255,0.06), transparent),
            radial-gradient(1.5px 1.5px at 80% 40%, rgba(255,255,255,0.04), transparent),
            radial-gradient(1.5px 1.5px at 40% 70%, rgba(255,255,255,0.03), transparent);
          background-repeat: no-repeat;
        }

        /* Particles */
        @keyframes drift {
          0% { transform: translateX(0) translateY(0); opacity: 0.6; }
          50% { transform: translateX(30px) translateY(-20px); opacity: 1; }
          100% { transform: translateX(0) translateY(0); opacity: 0.6; }
        }
        .qsv-particle {
          position: absolute;
          width: 2px;
          height: 2px;
          border-radius: 50%;
          background: white;
          opacity: 0.5;
          animation: drift 6s ease-in-out infinite;
        }

        /* Responsive adjustments */
        @media (max-width: 640px) {
          h1 { font-size: 3rem; }
          .w-80 { width: 60%; height: 60%; }
        }
      `}</style>
    </div>
  );
};

export default Home;

