import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Suspense, useState, useEffect, useRef } from 'react'
import Head from 'next/head'
import * as THREE from 'three'

// Enhanced Q Portal with Synchronized Breathing Cycle
function QPortal() {
  const portalRef = useRef()
  const innerGlowRef = useRef()
  const energyRingRef = useRef()
  const distortionRef = useRef()
  const outerRingRef = useRef()
  const coreGlowRef = useRef()
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    
    // 4-second breathing cycle synchronized with lighting
    const breathingCycle = Math.sin(time * Math.PI / 2) * 0.5 + 0.5 // 0 to 1
    const breathingIntensity = 0.7 + breathingCycle * 0.3 // 0.7 to 1.0
    
    // Phase offsets for layered breathing effects
    const phase1 = Math.sin(time * Math.PI / 2) * 0.5 + 0.5
    const phase2 = Math.sin(time * Math.PI / 2 + Math.PI / 4) * 0.5 + 0.5
    const phase3 = Math.sin(time * Math.PI / 2 + Math.PI / 2) * 0.5 + 0.5
    
    // Main portal ring - synchronized breathing
    if (portalRef.current) {
      portalRef.current.rotation.z = time * 0.15
      portalRef.current.scale.setScalar(1 + breathingCycle * 0.08)
      portalRef.current.material.emissiveIntensity = 0.6 + breathingIntensity * 0.4
    }
    
    // Outer ring with phase offset
    if (outerRingRef.current) {
      outerRingRef.current.rotation.z = -time * 0.1
      outerRingRef.current.scale.setScalar(1 + phase2 * 0.06)
      outerRingRef.current.material.emissiveIntensity = 0.8 + phase2 * 0.6
    }
    
    // Inner glow with synchronized breathing
    if (innerGlowRef.current) {
      innerGlowRef.current.material.opacity = 0.2 + breathingCycle * 0.3
      innerGlowRef.current.scale.setScalar(1 + breathingCycle * 0.15)
      innerGlowRef.current.material.emissiveIntensity = 0.3 + breathingIntensity * 0.4
    }
    
    // Core glow with strongest breathing effect
    if (coreGlowRef.current) {
      coreGlowRef.current.material.opacity = 0.1 + breathingCycle * 0.4
      coreGlowRef.current.scale.setScalar(1 + breathingCycle * 0.2)
    }
    
    // Energy ring with phase offset
    if (energyRingRef.current) {
      energyRingRef.current.rotation.z = -time * 0.4
      energyRingRef.current.material.emissiveIntensity = 1.0 + phase3 * 0.5
    }
    
    // Distortion ripple with breathing sync
    if (distortionRef.current) {
      distortionRef.current.scale.setScalar(1 + breathingCycle * 0.05)
      distortionRef.current.material.opacity = 0.08 + breathingCycle * 0.07
    }
  })
  
  return (
    <group position={[0, 0, 0]}>
      {/* Outer Portal Ring */}
      <mesh ref={outerRingRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.8, 0.08, 12, 80]} />
        <meshStandardMaterial 
          color="#9b6cff" 
          emissive="#9b6cff"
          emissiveIntensity={0.8}
          metalness={0.7}
          roughness={0.2}
          transparent
          opacity={0.7}
        />
      </mesh>
      
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
      
      {/* Core Glow - Innermost */}
      <mesh ref={coreGlowRef} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.05]}>
        <circleGeometry args={[1.2]} />
        <meshBasicMaterial 
          color="#ffffff" 
          transparent
          opacity={0.3}
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
    
    // Info card animation - simplified
    if (infoRef.current) {
      const targetScale = (hovered || clicked) ? 1 : 0.1
      const targetOpacity = (hovered || clicked) ? 1 : 0
      
      infoRef.current.scale.x += (targetScale - infoRef.current.scale.x) * 0.1
      infoRef.current.scale.y += (targetScale - infoRef.current.scale.y) * 0.1
      infoRef.current.scale.z += (targetScale - infoRef.current.scale.z) * 0.1
      
      if (infoRef.current.material) {
        infoRef.current.material.opacity += (targetOpacity - infoRef.current.material.opacity) * 0.1
      }
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

// Ambient Audio Component - User Interaction Based
function AmbientAudio() {
  const [audioStarted, setAudioStarted] = useState(false)
  
  useEffect(() => {
    if (typeof window === 'undefined' || audioStarted) return
    
    let audioContext = null
    let oscillator = null
    let gainNode = null
    
    const startAudio = () => {
      try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)()
        oscillator = audioContext.createOscillator()
        gainNode = audioContext.createGain()
        
        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)
        
        oscillator.frequency.setValueAtTime(60, audioContext.currentTime)
        oscillator.type = 'sine'
        gainNode.gain.setValueAtTime(0.01, audioContext.currentTime)
        
        oscillator.start()
        setAudioStarted(true)
      } catch (error) {
        console.log('Audio not supported')
      }
    }
    
    // Start audio on first user interaction
    const handleInteraction = () => {
      startAudio()
      document.removeEventListener('click', handleInteraction)
      document.removeEventListener('touchstart', handleInteraction)
    }
    
    document.addEventListener('click', handleInteraction)
    document.addEventListener('touchstart', handleInteraction)
    
    return () => {
      document.removeEventListener('click', handleInteraction)
      document.removeEventListener('touchstart', handleInteraction)
      try {
        if (oscillator) oscillator.stop()
        if (audioContext) audioContext.close()
      } catch (error) {
        // Ignore cleanup errors
      }
    }
  }, [audioStarted])
  
  return null
}

