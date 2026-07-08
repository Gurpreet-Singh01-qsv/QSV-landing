// Procedural 3D product models for QSV Street storefronts.
// All models are built from primitives, sized to fit a ~0.8 unit display slot,
// and take an accent color to match their store's branding.

function Sneaker({ color }) {
  return (
    <group scale={0.32}>
      {/* Sole */}
      <mesh position={[0, -0.55, 0]}>
        <boxGeometry args={[1.1, 0.3, 2.6]} />
        <meshStandardMaterial color="#e8e8f0" roughness={0.4} metalness={0.1} />
      </mesh>
      {/* Sole glow strip */}
      <mesh position={[0, -0.55, 0]}>
        <boxGeometry args={[1.14, 0.12, 2.64]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />
      </mesh>
      {/* Heel body */}
      <mesh position={[0, 0, -0.6]}>
        <boxGeometry args={[1, 0.9, 1.3]} />
        <meshStandardMaterial color="#14142a" roughness={0.3} metalness={0.7} />
      </mesh>
      {/* Toe box (lower, tapered) */}
      <mesh position={[0, -0.18, 0.75]} rotation={[0.18, 0, 0]}>
        <boxGeometry args={[0.95, 0.5, 1.4]} />
        <meshStandardMaterial color="#14142a" roughness={0.3} metalness={0.7} />
      </mesh>
      {/* Ankle collar */}
      <mesh position={[0, 0.5, -0.85]}>
        <cylinderGeometry args={[0.42, 0.5, 0.4, 12]} />
        <meshStandardMaterial color="#1e1e3a" roughness={0.5} metalness={0.4} />
      </mesh>
      {/* Side swoosh accent */}
      <mesh position={[0.51, 0, -0.3]} rotation={[0, 0, -0.3]}>
        <boxGeometry args={[0.02, 0.25, 1.2]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.5} />
      </mesh>
      <mesh position={[-0.51, 0, -0.3]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[0.02, 0.25, 1.2]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.5} />
      </mesh>
      {/* Laces */}
      {[0.15, 0.45, 0.75].map((z, i) => (
        <mesh key={i} position={[0, 0.14 - i * 0.07, z - 0.15]} rotation={[0.18, 0, 0]}>
          <boxGeometry args={[0.7, 0.05, 0.08]} />
          <meshStandardMaterial color="#f0f0f5" roughness={0.6} />
        </mesh>
      ))}
    </group>
  )
}

function Headset({ color }) {
  return (
    <group scale={0.36}>
      {/* Headband arc */}
      <mesh rotation={[0, 0, 0]}>
        <torusGeometry args={[0.9, 0.09, 8, 24, Math.PI]} />
        <meshStandardMaterial color="#14142a" roughness={0.3} metalness={0.8} />
      </mesh>
      {/* Ear cups */}
      {[-0.9, 0.9].map((x, i) => (
        <group key={i} position={[x, 0, 0]}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.42, 0.42, 0.3, 16]} />
            <meshStandardMaterial color="#1e1e3a" roughness={0.25} metalness={0.85} />
          </mesh>
          {/* Glowing ring on cup */}
          <mesh rotation={[0, Math.PI / 2, 0]} position={[x > 0 ? 0.16 : -0.16, 0, 0]}>
            <torusGeometry args={[0.3, 0.03, 8, 24]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2.5} />
          </mesh>
        </group>
      ))}
      {/* Neural sensor strip across the band */}
      <mesh position={[0, 0.92, 0]}>
        <boxGeometry args={[0.5, 0.08, 0.14]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />
      </mesh>
    </group>
  )
}

function Watch({ color }) {
  return (
    <group scale={0.4}>
      {/* Strap loop */}
      <mesh>
        <torusGeometry args={[0.75, 0.14, 8, 24]} />
        <meshStandardMaterial color="#14142a" roughness={0.4} metalness={0.6} />
      </mesh>
      {/* Watch face housing */}
      <mesh position={[0, 0.75, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.45, 0.45, 0.18, 20]} />
        <meshStandardMaterial color="#1e1e3a" roughness={0.2} metalness={0.9} />
      </mesh>
      {/* Holographic dial */}
      <mesh position={[0, 0.75, 0.1]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.36, 0.36, 0.02, 20]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.8} transparent opacity={0.85} />
      </mesh>
      {/* Bezel ring */}
      <mesh position={[0, 0.75, 0.08]}>
        <torusGeometry args={[0.42, 0.03, 8, 24]} />
        <meshStandardMaterial color="#e8e8f0" roughness={0.15} metalness={1} />
      </mesh>
      {/* Crown */}
      <mesh position={[0.5, 0.75, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.06, 0.06, 0.12, 8]} />
        <meshStandardMaterial color="#e8e8f0" metalness={1} roughness={0.2} />
      </mesh>
    </group>
  )
}

