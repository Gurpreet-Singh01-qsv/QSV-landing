import Head from "next/head";
import { useEffect, useMemo, useState } from "react";

const particleConfig = [
  { top: "8%", left: "12%", size: 2, delay: "0s" },
  { top: "18%", left: "72%", size: 3, delay: "1s" },
  { top: "28%", left: "42%", size: 2, delay: "2s" },
  { top: "42%", left: "18%", size: 1.5, delay: "1.6s" },
  { top: "60%", left: "82%", size: 2.5, delay: "2.4s" },
  { top: "66%", left: "32%", size: 1.8, delay: "0.8s" },
  { top: "78%", left: "58%", size: 2.2, delay: "3.1s" },
  { top: "86%", left: "24%", size: 1.4, delay: "2.7s" },
  { top: "12%", left: "88%", size: 1.6, delay: "3.5s" },
  { top: "52%", left: "52%", size: 1.2, delay: "4.2s" },
];

export default function Home() {
  const [scrollIntensity, setScrollIntensity] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => setIsMounted(true), []);

  useEffect(() => {
    const handleScroll = () =>
      setScrollIntensity(Math.min(window.scrollY, 320));
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const cardTransform = useMemo(() => {
    const n = scrollIntensity * 0.25;
    const rotateX = Math.max(-12, Math.min(12, scrollIntensity * 0.04));
    const rotateY = Math.max(-18, Math.min(18, scrollIntensity * 0.06));
    return `translateY(${n}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  }, [scrollIntensity]);

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");
  setSubmitted(false);

  try {
    const res = await fetch("/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const result = await res.json();

    if (res.ok && result.success) {
      setSubmitted(true);
      setEmail("");

      // ✅ Safely reset the form (React event pooling fix)
      if (e && e.target && typeof e.target.reset === "function") {
        e.target.reset();
      }

      setError("");
    } else {
      console.error("Backend error:", result.error || "Unknown error");
      setError("Submission failed. Please try again.");
    }
  } catch (err) {
    console.error("Frontend error:", err);
    setError("Network error. Please try again later.");
  } finally {
    setLoading(false);
  }
};

return (
  <>
    <Head>
      <title>QSV – Shop the Multiverse</title>
      <meta
        name="description"
        content="Experience immersive VR shopping with QSV – Shop the Multiverse."
      />
    </Head>

    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#040824] via-[#120538] to-[#01010f] text-white">
      {/* Background Glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(68,215,255,0.25),transparent_55%),radial-gradient(circle_at_80%_10%,rgba(155,108,255,0.35),transparent_50%),radial-gradient(circle_at_50%_80%,rgba(0,102,255,0.2),transparent_55%)]" />

      {/* Floating Particles */}
      {particleConfig.map((p, i) => (
        <span
          key={i}
          style={{
            top: p.top,
            left: p.left,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDelay: p.delay,
          }}
          className="qsv-particle"
        />
      ))}

      {/* HERO SECTION */}
      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-24 text-center lg:flex-row lg:text-left lg:px-16 lg:py-32">
  {/* LEFT: Text + Logo */}
  <div className="max-w-2xl space-y-8">
    {/* Eyebrow */}
    <p
      className={`uppercase tracking-[0.35em] text-[11px] text-cyan-200/60 fade-up ${
        isMounted ? "fade-up--animate" : ""
      }`}
      style={{ animationDelay: "0.05s" }}
    >
      FUTURISTIC VR SHOPPING PLATFORM
    </p>
   
{/* QSV Logo — mobile-heavier, no disk, responsive tweaks */}
<div className="relative mb-8 flex flex-col items-center justify-center fade-up isolate">
  <div className="relative w-40 h-40 sm:w-52 sm:h-52 rounded-full overflow-hidden">
    {/* Mobile-only local darkener to add contrast without a visible circle */}
    <div
      className="pointer-events-none absolute inset-0 rounded-full md:hidden"
      style={{
        background:
          "radial-gradient(closest-side, rgba(0,0,0,0.38) 0%, rgba(0,0,0,0.22) 58%, rgba(0,0,0,0) 82%)",
        mixBlendMode: "multiply",
      }}
    />

    {/* Logo (heavier on mobile, relaxed on md+) */}
    <img
      src="/images/qsv-logo-merged.png"
      alt="QSV Logo"
      className="
        absolute inset-0 w-full h-full object-contain select-none animate-float
        /* MOBILE (default) */
        brightness-[0.82] contrast-[1.26] saturate-[1.12]
        [mask-image:radial-gradient(closest-side,white_90%,transparent_100%)]
        [-webkit-mask-image:radial-gradient(closest-side,white_90%,transparent_100%)]
        drop-shadow-[0_10px_32px_rgba(10,12,28,0.6)]
        /* DESKTOP overrides */
        md:brightness-[0.9] md:contrast-[1.18] md:saturate-[1.05]
        md:[mask-image:radial-gradient(closest-side,white_88%,transparent_100%)]
        md:[-webkit-mask-image:radial-gradient(closest-side,white_88%,transparent_100%)]
      "
      draggable="false"
    />

    {/* Sheen: off on mobile, on from md+ */}
    <div className="pointer-events-none absolute inset-0 hidden md:block
                    [mask-image:radial-gradient(closest-side,white,transparent)]
                    [-webkit-mask-image:radial-gradient(closest-side,white,transparent)]">
      <div className="absolute -left-1/2 top-0 h-full w-[60%]
                      bg-[linear-gradient(100deg,transparent,rgba(255,255,255,0.06),transparent)]
                      animate-logo-sheen" />
    </div>
  </div>

  <h2 className="mt-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-300/85 to-violet-300/85 text-2xl sm:text-3xl font-semibold uppercase tracking-wide">
    Step Into the Multiverse
  </h2>
</div>


  {/* Primary Heading — fallback + gradient overlay */}
<h1
  className={`mt-2 relative z-20 text-5xl sm:text-6xl xl:text-7xl
              font-semibold tracking-tight leading-tight fade-up text-cyan-200
              ${isMounted ? "fade-up--animate" : ""}`}
  style={{ animationDelay: "0.2s" }}
>
  {/* Fallback solid text (always visible) */}
  <span>Shop the Multiverse</span>

  {/* Gradient overlay (sits on top if supported) */}
  <span
    aria-hidden="true"
    className="pointer-events-none absolute inset-0 bg-gradient-to-r from-cyan-300/90 to-violet-300/90 bg-clip-text text-transparent"
    style={{ WebkitTextFillColor: "transparent" }}
  >
    Shop the Multiverse
  </span>

  {/* Ultra-subtle sweep on the gradient layer */}
  <span
    aria-hidden="true"
    className="pointer-events-none absolute inset-0
               bg-[linear-gradient(90deg,transparent,rgba(255,255,255,.10),transparent)]
               animate-h1-sheen"
    style={{ mixBlendMode: "overlay" }}
  />
</h1>

{/* Body copy */}
<p
  className={`text-slate-200/80 sm:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0 fade-up ${
    isMounted ? "fade-up--animate" : ""
  }`}
  style={{ animationDelay: "0.35s" }}
>
  Experience shopping like never before — traverse immersive virtual realms,
  touch lifelike holograms, and customize your dream spaces with quantum precision.
</p>
 
            <form
  onSubmit={handleSubmit}
  className="flex flex-col sm:flex-row gap-4 items-center justify-center mt-6"
>
  <input
    type="email"
    name="email"
    required
    placeholder="Enter your email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    className="px-4 py-3 rounded-full bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-400 w-64 sm:w-72 shadow-md"
  />

  <button
    type="submit"
    disabled={loading}
    className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-cyan-400 via-sky-500 to-violet-600 px-8 py-3 text-base font-semibold uppercase tracking-wide text-white shadow-[0_0_35px_rgba(103,232,249,0.45)] transition-transform duration-300 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200 disabled:opacity-60 disabled:cursor-not-allowed"
  >
    <span className="absolute inset-0 animate-glow bg-gradient-to-r from-cyan-300/30 via-transparent to-fuchsia-400/30" />
    <span className="relative">{loading ? "Sending…" : "Join Waitlist"}</span>
  </button>
</form>

{submitted && !error && (
  <p className="mt-4 text-sky-300 text-sm fade-up">
    You’re officially in. The Multiverse awaits — stay tuned for your access key.
  </p>
)}

{error && (
  <p className="mt-4 text-rose-300 text-sm fade-up">{error}</p>
)}

          </div>

          {/* VR CARD SECTION */}
          <div className="relative mt-20 flex w-full max-w-sm justify-center lg:mt-0">
    <div
      className="relative w-full rounded-[2.5rem] border border-white/10 bg-white/10 p-[1px] shadow-[0_30px_80px_rgba(0,0,0,0.45)]"
      style={{ perspective: "1400px" }}
    >
      <div
        className="relative overflow-hidden rounded-[2.4rem] bg-white/5 p-10 backdrop-blur-2xl transition-transform duration-500 ease-out will-change-transform hover:shadow-[0_30px_120px_rgba(79,70,229,0.25)] hover:scale-[1.015]"
        style={{ transform: cardTransform }}
      >
        {/* Your existing VR card content */}
        <div className="flex flex-col gap-6 text-left">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-[0.45em] text-cyan-200/80">
              Quantum Cart
            </span>
            <span className="rounded-full bg-cyan-400/20 px-4 py-1 text-[10px] font-semibold uppercase tracking-[0.35em] text-cyan-200/70">
              Live
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-cyan-300 to-violet-500 shadow-lg shadow-cyan-400/30" />
            <div className="space-y-1">
              <p className="text-sm font-semibold tracking-wide text-white/90">
                Luminous Hyper-Sneaker
              </p>
              <p className="text-xs text-slate-200/70">
                Adaptive fit · Haptic weave · Void black
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-xs text-slate-200/80">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-[10px] uppercase tracking-[0.35em] text-cyan-200/60">
                Environment
              </p>
              <p className="mt-2 text-sm text-white">Neon Spires</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-[10px] uppercase tracking-[0.35em] text-cyan-200/60">
                Emotion
              </p>
              <p className="mt-2 text-sm text-white">Euphoric Calm</p>
            </div>
          </div>
          <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-gradient-to-r from-cyan-400/20 via-transparent to-fuchsia-400/20 p-5">
            <div>
              <p className="text-[10px] uppercase tracking-[0.4em] text-cyan-200/60">
                Checkout Pulse
              </p>
              <p className="mt-2 text-lg font-semibold text-white">2.3 s</p>
            </div>
            <span className="rounded-full bg-white/10 px-5 py-2 text-[10px] uppercase tracking-[0.4em] text-white/80">
              Synced
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</main>

        <footer className="relative z-10 border-t border-white/10 bg-black/20 py-8 text-center text-xs uppercase tracking-[0.4em] text-slate-300/60">
          © 2025 QSV Multiverse All rights reserved
        </footer>
      </div>

      {/* Global Styles */}
      <style jsx global>{`
        :root {
          color-scheme: dark;
        }
        body {
          background-color: #040824;
        }
        @keyframes fadeUp {
          0% {
            opacity: 0;
            transform: translateY(24px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .fade-up {
          opacity: 0;
          transform: translateY(24px);
        }
        .fade-up--animate {
          animation: fadeUp 1s ease-out forwards;
        }
        @keyframes particleTwinkle {
          0% {
            transform: translateY(0) scale(1);
            opacity: 0.25;
          }
          50% {
            transform: translateY(-12px) scale(1.6);
            opacity: 0.8;
          }
          100% {
            transform: translateY(0) scale(1);
            opacity: 0.25;
          }
        }
        .qsv-particle {
          position: absolute;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.65);
          opacity: 0.4;
          box-shadow: 0 0 12px rgba(114, 255, 255, 0.35);
          animation: particleTwinkle 6s ease-in-out infinite;
        }
        .animate-glow {
          animation: glowPulse 4s ease-in-out infinite;
          mix-blend-mode: screen;
        }
        @keyframes logoSheen {
  0% { transform: translateX(0); opacity: .0; }
  25% { opacity: .7; }
  100% { transform: translateX(180%); opacity: 0; }
}
.animate-logo-sheen { animation: logoSheen 3.8s ease-in-out infinite; }

@keyframes h1Sheen {
  0% { transform: translateX(-120%); opacity: 0; }
  40% { opacity: .5; }
  100% { transform: translateX(120%); opacity: 0; }
}
.animate-h1-sheen { animation: h1Sheen 6s ease-in-out infinite; }

        @keyframes glowPulse {
          0%,
          100% {
            opacity: 0.35;
            transform: translateX(-40%);
          }
          50% {
            opacity: 0.7;
            transform: translateX(20%);
          }
          @keyframes pulseSlow {
  0%, 100% { opacity: 0.9; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.05); }
}
.animate-pulse-slow {
  animation: pulseSlow 5s ease-in-out infinite;
}
      `}</style>
    </>
  );
}



