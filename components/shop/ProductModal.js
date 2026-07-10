import { useState } from 'react'
import { useCart } from '../cart/CartContext'
import { getProductsByCategory, formatPrice, STORES } from '../../lib/products'
import ProductInspector from './ProductInspector'

// Full-screen product detail overlay used inside QSV Street.
// Includes an instant cross-retailer comparison tab for the product's category.
export default function ProductModal({ product, onClose }) {
  const { addItem } = useCart()
  const [tab, setTab] = useState('details')
  const [added, setAdded] = useState(false)
  const [inspecting, setInspecting] = useState(false)

  if (!product) return null

  if (inspecting) {
    return <ProductInspector product={product} onClose={() => setInspecting(false)} />
  }

  const store = STORES[product.store]
  const rivals = getProductsByCategory(product.category).filter((p) => p.id !== product.id)

  const handleAdd = (id) => {
    addItem(id)
    setAdded(true)
    setTimeout(() => setAdded(false), 1200)
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-gradient-to-br from-[#0a0a24] to-[#120538] border border-cyan-400/30 rounded-2xl shadow-2xl shadow-cyan-500/20 overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-4">
          <div>
            <p className="text-xs tracking-widest uppercase" style={{ color: store.color }}>
              {store.name} · {product.category}
            </p>
            <h2 className="text-2xl font-bold text-white mt-1">{product.name}</h2>
            <p className="text-cyan-300/70 text-sm mt-1 italic">{product.tagline}</p>
            {product.modelUrl && (
              <button
                onClick={() => setInspecting(true)}
                className="mt-2 inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-cyan-300 bg-cyan-500/15 border border-cyan-400/40 rounded-full px-3 py-1 hover:bg-cyan-500/30 transition-colors"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-pulse" />
                Digitized by QSV — view in 360°
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-gray-400 hover:text-white text-2xl leading-none px-2"
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 px-6">
          {['details', 'compare'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-colors ${
                tab === t
                  ? 'bg-cyan-500/20 text-cyan-300 border border-b-0 border-cyan-400/30'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {t === 'details' ? 'Details' : `Compare (${rivals.length})`}
            </button>
          ))}
        </div>

        <div className="border-t border-cyan-400/20 px-6 py-5 min-h-[220px]">
          {tab === 'details' ? (
            <div>
              <p className="text-gray-300 text-sm leading-relaxed">{product.description}</p>
              <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {product.specs.map((s, i) => (
                  <li key={i} className="text-sm text-cyan-100/80 flex items-start gap-2">
                    <span style={{ color: store.color }}>◆</span> {s}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-yellow-300/90">★ {product.rating} verified Verse rating</p>
            </div>
          ) : (
            <div>
              <p className="text-gray-400 text-xs mb-3">
                Same category, every retailer in the Verse — compared instantly.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-400 border-b border-cyan-400/20">
                      <th className="py-2 pr-4">Product</th>
                      <th className="py-2 pr-4">Store</th>
                      <th className="py-2 pr-4">Rating</th>
                      <th className="py-2 pr-4">Price</th>
                      <th className="py-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {[product, ...rivals].map((p) => (
                      <tr
                        key={p.id}
                        className={`border-b border-cyan-400/10 ${p.id === product.id ? 'bg-cyan-500/10' : ''}`}
                      >
                        <td className="py-2 pr-4 text-white">{p.name}</td>
                        <td className="py-2 pr-4" style={{ color: STORES[p.store].color }}>{p.store}</td>
                        <td className="py-2 pr-4 text-yellow-300/90">★ {p.rating}</td>
                        <td className="py-2 pr-4 text-cyan-300 font-semibold">{formatPrice(p.price)}</td>
                        <td className="py-2 text-right">
                          <button
                            onClick={() => handleAdd(p.id)}
                            className="px-3 py-1 text-xs bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 rounded hover:bg-cyan-500/40 transition-colors"
                          >
                            Add
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 bg-black/30 border-t border-cyan-400/20">
          <p className="text-2xl font-bold text-white">{formatPrice(product.price)}</p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors"
            >
              Keep browsing
            </button>
            <button
              onClick={() => handleAdd(product.id)}
              className={`px-6 py-2 rounded-lg font-semibold text-sm transition-all ${
                added
                  ? 'bg-green-500/80 text-white'
                  : 'bg-gradient-to-r from-cyan-500 to-violet-500 text-white hover:opacity-90'
              }`}
            >
              {added ? '✓ Added to cart' : 'Add to cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
