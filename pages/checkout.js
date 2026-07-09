import { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useCart } from '../components/cart/CartContext'
import { formatPrice, STORES } from '../lib/products'

export default function Checkout() {
  const { items, count, total, clearCart } = useCart()
  const router = useRouter()
  const [placing, setPlacing] = useState(false)
  const [order, setOrder] = useState(null)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', email: '', address: '' })

  const stripeReturn = router.query.status // 'success' | 'cancelled' from Stripe redirect

  // Returning from a successful Stripe payment: the order is done, empty the cart
  useEffect(() => {
    if (stripeReturn === 'success') clearCart()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stripeReturn])

  const placeOrder = async (e) => {
    e.preventDefault()
    setError('')
    setPlacing(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: items.map(({ id, qty }) => ({ id, qty })) })
      })
      const result = await res.json()

      if (!result.success) {
        setError(result.error || 'Checkout failed')
        return
      }

      if (result.mode === 'stripe') {
        window.location.href = result.url
        return
      }

      // Demo mode: brief processing beat so the confirmation lands naturally
      await new Promise((r) => setTimeout(r, 1200))
      setOrder({ id: result.orderId, total: result.total })
      clearCart()
    } catch (err) {
      setError('Could not reach checkout — try again')
    } finally {
      setPlacing(false)
    }
  }

  const confirmed = order || stripeReturn === 'success'

  return (
    <>
      <Head>
        <title>Checkout – QSV</title>
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-[#040824] via-[#120538] to-[#01010f] text-white">
        {/* Nav */}
        <nav className="flex items-center justify-between px-6 py-4 border-b border-cyan-400/20">
          <Link href="/" className="text-xl font-bold text-cyan-300">QSV</Link>
          <Link href="/vr" className="text-sm text-cyan-300/80 hover:text-cyan-200">← Back to QSV Street</Link>
        </nav>

        <main className="max-w-3xl mx-auto px-4 py-10">
          {confirmed ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 flex items-center justify-center text-4xl">✓</div>
              <h1 className="text-3xl font-bold mb-2">Order confirmed</h1>
              {order && (
                <p className="text-cyan-300 text-lg mb-1">
                  {order.id} · {formatPrice(order.total)}
                </p>
              )}
              <p className="text-gray-400 mb-8">Your items are being prepared for dispatch from the Verse.</p>
              <Link
                href="/vr"
                className="inline-block px-8 py-3 rounded-lg font-semibold bg-gradient-to-r from-cyan-500 to-violet-500 hover:opacity-90 transition-opacity"
              >
                Keep shopping in QSV Street
              </Link>
            </div>
          ) : (
            <>
              <h1 className="text-3xl font-bold mb-8">Checkout</h1>
              {stripeReturn === 'cancelled' && (
                <p className="mb-6 px-4 py-3 rounded-lg bg-yellow-500/15 border border-yellow-400/40 text-yellow-200 text-sm">
                  Payment was cancelled — your cart is untouched.
                </p>
              )}

              {items.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-gray-400 mb-6">Your cart is empty.</p>
                  <Link
                    href="/vr"
                    className="inline-block px-8 py-3 rounded-lg font-semibold bg-gradient-to-r from-cyan-500 to-violet-500 hover:opacity-90 transition-opacity"
                  >
                    Enter QSV Street
                  </Link>
                </div>
              ) : (
                <div className="grid md:grid-cols-5 gap-8">
                  {/* Order summary */}
                  <section className="md:col-span-3">
                    <h2 className="text-sm uppercase tracking-widest text-cyan-300/70 mb-4">
                      Order summary ({count} items)
                    </h2>
                    <div className="space-y-3">
                      {items.map(({ id, qty, product }) => (
                        <div key={id} className="flex items-center gap-4 bg-black/30 border border-cyan-400/15 rounded-lg p-4">
                          <div
                            className="w-12 h-12 rounded-md flex-shrink-0"
                            style={{ background: `linear-gradient(135deg, ${product.color}44, ${product.color}22)`, border: `1px solid ${product.color}66` }}
                          />
                          <div className="flex-1">
                            <p className="font-medium">{product.name}</p>
                            <p className="text-xs" style={{ color: STORES[product.store].color }}>
                              {product.store} · qty {qty}
                            </p>
                          </div>
                          <p className="text-cyan-300 font-semibold">{formatPrice(product.price * qty)}</p>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between mt-6 pt-4 border-t border-cyan-400/20 text-lg">
                      <span className="text-gray-300">Total</span>
                      <span className="font-bold">{formatPrice(total)}</span>
                    </div>
                  </section>

                  {/* Shipping + payment */}
                  <section className="md:col-span-2">
                    <h2 className="text-sm uppercase tracking-widest text-cyan-300/70 mb-4">Delivery</h2>
                    <form onSubmit={placeOrder} className="space-y-4">
                      <input
                        required
                        placeholder="Full name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full bg-black/40 border border-cyan-400/25 rounded-lg px-4 py-3 text-sm placeholder-gray-500 focus:outline-none focus:border-cyan-400/60"
                      />
                      <input
                        required
                        type="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full bg-black/40 border border-cyan-400/25 rounded-lg px-4 py-3 text-sm placeholder-gray-500 focus:outline-none focus:border-cyan-400/60"
                      />
                      <input
                        required
                        placeholder="Delivery address"
                        value={form.address}
                        onChange={(e) => setForm({ ...form, address: e.target.value })}
                        className="w-full bg-black/40 border border-cyan-400/25 rounded-lg px-4 py-3 text-sm placeholder-gray-500 focus:outline-none focus:border-cyan-400/60"
                      />

                      {error && <p className="text-red-400 text-sm">{error}</p>}

                      <button
                        type="submit"
                        disabled={placing}
                        className="w-full py-3 rounded-lg font-semibold bg-gradient-to-r from-cyan-500 to-violet-500 hover:opacity-90 disabled:opacity-50 transition-opacity"
                      >
                        {placing ? 'Processing…' : `Pay ${formatPrice(total)}`}
                      </button>
                      <p className="text-[11px] text-gray-500 text-center">
                        Payments secured by Stripe. Demo environment — no card is charged.
                      </p>
                    </form>
                  </section>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </>
  )
}
