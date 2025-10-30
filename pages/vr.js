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

// Premium Material Systems
function createChromeMaterial(hovered = false) {
  return {
    color: hovered ? "#ffffff" : "#c0c0c0",
    metalness: 0.95,
    roughness: hovered ? 0.05 : 0.1,
    envMapIntensity: 2.0,
    reflectivity: 1.0,
    transparent: false,
    opacity: 1.0
  }
}

function createGlassMaterial(hovered = false) {
  return {
    color: hovered ? "#ffffff" : "#e6f3ff",
    metalness: 0.0,
    roughness: 0.0,
    transmission: 0.9,
    transparent: true,
    opacity: hovered ? 0.8 : 0.6,
    ior: 1.5,
    thickness: 0.5
  }
}

function createNeonMaterial(hovered = false, baseColor = "#00ff88") {
  return {
    color: baseColor,
    emissive: baseColor,
    emissiveIntensity: hovered ? 1.2 : 0.8,
    metalness: 0.1,
    roughness: 0.2,
    transparent: true,
    opacity: hovered ? 0.95 : 0.85
  }
}

// Interactive Product with Integrated Visual Cues
function InteractiveProductWithCues({ position, color, name, description, type }) {
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)
  
  return (
    <VisualCueSystem isInteractive={true} isHovered={hovered} isClicked={clicked}>
      <InteractiveProduct 
        position={position}
        color={color}
        name={name}
        description={description}
        type={type}
        onHoverChange={setHovered}
        onClickChange={setClicked}
      />
    </VisualCueSystem>
  )
}

