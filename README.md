# QSV – Quantum Shopping Verse

🚀 The future of shopping is here.
QSV is an immersive, AI-assisted shopping platform built with Next.js and React Three Fiber.
Walk a virtual shopping street, inspect 3D products, compare across retailers, ask the
built-in AI assistant, and check out — in the browser or a VR headset.

**Investor demo script:** see [DEMO.md](./DEMO.md)

## ✨ QSV Street Experience

Experience **QSV Street** - a first-person explorable futuristic shopping district featuring:

- 🏙️ **Immersive Street Scene**: Walk through a cyberpunk-inspired street at night
- 🎮 **FPS Controls**: WASD movement + mouse look with collision detection
- 🌧️ **Dynamic Weather**: Atmospheric rain effects with wind simulation
- 🏪 **Interactive Storefronts**: 4 unique branded stores (NEXUS, VORTEX, FLUX, APEX)
- 💫 **Product Displays**: Walk close to products to see detailed information panels
- ✨ **Post-Processing**: Bloom effects and chromatic aberration for cinematic feel
- 🎨 **Futuristic Aesthetic**: Cyan/violet color palette with neon lighting

### Controls
- **Click** to enter first-person mode
- **WASD** to move around the street
- **Mouse** to look around
- **ESC** to exit first-person mode
- Walk close to storefronts to see product details

## Tech Stack
- Next.js 13
- React 18
- React Three Fiber 9.x
- @react-three/drei
- @react-three/postprocessing
- Three.js
- Tailwind CSS 3

## Scripts
- `npm run dev` – Run locally  
- `npm run build` – Build for production  
- `npm start` – Start production server

## Deployed on
[Vercel](https://qsv-landing.vercel.app)

## Asset credits
- `public/models/cyber-sneaker.glb` — "Materials Variants Shoe" by Shopify, from the
  [Khronos glTF Sample Models](https://github.com/KhronosGroup/glTF-Sample-Models)
  repository, licensed [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
- `public/hdr/street.hdr` — "Potsdamer Platz" HDRI from [Poly Haven](https://polyhaven.com),
  licensed CC0.
