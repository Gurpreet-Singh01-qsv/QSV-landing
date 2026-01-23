import { Canvas } from '@react-three/fiber'
import { OrbitControls, Float, MeshDistortMaterial, ContactShadows } from '@react-three/drei'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

// Quantum Sneaker 3D Model Component
function SneakerModel() {
  const meshRef = useRef()
  
  useFrame((state) => {
    if (meshRef.current) {
      // Subtle rotation animation
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.05
    }
  })

  return (
    <Float
      speed={2}
      rotationIntensity={0.1}
      floatIntensity={0.2}
    >
      <group ref={meshRef}>
        {/* Main Sneaker Body */}
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[2.5, 1, 4]} />
          <MeshDistortMaterial
            color="#44d7ff"
            attach="material"
            distort={0.3}
            speed={2}
            roughness={0.1}
            metalness={0.8}
          />
        </mesh>
        
        {/* Sneaker Sole */}
        <mesh position={[0, -0.7, 0]} castShadow>
          <boxGeometry args={[2.8, 0.4, 4.2]} />
          <MeshDistortMaterial
            color="#9b6cff"
            attach="material"
            distort={0.2}
            speed={1.5}
            roughness={0.2}
            metalness={0.6}
          />
        </mesh>
        
        {/* Quantum Glow Effect */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[2.7, 1.2, 4.2]} />
          <meshBasicMaterial
            color="#00ff88"
            transparent
            opacity={0.2}
          />
        </mesh>
        
        {/* Laces */}
        {[-0.8, -0.4, 0, 0.4, 0.8].map((z, index) => (
          <mesh key={index} position={[0, 0.3, z]} castShadow>
            <cylinderGeometry args={[0.02, 0.02, 1.8]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
        ))}
        
        {/* Quantum Particles */}
        {Array.from({ length: 20 }).map((_, index) => (
          <mesh
            key={index}
            position={[
              (Math.random() - 0.5) * 4,
              (Math.random() - 0.5) * 2,
              (Math.random() - 0.5) * 5
            ]}
          >
            <sphereGeometry args={[0.05]} />
            <meshBasicMaterial
              color={Math.random() > 0.5 ? "#44d7ff" : "#9b6cff"}
              transparent
              opacity={0.6}
            />
          </mesh>
        ))}
      </group>
    </Float>
  )
}

// Main Quantum Sneaker Component
export default function QuantumSneaker({ width = "100%", height = "400px" }) {
  return (
    <div style={{ width, height }}>
      <Canvas
        camera={{ position: [5, 2, 5], fov: 50 }}
        shadows
      >
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-10, -10, -10]} color="#9b6cff" intensity={0.5} />
        <pointLight position={[10, 10, 10]} color="#44d7ff" intensity={0.5} />
        
        {/* 3D Model */}
        <SneakerModel />
        
        {/* Ground Shadows */}
        <ContactShadows
          position={[0, -1.5, 0]}
          opacity={0.4}
          scale={10}
          blur={2}
          far={4}
        />
        
        {/* Controls */}
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          minDistance={3}
          maxDistance={10}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI - Math.PI / 6}
        />
      </Canvas>
    </div>
  )
}

// Export individual components for flexibility
export { SneakerModel }