// Premium Interactive Product with Advanced Materials
function InteractiveProduct({ position, color, name, description, type, onHoverChange, onClickChange }) {
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)
  const productRef = useRef()
  const infoRef = useRef()
  const adaptiveFitRef = useRef()
  const hologramRef = useRef()
  const brainwaveRef = useRef()
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    
    // Floating animation
    if (productRef.current) {
      productRef.current.position.y = position[1] + Math.sin(time * 2 + position[0]) * 0.1
      productRef.current.rotation.y = time * 0.3
    }
    
    // Enhanced info card animation with 300ms target
    if (infoRef.current) {
      const targetScale = (hovered || clicked) ? 1 : 0.1
      const targetOpacity = (hovered || clicked) ? 0.9 : 0
      const lerpSpeed = 0.15 // Faster for 300ms feel
      
      infoRef.current.scale.x += (targetScale - infoRef.current.scale.x) * lerpSpeed
      infoRef.current.scale.y += (targetScale - infoRef.current.scale.y) * lerpSpeed
      infoRef.current.scale.z += (targetScale - infoRef.current.scale.z) * lerpSpeed
      
      // Animate all child elements
      infoRef.current.children.forEach((child, index) => {
        if (child.material) {
          const delay = index * 0.1 // Staggered animation
          const adjustedOpacity = Math.max(0, targetOpacity - delay)
          child.material.opacity += (adjustedOpacity - child.material.opacity) * lerpSpeed
        }
      })
    }
    
    // Adaptive fit visualization for sneaker
    if (adaptiveFitRef.current && type === 'sneaker') {
      const pulseIntensity = hovered ? 0.3 + Math.sin(time * 4) * 0.2 : 0
      adaptiveFitRef.current.material.opacity = pulseIntensity
    }
    
    // Holographic display for watch
    if (hologramRef.current && type === 'watch') {
      hologramRef.current.rotation.y = time * 2
      const hologramIntensity = hovered ? 0.4 + Math.sin(time * 3) * 0.2 : 0
      hologramRef.current.material.opacity = hologramIntensity
    }
    
    // Brainwave pattern for headset
    if (brainwaveRef.current && type === 'headset') {
      brainwaveRef.current.rotation.z = time * 1.5
      const brainwaveIntensity = hovered ? 0.5 + Math.sin(time * 5) * 0.3 : 0
      brainwaveRef.current.material.emissiveIntensity = brainwaveIntensity
    }
  })
  
  const handleHover = (isHovered) => {
    setHovered(isHovered)
    if (onHoverChange) onHoverChange(isHovered)
  }
  
  const handleClick = () => {
    const newClickedState = !clicked
    setClicked(newClickedState)
    if (onClickChange) onClickChange(newClickedState)
    console.log(`${newClickedState ? 'Opened' : 'Closed'} ${name} details`)
    // Future: Add to waitlist integration
  }
  
  return (
    <group position={position}>
      {/* Product Object */}
      <group ref={productRef}>
        {/* Detailed Product Geometries */}
        
        {/* Premium Sneaker - Multi-part Construction */}
        {type === 'sneaker' && (
          <group
            onPointerOver={() => handleHover(true)}
            onPointerOut={() => handleHover(false)}
            onClick={handleClick}
          >
            {/* Sneaker Sole */}
            <mesh position={[0, -0.2, 0]}>
              <boxGeometry args={[1.3, 0.2, 0.9]} />
              <meshStandardMaterial {...createChromeMaterial(hovered)} />
            </mesh>
            
            {/* Sneaker Upper */}
            <mesh position={[0, 0.1, 0]}>
              <boxGeometry args={[1.1, 0.4, 0.7]} />
              <meshStandardMaterial {...createChromeMaterial(hovered)} />
            </mesh>
            
            {/* Sneaker Toe Cap */}
            <mesh position={[0, 0.05, 0.35]}>
              <sphereGeometry args={[0.25, 16, 8]} />
              <meshStandardMaterial {...createChromeMaterial(hovered)} />
            </mesh>
          </group>
        )}
        
        {/* Quantum Chronometer - Layered Construction */}
        {type === 'watch' && (
          <group
            onPointerOver={() => handleHover(true)}
            onPointerOut={() => handleHover(false)}
            onClick={handleClick}
          >
            {/* Watch Base */}
            <mesh>
              <cylinderGeometry args={[0.45, 0.45, 0.15, 32]} />
              <meshPhysicalMaterial {...createGlassMaterial(hovered)} />
            </mesh>
            
            {/* Watch Face */}
            <mesh position={[0, 0.08, 0]}>
              <cylinderGeometry args={[0.35, 0.35, 0.02, 32]} />
              <meshStandardMaterial 
                color="#000000"
                metalness={0.9}
                roughness={0.1}
              />
            </mesh>
            
            {/* Watch Crown */}
            <mesh position={[0.4, 0, 0]}>
              <cylinderGeometry args={[0.05, 0.05, 0.1, 8]} />
              <meshStandardMaterial {...createChromeMaterial(hovered)} />
            </mesh>
          </group>
        )}
        
        {/* Neural Interface Headset - Complex Shape */}
        {type === 'headset' && (
          <group
            onPointerOver={() => handleHover(true)}
            onPointerOut={() => handleHover(false)}
            onClick={handleClick}
          >
            {/* Main Headset Body */}
            <mesh>
              <sphereGeometry args={[0.5, 32, 16]} />
              <meshStandardMaterial {...createNeonMaterial(hovered, color)} />
            </mesh>
            
            {/* Side Connectors */}
            <mesh position={[-0.4, 0, 0]}>
              <cylinderGeometry args={[0.08, 0.08, 0.3, 8]} />
              <meshStandardMaterial {...createNeonMaterial(hovered, "#44d7ff")} />
            </mesh>
            <mesh position={[0.4, 0, 0]}>
              <cylinderGeometry args={[0.08, 0.08, 0.3, 8]} />
              <meshStandardMaterial {...createNeonMaterial(hovered, "#44d7ff")} />
            </mesh>
            
            {/* Neural Interface Ports */}
            <mesh position={[0, 0.3, 0]}>
              <cylinderGeometry args={[0.06, 0.06, 0.1, 6]} />
              <meshStandardMaterial {...createNeonMaterial(hovered, "#9b6cff")} />
            </mesh>
          </group>
        )}

        
        {/* Adaptive Fit Visualization for Sneaker */}
        {type === 'sneaker' && (
          <mesh ref={adaptiveFitRef}>
            <boxGeometry args={[1.3, 0.7, 0.9]} />
            <meshBasicMaterial 
              color="#44d7ff"
              transparent
              opacity={0}
              wireframe={true}
            />
          </mesh>
        )}
        
        {/* Holographic Display for Watch */}
        {type === 'watch' && (
          <mesh ref={hologramRef} position={[0, 0.3, 0]}>
            <planeGeometry args={[0.6, 0.4]} />
            <meshBasicMaterial 
              color="#00ffff"
              transparent
              opacity={0}
              side={THREE.DoubleSide}
            />
          </mesh>
        )}
        
        {/* Brainwave Pattern for Headset */}
        {type === 'headset' && (
          <mesh ref={brainwaveRef} position={[0, 0, 0]}>
            <torusGeometry args={[0.7, 0.02, 8, 32]} />
            <meshStandardMaterial 
              color="#00ff88"
              emissive="#00ff88"
              emissiveIntensity={0}
              transparent
              opacity={0.8}
            />
          </mesh>
        )}
        
        {/* Enhanced Product Base Glow */}
        <mesh position={[0, -0.4, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <circleGeometry args={[hovered ? 1.2 : 0.9]} />
          <meshBasicMaterial 
            color={color}
            transparent
            opacity={hovered ? 0.25 : 0.12}
          />
        </mesh>
      </group>
      
      {/* Enhanced Floating Info Card */}
      <group ref={infoRef} position={[0, 1.8, 0]} scale={[0.1, 0.1, 0.1]}>
        {/* Card Background */}
        <mesh>
          <planeGeometry args={[3, 1.5]} />
          <meshStandardMaterial 
            color="#000000"
            emissive="#44d7ff"
            emissiveIntensity={0.1}
            transparent
            opacity={0}
          />
        </mesh>
        
        {/* Card Border Glow */}
        <mesh position={[0, 0, -0.01]}>
          <planeGeometry args={[3.1, 1.6]} />
          <meshBasicMaterial 
            color="#44d7ff"
            transparent
            opacity={0}
          />
        </mesh>
        
        {/* Product Name Indicator */}
        <mesh position={[0, 0.4, 0.01]}>
          <planeGeometry args={[2.5, 0.3]} />
          <meshBasicMaterial 
            color="#ffffff"
            transparent
            opacity={0}
          />
        </mesh>
        
        {/* Description Area */}
        <mesh position={[0, -0.1, 0.01]}>
          <planeGeometry args={[2.8, 0.4]} />
          <meshBasicMaterial 
            color="#9b6cff"
            transparent
            opacity={0}
          />
        </mesh>
        
        {/* Action Indicator */}
        <mesh position={[0, -0.5, 0.01]}>
          <planeGeometry args={[1.5, 0.2]} />
          <meshBasicMaterial 
            color="#00ff88"
            transparent
            opacity={0}
          />
        </mesh>
      </group>
      
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

// Parallax Controller for Depth-Based Movement
function ParallaxController({ children }) {
  const groupRef = useRef()
  const previousCameraPosition = useRef(new THREE.Vector3())
  
  useFrame((state) => {
    const camera = state.camera
    const currentPosition = camera.position.clone()
    
    // Calculate camera movement delta
    const deltaMovement = currentPosition.clone().sub(previousCameraPosition.current)
    
    // Apply parallax offset to background elements
    if (groupRef.current) {
      groupRef.current.children.forEach((child, index) => {
        if (child.userData.parallaxDepth) {
          const depth = child.userData.parallaxDepth
          const parallaxFactor = 1 - (depth / 10) // Objects further away move less
          
          // Apply inverse movement for parallax effect
          child.position.x -= deltaMovement.x * parallaxFactor * 0.3
          child.position.y -= deltaMovement.y * parallaxFactor * 0.3
          child.position.z -= deltaMovement.z * parallaxFactor * 0.1
        }
      })
    }
    
    // Store current position for next frame
    previousCameraPosition.current.copy(currentPosition)
  })
  
  return <group ref={groupRef}>{children}</group>
}

// Enhanced Visual Cue System with Immediate Feedback
function VisualCueSystem({ children, isInteractive = false, isHovered = false, isClicked = false }) {
  const glowRef = useRef()
  const pulseRef = useRef()
  const feedbackRef = useRef()
  const [lastInteractionTime, setLastInteractionTime] = useState(0)
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    
    if (glowRef.current && isInteractive) {
      // Immediate glow response (< 100ms)
      const targetIntensity = isHovered ? 0.5 : isClicked ? 0.7 : 0.15
      const currentIntensity = glowRef.current.material.opacity
      
      // Fast lerp for immediate response
      const lerpSpeed = 0.25 // Very fast response
      glowRef.current.material.opacity += (targetIntensity - currentIntensity) * lerpSpeed
      
      // Scale response for immediate feedback
      const targetScale = isHovered ? 1.15 : isClicked ? 1.25 : 1.0
      const currentScale = glowRef.current.scale.x
      glowRef.current.scale.setScalar(currentScale + (targetScale - currentScale) * lerpSpeed)
      
      // Color change for state feedback
      if (isClicked) {
        glowRef.current.material.color.setHex(0x00ff88) // Green when clicked
      } else if (isHovered) {
        glowRef.current.material.color.setHex(0x9b6cff) // Purple when hovered
      } else {
        glowRef.current.material.color.setHex(0x44d7ff) // Default cyan
      }
    }
    
    // Pulse effect for interactive elements
    if (pulseRef.current && isInteractive) {
      const pulseIntensity = 0.1 + Math.sin(time * 2) * 0.05
      pulseRef.current.material.opacity = pulseIntensity
      
      // Faster pulse when hovered
      const pulseSpeed = isHovered ? 4 : 2
      const pulseScale = 1 + Math.sin(time * pulseSpeed) * 0.03
      pulseRef.current.scale.setScalar(pulseScale)
    }
    
    // Subtle immediate feedback burst effect
    if (feedbackRef.current && (time - lastInteractionTime) < 0.3) {
      const timeSinceInteraction = time - lastInteractionTime
      const burstIntensity = Math.max(0, 0.2 - timeSinceInteraction * 0.6) // Much more subtle
      const burstScale = 1 + burstIntensity * 0.1 // Smaller scale change
      
      feedbackRef.current.material.opacity = burstIntensity
      feedbackRef.current.scale.setScalar(burstScale)
    } else if (feedbackRef.current) {
      feedbackRef.current.material.opacity = 0
    }
  })
  
  // Trigger immediate feedback on interaction
  useEffect(() => {
    if (isHovered || isClicked) {
      setLastInteractionTime(performance.now() / 1000)
    }
  }, [isHovered, isClicked])
  
  return (
    <group>
      {children}
      {isInteractive && (
        <>
          {/* Main Glow */}
          <mesh ref={glowRef} position={[0, 0, -0.1]}>
            <sphereGeometry args={[1.8]} />
            <meshBasicMaterial 
              color="#44d7ff"
              transparent
              opacity={0.15}
            />
          </mesh>
          
          {/* Pulse Ring */}
          <mesh ref={pulseRef} position={[0, 0, -0.05]} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.5, 2.0, 32]} />
            <meshBasicMaterial 
              color="#ffffff"
              transparent
              opacity={0.1}
              side={THREE.DoubleSide}
            />
          </mesh>
          
          {/* Immediate Feedback Burst - Subtle */}
          <mesh ref={feedbackRef} position={[0, 0, 0]}>
            <sphereGeometry args={[1.2]} />
            <meshBasicMaterial 
              color="#44d7ff"
              transparent
              opacity={0}
            />
          </mesh>
        </>
      )}
    </group>
  )
}

