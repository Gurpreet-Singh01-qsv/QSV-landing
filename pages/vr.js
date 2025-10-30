import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, EffectComposer, Bloom, DepthOfField } from '@react-three/drei'
import { Suspense, useState, useEffect, useRef } from 'react'
import Head from 'next/head'
import * as THREE from 'three'

// Premium Animated Q Portal
function QPortal() {
  const portalRef = useRef()
  const innerGlowRef = useRef()
  const energyRingRef = useRef()
  const distortionRef = useRef()
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    
    // Pulsing portal animation
    if (portalRef.current) {
      portalRef.current.rotation.z = time * 0.2
      portalRef.current.scale.setScalar(1 + Math.sin(time * 2) * 0.05)
    }
    
    // Inner glow breathing effect
    if (innerGlowRef.current) {
      innerGlowRef.current.material.opacity = 0.3 + Math.sin(time * 3) * 0.2
      innerGlowRef.current.scale.setScalar(1 + Math.sin(time * 1.5) * 0.1)
    }
    
    // Energy ring rotation
    if (energyRingRef.current) {
      energyRingRef.current.rotation.z = -time * 0.5
    }
    
    // Distortion ripple
    if (distortionRef.current) {
      distortionRef.current.scale.setScalar(1 + Math.sin(time * 4) * 0.03)
      distortionRef.current.material.opacity = 0.1 + Math.sin(time * 6) * 0.05
    }
  })
  
  return (
    <group position={[0, 0, 0]}>
      {/* Main Portal Ring */}
      <mesh ref={portalRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.2, 0.15, 16, 100]} />
        <meshStandardMaterial 
          color="#44d7ff" 
          emissive="#44d7ff"
          emissiveIntensity={0.8}
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={0.9}
        />
      </mesh>
      
      {/* Energy Ring */}
      <mesh ref={energyRingRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.5, 0.05, 8, 64]} />
        <meshStandardMaterial 
          color="#9b6cff" 
          emissive="#9b6cff"
          emissiveIntensity={1.2}
          transparent
          opacity={0.6}
        />
      </mesh>
      
      {/* Inner Portal Glow */}
      <mesh ref={innerGlowRef} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.0]} />
        <meshStandardMaterial 
          color="#00ffff" 
          emissive="#00ffff"
          emissiveIntensity={0.5}
          transparent
          opacity={0.3}
        />
      </mesh>
      
      {/* Distortion Ripple */}
      <mesh ref={distortionRef} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.1]}>
        <ringGeometry args={[1.5, 2.8, 32]} />
        <meshBasicMaterial 
          color="#ffffff" 
          transparent
          opacity={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Q Logo with Glow */}
      <group position={[0, 0, 0.2]}>
        <mesh>
          <planeGeometry args={[1.2, 1.2]} />
          <meshStandardMaterial 
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={0.3}
            transparent
            opacity={0.95}
          />
        </mesh>
        {/* Q Glow Halo */}
        <mesh position={[0, 0, -0.1]}>
          <planeGeometry args={[2, 2]} />
          <meshBasicMaterial 
            color="#44d7ff"
            transparent
            opacity={0.2}
          />
        </mesh>
      </group>
      
      {/* God Rays Effect */}
      {[...Array(8)].map((_, i) => (
        <mesh 
          key={i} 
          rotation={[Math.PI / 2, 0, (i * Math.PI) / 4]} 
          position={[0, 0, -0.5]}
        >
          <planeGeometry args={[0.1, 6]} />
          <meshBasicMaterial 
            color="#44d7ff"
            transparent
            opacity={0.1}
          />
        </mesh>
      ))}
    </group>
  )
}

// Premium Interactive Product with Floating Info
function InteractiveProduct({ position, color, name, description, type }) {
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)
  const productRef = useRef()
  const infoRef = useRef()
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    
    // Floating animation
    if (productRef.current) {
      productRef.current.position.y = position[1] + Math.sin(time * 2 + position[0]) * 0.1
      productRef.current.rotation.y = time * 0.3
    }
    
    // Info card animation
    if (infoRef.current && (hovered || clicked)) {
      infoRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1)
      infoRef.current.material.opacity = THREE.MathUtils.lerp(infoRef.current.material.opacity, 1, 0.1)
    } else if (infoRef.current) {
      infoRef.current.scale.lerp(new THREE.Vector3(0.1, 0.1, 0.1), 0.1)
      infoRef.current.material.opacity = THREE.MathUtils.lerp(infoRef.current.material.opacity, 0, 0.1)
    }
  })
  
  const handleClick = () => {
    setClicked(!clicked)
    console.log(`${clicked ? 'Closed' : 'Opened'} ${name} details`)
    // Future: Add to waitlist integration
  }
  
  return (
    <group position={position}>
      {/* Product Object */}
      <group ref={productRef}>
        {/* Main Product Shape */}
        <mesh
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onClick={handleClick}
        >
          {type === 'sneaker' && <boxGeometry args={[1.2, 0.6, 0.8]} />}
          {type === 'watch' && <cylinderGeometry args={[0.4, 0.4, 0.2, 32]} />}
          {type === 'headset' && <sphereGeometry args={[0.5]} />}
          
          <meshStandardMaterial 
            color={hovered ? "#ffffff" : color}
            emissive={color}
            emissiveIntensity={hovered ? 0.3 : 0.1}
            metalness={0.8}
            roughness={0.2}
            transparent
            opacity={0.9}
          />
        </mesh>
        
        {/* Product Glow */}
        <mesh>
          {type === 'sneaker' && <boxGeometry args={[1.4, 0.8, 1.0]} />}
          {type === 'watch' && <cylinderGeometry args={[0.5, 0.5, 0.3, 32]} />}
          {type === 'headset' && <sphereGeometry args={[0.6]} />}
          
          <meshBasicMaterial 
            color={color}
            transparent
            opacity={hovered ? 0.2 : 0.1}
          />
        </mesh>
      </group>
      
      {/* Floating Info Card */}
      <mesh 
        ref={infoRef}
        position={[0, 1.5, 0]}
        scale={[0.1, 0.1, 0.1]}
      >
        <planeGeometry args={[2, 1]} />
        <meshStandardMaterial 
          color="#000000"
          emissive="#44d7ff"
          emissiveIntensity={0.1}
          transparent
          opacity={0}
        />
      </mesh>
      
      {/* Product Base Glow */}
      <mesh position={[0, -0.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.8]} />
        <meshBasicMaterial 
          color={color}
          transparent
          opacity={hovered ? 0.3 : 0.1}
        />
      </mesh>
    </group>
  )
}

