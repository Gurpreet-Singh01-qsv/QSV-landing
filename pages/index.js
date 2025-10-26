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
    const handleScroll = () => setScrollIntensity(Math.min(window.scrollY, 320));
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

  // ✅ FORM HANDLER
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSubmitted(false);

    try {
      const res = await fetch(
        "https://corsproxy.io/?https://script.google.com/macros/s/AKfycbzKTC70E2xjBizIkNYvBWjTpdZxfUtBRkPZrwstv9C4_6ZsagGewNFiaqVwG8fWpMb3/exec",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const text = await res.text();
      let result = {};
      try {
        result = JSON.parse(text);
      } catch {
        result = { success: false, error: "Invalid JSON response" };
      }

      if (result.success) {
        setSubmitted(true);
        setEmail("");
        e.currentTarget.reset();
        setError("");
      } else {
        console.error(result.error || "Unknown error");
        setError("Submission failed. Please try again.");
      }
    } catch (err) {
      console.error("Network Error:", err);
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

        <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-24 text-center">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-violet-400 to-fuchsia-500">
            Shop the Multiverse
          </h1>
          <p className="mt-4 text-slate-300 max-w-xl">
            Experience immersive shopping like never before.
          </p>

          {/* ✅ FORM */}
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
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-cyan-400 via-sky-500 to-violet-600 px-8 py-3 text-base font-semibold uppercase tracking-wide text-white shadow transition-transform duration-300 hover:scale-105 disabled:opacity-60"
            >
              <span className="relative">
                {loading ? "Sending…" : "Join Waitlist"}
              </span>
            </button>
          </form>

          {submitted && !error && (
            <p className="mt-4 text-sky-300 text-sm fade-up">
              🎉 You’re on the waitlist! We’ll be in touch soon.
            </p>
          )}
          {error && (
            <p className="mt-4 text-rose-300 text-sm fade-up">{error}</p>
          )}
        </main>

        <footer className="text-center text-xs text-slate-400 py-8">
          © 2025 QSV Multiverse. All rights reserved.
        </footer>
      </div>
    </>
  );
}