// Enhanced Camera Controller with Smooth Transitions
function EnhancedCameraController() {
  const controlsRef = useRef()
  
  useFrame((state) => {
    if (controlsRef.current) {
      // Smooth camera transitions with easing
      const target = controlsRef.current.target
      const camera = state.camera
      
      // Auto-rotation with user override
      if (!controlsRef.current.autoRotate) {
        // User is controlling, temporarily disable auto-rotation
        setTimeout(() => {
          if (controlsRef.current) {
            controlsRef.current.autoRotate = true
          }
        }, 3000) // Resume after 3 seconds of inactivity
      }
    }
  })
  
  return (
    <OrbitControls 
      ref={controlsRef}
      enablePan={true} 
      enableZoom={true} 
      enableRotate={true}
      minDistance={2}
      maxDistance={15}
      maxPolarAngle={Math.PI / 1.8}
      autoRotate={true}
      autoRotateSpeed={0.15}
      enableDamping={true}
      dampingFactor={0.05}
      rotateSpeed={0.5}
      zoomSpeed={0.8}
      panSpeed={0.8}
      onStart={() => {
        if (controlsRef.current) {
          controlsRef.current.autoRotate = false
        }
      }}
    />
  )
}

// Background Elements with Parallax Depth
function ParallaxBackground() {
  return (
    <>
      {/* Far Background Particles */}
      {[...Array(20)].map((_, i) => (
        <mesh 
          key={`bg-${i}`}
          position={[
            (Math.random() - 0.5) * 30,
            (Math.random() - 0.5) * 15,
            -15 - Math.random() * 10
          ]}
          userData={{ parallaxDepth: 8 }}
        >
          <sphereGeometry args={[0.01]} />
          <meshBasicMaterial 
            color={i % 3 === 0 ? "#44d7ff" : i % 3 === 1 ? "#9b6cff" : "#00ff88"}
            transparent
            opacity={0.3}
          />
        </mesh>
      ))}
      
      {/* Mid-ground Elements */}
      {[...Array(8)].map((_, i) => (
        <mesh 
          key={`mg-${i}`}
          position={[
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 8,
            -8 - Math.random() * 5
          ]}
          userData={{ parallaxDepth: 5 }}
        >
          <sphereGeometry args={[0.02]} />
          <meshBasicMaterial 
            color="#ffffff"
            transparent
            opacity={0.15}
          />
        </mesh>
      ))}
    </>
  )
}

