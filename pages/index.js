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
  const [portalAnimationComplete, setPortalAnimationComplete] = useState(false);
  const [showPortal, setShowPortal] = useState(true);

  useEffect(() => {
    setIsMounted(true);
    
    // Portal animation sequence
    const portalTimer = setTimeout(() => {
      setPortalAnimationComplete(true);
    }, 2000); // Portal animation duration
    
    const hidePortalTimer = setTimeout(() => {
      setShowPortal(false);
    }, 2500); // Hide portal overlay
    
    return () => {
      clearTimeout(portalTimer);
      clearTimeout(hidePortalTimer);
    };
  }, []);

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

    // Track form submission attempt
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'form_submit_attempt', {
        event_category: 'engagement',
        event_label: 'waitlist_signup'
      });
    }

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

        // Track successful conversion
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'conversion', {
            event_category: 'engagement',
            event_label: 'waitlist_signup_success'
          });
        }

        // ✅ Safely reset the form (React event pooling fix)
        if (e && e.target && typeof e.target.reset === "function") {
          e.target.reset();
        }

        setError("");
      } else {
        console.error("Backend error:", result.error || "Unknown error");
        setError(result.error || "Submission failed. Please try again.");

        // Track form errors
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'form_error', {
            event_category: 'engagement',
            event_label: 'waitlist_signup_failed'
          });
        }
      }
    } catch (err) {
      console.error("Frontend error:", err);
      setError("Network error. Please try again later.");

      // Track network errors
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'form_error', {
          event_category: 'engagement',
          event_label: 'network_error'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>QSV – Shop the Multiverse | Revolutionary VR Shopping Platform</title>
        <meta
          name="description"
          content="Experience the future of shopping with QSV. Traverse immersive virtual realms, touch lifelike holograms, and customize your dream spaces with quantum precision. Join the VR shopping revolution."
        />
        <meta name="keywords" content="VR shopping, virtual reality, metaverse shopping, immersive commerce, quantum shopping, futuristic retail" />
        <meta name="author" content="QSV Multiverse" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://qsv-multiverse.com/" />
        <meta property="og:title" content="QSV – Shop the Multiverse | Revolutionary VR Shopping" />
        <meta property="og:description" content="Experience the future of shopping with QSV. Traverse immersive virtual realms and customize your dream spaces with quantum precision." />
        <meta property="og:image" content="/images/qsv-og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://qsv-multiverse.com/" />
        <meta property="twitter:title" content="QSV – Shop the Multiverse | Revolutionary VR Shopping" />
        <meta property="twitter:description" content="Experience the future of shopping with QSV. Traverse immersive virtual realms and customize your dream spaces." />
        <meta property="twitter:image" content="/images/qsv-og-image.png" />

        {/* Favicon */}
        <link rel="icon" href="/images/qsv-logo-merged.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/images/qsv-logo-merged.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/images/qsv-logo-merged.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/images/qsv-logo-merged.png" />
        <link rel="shortcut icon" href="/images/qsv-logo-merged.png" />

        {/* Preload critical resources */}
        <link rel="preload" href="/images/qsv-logo-merged.png" as="image" />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "QSV Multiverse",
              "description": "Revolutionary VR shopping platform for the metaverse",
              "url": "https://qsv-multiverse.com",
              "logo": "https://qsv-multiverse.com/images/qsv-logo-merged.png",
              "sameAs": [
                "https://twitter.com/qsv_multiverse",
                "https://linkedin.com/company/qsv-multiverse"
              ]
            })
          }}
        />
      </Head>

      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#040824] via-[#120538] to-[#01010f] text-white">
        {/* Portal Entry Animation */}
        {showPortal && (
          <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black transition-opacity duration-1000 ${portalAnimationComplete ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <div className="relative">
              {/* Portal Ring */}
              <div className="portal-ring w-96 h-96 rounded-full border-4 border-cyan-400/30 animate-portal-expand">
                <div className="absolute inset-4 rounded-full border-2 border-violet-400/40 animate-portal-expand-delayed">
                  <div className="absolute inset-4 rounded-full border border-cyan-300/50 animate-portal-expand-delayed-2">
                    {/* Portal Center Glow */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400/20 via-violet-500/30 to-cyan-400/20 animate-portal-pulse"></div>
                  </div>
                </div>
              </div>
              
              {/* Portal Logo */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-32 h-32 animate-portal-logo-emerge">
                  <img
                    src="/images/qsv-logo-merged.png"
                    alt="QSV Portal"
                    className="w-full h-full object-contain animate-portal-logo-spin"
                  />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400/30 to-violet-500/30 animate-portal-logo-glow"></div>
                </div>
              </div>
              
              {/* Portal Particles */}
              <div className="absolute inset-0">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 bg-cyan-400 rounded-full animate-portal-particles"
                    style={{
                      top: `${20 + (i * 5)}%`,
                      left: `${15 + (i * 6)}%`,
                      animationDelay: `${i * 0.1}s`,
                    }}
                  />
                ))}
              </div>
              
              {/* Welcome Text */}
              <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 text-center">
                <p className="text-cyan-300 text-lg font-semibold animate-portal-text">
                  Entering the Multiverse...
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Background Effects */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(68,215,255,0.15),transparent_50%),radial-gradient(circle_at_80%_70%,rgba(155,108,255,0.2),transparent_50%)]" />

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

        {/* Navigation */}
        <nav className={`relative z-10 px-6 py-6 lg:px-16 transition-all duration-1000 ${portalAnimationComplete ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="/images/qsv-logo-merged.png" 
                alt="QSV Logo" 
                className="w-8 h-8 object-contain"
              />
              <div className="text-2xl font-bold text-cyan-300">QSV</div>
            </div>
            <div className="flex gap-8">
              <a href="/" className="text-cyan-300 font-medium">Home</a>
              <a href="/features" className="text-gray-300 hover:text-white transition-colors font-medium">Features</a>
              <a href="/about" className="text-gray-300 hover:text-white transition-colors font-medium">About</a>
            </div>
          </div>
        </nav>

        {/* HERO SECTION */}
        <main className={`relative z-10 px-6 py-12 lg:px-16 lg:py-16 transition-all duration-1000 delay-300 ${portalAnimationComplete ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[80vh]">
              {/* LEFT: Text + Logo */}
              <div className="space-y-8 text-center lg:text-left">
            {/* Eyebrow */}
            <p
              className={`uppercase tracking-[0.35em] text-[11px] text-cyan-200/60 fade-up ${isMounted ? "fade-up--animate" : ""
                }`}
              style={{ animationDelay: "0.05s" }}
            >
              FUTURISTIC VR SHOPPING PLATFORM
            </p>

            {/* QSV Logo — mobile-heavier, no disk, responsive tweaks */}
            <div className="relative mb-8 flex flex-col items-center lg:items-start justify-center fade-up isolate">
              <div className="relative w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 rounded-full overflow-hidden">
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
                  alt="QSV Logo - Revolutionary VR Shopping Platform"
                  width="208"
                  height="208"
                  loading="eager"
                  decoding="async"
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
              className={`mt-2 relative z-20 text-4xl sm:text-5xl lg:text-6xl xl:text-7xl
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
              className={`text-slate-200/80 text-lg lg:text-xl leading-relaxed max-w-2xl mx-auto lg:mx-0 fade-up ${isMounted ? "fade-up--animate" : ""
                }`}
              style={{ animationDelay: "0.35s" }}
            >
              Experience shopping like never before — traverse immersive virtual realms,
              touch lifelike holograms, and customize your dream spaces with quantum precision.
            </p>

            {/* Key Features Pills */}
            <div 
              className={`flex flex-wrap gap-3 justify-center lg:justify-start mt-6 fade-up ${isMounted ? "fade-up--animate" : ""}`}
              style={{ animationDelay: "0.5s" }}
            >
              <span className="px-4 py-2 bg-cyan-500/20 border border-cyan-400/30 rounded-full text-sm text-cyan-300 backdrop-blur-sm">
                ⚡ Streamlined Checkout
              </span>
              <span className="px-4 py-2 bg-violet-500/20 border border-violet-400/30 rounded-full text-sm text-violet-300 backdrop-blur-sm">
                🤚 Haptic Touch
              </span>
              <span className="px-4 py-2 bg-green-500/20 border border-green-400/30 rounded-full text-sm text-green-300 backdrop-blur-sm">
                🌌 Infinite Worlds
              </span>
            </div>
            {/* ==== FORM STARTS HERE ==== */}
            <form
              onSubmit={handleSubmit}
              className="mt-8 flex w-full max-w-2xl flex-col items-center lg:items-start gap-4 sm:flex-row sm:gap-4"
              aria-describedby="waitlist-desc"
            >
              <label htmlFor="email" className="sr-only">Email address</label>

              <div className="relative w-full sm:flex-1">
                <input
                  id="email"
                  type="email"
                  name="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-full bg-white/90 text-slate-900 placeholder-slate-500 px-5 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.25)] focus:outline-none focus:ring-2 focus:ring-cyan-300/60 focus:ring-offset-0 transition-shadow"
                  aria-invalid={Boolean(error) || undefined}
                  aria-describedby="waitlist-desc waitlist-msg"
                />
                {/* subtle inset highlight */}
                <span className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-white/10" />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-full px-7 py-3 font-semibold uppercase tracking-wide text-white bg-gradient-to-r from-cyan-400 via-sky-500 to-violet-600 shadow-[0_12px_40px_rgba(56,189,248,0.28)] transition-transform duration-300 hover:scale-[1.03] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200 disabled:opacity-60 disabled:cursor-not-allowed"
                aria-live="polite"
              >
                <span className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.16),transparent)] translate-x-[-40%] group-hover:translate-x-[30%] transition-transform duration-[1200ms] ease-out" />
                <span className="relative">{loading ? "Sending…" : "Join Waitlist"}</span>
              </button>
            </form>

            {/* ARIA helper text (invisible) */}
            <p id="waitlist-desc" className="sr-only">Join the QSV early access waitlist. We’ll only use your email to contact you about access.</p>

            {/* Success / Error messages */}
            <div id="waitlist-msg" className="mt-3 min-h-[2.5rem] text-center lg:text-left" aria-live="polite" role="status">
              {submitted && !error && (
                <p className="text-sm text-sky-300">You’re officially in. The Multiverse awaits — stay tuned for your access key.</p>
              )}
              {error && <p className="text-sm text-rose-300">{error}</p>}
            </div>
                {/* ==== FORM ENDS HERE ==== */}
              </div>

              {/* VR CARD SECTION */}
              <div className="relative flex w-full max-w-lg justify-center lg:justify-end">
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
                        Checkout Speed
                      </p>
                      <p className="mt-2 text-lg font-semibold text-white">Ultra-Fast</p>
                    </div>
                    <span className="rounded-full bg-white/10 px-5 py-2 text-[10px] uppercase tracking-[0.4em] text-white/80">
                      Synced
                    </span>
                  </div>
                </div>
              </div>
            </div>
              </div>
            </div>
          </div>
        </main>

        {/* Features Preview Section */}
        <section className={`relative z-10 px-6 py-16 lg:px-16 lg:py-24 transition-all duration-1000 delay-500 ${portalAnimationComplete ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-violet-300">
                  Revolutionary Technology
                </span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Experience the most advanced VR commerce platform ever built, powered by quantum precision and emotional intelligence.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Quantum Cart */}
              <div className="group relative bg-gradient-to-br from-cyan-900/20 to-cyan-800/10 p-8 rounded-2xl border border-cyan-500/20 backdrop-blur-sm hover:border-cyan-400/40 transition-all duration-500 hover:scale-[1.02]">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    ⚡
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-4">Quantum Cart</h3>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    Lightning-fast checkout with quantum-encrypted transactions and ultra-low latency processing.
                  </p>
                  <div className="flex items-center text-cyan-300 text-sm font-medium">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full mr-2 animate-pulse"></span>
                    Live & Synced
                  </div>
                </div>
              </div>

              {/* Haptic Weave */}
              <div className="group relative bg-gradient-to-br from-violet-900/20 to-violet-800/10 p-8 rounded-2xl border border-violet-500/20 backdrop-blur-sm hover:border-violet-400/40 transition-all duration-500 hover:scale-[1.02]">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-400/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-violet-400 to-purple-500 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    🤚
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-4">Haptic Weave</h3>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    Feel every texture, weight, and material property through advanced haptic feedback technology.
                  </p>
                  <div className="flex items-center text-violet-300 text-sm font-medium">
                    <span className="w-2 h-2 bg-violet-400 rounded-full mr-2 animate-pulse"></span>
                    Ultra-Realistic
                  </div>
                </div>
              </div>

              {/* Multiverse Environments */}
              <div className="group relative bg-gradient-to-br from-green-900/20 to-green-800/10 p-8 rounded-2xl border border-green-500/20 backdrop-blur-sm hover:border-green-400/40 transition-all duration-500 hover:scale-[1.02] md:col-span-2 lg:col-span-1">
                <div className="absolute inset-0 bg-gradient-to-br from-green-400/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-teal-500 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    🌌
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-4">Multiverse Environments</h3>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    Shop in infinite customizable worlds, from neon cyberpunk streets to serene mountain cabins.
                  </p>
                  <div className="flex items-center text-green-300 text-sm font-medium">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                    Infinite Worlds
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mt-12">
              <a 
                href="/features"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-cyan-500/20 to-violet-600/20 border border-cyan-400/30 text-white font-semibold rounded-full hover:scale-105 transition-all duration-300 hover:border-cyan-300/50 hover:shadow-[0_20px_40px_rgba(56,189,248,0.2)]"
              >
                Explore All Features
                <span className="ml-2">→</span>
              </a>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className={`relative z-10 px-6 py-16 lg:px-16 lg:py-20 bg-gradient-to-br from-black/20 to-transparent transition-all duration-1000 delay-700 ${portalAnimationComplete ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-6">Platform Performance</h2>
              <p className="text-xl text-gray-300">Key features of our VR shopping platform</p>
              <p className="text-sm text-gray-400 mt-2">*Platform currently in development - features subject to change</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center group">
                <div className="bg-gradient-to-br from-cyan-900/30 to-cyan-800/20 p-8 rounded-2xl border border-cyan-500/20 backdrop-blur-sm group-hover:border-cyan-400/40 transition-all duration-300">
                  <div className="text-4xl font-bold text-cyan-400 mb-2 group-hover:scale-110 transition-transform duration-300">Streamlined</div>
                  <div className="text-gray-300 font-medium">Checkout Experience</div>
                  <div className="text-sm text-cyan-300 mt-2">Designed for efficiency</div>
                </div>
              </div>
              
              <div className="text-center group">
                <div className="bg-gradient-to-br from-violet-900/30 to-violet-800/20 p-8 rounded-2xl border border-violet-500/20 backdrop-blur-sm group-hover:border-violet-400/40 transition-all duration-300">
                  <div className="text-4xl font-bold text-violet-400 mb-2 group-hover:scale-110 transition-transform duration-300">Better Fit</div>
                  <div className="text-gray-300 font-medium">Technology</div>
                  <div className="text-sm text-violet-300 mt-2">VR try-before-buy</div>
                </div>
              </div>
              
              <div className="text-center group">
                <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 p-8 rounded-2xl border border-green-500/20 backdrop-blur-sm group-hover:border-green-400/40 transition-all duration-300">
                  <div className="text-4xl font-bold text-green-400 mb-2 group-hover:scale-110 transition-transform duration-300">Immersive</div>
                  <div className="text-gray-300 font-medium">Shopping Experience</div>
                  <div className="text-sm text-green-300 mt-2">VR environments</div>
                </div>
              </div>
              
              <div className="text-center group">
                <div className="bg-gradient-to-br from-orange-900/30 to-orange-800/20 p-8 rounded-2xl border border-orange-500/20 backdrop-blur-sm group-hover:border-orange-400/40 transition-all duration-300">
                  <div className="text-4xl font-bold text-orange-400 mb-2 group-hover:scale-110 transition-transform duration-300">Reliable</div>
                  <div className="text-gray-300 font-medium">Platform</div>
                  <div className="text-sm text-orange-300 mt-2">Built for scale</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof Section */}
        <section className="relative z-10 px-6 py-16 lg:px-16 lg:py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-12">Join the VR Shopping Revolution</h2>
            
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="bg-gradient-to-br from-white/10 to-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-sm">
                <div className="text-3xl mb-4">🚀</div>
                <h3 className="text-xl font-semibold text-white mb-2">Early Adopters</h3>
                <p className="text-gray-300">Be among the first to experience the future of shopping</p>
              </div>
              
              <div className="bg-gradient-to-br from-white/10 to-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-sm">
                <div className="text-3xl mb-4">🎯</div>
                <h3 className="text-xl font-semibold text-white mb-2">Exclusive Access</h3>
                <p className="text-gray-300">Priority access to beta features and premium brands</p>
              </div>
              
              <div className="bg-gradient-to-br from-white/10 to-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-sm">
                <div className="text-3xl mb-4">💎</div>
                <h3 className="text-xl font-semibold text-white mb-2">Founding Member</h3>
                <p className="text-gray-300">Special perks and lifetime benefits for early supporters</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-cyan-900/20 to-violet-900/20 p-8 rounded-2xl border border-cyan-500/20 backdrop-blur-sm">
              <p className="text-2xl text-gray-200 leading-relaxed mb-6">
                "The future of commerce isn't just online—it's immersive, emotional, and revolutionary."
              </p>
              <div className="flex items-center justify-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-violet-500 rounded-full"></div>
                <div className="text-left">
                  <div className="text-white font-semibold">QSV Team</div>
                  <div className="text-gray-400 text-sm">Building the Multiverse</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Disclaimer Section */}
        <section className="relative z-10 px-6 py-8 bg-black/30">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-sm text-gray-400 leading-relaxed">
              QSV is currently in development. All features, performance characteristics, and capabilities described are planned functionality and subject to change. 
              This website represents our vision and development goals, not current product capabilities. 
              Join our waitlist to be notified when the platform becomes available.
            </p>
          </div>
        </section>

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
        }
        @keyframes pulseSlow {
          0%, 100% { 
            opacity: 0.9; 
            transform: scale(1); 
          }
          50% { 
            opacity: 1; 
            transform: scale(1.05); 
          }
        }
        .animate-pulse-slow {
          animation: pulseSlow 5s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px); 
          }
          50% { 
            transform: translateY(-10px); 
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        @keyframes slideInUp {
          from { 
            opacity: 0; 
            transform: translateY(30px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        .animate-slideInUp {
          animation: slideInUp 0.8s ease-out forwards;
        }
        @keyframes glow {
          0%, 100% { 
            box-shadow: 0 0 20px rgba(56, 189, 248, 0.3);
          }
          50% { 
            box-shadow: 0 0 40px rgba(56, 189, 248, 0.6);
          }
        }
        .animate-glow-pulse {
          animation: glow 2s ease-in-out infinite;
        }
        @keyframes backgroundShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-bg-shift {
          background-size: 200% 200%;
          animation: backgroundShift 8s ease infinite;
        }

        /* Portal Animation Keyframes */
        @keyframes portalExpand {
          0% { 
            transform: scale(0) rotate(0deg); 
            opacity: 0; 
          }
          50% { 
            transform: scale(1.2) rotate(180deg); 
            opacity: 0.8; 
          }
          100% { 
            transform: scale(1) rotate(360deg); 
            opacity: 1; 
          }
        }
        .animate-portal-expand {
          animation: portalExpand 1.5s ease-out forwards;
        }
        .animate-portal-expand-delayed {
          animation: portalExpand 1.5s ease-out 0.2s forwards;
          opacity: 0;
        }
        .animate-portal-expand-delayed-2 {
          animation: portalExpand 1.5s ease-out 0.4s forwards;
          opacity: 0;
        }

        @keyframes portalPulse {
          0%, 100% { 
            opacity: 0.2; 
            transform: scale(1); 
          }
          50% { 
            opacity: 0.6; 
            transform: scale(1.1); 
          }
        }
        .animate-portal-pulse {
          animation: portalPulse 2s ease-in-out infinite;
        }

        @keyframes portalLogoEmerge {
          0% { 
            transform: scale(0) translateZ(0); 
            opacity: 0; 
          }
          60% { 
            transform: scale(0.8) translateZ(0); 
            opacity: 0.5; 
          }
          100% { 
            transform: scale(1) translateZ(0); 
            opacity: 1; 
          }
        }
        .animate-portal-logo-emerge {
          animation: portalLogoEmerge 1.8s ease-out 0.5s forwards;
          opacity: 0;
        }

        @keyframes portalLogoSpin {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(360deg); }
        }
        .animate-portal-logo-spin {
          animation: portalLogoSpin 2s ease-in-out 0.8s forwards;
        }

        @keyframes portalLogoGlow {
          0%, 100% { 
            opacity: 0.3; 
            transform: scale(1); 
          }
          50% { 
            opacity: 0.7; 
            transform: scale(1.2); 
          }
        }
        .animate-portal-logo-glow {
          animation: portalLogoGlow 1.5s ease-in-out infinite;
        }

        @keyframes portalParticles {
          0% { 
            transform: translateY(0) scale(0); 
            opacity: 0; 
          }
          20% { 
            transform: translateY(-20px) scale(1); 
            opacity: 1; 
          }
          100% { 
            transform: translateY(-100px) scale(0); 
            opacity: 0; 
          }
        }
        .animate-portal-particles {
          animation: portalParticles 2s ease-out infinite;
        }

        @keyframes portalText {
          0% { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          50% { 
            opacity: 1; 
            transform: translateY(0); 
          }
          100% { 
            opacity: 0; 
            transform: translateY(-10px); 
          }
        }
        .animate-portal-text {
          animation: portalText 2s ease-in-out 0.5s forwards;
          opacity: 0;
        }
      `}</style>
    </>
  );
}