function Chip({ color }) {
  return (
    <group scale={0.42}>
      {/* PCB base */}
      <mesh position={[0, -0.1, 0]}>
        <boxGeometry args={[1.4, 0.08, 1.4]} />
        <meshStandardMaterial color="#0a1a12" roughness={0.5} metalness={0.4} />
      </mesh>
      {/* Die */}
      <mesh position={[0, 0.08, 0]}>
        <boxGeometry args={[0.7, 0.22, 0.7]} />
        <meshStandardMaterial color="#14142a" roughness={0.2} metalness={0.9} />
      </mesh>
      {/* Glowing core */}
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[0.4, 0.04, 0.4]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={3} />
      </mesh>
      {/* Circuit traces */}
      {[-0.45, -0.15, 0.15, 0.45].map((x, i) => (
        <mesh key={i} position={[x, -0.04, 0]}>
          <boxGeometry args={[0.04, 0.02, 1.3]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.2} />
        </mesh>
      ))}
      {/* Pins on two edges */}
      {[-0.5, -0.3, -0.1, 0.1, 0.3, 0.5].map((z, i) => (
        <group key={i}>
          <mesh position={[0.74, -0.06, z]}>
            <boxGeometry args={[0.1, 0.04, 0.06]} />
            <meshStandardMaterial color="#c0c0d0" metalness={1} roughness={0.3} />
          </mesh>
          <mesh position={[-0.74, -0.06, z]}>
            <boxGeometry args={[0.1, 0.04, 0.06]} />
            <meshStandardMaterial color="#c0c0d0" metalness={1} roughness={0.3} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function HoloScreen({ color }) {
  return (
    <group scale={0.38}>
      {/* Base stand */}
      <mesh position={[0, -0.75, 0]}>
        <cylinderGeometry args={[0.4, 0.5, 0.15, 16]} />
        <meshStandardMaterial color="#14142a" roughness={0.3} metalness={0.8} />
      </mesh>
      {/* Stem */}
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.4, 8]} />
        <meshStandardMaterial color="#1e1e3a" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Floating holographic panel */}
      <mesh position={[0, 0.25, 0]}>
        <boxGeometry args={[1.6, 1, 0.04]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.2} transparent opacity={0.35} />
      </mesh>
      {/* Panel frame */}
      <mesh position={[0, 0.25, 0]}>
        <boxGeometry args={[1.66, 1.06, 0.02]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2.5} transparent opacity={0.9} wireframe />
      </mesh>
      {/* Content bars on screen */}
      {[0.45, 0.25, 0.05, -0.15].map((y, i) => (
        <mesh key={i} position={[-0.2 + i * 0.08, y, 0.04]}>
          <boxGeometry args={[1 - i * 0.15, 0.08, 0.01]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1.5} transparent opacity={0.8} />
        </mesh>
      ))}
    </group>
  )
}

function Canister({ color }) {
  return (
    <group scale={0.4}>
      {/* Body */}
      <mesh>
        <cylinderGeometry args={[0.45, 0.45, 1.5, 16]} />
        <meshStandardMaterial color="#14142a" roughness={0.25} metalness={0.85} />
      </mesh>
      {/* Glowing label band */}
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.46, 0.46, 0.5, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.8} />
      </mesh>
      {/* Liquid window */}
      <mesh position={[0, -0.45, 0]}>
        <cylinderGeometry args={[0.47, 0.47, 0.3, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} transparent opacity={0.5} />
      </mesh>
      {/* Cap */}
      <mesh position={[0, 0.85, 0]}>
        <cylinderGeometry args={[0.3, 0.42, 0.25, 16]} />
        <meshStandardMaterial color="#e8e8f0" roughness={0.3} metalness={0.9} />
      </mesh>
      {/* Pull tab */}
      <mesh position={[0, 1, 0]}>
        <torusGeometry args={[0.1, 0.03, 6, 12]} />
        <meshStandardMaterial color="#c0c0d0" metalness={1} roughness={0.3} />
      </mesh>
    </group>
  )
}

function Jacket({ color }) {
  return (
    <group scale={0.36}>
      {/* Torso */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.55, 0.7, 1.5, 8]} />
        <meshStandardMaterial color="#14142a" roughness={0.5} metalness={0.5} transparent opacity={0.95} />
      </mesh>
      {/* Collar */}
      <mesh position={[0, 0.95, 0]}>
        <cylinderGeometry args={[0.35, 0.45, 0.25, 8]} />
        <meshStandardMaterial color="#1e1e3a" roughness={0.4} metalness={0.6} />
      </mesh>
      {/* Shoulders */}
      {[-0.62, 0.62].map((x, i) => (
        <mesh key={i} position={[x, 0.62, 0]} rotation={[0, 0, x > 0 ? -0.5 : 0.5]}>
          <cylinderGeometry args={[0.2, 0.24, 0.7, 8]} />
          <meshStandardMaterial color="#14142a" roughness={0.5} metalness={0.5} />
        </mesh>
      ))}
      {/* Center zip glow line */}
      <mesh position={[0, 0.1, 0.66]}>
        <boxGeometry args={[0.05, 1.4, 0.02]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2.5} />
      </mesh>
      {/* Phase-shift trim on hem and cuffs */}
      <mesh position={[0, -0.65, 0]}>
        <torusGeometry args={[0.7, 0.04, 8, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />
      </mesh>
    </group>
  )
}

const MODELS = {
  sneaker: Sneaker,
  headset: Headset,
  watch: Watch,
  chip: Chip,
  screen: HoloScreen,
  can: Canister,
  jacket: Jacket
}

export default function ProductModel({ type, color = '#44d7ff' }) {
  const Model = MODELS[type] || Chip
  return <Model color={color} />
}
