import { useRouter } from 'next/router'
import { useCart } from '../cart/CartContext'
import { formatPrice, STORES } from '../../lib/products'

// Slide-over cart panel, shared by QSV Street and regular pages.
export default function CartDrawer({ open, onClose }) {
  const { items, count, total, setQty, removeItem } = useCart()
  const router = useRouter()

  if (!open) return null

  return (
    <div className="fixed inset-0 z-40">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <aside className="absolute right-0 top-0 h-full w-full max-w-md bg-gradient-to-b from-[#0a0a24] to-[#120538] border-l border-cyan-400/30 shadow-2xl flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-cyan-400/20">
          <h2 className="text-lg font-bold text-white">
            Your Cart <span className="text-cyan-300/70 text-sm font-normal">({count} items)</span>
          </h2>
          <button onClick={onClose} aria-label="Close cart" className="text-gray-400 hover:text-white text-2xl leading-none">×</button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="text-center mt-16">
              <p className="text-gray-400">Your cart is empty.</p>
              <p className="text-cyan-300/60 text-sm mt-2">Walk up to any product and press E to view it.</p>
            </div>
          ) : (
            items.map(({ id, qty, product }) => (
              <div key={id} className="flex items-center gap-4 bg-black/30 border border-cyan-400/15 rounded-lg p-3">
                <div
                  className="w-10 h-10 rounded-md flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${product.color}44, ${product.color}22)`, border: `1px solid ${product.color}66` }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{product.name}</p>
                  <p className="text-xs" style={{ color: STORES[product.store].color }}>{product.store}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setQty(id, qty - 1)} className="w-6 h-6 rounded bg-cyan-500/20 text-cyan-300 text-sm hover:bg-cyan-500/40">−</button>
                  <span className="text-white text-sm w-5 text-center">{qty}</span>
                  <button onClick={() => setQty(id, qty + 1)} className="w-6 h-6 rounded bg-cyan-500/20 text-cyan-300 text-sm hover:bg-cyan-500/40">+</button>
                </div>
                <div className="text-right w-20">
                  <p className="text-cyan-300 text-sm font-semibold">{formatPrice(product.price * qty)}</p>
                  <button onClick={() => removeItem(id)} className="text-xs text-gray-500 hover:text-red-400">remove</button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-5 border-t border-cyan-400/20 bg-black/30">
          <div className="flex justify-between mb-4">
            <span className="text-gray-300">Total</span>
            <span className="text-xl font-bold text-white">{formatPrice(total)}</span>
          </div>
          <button
            disabled={items.length === 0}
            onClick={() => router.push('/checkout')}
            className="w-full py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-cyan-500 to-violet-500 hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
          >
            Checkout {items.length > 0 && `· ${formatPrice(total)}`}
          </button>
        </div>
      </aside>
    </div>
  )
}