// Dynamic Lighting System with 3-Point Setup and Breathing Cycle
function DynamicLightingRig() {
  const keyLightRef = useRef()
  const fillLight1Ref = useRef()
  const fillLight2Ref = useRef()
  const rimLightRef = useRef()
  const ambientRef = useRef()
  
  // Color temperature variations
  const colorTemperatures = {
    warm: { r: 1.0, g: 0.8, b: 0.6 },
    neutral: { r: 0.8, g: 1.0, b: 1.0 },
    cool: { r: 0.6, g: 0.8, b: 1.0 }
  }
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    
    // 4-second breathing cycle for all lights
    const breathingCycle = Math.sin(time * Math.PI / 2) * 0.5 + 0.5 // 0 to 1
    const breathingIntensity = 0.7 + breathingCycle * 0.3 // 0.7 to 1.0
    
    // Color temperature cycling (warm -> neutral -> cool -> neutral)
    const tempCycle = (Math.sin(time * 0.3) + 1) / 2 // 0 to 1
    let currentTemp
    if (tempCycle < 0.33) {
      // Warm to Neutral
      const t = tempCycle / 0.33
      currentTemp = {
        r: colorTemperatures.warm.r + (colorTemperatures.neutral.r - colorTemperatures.warm.r) * t,
        g: colorTemperatures.warm.g + (colorTemperatures.neutral.g - colorTemperatures.warm.g) * t,
        b: colorTemperatures.warm.b + (colorTemperatures.neutral.b - colorTemperatures.warm.b) * t
      }
    } else if (tempCycle < 0.66) {
      // Neutral to Cool
      const t = (tempCycle - 0.33) / 0.33
      currentTemp = {
        r: colorTemperatures.neutral.r + (colorTemperatures.cool.r - colorTemperatures.neutral.r) * t,
        g: colorTemperatures.neutral.g + (colorTemperatures.cool.g - colorTemperatures.neutral.g) * t,
        b: colorTemperatures.neutral.b + (colorTemperatures.cool.b - colorTemperatures.neutral.b) * t
      }
    } else {
      // Cool to Neutral
      const t = (tempCycle - 0.66) / 0.34
      currentTemp = {
        r: colorTemperatures.cool.r + (colorTemperatures.neutral.r - colorTemperatures.cool.r) * t,
        g: colorTemperatures.cool.g + (colorTemperatures.neutral.g - colorTemperatures.cool.g) * t,
        b: colorTemperatures.cool.b + (colorTemperatures.neutral.b - colorTemperatures.cool.b) * t
      }
    }
    
    // Apply breathing and color temperature to key light (portal)
    if (keyLightRef.current) {
      keyLightRef.current.intensity = 2.5 * breathingIntensity
      keyLightRef.current.color.setRGB(
        0.27 * currentTemp.r, // #44d7ff red component
        0.84 * currentTemp.g, // #44d7ff green component  
        1.0 * currentTemp.b   // #44d7ff blue component
      )
    }
    
    // Apply subtle breathing to fill lights
    if (fillLight1Ref.current) {
      fillLight1Ref.current.intensity = 0.9 * (0.8 + breathingCycle * 0.2)
      fillLight1Ref.current.color.setRGB(
        0.61 * currentTemp.r, // #9b6cff red component
        0.42 * currentTemp.g, // #9b6cff green component
        1.0 * currentTemp.b   // #9b6cff blue component
      )
    }
    
    if (fillLight2Ref.current) {
      fillLight2Ref.current.intensity = 0.9 * (0.8 + breathingCycle * 0.2)
      fillLight2Ref.current.color.setRGB(
        0.0 * currentTemp.r,  // #00ffff red component
        1.0 * currentTemp.g,  // #00ffff green component
        1.0 * currentTemp.b   // #00ffff blue component
      )
    }
    
    // Rim light with subtle breathing
    if (rimLightRef.current) {
      rimLightRef.current.intensity = 1.8 * (0.9 + breathingCycle * 0.1)
    }
    
    // Ambient light breathing
    if (ambientRef.current) {
      ambientRef.current.intensity = 0.12 * (0.8 + breathingCycle * 0.2)
    }
  })
  
  return (
    <>
      {/* Ambient Light with Breathing */}
      <ambientLight ref={ambientRef} intensity={0.12} color="#0a0a2e" />
      
      {/* Key Light - Portal (Main Subject Light) */}
      <pointLight 
        ref={keyLightRef}
        position={[0, 2.5, 2]} 
        intensity={2.5} 
        color="#44d7ff"
        distance={12}
        decay={1.8}
        castShadow
      />
      
      {/* Fill Light 1 - Left Side */}
      <pointLight 
        ref={fillLight1Ref}
        position={[-6, 3, -2]} 
        intensity={0.9} 
        color="#9b6cff"
        distance={10}
        decay={2}
      />
      
      {/* Fill Light 2 - Right Side */}
      <pointLight 
        ref={fillLight2Ref}
        position={[6, 3, -2]} 
        intensity={0.9} 
        color="#00ffff"
        distance={10}
        decay={2}
      />
      
      {/* Rim Light - Back Lighting for Depth */}
      <pointLight 
        ref={rimLightRef}
        position={[0, -1, -10]} 
        intensity={1.8} 
        color="#ffffff"
        distance={15}
        decay={1.2}
      />
      
      {/* Additional Accent Lights for Atmosphere */}
      <pointLight 
        position={[-8, 1, 4]} 
        intensity={0.4} 
        color="#44d7ff"
        distance={6}
        decay={3}
      />
      <pointLight 
        position={[8, 1, 4]} 
        intensity={0.4} 
        color="#9b6cff"
        distance={6}
        decay={3}
      />
    </>
  )
}

// Premium Cinematic VR Scene
function VRScene() {
  return (
    <>
      {/* Dynamic Lighting System */}
      <DynamicLightingRig />
      
      {/* Simple Environment */}
      <fog attach="fog" args={['#000011', 8, 20]} />
      
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
        
        {/* Premium 3D Canvas - Stable Version */}
        <Canvas
          camera={{ position: [0, 3, 8], fov: 60 }}
          style={{ background: 'radial-gradient(circle at center, #0a0a2e 0%, #000000 100%)' }}
          gl={{ 
            antialias: true, 
            alpha: true,
            powerPreference: "high-performance"
          }}
        >
          <Suspense fallback={
            <mesh>
              <sphereGeometry args={[0.5]} />
              <meshBasicMaterial color="#44d7ff" />
            </mesh>
          }>
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