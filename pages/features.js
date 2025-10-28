import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'

export default function Features() {
  const [activeFeature, setActiveFeature] = useState(0)

  const features = [
    {
      title: "Quantum Cart Technology",
      subtitle: "Lightning-Fast Checkout",
      description: "Our streamlined cart system is designed to reduce checkout friction and create a seamless purchase experience in VR environments.",
      icon: "⚡",
      color: "from-cyan-400 to-blue-500",
      details: [
        "Instant product materialization",
        "Secure transaction processing",
        "Predictive purchase suggestions",
        "Optimized payment processing"
      ]
    },
    {
      title: "Haptic Weave Integration",
      subtitle: "Feel Every Texture",
      description: "Touch products before you buy them. Our haptic weave technology transmits texture, weight, temperature, and material properties directly to your hands.",
      icon: "🤚",
      color: "from-violet-400 to-purple-500",
      details: [
        "Ultra-realistic texture simulation",
        "Weight and density feedback",
        "Temperature variation sensing",
        "Material composition analysis"
      ]
    },
    {
      title: "Multiverse Environments",
      subtitle: "Shop in Any Reality",
      description: "Every product exists in its perfect environment. Shop for sneakers in neon-lit cyberpunk streets, or browse furniture in a cozy mountain cabin.",
      icon: "🌌",
      color: "from-green-400 to-teal-500",
      details: [
        "Infinite customizable worlds",
        "Brand-specific environments",
        "Weather and lighting effects",
        "Social shopping spaces"
      ]
    },
    {
      title: "Emotional Commerce AI",
      subtitle: "Euphoric Calm Shopping",
      description: "Our AI doesn't just recommend products—it curates emotional experiences. Find items that match your mood, aspirations, and lifestyle.",
      icon: "🧠",
      color: "from-pink-400 to-rose-500",
      details: [
        "Mood-based product curation",
        "Emotional state analysis",
        "Lifestyle compatibility scoring",
        "Aspiration-driven recommendations"
      ]
    },
    {
      title: "Adaptive Fit Technology",
      subtitle: "Perfect Size Every Time",
      description: "Never worry about sizing again. Our adaptive fit technology scans your body and ensures every item fits perfectly before you buy.",
      icon: "📐",
      color: "from-orange-400 to-red-500",
      details: [
        "3D body scanning",
        "Size prediction algorithms",
        "Fit visualization",
        "Improved purchase confidence"
      ]
    },
    {
      title: "Social Shopping Pods",
      subtitle: "Shop with Friends",
      description: "Bring friends into your shopping experience. Get real-time opinions, share discoveries, and make group purchases in shared virtual spaces.",
      icon: "👥",
      color: "from-indigo-400 to-purple-500",
      details: [
        "Multi-user shopping sessions",
        "Real-time voice and gesture",
        "Shared wishlists and carts",
        "Group discount mechanics"
      ]
    }
  ]

  return (
    <>
      <Head>
        <title>Features - QSV Multiverse | Revolutionary VR Shopping Technology</title>
        <meta
          name="description"
          content="Discover QSV's cutting-edge features: Quantum Cart, Haptic Weave, Multiverse Environments, and Emotional Commerce AI. The future of shopping is here."
        />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/images/qsv-logo-merged.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/images/qsv-logo-merged.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/images/qsv-logo-merged.png" />
      </Head>

      <div className="relative min-h-screen bg-gradient-to-br from-[#040824] via-[#120538] to-[#01010f] text-white">
        {/* Background Effects */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(68,215,255,0.15),transparent_50%),radial-gradient(circle_at_80%_70%,rgba(155,108,255,0.2),transparent_50%)]" />

        {/* Navigation */}
        <nav className="relative z-10 flex items-center justify-between px-6 py-6 lg:px-16">
          <Link href="/" className="text-2xl font-bold text-cyan-300 hover:text-cyan-200 transition-colors">
            QSV
          </Link>
          <div className="flex gap-6">
            <Link href="/" className="text-gray-300 hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/features" className="text-cyan-300">
              Features
            </Link>
            <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
              About
            </Link>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative z-10 px-6 py-16 lg:px-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl lg:text-7xl font-bold mb-6">
              <span className="text-white">Revolutionary</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-violet-300">
                Shopping Technology
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Experience the most advanced VR commerce platform ever built. Every feature designed to make shopping intuitive, immersive, and emotionally engaging.
            </p>
          </div>
        </section>

        {/* Interactive Features Section */}
        <section className="relative z-10 px-6 py-16 lg:px-16">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Feature List */}
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className={`p-6 rounded-2xl border cursor-pointer transition-all duration-300 ${
                      activeFeature === index
                        ? 'bg-white/10 border-cyan-400/50 shadow-[0_0_30px_rgba(56,189,248,0.3)]'
                        : 'bg-white/5 border-white/10 hover:bg-white/8 hover:border-white/20'
                    }`}
                    onClick={() => setActiveFeature(index)}
                  >
                    <div className="flex items-center gap-4 mb-3">
                      <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center text-2xl`}>
                        {feature.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                        <p className="text-sm text-cyan-300">{feature.subtitle}</p>
                      </div>
                    </div>
                    <p className="text-gray-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* Feature Details */}
              <div className="lg:sticky lg:top-8">
                <div className="bg-gradient-to-br from-white/10 to-white/5 p-8 rounded-2xl border border-white/20 backdrop-blur-sm">
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-br ${features[activeFeature].color} rounded-2xl flex items-center justify-center text-3xl`}>
                      {features[activeFeature].icon}
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-white">{features[activeFeature].title}</h2>
                      <p className="text-cyan-300 text-lg">{features[activeFeature].subtitle}</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 text-lg leading-relaxed mb-8">
                    {features[activeFeature].description}
                  </p>

                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-white mb-4">Key Capabilities:</h3>
                    {features[activeFeature].details.map((detail, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                        <span className="text-gray-300">{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="relative z-10 px-6 py-16 lg:px-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold mb-6 text-center text-white">Platform Goals</h2>
            <p className="text-center text-gray-400 mb-12 text-sm">Our development targets for the VR shopping experience</p>
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-400 mb-2">Streamlined</div>
                <div className="text-gray-300">Checkout Process</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-violet-400 mb-2">Better Fit</div>
                <div className="text-gray-300">Through VR Try-On</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">Engaging</div>
                <div className="text-gray-300">VR Environments</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-400 mb-2">Scalable</div>
                <div className="text-gray-300">Platform Architecture</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative z-10 px-6 py-16 lg:px-16">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6 text-white">Ready to Experience the Future?</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of early adopters who are already experiencing the next generation of shopping.
            </p>
            <Link 
              href="/"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-cyan-500 to-violet-600 text-white font-semibold rounded-full hover:scale-105 transition-transform duration-300 shadow-[0_20px_40px_rgba(56,189,248,0.3)]"
            >
              Get Early Access
              <span className="ml-2">→</span>
            </Link>
          </div>
        </section>

        {/* Disclaimer Section */}
        <section className="relative z-10 px-6 py-8 bg-black/30">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-sm text-gray-400 leading-relaxed">
              All features described are planned functionality for the QSV platform currently in development. 
              Performance characteristics and capabilities are development goals and subject to change. 
              Actual results may vary based on final implementation and hardware requirements.
            </p>
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