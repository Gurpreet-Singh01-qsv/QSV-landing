diff --git a/pages/index.js b/pages/index.js
index d3c44284794b059802a8303c2acf2fe34dbc82c7..31d9a79e0686eaa075d7ca8453ae5ac690632c78 100644
--- a/pages/index.js
+++ b/pages/index.js
@@ -1,170 +1,305 @@
-import React, { useEffect, useState } from "react";
+import Head from "next/head";
+import { useEffect, useMemo, useState } from "react";
+
+const particleConfig = [
+  { top: "8%", left: "12%", size: 2, delay: "0s" },
+  { top: "18%", left: "72%", size: 3, delay: "1s" },
+  { top: "28%", left: "42%", size: 2, delay: "2s" },
+  { top: "42%", left: "18%", size: 1.5, delay: "1.6s" },
+  { top: "60%", left: "82%", size: 2.5, delay: "2.4s" },
+  { top: "66%", left: "32%", size: 1.8, delay: "0.8s" },
+  { top: "78%", left: "58%", size: 2.2, delay: "3.1s" },
+  { top: "86%", left: "24%", size: 1.4, delay: "2.7s" },
+  { top: "12%", left: "88%", size: 1.6, delay: "3.5s" },
+  { top: "52%", left: "52%", size: 1.2, delay: "4.2s" },
+];
+
+export default function Home() {
+  const [scrollIntensity, setScrollIntensity] = useState(0);
+  const [isMounted, setIsMounted] = useState(false);
+
+  useEffect(() => {
+    setIsMounted(true);
+  }, []);
 
-const Home = () => {
-  const [offset, setOffset] = useState(0);
   useEffect(() => {
-    const handleScroll = () => setOffset(window.scrollY * 0.2);
-    window.addEventListener("scroll", handleScroll);
+    const handleScroll = () => {
+      const y = window.scrollY;
+      setScrollIntensity(Math.min(y, 320));
+    };
+
+    handleScroll();
+    window.addEventListener("scroll", handleScroll, { passive: true });
     return () => window.removeEventListener("scroll", handleScroll);
   }, []);
 
+  const cardTransform = useMemo(() => {
+    const normalized = scrollIntensity * 0.25;
+    const rotateX = Math.max(-12, Math.min(12, scrollIntensity * 0.04));
+    const rotateY = Math.max(-18, Math.min(18, scrollIntensity * 0.06));
+    return `translateY(${normalized}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
+  }, [scrollIntensity]);
+
   return (
-    <div className="min-h-screen bg-gradient-to-br from-blue-950/90 via-purple-900/80 to-black text-white qsv-star-bg relative overflow-hidden">
-      {/* Floating particles */}
-      <div className="qsv-particle" style={{ top: "10%", left: "20%" }}></div>
-      <div className="qsv-particle" style={{ top: "50%", left: "70%" }}></div>
-      <div className="qsv-particle" style={{ top: "80%", left: "40%" }}></div>
-      <div className="qsv-particle" style={{ top: "30%", left: "50%" }}></div>
-      <div className="qsv-particle" style={{ top: "60%", left: "15%" }}></div>
-
-      {/* Hero Section */}
-      <section className="text-center py-24 px-4">
-        <h1 className="text-5xl sm:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-violet-500 to-fuchsia-600 animate-text fade-up">
-          Shop the Multiverse
-        </h1>
-        <p
-          className="mt-4 text-lg text-slate-300 max-w-2xl mx-auto fade-up"
-          style={{ animationDelay: "0.3s" }}
-        >
-          Experience shopping like never before — explore immersive 3D worlds,
-          interact with products in real-time, and feel presence beyond the
-          screen.
-        </p>
-        <button
-          className="mt-6 px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-sky-500 to-violet-600 hover:from-fuchsia-500 hover:to-sky-600 transform hover:scale-105 transition-all duration-300 shadow-lg fade-up"
-          style={{ animationDelay: "0.6s" }}
-        >
-          Join Waitlist
-        </button>
-      </section>
-
-      {/* VR Card / Mockup Section */}
-      <section className="flex justify-center py-16 px-4">
-        <div
-          className="relative w-80 h-80 backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl transform transition-transform"
-          style={{
-            transform: `translateY(${offset}px) rotateY(${offset * 0.05}deg)`,
-          }}
-        >
-          <div className="absolute inset-0 flex items-center justify-center">
-            <div className="w-40 h-40 bg-gradient-to-tr from-sky-400 to-violet-600 rounded-3xl shadow-lg float-medium"></div>
-          </div>
-          <div className="absolute top-8 left-6 w-12 h-6 bg-white/20 rounded-lg float-slow"></div>
-          <div className="absolute top-20 right-10 w-16 h-8 bg-white/25 rounded-lg float-medium"></div>
-          <div className="absolute bottom-16 left-12 w-20 h-10 bg-white/15 rounded-lg float-fast"></div>
-        </div>
-      </section>
-
-      {/* Footer */}
-      <footer className="text-center py-12 text-slate-400">
-        © 2025 QSV Multiverse. All rights reserved.
-      </footer>
+    <>
+      <Head>
+        <title>QSV – Shop the Multiverse</title>
+        <meta
+          name="description"
+          content="Experience immersive VR shopping with QSV – Shop the Multiverse."
+        />
+      </Head>
+      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#040824] via-[#120538] to-[#01010f] text-white">
+        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(68,215,255,0.25),transparent_55%),radial-gradient(circle_at_80%_10%,rgba(155,108,255,0.35),transparent_50%),radial-gradient(circle_at_50%_80%,rgba(0,102,255,0.2),transparent_55%)]" />
+
+        {particleConfig.map((particle, index) => (
+          <span
+            key={`particle-${index}`}
+            style={{
+              top: particle.top,
+              left: particle.left,
+              width: `${particle.size}px`,
+              height: `${particle.size}px`,
+              animationDelay: particle.delay,
+            }}
+            className="qsv-particle"
+          />
+        ))}
+
+        <main className="relative z-10 flex min-h-screen flex-col">
+          <section className="flex flex-1 flex-col items-center justify-center gap-10 px-6 py-24 text-center lg:flex-row lg:text-left lg:py-32 lg:px-16">
+            <div className="max-w-2xl space-y-8">
+              <p
+                className={`mx-auto max-w-xl uppercase tracking-[0.4em] text-xs text-cyan-200/70 lg:mx-0 fade-up ${
+                  isMounted ? "fade-up--animate" : ""
+                }`}
+                style={{ animationDelay: "0.05s" }}
+              >
+                FUTURISTIC VR SHOPPING PLATFORM
+              </p>
+              <h1
+                className={`bg-gradient-to-r from-cyan-300 via-violet-400 to-fuchsia-500 bg-clip-text text-4xl font-extrabold uppercase text-transparent drop-shadow-[0_10px_35px_rgba(114,106,255,0.35)] sm:text-5xl lg:text-6xl xl:text-7xl fade-up text-shimmer ${
+                  isMounted ? "fade-up--animate" : ""
+                }`}
+                style={{ animationDelay: "0.2s" }}
+              >
+                Shop the Multiverse
+              </h1>
+              <p
+                className={`mx-auto max-w-xl text-base text-slate-200/90 sm:text-lg lg:mx-0 lg:max-w-2xl fade-up ${
+                  isMounted ? "fade-up--animate" : ""
+                }`}
+                style={{ animationDelay: "0.35s" }}
+              >
+                Experience shopping like never before. Traverse immersive virtual realms, touch lifelike holograms, and customize your dream spaces with quantum precision — all from the comfort of your headset.
+              </p>
+              <div
+                className={`flex flex-col items-center gap-6 sm:flex-row lg:items-start fade-up ${
+                  isMounted ? "fade-up--animate" : ""
+                }`}
+                style={{ animationDelay: "0.5s" }}
+              >
+                <button className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-cyan-400 via-sky-500 to-violet-600 px-10 py-4 text-base font-semibold uppercase tracking-wide text-white shadow-[0_0_35px_rgba(103,232,249,0.45)] transition-transform duration-300 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200">
+                  <span className="absolute inset-0 animate-glow bg-gradient-to-r from-cyan-300/30 via-transparent to-fuchsia-400/30" />
+                  <span className="relative">Join Waitlist</span>
+                </button>
+                <div className="max-w-xs text-xs uppercase tracking-[0.3em] text-slate-300/60">
+                  Early access portals opening soon — secure your slot today.
+                </div>
+              </div>
+            </div>
+
+              <div className="relative flex w-full max-w-xl justify-center lg:max-w-lg">
+                <div className="absolute -inset-x-16 -top-10 h-40 rounded-full bg-cyan-500/10 blur-3xl" />
+              <div className="absolute -left-20 top-10 h-32 w-32 rounded-3xl border border-cyan-300/20 bg-gradient-to-br from-cyan-400/20 to-transparent floating-rect drift" />
+              <div className="absolute -right-10 bottom-16 h-24 w-40 rounded-3xl border border-fuchsia-300/10 bg-gradient-to-r from-violet-500/10 to-transparent floating-rect drift" />
+              <div className="absolute left-1/2 top-0 h-20 w-20 -translate-x-1/2 rounded-full border border-white/10 bg-white/5 floating-rect drift" />
+
+              <div className="relative w-full max-w-sm rounded-[2.5rem] border border-white/10 bg-white/10 p-[1px] shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
+                <div
+                  className="relative overflow-hidden rounded-[2.4rem] bg-white/5 p-10 backdrop-blur-2xl"
+                  style={{ perspective: "1400px" }}
+                >
+                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(125,211,252,0.25),transparent_60%),radial-gradient(circle_at_85%_30%,rgba(192,132,252,0.2),transparent_55%),linear-gradient(135deg,rgba(15,23,42,0.6),rgba(30,27,75,0.2))]" />
+                  <div
+                    className="relative flex flex-col gap-6 text-left transition-transform duration-500 ease-out will-change-transform"
+                    style={{ transform: cardTransform }}
+                  >
+                    <div className="flex items-center justify-between">
+                      <span className="text-xs uppercase tracking-[0.45em] text-cyan-200/80">Quantum Cart</span>
+                      <span className="rounded-full bg-cyan-400/20 px-4 py-1 text-[10px] font-semibold uppercase tracking-[0.35em] text-cyan-200/70">
+                        Live
+                      </span>
+                    </div>
+                    <div className="flex items-center gap-4">
+                      <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-cyan-300 to-violet-500 shadow-lg shadow-cyan-400/30" />
+                      <div className="space-y-1">
+                        <p className="text-sm font-semibold tracking-wide text-white/90">Luminous Hyper-Sneaker</p>
+                        <p className="text-xs text-slate-200/70">Adaptive fit · Haptic weave · Void black</p>
+                      </div>
+                    </div>
+                    <div className="grid grid-cols-2 gap-4 text-xs text-slate-200/80">
+                      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
+                        <p className="text-[10px] uppercase tracking-[0.35em] text-cyan-200/60">Environment</p>
+                        <p className="mt-2 text-sm text-white">Neon Spires</p>
+                      </div>
+                      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
+                        <p className="text-[10px] uppercase tracking-[0.35em] text-cyan-200/60">Emotion</p>
+                        <p className="mt-2 text-sm text-white">Euphoric Calm</p>
+                      </div>
+                    </div>
+                    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-gradient-to-r from-cyan-400/20 via-transparent to-fuchsia-400/20 p-5">
+                      <div>
+                        <p className="text-[10px] uppercase tracking-[0.4em] text-cyan-200/60">Checkout Pulse</p>
+                        <p className="mt-2 text-lg font-semibold text-white">2.3s</p>
+                      </div>
+                      <span className="rounded-full bg-white/10 px-5 py-2 text-[10px] uppercase tracking-[0.4em] text-white/80">
+                        Synced
+                      </span>
+                    </div>
+                  </div>
+                </div>
+              </div>
+            </div>
+          </section>
+        </main>
+
+        <footer className="relative z-10 border-t border-white/10 bg-black/20 py-8 text-center text-xs uppercase tracking-[0.4em] text-slate-300/60">
+          © 2025 QSV Multiverse
+        </footer>
+      </div>
 
       <style jsx global>{`
-        @keyframes text {
-          0%,
-          100% {
-            background-size: 200% 200%;
-            background-position: left center;
-          }
-          50% {
-            background-position: right center;
-          }
-        }
-        .animate-text {
-          animation: text 6s ease-in-out infinite;
+        :root {
+          color-scheme: dark;
         }
 
-        @keyframes float {
-          0%,
-          100% {
-            transform: translateY(0px);
-          }
-          50% {
-            transform: translateY(-12px);
-          }
-        }
-        .float-slow {
-          animation: float 4s ease-in-out infinite;
+        body {
+          background-color: #040824;
         }
-        .float-medium {
-          animation: float 3s ease-in-out infinite;
+
+        .fade-up {
+          opacity: 0;
+          transform: translateY(24px);
         }
-        .float-fast {
-          animation: float 2.5s ease-in-out infinite;
+
+        .fade-up.fade-up--animate {
+          animation: fadeUp 1s ease-out forwards;
         }
 
         @keyframes fadeUp {
           0% {
             opacity: 0;
-            transform: translateY(20px);
+            transform: translateY(24px);
           }
           100% {
             opacity: 1;
             transform: translateY(0);
           }
         }
-        .fade-up {
-          animation: fadeUp 1.2s ease-out forwards;
-        }
-
-        .qsv-star-bg {
-          background-image: radial-gradient(
-              2px 2px at 10% 20%,
-              rgba(255, 255, 255, 0.06),
-              transparent
-            ),
-            radial-gradient(
-              1.5px 1.5px at 80% 40%,
-              rgba(255, 255, 255, 0.04),
-              transparent
-            ),
-            radial-gradient(
-              1.5px 1.5px at 40% 70%,
-              rgba(255, 255, 255, 0.03),
-              transparent
-            );
-          background-repeat: no-repeat;
+
+        .floating-rect {
+          animation: float 8s ease-in-out infinite;
+        }
+
+        .floating-rect.drift {
+          animation: float 8s ease-in-out infinite, drift 18s ease-in-out infinite;
+          background-size: 200% 200%;
+        }
+
+        @keyframes float {
+          0% {
+            transform: translate3d(0, 0, 0) rotate(0deg);
+          }
+          50% {
+            transform: translate3d(12px, -18px, 0) rotate(3deg);
+          }
+          100% {
+            transform: translate3d(0, 0, 0) rotate(0deg);
+          }
         }
 
         @keyframes drift {
           0% {
-            transform: translateX(0) translateY(0);
-            opacity: 0.6;
+            background-position: 0% 50%;
           }
           50% {
-            transform: translateX(30px) translateY(-20px);
-            opacity: 1;
+            background-position: 100% 50%;
           }
           100% {
-            transform: translateX(0) translateY(0);
-            opacity: 0.6;
+            background-position: 0% 50%;
           }
         }
+
         .qsv-particle {
           position: absolute;
-          width: 2px;
-          height: 2px;
-          border-radius: 50%;
-          background: white;
-          opacity: 0.5;
-          animation: drift 6s ease-in-out infinite;
+          border-radius: 9999px;
+          background: rgba(255, 255, 255, 0.65);
+          opacity: 0.4;
+          animation: particleTwinkle 6s ease-in-out infinite;
+          box-shadow: 0 0 12px rgba(114, 255, 255, 0.35);
         }
 
-        @media (max-width: 640px) {
-          h1 {
-            font-size: 3rem;
+        @keyframes particleTwinkle {
+          0% {
+            transform: translateY(0) scale(1);
+            opacity: 0.25;
           }
-          .w-80 {
-            width: 60%;
-            height: 60%;
+          50% {
+            transform: translateY(-12px) scale(1.6);
+            opacity: 0.8;
+          }
+          100% {
+            transform: translateY(0) scale(1);
+            opacity: 0.25;
           }
         }
-      `}</style>
-    </div>
-  );
-};
 
-export default Home;
+        .animate-glow {
+          animation: glowPulse 4s ease-in-out infinite;
+          mix-blend-mode: screen;
+        }
 
+        @keyframes glowPulse {
+          0%,
+          100% {
+            opacity: 0.35;
+            transform: translateX(-40%);
+          }
+          50% {
+            opacity: 0.7;
+            transform: translateX(20%);
+          }
+        }
+
+        .text-shimmer {
+          background-size: 200% 200%;
+          animation: textShimmer 10s ease-in-out infinite;
+        }
 
+        @keyframes textShimmer {
+          0% {
+            background-position: 0% 50%;
+          }
+          50% {
+            background-position: 100% 50%;
+          }
+          100% {
+            background-position: 0% 50%;
+          }
+        }
+
+        @media (prefers-reduced-motion: reduce) {
+          .fade-up,
+          .floating-rect,
+          .qsv-particle,
+          .animate-glow {
+            animation-duration: 0.01ms !important;
+            animation-iteration-count: 1 !important;
+            transition-duration: 0.01ms !important;
+          }
+        }
+      `}</style>
+    </>
+  );
+}