// Premium Cinematic VR Scene with Emotional Engagement
function VRScene({ showWowMoment = false, onWowComplete }) {
  return (
    <>
      {/* Emotional Engagement Features */}
      {showWowMoment && <WowMomentController onWowComplete={onWowComplete} />}
      <SurpriseAnimations />
      <EasterEggs />
      
      {/* Dynamic Lighting System */}
      <DynamicLightingRig />
      
      {/* Enhanced Environment with Fog */}
      <fog attach="fog" args={['#000011', 8, 25]} />
      
      {/* Parallax Background Elements */}
      <ParallaxController>
        <ParallaxBackground />
      </ParallaxController>
      
      {/* Central Q Portal with Visual Cues */}
      <VisualCueSystem isInteractive={true}>
        <QPortal />
      </VisualCueSystem>
      
      {/* Hero Products with Enhanced Visual Cues */}
      <InteractiveProductWithCues 
        position={[-3.5, 0, -2]} 
        color="#44d7ff" 
        name="Luminous Hyper-Sneaker"
        description="Adaptive fit • Haptic weave • Void black"
        type="sneaker"
      />
      
      <InteractiveProductWithCues 
        position={[3.5, 0, -2]} 
        color="#9b6cff" 
        name="Quantum Chronometer"
        description="Time dilation • Neural sync • Holographic display"
        type="watch"
      />
      
      <InteractiveProductWithCues 
        position={[0, 0, -5]} 
        color="#00ff88" 
        name="Neural Interface Headset"
        description="Mind-link • Spatial computing • Consciousness bridge"
        type="headset"
      />
      
      {/* Energy Particles with Parallax */}
      <ParallaxController>
        <EnergyParticles />
      </ParallaxController>
      
      {/* Ambient Audio */}
      <AmbientAudio />
      
      {/* Enhanced Camera Controls */}
      <EnhancedCameraController />
    </>
  )
}

