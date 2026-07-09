// QSV AI shopping assistant engine.
//
// Deterministic, catalog-aware recommendation engine: zero latency and fully
// predictable during live pitches. The answer() signature is async so a real
// LLM backend (Claude API) can be swapped in behind the same interface later.

import { PRODUCTS, getCategories, getProductsByCategory, formatPrice } from './products'

const CATEGORY_KEYWORDS = {
  Footwear: ['shoe', 'shoes', 'sneaker', 'sneakers', 'boot', 'boots', 'footwear', 'kicks'],
  Wearables: ['watch', 'watches', 'lens', 'lenses', 'wearable', 'wearables', 'glasses', 'wrist'],
  Neurotech: ['neural', 'headset', 'brain', 'voice', 'neurotech', 'mind'],
  Computing: ['processor', 'chip', 'display', 'scanner', 'computer', 'computing', 'screen', 'quantum'],
  Consumables: ['drink', 'energy', 'pills', 'supplement', 'consumable', 'snack'],
  Apparel: ['jacket', 'clothes', 'clothing', 'apparel', 'wear', 'outfit', 'fashion']
}

function detectCategory(text) {
  for (const [category, words] of Object.entries(CATEGORY_KEYWORDS)) {
    if (words.some((w) => text.includes(w))) return category
  }
  return null
}

function detectBudget(text) {
  const m = text.match(/(?:under|below|less than|max|budget of|around)?\s*\$?\s*(\d{2,6})/)
  return m ? parseInt(m[1], 10) : null
}

function byRating(a, b) {
  return b.rating - a.rating
}

export async function answer(rawText) {
  const text = rawText.toLowerCase().trim()

  // Greetings / help
  if (/^(hi|hey|hello|yo|sup)\b/.test(text) || text === '') {
    return {
      reply:
        "Welcome to the Verse. I know every product in every store here. Ask me things like \"compare footwear\", \"best wearable\", or \"gift ideas under $500\".",
      products: []
    }
  }

  const category = detectCategory(text)
  const budget = detectBudget(text)
  const wantsCompare = /compare|versus|vs\b|difference/.test(text)
  const wantsCheapest = /cheap|cheapest|affordable|budget/.test(text)
  const wantsBest = /best|top|highest|premium|flagship/.test(text)
  const wantsGift = /gift|present|birthday/.test(text)

  // Comparison across retailers
  if (wantsCompare) {
    const cat = category || 'Footwear'
    const items = getProductsByCategory(cat).sort((a, b) => a.price - b.price)
    if (items.length >= 2) {
      const cheapest = items[0]
      const best = [...items].sort(byRating)[0]
      return {
        reply: `Here's every ${cat.toLowerCase()} product across the Verse, compared instantly. ${cheapest.name} (${cheapest.store}) is the value pick at ${formatPrice(cheapest.price)}, while ${best.name} (${best.store}) has the top rating at ★ ${best.rating}.`,
        products: items,
        comparison: true
      }
    }
  }

  // Gift ideas
  if (wantsGift) {
    const max = budget || 1000
    const picks = PRODUCTS.filter((p) => p.price <= max).sort(byRating).slice(0, 3)
    return {
      reply: `Great gifts under ${formatPrice(max)}, ranked by Verse rating:`,
      products: picks
    }
  }

  // Budget query
  if (budget && !category) {
    const picks = PRODUCTS.filter((p) => p.price <= budget).sort(byRating).slice(0, 4)
    return picks.length
      ? { reply: `Top-rated picks under ${formatPrice(budget)}:`, products: picks }
      : { reply: `Nothing under ${formatPrice(budget)} right now — the Energy Drink at ${formatPrice(29)} is our most affordable item.`, products: [] }
  }

  // Category (optionally with budget / cheapest / best)
  if (category) {
    let items = getProductsByCategory(category)
    if (budget) items = items.filter((p) => p.price <= budget)
    if (wantsCheapest) items = [...items].sort((a, b) => a.price - b.price)
    else items = [...items].sort(byRating)

    if (items.length === 0) {
      return { reply: `No ${category.toLowerCase()} in that range — want me to widen the budget?`, products: [] }
    }
    const lead = items[0]
    return {
      reply: `For ${category.toLowerCase()}, I'd start with the ${lead.name} from ${lead.store} — ${lead.tagline.toLowerCase()} ${formatPrice(lead.price)}, rated ★ ${lead.rating}.`,
      products: items
    }
  }

  // Cheapest / best overall
  if (wantsCheapest) {
    const items = [...PRODUCTS].sort((a, b) => a.price - b.price).slice(0, 3)
    return { reply: 'Most affordable across all stores:', products: items }
  }
  if (wantsBest) {
    const items = [...PRODUCTS].sort(byRating).slice(0, 3)
    return { reply: 'Highest-rated products in the Verse right now:', products: items }
  }

  // Direct product name match
  const named = PRODUCTS.filter((p) => text.includes(p.name.toLowerCase()))
  if (named.length > 0) {
    const p = named[0]
    return {
      reply: `${p.name} (${p.store}) — ${p.description} ${formatPrice(p.price)}, rated ★ ${p.rating}.`,
      products: [p]
    }
  }

  // Fallback: general recommendations
  const picks = [...PRODUCTS].sort(byRating).slice(0, 3)
  return {
    reply: `I can help you find, compare, and buy anything in the Verse. Categories here: ${getCategories().join(', ')}. Meanwhile, these are trending:`,
    products: picks
  }
}

export const SUGGESTIONS = [
  'Compare footwear',
  'Best wearable?',
  'Gift ideas under $500',
  'Cheapest tech'
]
