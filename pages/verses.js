import Head from 'next/head'
import Link from 'next/link'
import { PRODUCTS, getCategories, getProductsByCategory, formatPrice } from '../lib/products'

const VERSE_META = {
  Footwear: { icon: '👟', blurb: 'Sneakers and boots you can walk around before you walk in.' },
  Wearables: { icon: '⌚', blurb: 'Watches and lenses, inspected down to the bezel.' },
  Neurotech: { icon: '🧠', blurb: 'Interfaces between you and the Verse.' },
  Computing: { icon: '🔮', blurb: 'Processors, displays, and scanners from every maker.' },
  Consumables: { icon: '⚡', blurb: 'Fuel for long sessions, delivered to your door.' },
  Apparel: { icon: '🧥', blurb: 'Programmable fashion from the street to the stratosphere.' }
}

const COMING_SOON = [
  { icon: '🏙️', name: 'City Twins', blurb: 'Photoreal digital twins of real flagship stores, scanned block by block.' },
  { icon: '🎤', name: 'Creator Verses', blurb: 'Influencer-curated storefronts with live shopping events.' }
]

export default function Verses() {
  const categories = getCategories()

  return (
    <>
      <Head>
        <title>Choose your Verse – QSV</title>
        <meta name="description" content="Enter the Quantum Shopping Verse — pick a category verse and shop every brand inside one immersive world." />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-[#040824] via-[#120538] to-[#01010f] text-white">
        {/* Nav */}
        <nav className="flex items-center justify-between px-6 py-4 border-b border-cyan-400/20">
          <Link href="/" className="text-xl font-bold text-cyan-300">QSV</Link>
          <Link
            href="/vr"
            className="px-4 py-2 text-sm bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 rounded-lg hover:bg-cyan-500/30 transition-colors"
          >
            Enter the full street →
          </Link>
        </nav>

        <main className="max-w-5xl mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <p className="text-xs tracking-[0.3em] uppercase text-violet-300/70 mb-3">Quantum Shopping Verse</p>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Choose your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400">Verse</span>
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Every brand under one roof, divided into worlds by what you love.
              Pick a verse — QSV AI guides you to every product in it, across every retailer.
            </p>
          </div>

          {/* Category verses */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {categories.map((cat) => {
              const items = getProductsByCategory(cat)
              const prices = items.map((p) => p.price)
              const meta = VERSE_META[cat] || { icon: '🛍️', blurb: '' }
              return (
                <Link
                  key={cat}
                  href={`/vr?verse=${encodeURIComponent(cat)}`}
                  className="group relative bg-black/30 border border-cyan-400/20 rounded-2xl p-6 hover:border-cyan-400/60 hover:bg-cyan-500/5 transition-all hover:-translate-y-1"
                >
                  <div className="text-4xl mb-4">{meta.icon}</div>
                  <h2 className="text-xl font-bold mb-1 group-hover:text-cyan-300 transition-colors">{cat} Verse</h2>
                  <p className="text-sm text-gray-400 mb-4 min-h-[40px]">{meta.blurb}</p>
                  <div className="flex items-center justify-between text-xs text-cyan-300/70">
                    <span>{items.length} products · {new Set(items.map((p) => p.store)).size} retailers</span>
                    <span>{formatPrice(Math.min(...prices))}–{formatPrice(Math.max(...prices))}</span>
                  </div>
                  <span className="absolute top-5 right-5 text-[10px] uppercase tracking-wider text-green-300 bg-green-500/15 border border-green-400/40 rounded px-1.5 py-0.5">Live</span>
                </Link>
              )
            })}

            {/* Coming soon */}
            {COMING_SOON.map((v) => (
              <div key={v.name} className="relative bg-black/20 border border-white/10 rounded-2xl p-6 opacity-60">
                <div className="text-4xl mb-4 grayscale">{v.icon}</div>
                <h2 className="text-xl font-bold mb-1 text-gray-300">{v.name}</h2>
                <p className="text-sm text-gray-500 mb-4 min-h-[40px]">{v.blurb}</p>
                <span className="absolute top-5 right-5 text-[10px] uppercase tracking-wider text-violet-300 bg-violet-500/15 border border-violet-400/40 rounded px-1.5 py-0.5">Coming soon</span>
              </div>
            ))}
          </div>

          <p className="text-center text-gray-500 text-sm mt-10">
            {PRODUCTS.length} products · 4 retailers · one cart, one checkout, one world
          </p>
        </main>
      </div>
    </>
  )
}
