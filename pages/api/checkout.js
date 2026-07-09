import { getProduct } from '../../lib/products'

// Creates a checkout session. If STRIPE_SECRET_KEY is configured, a real
// Stripe Checkout session is created (test or live mode follows the key).
// Without keys the API returns a simulated order so the demo flow always works.
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  const { items } = req.body
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, error: 'Cart is empty' })
  }

  // Never trust client prices — rebuild line items from the server-side catalog
  const lineItems = []
  for (const item of items) {
    const product = getProduct(item.id)
    const qty = Math.max(1, Math.min(99, parseInt(item.qty, 10) || 1))
    if (!product) {
      return res.status(400).json({ success: false, error: `Unknown product: ${item.id}` })
    }
    lineItems.push({ product, qty })
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY

  if (stripeKey) {
    try {
      const Stripe = (await import('stripe')).default
      const stripe = new Stripe(stripeKey)
      const origin = req.headers.origin || `https://${req.headers.host}`

      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        line_items: lineItems.map(({ product, qty }) => ({
          price_data: {
            currency: 'usd',
            product_data: { name: product.name, description: product.tagline },
            unit_amount: product.price * 100
          },
          quantity: qty
        })),
        success_url: `${origin}/checkout?status=success&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/checkout?status=cancelled`
      })

      return res.status(200).json({ success: true, mode: 'stripe', url: session.url })
    } catch (err) {
      console.error('Stripe error:', err.message)
      return res.status(500).json({ success: false, error: 'Payment provider error' })
    }
  }

  // Demo mode: simulate a confirmed order
  const total = lineItems.reduce((sum, { product, qty }) => sum + product.price * qty, 0)
  const orderId = `QSV-${Date.now().toString(36).toUpperCase()}`

  return res.status(200).json({
    success: true,
    mode: 'demo',
    orderId,
    total
  })
}
