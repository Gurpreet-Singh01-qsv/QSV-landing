import React from "react";
import "./QSVLanding.css"; // Import the CSS file

// QSV Landing Page - Single-file React component using Tailwind CSS
// Notes for use:
// - This is a presentational component. Drop into a React app (Next.js or CRA) with Tailwind configured.
// - Replace the WAITLIST_FORM_ACTION constant with your form endpoint (Mailchimp, ConvertKit, Netlify Forms, or custom API).
// - Replace images / SVGs with your assets if available.
// - Ensure QSVLanding.css is in your project and imported.

const WAITLIST_FORM_ACTION = "#"; // <- replace with your form endpoint

export default function QSVLanding() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950/90 via-purple-900/80 to-black text-white qsv-star-bg">
      {/* Navbar */}
      <header className="max-w-6xl mx-auto px-6 sm:px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C7 2 4 6 4 10c0 4 3 8 8 12s8-4 8-8c0-3-3-8-8-12z" fill="white" opacity="0.95" />
            <path d="M12 6c-2 1-4 3-4 6 0 3 1.5 5.5 4 8 2.5-2.5 4-5 4-8 0-3-2-5-4-6z" fill="#0ea5e9" opacity="0.85" />
          </svg>
          <span className="font-semibold text-lg tracking-wide">QSV</span>
          <span className="text-slate-400 ml-2 hidden sm:inline">Shop Across Realities</span>
        </div>
        <nav className="flex items-center gap-4">
          <a href="#how" className="text-slate-300 hover:text-white">How it works</a>
          <a href="#why" className="text-slate-300 hover:text-white">Why QSV</a>
          <a href="#join" className="text-slate-300 hover:text-white">Join Waitlist</a>
        </nav>
      </header>

      {/* Hero */}
      <main className="max-w-6xl mx-auto px-6 sm:px-8 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <section className="lg:col-span-7">
          <h1 className="text-5xl sm:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-violet-500 to-fuchsia-600 animate-text">
            Shop the Multiverse
          </h1>
          <p className="mt-4 text-lg text-slate-300 max-w-2xl">
            Experience shopping like never before — explore immersive 3D worlds, interact with products in real-time, and feel presence beyond the screen.
          </p>
          <p className="mt-6 text-slate-300 max-w-2xl">
            QSV brings shopping to the multiverse — explore immersive worlds, interact with products, and buy as if you’re really there. From luxury streets to gadget planets, discovery becomes the experience.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#join"
              className="inline-flex items-center px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-violet-600 text-black font-semibold shadow-lg hover:scale-105 transition-transform duration-300"
              aria-label="Join the QSV waitlist"
            >
              Join the Waitlist
            </a>
            <a
              href="#demo"
              className="inline-flex items-center px-6 py-3 rounded-xl border border-slate-700 text-slate-200 hover:bg-slate-700"
              aria-label="Watch QSV concept video"
            >
              See Concept Video
            </a>
          </div>

          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-3 text-slate-400">
            <div className="p-3 bg-slate-900/50 rounded-lg">
              <div className="text-sm font-semibold">For Users</div>
              <div className="text-xs mt-1">Immersive shopping, social discovery, avatar try-ons.</div>
            </div>
            <div className="p-3 bg-slate-900/50 rounded-lg">
              <div className="text-sm font-semibold">For Brands</div>
              <div className="text-xs mt-1">Custom storeverses and new revenue channels.</div>
            </div>
            <div className="p-3 bg-slate-900/50 rounded-lg">
              <div className="text-sm font-semibold">For Creators</div>
              <div className="text-xs mt-1">Events, product launches and collectible drops.</div>
            </div>
          </div>
        </section>

        <aside className="lg:col-span-5 relative">
          <div className="w-full rounded-2xl bg-gradient-to-br from-indigo-800 via-slate-900 to-black shadow-2xl p-6 border border-slate-800">
            {/* Mock VR Scene Card */}
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl">
              <div className="absolute top-8 left-6 w-12 h-6 bg-white/20 rounded-lg float-slow"></div>
              <div className="absolute top-20 right-10 w-16 h-8 bg-white/25 rounded-lg float-medium"></div>
              <div className="absolute bottom-16 left-12 w-20 h-10 bg-white/15 rounded-lg float-fast"></div>
              {/* Placeholder for card content */}
              <div className="text-center text-slate-400 text-sm">Mock VR Scene Preview</div>
            </div>
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 500" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="g1" x1="0" x2="1">
                  <stop offset="0" stopColor="#6ee7b7" stopOpacity="0.05" />
                  <stop offset="1" stopColor="#7c3aed" stopOpacity="0.08" />
                </linearGradient>
              </defs>
              <rect width="800" height="500" fill="url(#g1)" />
              {/* Stylised skyline */}
              <g transform="translate(0,60) scale(1,1)">
                <rect x="60" y="160" width="60" height="180" rx="8" fill="#0ea5e9" opacity="0.12" />
                <rect x="140" y="120" width="80" height="220" rx="10" fill="#7c3aed" opacity="0.12" />
                <rect x="240" y="140" width="50" height="200" rx="6" fill="#60a5fa" opacity="0.12" />
                <rect x="320" y="100" width="120" height="240" rx="12" fill="#a78bfa" opacity="0.1" />
                <circle cx="660" cy="60" r="40" fill="#60a5fa" opacity="0.08" />
              </g>
            </svg>

            <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3">
              <div className="bg-gradient-to-br from-indigo-500 to-sky-400 p-2 rounded-md shadow">
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C7 2 4 6 4 10c0 4 3 8 8 12s8-4 8-8c0-3-3-8-8-12z" fill="white" opacity="0.95" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold">TechVerse Preview</div>
                <div className="text-xs text-slate-400">Explore a curated electronics world — demo coming soon.</div>
              </div>
              <div>
                <button className="px-4 py-2 rounded-lg bg-white text-black font-semibold">Preview</button>
              </div>
            </div>
          </div>

          <div className="mt-4 text-xs text-slate-400">Concept mockup — visuals subject to change. Built with QSV brand palette.</div>
        </aside>
      </main>

      {/* How it works */}
      <section id="how" className="max-w-6xl mx-auto px-6 sm:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/60 to-black border border-slate-800">
            <h3 className="text-lg font-semibold">Explore Worlds</h3>
            <p className="mt-2 text-slate-400">Enter themed universes built by brands. Each world is crafted for discovery and storytelling.</p>
          </div>
          <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/60 to-black border border-slate-800">
            <h3 className="text-lg font-semibold">Experience Products</h3>
            <p className="mt-2 text-slate-400">Try, test and interact with products in realistic 3D before buying.</p>
          </div>
          <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/60 to-black border border-slate-800">
            <h3 className="text-lg font-semibold">Buy Seamlessly</h3>
            <p className="mt-2 text-slate-400">Secure checkout integrated with leading payment providers and delivery options.</p>
          </div>
        </div>
      </section>

      {/* Why QSV */}
      <section id="why" className="max-w-6xl mx-auto px-6 sm:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-bold">Why QSV?</h2>
            <p className="mt-4 text-slate-300 max-w-xl">
              QSV recreates the delight of discovery and the tactile feeling of shopping without the friction of travel. For brands, it’s a new channel to tell stories, create events, and sell — both physical and digital products.
            </p>
            <ul className="mt-6 space-y-3 text-slate-400">
              <li>• Immersive discovery beats flat thumbnails.</li>
              <li>• Social shopping with friends & creators.</li>
              <li>• New revenue from virtual goods & branded worlds.</li>
            </ul>
          </div>
          <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/60 to-black border border-slate-800">
            <div className="text-center">
              <div className="text-sm font-semibold">Market Snapshot</div>
              <div className="mt-4 text-4xl font-bold">$6T+</div>
              <div className="text-slate-400 mt-1">Global e-commerce (2024)</div>
              <div className="mt-6 text-2xl font-semibold">$100B+</div>
              <div className="text-slate-400 mt-1">VR/AR market potential</div>
            </div>
          </div>
        </div>
      </section>

      {/* Waitlist / Join */}
      <section id="join" className="max-w-4xl mx-auto px-6 sm:px-8 py-12">
        <div className="rounded-3xl bg-gradient-to-br from-indigo-900/40 via-slate-900 to-black p-8 border border-slate-800 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div>
              <h3 className="text-2xl font-bold">Be the First to Explore QSV</h3>
              <p className="mt-3 text-slate-300">Sign up for early access, beta invites, and exclusive founder updates.</p>
            </div>
            <form action={WAITLIST_FORM_ACTION} method="POST" className="flex gap-3">
              <input
                name="email"
                type="email"
                required
                placeholder="you@domain.com"
                className="flex-1 px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 placeholder-slate-500"
                aria-label="Email address for waitlist"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-sky-500 to-violet-600 hover:from-fuchsia-500 hover:to-sky-600 hover:scale-105 transition-transform duration-300 shadow-lg"
              >
                Join Waitlist
              </button>
            </form>
          </div>
          <div className="mt-4 text-xs text-slate-400">We respect your privacy. We’ll only email you about QSV updates.</div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-6 sm:px-8 py-8 text-slate-400">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold text-white">QSV</div>
            <div className="text-xs">Shop Across Realities</div>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <a href="#" className="hover:text-white">About</a>
            <a href="#" className="hover:text-white">Contact</a>
            <a href="#" className="hover:text-white">Privacy</a>
          </div>
        </div>
        <div className="mt-6 text-xs text-slate-500">© {new Date().getFullYear()} QSV. All rights reserved.</div>
      </footer>
    </div>
  );
}
