import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Suspense, useState, useEffect } from 'react'
import Head from 'next/head'

// Simple Q Portal Component
function QPortal() {
  return (
    <group position={[0, 0, 0]}>
      {/* Portal Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2, 0.1, 16, 100]} />
        <meshBasicMaterial 
          color="#44d7ff" 
          transparent
          opacity={0.8}
        />
      </mesh>
      
      {/* Inner Glow */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.8]} />
        <meshBasicMaterial 
          color="#9b6cff" 
          transparent
          opacity={0.4}
        />
      </mesh>
      
      {/* Q Logo - Simple Text */}
      <mesh position={[0, 0, 0.1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial 
          color="#ffffff"
          transparent
          opacity={0.9}
        />
      </mesh>
    </group>
  )
}

// Simple Interactive Product Component
function InteractiveProduct({ position, color, name }) {
  const [hovered, setHovered] = useState(false)
  
  return (
    <group position={position}>
      <mesh
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => {
          console.log(`Clicked on ${name}`)
        }}
      >
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        <meshBasicMaterial 
          color={hovered ? "#ffffff" : color}
          transparent
          opacity={0.9}
        />
      </mesh>
    </group>
  )
}

// Simple Particles
function Particles() {
  const particles = []
  for (let i = 0; i < 10; i++) {
    particles.push(
      <mesh
        key={i}
        position={[
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 5,
          (Math.random() - 0.5) * 10
        ]}
      >
        <sphereGeometry args={[0.02]} />
        <meshBasicMaterial color="#44d7ff" />
      </mesh>
    )
  }
  return <group>{particles}</group>
}

// Main VR Scene - Simplified
function VRScene() {
  return (
    <>
      {/* Simple Lighting */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={0.5} color="#44d7ff" />
      
      {/* Central Q Portal */}
      <QPortal />
      
      {/* Interactive Products */}
      <InteractiveProduct 
        position={[-3, 0, -2]} 
        color="#44d7ff" 
        name="Hyper Sneaker" 
      />
      <InteractiveProduct 
        position={[3, 0, -2]} 
        color="#9b6cff" 
        name="Quantum Watch" 
      />
      <InteractiveProduct 
        position={[0, 0, -4]} 
        color="#00ff88" 
        name="Neural Headset" 
      />
      
      {/* Ambient Particles */}
      <Particles />
      
      {/* Controls */}
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
    </>
  )
}

// Loading Component
function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#040824] via-[#120538] to-[#01010f] flex items-center justify-center z-50">
      <div className="text-center">
        <div className="w-32 h-32 mx-auto mb-8 relative">
          <div className="absolute inset-0 border-4 border-cyan-400/30 rounded-full animate-spin"></div>
          <div className="absolute inset-2 border-2 border-violet-400/40 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl font-bold text-cyan-300">Q</span>
          </div>
        </div>
        <p className="text-cyan-300 text-xl font-semibold">Initializing Multiverse...</p>
        <p className="text-gray-400 text-sm mt-2">Loading immersive experience</p>
      </div>
    </div>
  )
}

export default function VRPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
    const timer = setTimeout(() => setIsLoading(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  // Don't render on server
  if (!isClient) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center">
        <p className="text-white">Loading VR Experience...</p>
      </div>
    )
  }
  
  return (
    <>
      <Head>
        <title>QSV Multiverse - Immersive VR Shopping Experience</title>
        <meta name="description" content="Step into the QSV multiverse - an immersive VR shopping experience where you can explore products in stunning 3D environments." />
      </Head>
      
      {isLoading && <LoadingScreen />}
      
      <div className="w-full h-screen bg-black">
        {/* Exit Button */}
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={() => window.location.href = '/'}
            className="px-4 py-2 bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 rounded-lg hover:bg-cyan-500/30 transition-colors"
          >
            Exit Multiverse
          </button>
        </div>
        
        {/* 3D Canvas - Simplified */}
        <Canvas
          camera={{ position: [0, 2, 5], fov: 75 }}
          style={{ background: 'linear-gradient(to bottom, #040824, #01010f)' }}
        >
          <Suspense fallback={null}>
            <VRScene />
          </Suspense>
        </Canvas>
        
        {/* UI Overlay */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-black/50 backdrop-blur-sm border border-cyan-400/30 rounded-lg px-6 py-3">
            <p className="text-cyan-300 text-sm text-center">
              Use mouse to look around • Click objects to interact • Desktop & mobile compatible
            </p>
          </div>
        </div>
      </div>
    </>
  )
}