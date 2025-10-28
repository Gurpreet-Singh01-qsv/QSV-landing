import Head from 'next/head'
import Link from 'next/link'

export default function About() {
  return (
    <>
      <Head>
        <title>About QSV - The Future of VR Shopping | Shop the Multiverse</title>
        <meta
          name="description"
          content="Discover how QSV is revolutionizing e-commerce through immersive VR experiences. Meet the team building the future of shopping in the multiverse."
        />
      </Head>

      <div className="relative min-h-screen bg-gradient-to-br from-[#040824] via-[#120538] to-[#01010f] text-white">
        {/* Background Effects */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(68,215,255,0.15),transparent_50%),radial-gradient(circle_at_70%_60%,rgba(155,108,255,0.2),transparent_50%)]" />

        {/* Navigation */}
        <nav className="relative z-10 flex items-center justify-between px-6 py-6 lg:px-16">
          <Link href="/" className="text-2xl font-bold text-cyan-300 hover:text-cyan-200 transition-colors">
            QSV
          </Link>
          <div className="flex gap-6">
            <Link href="/" className="text-gray-300 hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/features" className="text-gray-300 hover:text-white transition-colors">
              Features
            </Link>
            <Link href="/about" className="text-cyan-300">
              About
            </Link>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative z-10 px-6 py-16 lg:px-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl lg:text-7xl font-bold mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-violet-300">
                Redefining Commerce
              </span>
              <br />
              <span className="text-white">for the VR Generation</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              We're not just building another shopping platform. We're creating the first true multiverse commerce experience where every purchase is an adventure.
            </p>
          </div>
        </section>

        {/* Story Section */}
        <section className="relative z-10 px-6 py-16 lg:px-16">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold mb-6 text-white">Our Vision</h2>
                <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
                  <p>
                    Shopping today is broken. Endless scrolling through flat images, reading reviews from strangers, 
                    and hoping products match expectations. We saw a future where commerce could be immersive, 
                    emotional, and genuinely exciting.
                  </p>
                  <p>
                    <span className="text-cyan-300 font-semibold">QSV - Shop the Multiverse</span> transforms 
                    every purchase into a journey. Touch products with haptic precision, explore them in their 
                    natural environments, and feel the emotion they're designed to evoke.
                  </p>
                  <p>
                    We're building the infrastructure for brands to create worlds, not just product pages. 
                    Where customers don't just buy products—they experience them.
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="bg-gradient-to-br from-cyan-900/30 to-violet-900/30 p-8 rounded-2xl border border-cyan-500/20 backdrop-blur-sm">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-violet-500 rounded-xl flex items-center justify-center text-2xl">
                        🌌
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white">Multiverse Commerce</h3>
                        <p className="text-gray-400">Every product has its perfect world</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-xl flex items-center justify-center text-2xl">
                        🤚
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white">Haptic Precision</h3>
                        <p className="text-gray-400">Feel textures, weight, and quality</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center text-2xl">
                        💫
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white">Emotional Shopping</h3>
                        <p className="text-gray-400">Connect with products on a deeper level</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="relative z-10 px-6 py-16 lg:px-16">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-8 text-white">Our Mission</h2>
            <div className="bg-gradient-to-r from-cyan-900/20 to-violet-900/20 p-8 rounded-2xl border border-cyan-500/20 backdrop-blur-sm">
              <p className="text-2xl text-gray-200 leading-relaxed">
                "To make shopping an adventure, not a chore. To help brands create emotional connections 
                through immersive experiences. To build the commerce platform for the next generation 
                of digital natives who expect more than flat screens and endless lists."
              </p>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="relative z-10 px-6 py-16 lg:px-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold mb-12 text-center text-white">Our Values</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl mx-auto mb-6 flex items-center justify-center text-3xl">
                  🚀
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-white">Innovation First</h3>
                <p className="text-gray-300 leading-relaxed">
                  We don't follow trends—we create them. Every feature we build pushes the boundaries 
                  of what's possible in commerce.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-violet-400 to-purple-500 rounded-2xl mx-auto mb-6 flex items-center justify-center text-3xl">
                  🎨
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-white">Experience Design</h3>
                <p className="text-gray-300 leading-relaxed">
                  Every interaction is crafted with intention. We believe beautiful, intuitive design 
                  is not optional—it's essential.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-teal-500 rounded-2xl mx-auto mb-6 flex items-center justify-center text-3xl">
                  🌍
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-white">Sustainable Future</h3>
                <p className="text-gray-300 leading-relaxed">
                  VR shopping reduces returns, minimizes packaging, and helps customers make better 
                  purchasing decisions. Good for business, better for the planet.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative z-10 px-6 py-16 lg:px-16">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6 text-white">Join the Revolution</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              We're building the future of commerce. Be part of the journey from the very beginning.
            </p>
            <Link 
              href="/"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-cyan-500 to-violet-600 text-white font-semibold rounded-full hover:scale-105 transition-transform duration-300 shadow-[0_20px_40px_rgba(56,189,248,0.3)]"
            >
              Join the Waitlist
              <span className="ml-2">→</span>
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative z-10 border-t border-white/10 bg-black/20 py-8 text-center text-xs uppercase tracking-[0.4em] text-slate-300/60">
          © 2025 QSV Multiverse All rights reserved
        </footer>
      </div>
    </>
  )
}