// Premium Floating Energy Particles
function EnergyParticles() {
  const particlesRef = useRef()
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    
    if (particlesRef.current) {
      particlesRef.current.children.forEach((particle, i) => {
        // Orbital motion around portal
        const radius = 3 + Math.sin(time + i) * 1
        const speed = 0.2 + i * 0.05
        particle.position.x = Math.cos(time * speed + i) * radius
        particle.position.z = Math.sin(time * speed + i) * radius
        particle.position.y = Math.sin(time * 2 + i) * 2
        
        // Pulsing glow
        particle.material.opacity = 0.3 + Math.sin(time * 4 + i) * 0.2
      })
    }
  })
  
  const particles = []
  for (let i = 0; i < 15; i++) {
    particles.push(
      <mesh key={i}>
        <sphereGeometry args={[0.03]} />
        <meshStandardMaterial 
          color={i % 2 === 0 ? "#44d7ff" : "#9b6cff"}
          emissive={i % 2 === 0 ? "#44d7ff" : "#9b6cff"}
          emissiveIntensity={0.8}
          transparent
          opacity={0.5}
        />
      </mesh>
    )
  }
  
  return <group ref={particlesRef}>{particles}</group>
}

// Ambient Audio Component
function AmbientAudio() {
  useEffect(() => {
    // Create ambient spatial audio
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    oscillator.frequency.setValueAtTime(60, audioContext.currentTime) // Low hum
    oscillator.type = 'sine'
    gainNode.gain.setValueAtTime(0.02, audioContext.currentTime) // Very subtle
    
    oscillator.start()
    
    return () => {
      oscillator.stop()
      audioContext.close()
    }
  }, [])
  
  return null
}

// Premium Cinematic VR Scene
function VRScene() {
  return (
    <>
      {/* Cinematic Lighting Setup */}
      <ambientLight intensity={0.1} color="#0a0a2e" />
      
      {/* Key Light - Portal */}
      <pointLight 
        position={[0, 2, 2]} 
        intensity={2} 
        color="#44d7ff"
        distance={10}
        decay={2}
      />
      
      {/* Fill Lights */}
      <pointLight 
        position={[-5, 3, -3]} 
        intensity={0.8} 
        color="#9b6cff"
        distance={8}
        decay={2}
      />
      <pointLight 
        position={[5, 3, -3]} 
        intensity={0.8} 
        color="#00ffff"
        distance={8}
        decay={2}
      />
      
      {/* Rim Light */}
      <pointLight 
        position={[0, -2, -8]} 
        intensity={1.5} 
        color="#ffffff"
        distance={12}
        decay={1}
      />
      
      {/* Environment */}
      <Environment preset="night" />
      
      {/* Central Q Portal */}
      <QPortal />
      
      {/* Hero Products */}
      <InteractiveProduct 
        position={[-3.5, 0, -2]} 
        color="#44d7ff" 
        name="Luminous Hyper-Sneaker"
        description="Adaptive fit • Haptic weave • Void black"
        type="sneaker"
      />
      <InteractiveProduct 
        position={[3.5, 0, -2]} 
        color="#9b6cff" 
        name="Quantum Chronometer"
        description="Time dilation • Neural sync • Holographic display"
        type="watch"
      />
      <InteractiveProduct 
        position={[0, 0, -5]} 
        color="#00ff88" 
        name="Neural Interface Headset"
        description="Mind-link • Spatial computing • Consciousness bridge"
        type="headset"
      />
      
      {/* Energy Particles */}
      <EnergyParticles />
      
      {/* Ambient Audio */}
      <AmbientAudio />
      
      {/* Premium Controls */}
      <OrbitControls 
        enablePan={true} 
        enableZoom={true} 
        enableRotate={true}
        minDistance={2}
        maxDistance={15}
        maxPolarAngle={Math.PI / 1.8}
        autoRotate={true}
        autoRotateSpeed={0.2}
      />
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
        
        {/* Premium 3D Canvas with Post-Processing */}
        <Canvas
          camera={{ position: [0, 3, 8], fov: 60 }}
          style={{ background: 'radial-gradient(circle at center, #0a0a2e 0%, #000000 100%)' }}
          gl={{ 
            antialias: true, 
            alpha: true,
            powerPreference: "high-performance"
          }}
          shadows
        >
          <Suspense fallback={
            <mesh>
              <sphereGeometry args={[0.5]} />
              <meshBasicMaterial color="#44d7ff" />
            </mesh>
          }>
            <VRScene />
            
            {/* Post-Processing Effects */}
            <EffectComposer>
              <Bloom 
                intensity={0.5}
                luminanceThreshold={0.2}
                luminanceSmoothing={0.9}
              />
              <DepthOfField 
                focusDistance={0.02}
                focalLength={0.05}
                bokehScale={3}
              />
            </EffectComposer>
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