// QSV unified product catalog — single source of truth for the street scene,
// AI assistant, comparison engine, cart, and checkout.

export const STORES = {
  NEXUS: { name: 'NEXUS', color: '#44d7ff', accentColor: '#00ff88', tagline: 'Neurotech & Computing' },
  VORTEX: { name: 'VORTEX', color: '#9b6cff', accentColor: '#ff6b9d', tagline: 'Premium Wearables' },
  FLUX: { name: 'FLUX', color: '#00ff88', accentColor: '#44d7ff', tagline: 'Bio & Energy' },
  APEX: { name: 'APEX', color: '#ff6b9d', accentColor: '#9b6cff', tagline: 'Street Tech' }
}

export const PRODUCTS = [
  {
    id: 'neural-interface',
    name: 'Neural Interface',
    price: 2499,
    store: 'NEXUS',
    category: 'Neurotech',
    color: '#44d7ff',
    model: 'headset',
    rating: 4.8,
    tagline: 'Think it. Find it. Buy it.',
    description: 'Direct neural link headset for thought-speed browsing. Consciousness-bridge sensors adapt to your brainwave patterns within minutes.',
    specs: ['Dual consciousness-bridge sensors', '14h active neural sync', 'Adaptive brainwave calibration', 'Wireless charging cradle included']
  },
  {
    id: 'quantum-processor',
    name: 'Quantum Processor',
    price: 1899,
    store: 'NEXUS',
    category: 'Computing',
    color: '#00ff88',
    model: 'chip',
    rating: 4.6,
    tagline: 'Compute across possibilities.',
    description: 'Personal quantum co-processor. Drop-in upgrade for any QSV-compatible rig — renders your virtual worlds before you ask.',
    specs: ['128 qubit lattice', 'Superposition cache', 'Zero-kelvin solid-state cooling', '5-year coherence warranty']
  },
  {
    id: 'holo-display',
    name: 'Holo Display',
    price: 999,
    store: 'NEXUS',
    category: 'Computing',
    color: '#44d7ff',
    model: 'screen',
    rating: 4.4,
    tagline: 'Screens are over.',
    description: 'Free-floating holographic panel with 8K volumetric projection. Pinch, stretch, and pin it anywhere in your space.',
    specs: ['8K volumetric projection', 'Gesture + gaze control', '270° viewing angle', 'Folds to pocket size']
  },
  {
    id: 'gravity-boots',
    name: 'Gravity Boots',
    price: 799,
    store: 'VORTEX',
    category: 'Footwear',
    color: '#9b6cff',
    model: 'sneaker',
    rating: 4.5,
    tagline: 'Defy the floor.',
    description: 'Magnetic-levitation soles with adaptive grip. Walk on walls in supported habitats or just float over puddles downtown.',
    specs: ['Mag-lev sole, 40mm lift', 'Auto-balancing gyros', 'All-terrain smart grip', 'Sizes 36–48, self-fitting']
  },
  {
    id: 'phase-jacket',
    name: 'Phase Jacket',
    price: 1299,
    store: 'VORTEX',
    category: 'Apparel',
    color: '#ff6b9d',
    model: 'jacket',
    rating: 4.7,
    tagline: 'One jacket. Every season.',
    description: 'Programmable-fabric jacket that shifts insulation, color, and cut on command. The last outer layer you will ever buy.',
    specs: ['Programmable smart fabric', '−20°C to +35°C comfort band', '4096 color states', 'Self-repairing weave']
  },
  {
    id: 'time-watch',
    name: 'Time Watch',
    price: 3499,
    store: 'VORTEX',
    category: 'Wearables',
    color: '#9b6cff',
    model: 'watch',
    rating: 4.9,
    tagline: 'Own every second.',
    description: 'Flagship chronometer with holographic dial and predictive scheduling. Knows where you need to be before you do.',
    specs: ['Holographic sapphire dial', 'Predictive AI scheduling', 'Atomic-sync accuracy', '10-day quantum cell battery']
  },
  {
    id: 'energy-drink',
    name: 'Energy Drink',
    price: 29,
    store: 'FLUX',
    category: 'Consumables',
    color: '#00ff88',
    model: 'can',
    rating: 4.2,
    tagline: 'Liquid voltage.',
    description: 'Nootropic energy blend engineered for long sessions in the Verse. Clean focus, zero crash, faintly luminous.',
    specs: ['6h sustained focus', 'Zero sugar, zero crash', 'Electrolyte + nootropic stack', 'Glows under neon']
  },
  {
    id: 'nano-pills',
    name: 'Nano Pills',
    price: 199,
    store: 'FLUX',
    category: 'Consumables',
    color: '#44d7ff',
    model: 'can',
    rating: 4.3,
    tagline: 'Recovery, engineered.',
    description: 'Micro-repair supplement pods that target fatigue at the cellular level. 30-day supply in a mag-sealed canister.',
    specs: ['Targeted cellular repair', '30-day supply', 'Lab-verified purity', 'Subscription eligible']
  },
  {
    id: 'bio-scanner',
    name: 'Bio Scanner',
    price: 899,
    store: 'FLUX',
    category: 'Computing',
    color: '#00ff88',
    model: 'chip',
    rating: 4.5,
    tagline: 'Know your body in real time.',
    description: 'Palm-sized health scanner with lab-grade diagnostics. Full biometric readout in eight seconds, synced to your QSV profile.',
    specs: ['8-second full scan', '40+ biomarkers', 'Medical-grade sensors', 'Private on-device analysis']
  },
  {
    id: 'cyber-sneakers',
    name: 'Cyber Sneakers',
    price: 599,
    store: 'APEX',
    category: 'Footwear',
    color: '#ff6b9d',
    model: 'sneaker',
    rating: 4.6,
    tagline: 'Streetlight compatible.',
    description: 'Reactive LED sneakers with adaptive-fit lacing and impact-return soles. The default flex of QSV Street.',
    specs: ['Reactive LED underglow', 'Adaptive-fit auto lacing', 'Impact-return soles', 'App-programmable patterns']
  },
  {
    id: 'smart-lens',
    name: 'Smart Lens',
    price: 1499,
    store: 'APEX',
    category: 'Wearables',
    color: '#9b6cff',
    model: 'screen',
    rating: 4.4,
    tagline: 'The world, annotated.',
    description: 'AR contact lenses with all-day battery and whisper-quiet neural input. Overlay prices, directions, and friends onto reality.',
    specs: ['4K per-eye AR overlay', '18h battery', 'Neural micro-gestures', 'Prescription compatible']
  },
  {
    id: 'voice-mod',
    name: 'Voice Mod',
    price: 399,
    store: 'APEX',
    category: 'Neurotech',
    color: '#ff6b9d',
    model: 'headset',
    rating: 4.1,
    tagline: 'Speak in any voice.',
    description: 'Wearable voice modulator with 200+ studio-grade profiles and real-time translation in 40 languages.',
    specs: ['200+ voice profiles', 'Real-time translation, 40 languages', 'Latency under 10ms', 'Creator licensing built in']
  }
]

export function getProduct(id) {
  return PRODUCTS.find((p) => p.id === id) || null
}

export function getProductsByStore(store) {
  return PRODUCTS.filter((p) => p.store === store)
}

export function getProductsByCategory(category) {
  return PRODUCTS.filter((p) => p.category === category)
}

export function getCategories() {
  return [...new Set(PRODUCTS.map((p) => p.category))]
}

export function formatPrice(amount) {
  return `$${amount.toLocaleString('en-US')}`
}
