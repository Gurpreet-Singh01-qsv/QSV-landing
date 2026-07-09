# QSV Investor Demo Script

**URL:** https://qsv-landing.vercel.app/vr (works in any modern browser — no install)
**Duration:** ~4 minutes. Practice the walk once before pitching.

---

## Setup (before the meeting)

1. Open the URL in Chrome, full screen (F11).
2. If you demoed earlier, click the cart and remove old items.
3. Keep this script on your phone, not the demo machine.

## The demo

### 1. The hook — "this is a store" (30s)

Let the street load. Don't touch anything yet.

> "This is QSV — the Quantum Shopping Verse. Every storefront you see is a
> retailer. Instead of visiting Amazon, Nike, and Apple in separate tabs,
> shoppers walk one street. It runs in any browser — laptop, phone, or VR
> headset. No app, no install."

Click the scene, then walk (**WASD** + mouse) slowly down the center line.

### 2. Product interaction (60s)

Walk up to the APEX store (pink, right side) until the **Cyber Sneakers**
info panel appears, then press **E**.

> "Products aren't photos here — they're 3D objects you approach like a real
> shelf. Full specs, ratings, pricing."

Click **Add to cart** — point out the cart badge updating live.

### 3. The killer feature — instant comparison (45s)

In the same panel, click the **Compare** tab.

> "Here's what no retailer can do alone: this is the same category across
> every store on the street, compared instantly — price, rating, retailer.
> Cross-retailer comparison is native to the platform, not a plugin."

Add the rival product too. Close the panel.

### 4. AI assistant (45s)

Click **QSV AI** (bottom-left). Click the **"Gift ideas under $500"** chip,
or type a question live.

> "Every shopper gets a personal AI that knows the entire catalog across all
> retailers. It recommends, compares, and adds to cart — this becomes the
> personalization engine as we scale."

Add one recommendation to the cart from the chat.

### 5. Close the loop — checkout (45s)

Click **Cart** (bottom-right) → **Checkout**. Fill the form with anything.
Click **Pay**.

> "And the transaction completes without ever leaving the platform. Payments
> run on Stripe. One cart, many retailers — that's unified commerce."

Show the order confirmation.

### 6. The kicker — VR (15s)

Point at the **Enter VR** button (top-right).

> "Same URL on a Quest headset, this button puts you inside the street with
> full controller movement. The web is our distribution: every device, zero
> friction."

---

## If asked

- **"Is the AI real?"** — The assistant runs on a deterministic catalog engine
  today; the interface is built to swap in a Claude-powered backend (the
  adapter is already in `lib/assistant.js`).
- **"Are payments live?"** — Stripe integration is wired; it runs in demo mode
  until API keys are configured. Flipping to live Stripe test mode is a
  config change, not a build.
- **"What about mobile?"** — The scene renders on mobile; touch movement
  controls are on the roadmap (next sprint).

## Known rough edges (don't demo these)

- Don't press E while the AI chat is closed and you're far from products —
  nothing happens (by design).
- Hand-tracking in VR is experimental; use controllers.