// Enhanced Loading Screen with QSV Branding
function LoadingScreen() {
  const [loadingPhase, setLoadingPhase] = useState(0)
  
  useEffect(() => {
    const phases = [
      "Quantum processors initializing...",
      "Neural networks synchronizing...", 
      "Multiverse gateway opening...",
      "Reality matrix stabilizing...",
      "Welcome to the QSV Multiverse"
    ]
    
    const interval = setInterval(() => {
      setLoadingPhase(prev => (prev + 1) % phases.length)
    }, 400)
    
    return () => clearInterval(interval)
  }, [])
  
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#040824] via-[#120538] to-[#01010f] flex items-center justify-center z-50">
      <div className="text-center">
        {/* Enhanced Portal Loading Animation */}
        <div className="w-40 h-40 mx-auto mb-8 relative">
          {/* Outer Ring */}
          <div className="absolute inset-0 border-4 border-cyan-400/30 rounded-full animate-spin" style={{animationDuration: '3s'}}></div>
          {/* Middle Ring */}
          <div className="absolute inset-3 border-3 border-violet-400/40 rounded-full animate-spin" style={{animationDuration: '2s', animationDirection: 'reverse'}}></div>
          {/* Inner Ring */}
          <div className="absolute inset-6 border-2 border-cyan-300/50 rounded-full animate-spin" style={{animationDuration: '1.5s'}}></div>
          
          {/* QSV Logo */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <span className="text-5xl font-bold text-cyan-300 drop-shadow-lg">Q</span>
              <div className="text-xs text-violet-300 font-semibold tracking-wider mt-1">SV</div>
            </div>
          </div>
          
          {/* Pulsing Glow */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400/20 via-violet-500/30 to-cyan-400/20 animate-pulse"></div>
        </div>
        
        {/* Dynamic Loading Messages */}
        <div className="h-16 flex items-center justify-center">
          <p className="text-cyan-300 text-xl font-semibold transition-all duration-300">
            {loadingPhase === 0 && "Quantum processors initializing..."}
            {loadingPhase === 1 && "Neural networks synchronizing..."}
            {loadingPhase === 2 && "Multiverse gateway opening..."}
            {loadingPhase === 3 && "Reality matrix stabilizing..."}
            {loadingPhase === 4 && "Welcome to the QSV Multiverse"}
          </p>
        </div>
        
        {/* QSV Branding */}
        <div className="mt-4">
          <p className="text-gray-400 text-sm">Quantum Speed Ventures</p>
          <p className="text-gray-500 text-xs mt-1">Experience the Future of Shopping</p>
        </div>
        
        {/* Loading Progress Indicator */}
        <div className="mt-6 w-64 mx-auto">
          <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-cyan-400 to-violet-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

// First Impression Wow Moment System
function WowMomentController({ onWowComplete }) {
  const [wowPhase, setWowPhase] = useState('entrance') // entrance -> reveal -> complete
  const cameraRef = useRef()
  const portalBurstRef = useRef()
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    
    if (wowPhase === 'entrance' && time > 1) {
      // Dramatic camera sweep
      const sweepProgress = Math.min((time - 1) / 2, 1) // 2-second sweep
      const easeProgress = 1 - Math.pow(1 - sweepProgress, 3) // Ease out cubic
      
      // Camera starts high and sweeps down to reveal the portal
      const startY = 8
      const endY = 3
      const startZ = 15
      const endZ = 8
      
      state.camera.position.y = startY + (endY - startY) * easeProgress
      state.camera.position.z = startZ + (endZ - startZ) * easeProgress
      state.camera.lookAt(0, 0, 0)
      
      if (sweepProgress >= 1) {
        setWowPhase('reveal')
      }
    }
    
    if (wowPhase === 'reveal' && time > 3.5) {
      // Subtle portal burst effect
      if (portalBurstRef.current) {
        const burstProgress = Math.min((time - 3.5) / 1, 1)
        const burstIntensity = Math.sin(burstProgress * Math.PI) * 0.8 // Reduced intensity
        
        portalBurstRef.current.scale.setScalar(1 + burstIntensity * 0.2) // Smaller scale
        portalBurstRef.current.material.opacity = burstIntensity * 0.1 // Much more subtle
      }
      
      if (time > 4.5) {
        setWowPhase('complete')
        if (onWowComplete) onWowComplete()
      }
    }
  })
  
  return (
    <>
      {wowPhase === 'reveal' && (
        <mesh ref={portalBurstRef} position={[0, 0, 0]}>
          <sphereGeometry args={[3]} />
          <meshBasicMaterial 
            color="#44d7ff"
            transparent
            opacity={0}
          />
        </mesh>
      )}
    </>
  )
}

// Surprise Animation System
function SurpriseAnimations() {
  const [surprises, setSurprises] = useState([])
  const surpriseRefs = useRef([])
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    
    // Trigger random surprise animations
    if (Math.random() < 0.002 && surprises.length < 3) { // ~2% chance per frame
      const newSurprise = {
        id: Date.now(),
        position: [
          (Math.random() - 0.5) * 10,
          Math.random() * 3 + 1,
          (Math.random() - 0.5) * 8
        ],
        startTime: time,
        type: Math.floor(Math.random() * 3) // 0: sparkle, 1: ring, 2: burst
      }
      setSurprises(prev => [...prev, newSurprise])
    }
    
    // Animate existing surprises
    surpriseRefs.current.forEach((ref, index) => {
      if (ref && surprises[index]) {
        const surprise = surprises[index]
        const age = time - surprise.startTime
        const progress = Math.min(age / 2, 1) // 2-second animation
        
        if (surprise.type === 0) { // Sparkle
          ref.rotation.y = age * 4
          ref.scale.setScalar(Math.sin(progress * Math.PI) * 0.5)
          ref.material.opacity = Math.sin(progress * Math.PI) * 0.8
        } else if (surprise.type === 1) { // Ring
          ref.rotation.z = age * 2
          ref.scale.setScalar(1 + progress * 2)
          ref.material.opacity = (1 - progress) * 0.6
        } else { // Burst
          ref.scale.setScalar(progress * 3)
          ref.material.opacity = (1 - progress) * 0.4
        }
        
        if (progress >= 1) {
          // Remove completed surprise
          setSurprises(prev => prev.filter(s => s.id !== surprise.id))
        }
      }
    })
  })
  
  return (
    <>
      {surprises.map((surprise, index) => (
        <mesh 
          key={surprise.id}
          ref={el => surpriseRefs.current[index] = el}
          position={surprise.position}
        >
          {surprise.type === 0 && <sphereGeometry args={[0.1]} />}
          {surprise.type === 1 && <torusGeometry args={[0.5, 0.05, 8, 16]} />}
          {surprise.type === 2 && <sphereGeometry args={[0.3]} />}
          <meshBasicMaterial 
            color={surprise.type === 0 ? "#44d7ff" : surprise.type === 1 ? "#9b6cff" : "#00ff88"}
            transparent
            opacity={0}
          />
        </mesh>
      ))}
    </>
  )
}

// Easter Egg Discovery System
function EasterEggs() {
  const [discovered, setDiscovered] = useState([])
  const eggRefs = useRef([])
  
  const easterEggs = [
    { position: [-8, 2, -3], message: "QSV Secret: Quantum entanglement enabled!" },
    { position: [8, -1, -6], message: "Hidden feature: Time dilation mode unlocked!" },
    { position: [0, 5, -10], message: "Easter egg: Neural link established!" }
  ]
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    
    eggRefs.current.forEach((ref, index) => {
      if (ref && !discovered.includes(index)) {
        // Subtle pulsing to hint at discovery
        const pulse = Math.sin(time * 2 + index) * 0.5 + 0.5
        ref.material.opacity = 0.1 + pulse * 0.1
        ref.scale.setScalar(0.8 + pulse * 0.2)
      }
    })
  })
  
  const handleEggClick = (index) => {
    if (!discovered.includes(index)) {
      setDiscovered(prev => [...prev, index])
      console.log(easterEggs[index].message)
      // Future: Show UI notification
    }
  }
  
  return (
    <>
      {easterEggs.map((egg, index) => (
        <mesh 
          key={index}
          ref={el => eggRefs.current[index] = el}
          position={egg.position}
          onClick={() => handleEggClick(index)}
        >
          <sphereGeometry args={[0.2]} />
          <meshBasicMaterial 
            color="#ffffff"
            transparent
            opacity={discovered.includes(index) ? 0 : 0.1}
          />
        </mesh>
      ))}
    </>
  )
}

export default function VRPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isClient, setIsClient] = useState(false)
  const [wowCompleted, setWowCompleted] = useState(false)
  
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
          camera={{ position: [0, 8, 15], fov: 60 }} // Start high for wow moment
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
            <VRScene 
              showWowMoment={!wowCompleted} 
              onWowComplete={() => setWowCompleted(true)}
            />
          </Suspense>
        </Canvas>
        
        {/* Enhanced UI Overlay with QSV Branding */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-black/60 backdrop-blur-sm border border-cyan-400/30 rounded-lg px-6 py-3 shadow-lg shadow-cyan-400/20">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 flex items-center justify-center">
                <span className="text-xs font-bold text-white">Q</span>
              </div>
              <span className="text-cyan-300 text-sm font-semibold">QSV Multiverse</span>
            </div>
            <p className="text-gray-300 text-xs text-center">
              Use mouse to explore • Click objects to interact • Find hidden easter eggs
            </p>
          </div>
        </div>
        
        {/* Subtle QSV Watermark */}
        <div className="absolute top-4 left-4 z-10">
          <div className="bg-black/40 backdrop-blur-sm border border-cyan-400/20 rounded-lg px-3 py-2">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500"></div>
              <span className="text-cyan-300 text-xs font-medium">QSV</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}