import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { PointerLockControls, Text, Box, Plane } from '@react-three/drei'
import { XR, Controllers, Hands, XRButton, useXR } from '@react-three/xr'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { Suspense, useState, useEffect, useRef } from 'react'
import Head from 'next/head'
import * as THREE from 'three'
import ProductModel from '../components/products/ProductModel'

// World-space collision check shared by desktop and VR movement
function checkCollision(position) {
  // Simple boundary collision
  if (position.x < -16 || position.x > 16 || position.z < -22 || position.z > 22) {
    return true
  }

  // Storefront collision (simple box collision)
  const storefronts = [
    { x: -12, z: -8, width: 4, depth: 3 },
    { x: 12, z: -8, width: 4, depth: 3 },
    { x: -12, z: 5, width: 4, depth: 3 },
    { x: 12, z: 5, width: 4, depth: 3 }
  ]

  for (const store of storefronts) {
    if (position.x > store.x - store.width && position.x < store.x + store.width &&
        position.z > store.z - store.depth && position.z < store.z + store.depth) {
      return true
    }
  }

  return false
}

// Collision Boxes (invisible)
function CollisionBoxes() {
  return (
    <group>
      {/* Storefront collision boxes */}
      <Box args={[8, 6, 3]} position={[-12, 3, -8]} visible={false} />
      <Box args={[8, 6, 3]} position={[12, 3, -8]} visible={false} />
      <Box args={[8, 6, 3]} position={[-12, 3, 5]} visible={false} />
      <Box args={[8, 6, 3]} position={[12, 3, 5]} visible={false} />
      
      {/* Street boundaries */}
      <Box args={[1, 10, 50]} position={[-19, 5, 0]} visible={false} />
      <Box args={[1, 10, 50]} position={[19, 5, 0]} visible={false} />
      <Box args={[40, 10, 1]} position={[0, 5, -25]} visible={false} />
      <Box args={[40, 10, 1]} position={[0, 5, 25]} visible={false} />
    </group>
  )
}

// FPS Controls Component with Collision Detection (desktop only)
function FPSControls() {
  const { camera, gl, scene } = useThree()
  const isPresenting = useXR((state) => state.isPresenting)
  const controlsRef = useRef()
  const velocity = useRef(new THREE.Vector3())
  const direction = useRef(new THREE.Vector3())
  const raycaster = useRef(new THREE.Raycaster())
  const moveForward = useRef(false)
  const moveBackward = useRef(false)
  const moveLeft = useRef(false)
  const moveRight = useRef(false)
  
  useEffect(() => {
    const onKeyDown = (event) => {
      switch (event.code) {
        case 'KeyW': moveForward.current = true; break
        case 'KeyS': moveBackward.current = true; break
        case 'KeyA': moveLeft.current = true; break
        case 'KeyD': moveRight.current = true; break
      }
    }
    
    const onKeyUp = (event) => {
      switch (event.code) {
        case 'KeyW': moveForward.current = false; break
        case 'KeyS': moveBackward.current = false; break
        case 'KeyA': moveLeft.current = false; break
        case 'KeyD': moveRight.current = false; break
      }
    }
    
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('keyup', onKeyUp)
    
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('keyup', onKeyUp)
    }
  }, [])
  
  useFrame((state, delta) => {
    if (!controlsRef.current?.isLocked) return
    
    const speed = 6.0
    velocity.current.x -= velocity.current.x * 10.0 * delta
    velocity.current.z -= velocity.current.z * 10.0 * delta
    
    direction.current.z = Number(moveForward.current) - Number(moveBackward.current)
    direction.current.x = Number(moveRight.current) - Number(moveLeft.current)
    direction.current.normalize()
    
    if (moveForward.current || moveBackward.current) {
      velocity.current.z -= direction.current.z * speed * delta
    }
    if (moveLeft.current || moveRight.current) {
      velocity.current.x -= direction.current.x * speed * delta
    }
    
    // Apply movement with collision detection
    const newPosition = camera.position.clone()
    const deltaMovement = velocity.current.clone().multiplyScalar(delta)
    
    // Check X movement
    const testX = newPosition.clone()
    testX.x += deltaMovement.x
    if (!checkCollision(testX)) {
      newPosition.x = testX.x
    }
    
    // Check Z movement
    const testZ = newPosition.clone()
    testZ.z += deltaMovement.z
    if (!checkCollision(testZ)) {
      newPosition.z = testZ.z
    }
    
    camera.position.copy(newPosition)
  })

  // Pointer lock fights the XR session for the camera — unmount it in VR
  if (isPresenting) return null

  return (
    <PointerLockControls
      ref={controlsRef}
      args={[camera, gl.domElement]}
    />
  )
}

// VR Locomotion: left thumbstick = smooth move (headset-relative),
// right thumbstick = 45° snap turn. Shares collision logic with desktop.
function VRLocomotion() {
  const { camera } = useThree()
  const { player, controllers, isPresenting } = useXR()
  const snapReady = useRef(true)
  const vec = useRef({
    forward: new THREE.Vector3(),
    right: new THREE.Vector3(),
    move: new THREE.Vector3(),
    head: new THREE.Vector3()
  })

  // Spawn the player rig where the desktop camera starts
  useEffect(() => {
    if (isPresenting) {
      player.position.set(0, 0, 10)
      player.rotation.set(0, 0, 0)
    }
  }, [isPresenting, player])

  useFrame((state, delta) => {
    if (!isPresenting) return

    const { forward, right, move, head } = vec.current
    const UP = new THREE.Vector3(0, 1, 0)
    const DEADZONE = 0.15
    const SPEED = 3.0

    let moveX = 0
    let moveZ = 0
    let turnX = 0

    for (const controller of controllers) {
      const gamepad = controller.inputSource?.gamepad
      if (!gamepad || gamepad.axes.length < 4) continue
      // Thumbstick is axes[2]/axes[3] on Quest-style controllers
      if (controller.inputSource.handedness === 'left') {
        moveX = gamepad.axes[2]
        moveZ = gamepad.axes[3]
      } else if (controller.inputSource.handedness === 'right') {
        turnX = gamepad.axes[2]
      }
    }

    // Smooth locomotion relative to where the headset is looking
    if (Math.abs(moveX) > DEADZONE || Math.abs(moveZ) > DEADZONE) {
      camera.getWorldDirection(forward)
      forward.y = 0
      forward.normalize()
      right.crossVectors(forward, UP)

      move
        .copy(forward)
        .multiplyScalar(-moveZ)
        .addScaledVector(right, moveX)
        .multiplyScalar(SPEED * delta)

      camera.getWorldPosition(head)

      // Axis-separated collision so we can slide along walls
      const testX = head.clone()
      testX.x += move.x
      if (!checkCollision(testX)) player.position.x += move.x

      const testZ = head.clone()
      testZ.z += move.z
      if (!checkCollision(testZ)) player.position.z += move.z
    }

    // Snap turn: one 45° step per stick flick, pivoting around the headset
    if (Math.abs(turnX) > 0.6) {
      if (snapReady.current) {
        snapReady.current = false
        const angle = (turnX > 0 ? -1 : 1) * Math.PI / 4
        camera.getWorldPosition(head)
        player.position.x -= head.x
        player.position.z -= head.z
        player.position.applyAxisAngle(UP, angle)
        player.position.x += head.x
        player.position.z += head.z
        player.rotation.y += angle
      }
    } else {
      snapReady.current = true
    }
  })

  return null
}

// Rain Effect
function RainEffect() {
  const rainRef = useRef()
  const raindrops = useRef([])
  
  useEffect(() => {
    const drops = []
    for (let i = 0; i < 800; i++) {
      drops.push({
        x: (Math.random() - 0.5) * 60,
        y: Math.random() * 25 + 15,
        z: (Math.random() - 0.5) * 60,
        speed: Math.random() * 0.15 + 0.08,
        originalX: (Math.random() - 0.5) * 60,
        originalZ: (Math.random() - 0.5) * 60
      })
    }
    raindrops.current = drops
  }, [])
  
  useFrame((state) => {
    if (!rainRef.current) return
    
    const time = state.clock.getElapsedTime()
    
    raindrops.current.forEach((drop, i) => {
      drop.y -= drop.speed
      // Add slight wind effect
      drop.x = drop.originalX + Math.sin(time * 0.5 + i * 0.01) * 0.5
      drop.z = drop.originalZ + Math.cos(time * 0.3 + i * 0.01) * 0.3
      
      if (drop.y < 0) {
        drop.y = 25
        drop.originalX = (Math.random() - 0.5) * 60
        drop.originalZ = (Math.random() - 0.5) * 60
        drop.x = drop.originalX
        drop.z = drop.originalZ
      }
      
      const index = i * 3
      rainRef.current.geometry.attributes.position.array[index] = drop.x
      rainRef.current.geometry.attributes.position.array[index + 1] = drop.y
      rainRef.current.geometry.attributes.position.array[index + 2] = drop.z
    })
    
    rainRef.current.geometry.attributes.position.needsUpdate = true
  })
  
  const positions = new Float32Array(800 * 3)
  raindrops.current.forEach((drop, i) => {
    positions[i * 3] = drop.x
    positions[i * 3 + 1] = drop.y
    positions[i * 3 + 2] = drop.z
  })
  
  return (
    <points ref={rainRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={800}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#44d7ff"
        size={0.08}
        transparent
        opacity={0.4}
        sizeAttenuation={true}
      />
    </points>
  )
}

// Atmospheric Particles (dust, mist)
function AtmosphericParticles() {
  const particlesRef = useRef()
  const particles = useRef([])
  
  useEffect(() => {
    const particleArray = []
    for (let i = 0; i < 200; i++) {
      particleArray.push({
        x: (Math.random() - 0.5) * 40,
        y: Math.random() * 8 + 1,
        z: (Math.random() - 0.5) * 40,
        speedX: (Math.random() - 0.5) * 0.02,
        speedY: Math.random() * 0.01 + 0.005,
        speedZ: (Math.random() - 0.5) * 0.02,
        life: Math.random()
      })
    }
    particles.current = particleArray
  }, [])
  
  useFrame((state) => {
    if (!particlesRef.current) return
    
    const time = state.clock.getElapsedTime()
    
    particles.current.forEach((particle, i) => {
      particle.x += particle.speedX
      particle.y += particle.speedY
      particle.z += particle.speedZ
      particle.life += 0.01
      
      // Reset particle if it goes too high or too far
      if (particle.y > 10 || particle.life > 1) {
        particle.x = (Math.random() - 0.5) * 40
        particle.y = 0.5
        particle.z = (Math.random() - 0.5) * 40
        particle.life = 0
      }
      
      const index = i * 3
      particlesRef.current.geometry.attributes.position.array[index] = particle.x
      particlesRef.current.geometry.attributes.position.array[index + 1] = particle.y
      particlesRef.current.geometry.attributes.position.array[index + 2] = particle.z
    })
    
    particlesRef.current.geometry.attributes.position.needsUpdate = true
  })
  
  const positions = new Float32Array(200 * 3)
  particles.current.forEach((particle, i) => {
    positions[i * 3] = particle.x
    positions[i * 3 + 1] = particle.y
    positions[i * 3 + 2] = particle.z
  })
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={200}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#9b6cff"
        size={0.05}
        transparent
        opacity={0.2}
        sizeAttenuation={true}
      />
    </points>
  )
}

// Street Ground with Reflections
function Street() {
  return (
    <group>
      {/* Main Street - Wet asphalt with reflections */}
      <Plane
        args={[30, 40]}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
      >
        <meshStandardMaterial
          color="#0f0f1a"
          roughness={0.05}
          metalness={0.9}
          envMapIntensity={1.5}
        />
      </Plane>
      
      {/* Street center line */}
      <Plane
        args={[0.3, 40]}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.001, 0]}
      >
        <meshStandardMaterial
          color="#44d7ff"
          emissive="#44d7ff"
          emissiveIntensity={0.3}
        />
      </Plane>
      
      {/* Sidewalks */}
      <Plane
        args={[4, 40]}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[-17, 0.01, 0]}
      >
        <meshStandardMaterial 
          color="#1a1a2e" 
          roughness={0.8}
          metalness={0.1}
        />
      </Plane>
      
      <Plane
        args={[4, 40]}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[17, 0.01, 0]}
      >
        <meshStandardMaterial 
          color="#1a1a2e" 
          roughness={0.8}
          metalness={0.1}
        />
      </Plane>
      
      {/* Puddles for extra reflection */}
      {[-8, -3, 2, 7, 12].map((z, index) => (
        <Plane
          key={index}
          args={[2, 1.5]}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[Math.random() * 10 - 5, 0.002, z]}
        >
          <meshStandardMaterial
            color="#000011"
            roughness={0.01}
            metalness={1.0}
            transparent
            opacity={0.8}
          />
        </Plane>
      ))}
    </group>
  )
}

// Storefront Component
function Storefront({ position, brand, color, accentColor, products }) {
  const [hovered, setHovered] = useState(false)
  const storeRef = useRef()
  
  useFrame((state) => {
    if (storeRef.current) {
      const intensity = hovered ? 1.2 : 0.8
      storeRef.current.children.forEach(child => {
        if (child.material && child.material.emissive) {
          child.material.emissiveIntensity = intensity
        }
      })
    }
  })
  
  return (
    <group 
      ref={storeRef}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Building Structure */}
      <Box args={[8, 6, 3]} position={[0, 3, 0]}>
        <meshStandardMaterial
          color="#0a0a1a"
          emissive={color}
          emissiveIntensity={0.1}
        />
      </Box>
      
      {/* Storefront Window */}
      <Box args={[7, 4, 0.2]} position={[0, 2, 1.6]}>
        <meshStandardMaterial
          color="#000011"
          transparent
          opacity={0.3}
          emissive={accentColor}
          emissiveIntensity={0.2}
        />
      </Box>
      
      {/* Brand Sign */}
      <Text
        position={[0, 5, 1.7]}
        fontSize={0.8}
        color={color}
        anchorX="center"
        anchorY="middle"

      >
        {brand}
      </Text>
      
      {/* Neon Accent Lines */}
      <Box args={[8.2, 0.1, 0.1]} position={[0, 4.5, 1.7]}>
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1}
        />
      </Box>
      
      <Box args={[8.2, 0.1, 0.1]} position={[0, 0.5, 1.7]}>
        <meshStandardMaterial
          color={accentColor}
          emissive={accentColor}
          emissiveIntensity={1}
        />
      </Box>
      
      {/* Product Displays */}
      {products.map((product, index) => (
        <ProductDisplay
          key={index}
          position={[
            (index - products.length / 2 + 0.5) * 2,
            1.5,
            1.4
          ]}
          product={product}
          storeColor={color}
        />
      ))}
    </group>
  )
}

// Product Display Component
function ProductDisplay({ position, product, storeColor }) {
  const [showInfo, setShowInfo] = useState(false)
  const productRef = useRef()
  const { camera } = useThree()
  const headPos = useRef(new THREE.Vector3())
  const productPos = useRef(new THREE.Vector3())

  useFrame(() => {
    if (!productRef.current) return

    // World positions so this works both on desktop and inside the XR player rig
    camera.getWorldPosition(headPos.current)
    productRef.current.getWorldPosition(productPos.current)

    setShowInfo(headPos.current.distanceTo(productPos.current) < 4)
  })
  
  useFrame((state) => {
    if (productRef.current) {
      productRef.current.rotation.y = state.clock.getElapsedTime() * 0.5
    }
  })
  
  return (
    <group position={position}>
      {/* Display pedestal */}
      <mesh position={[0, -0.55, 0]}>
        <cylinderGeometry args={[0.35, 0.4, 0.12, 16]} />
        <meshStandardMaterial color="#0a0a1a" roughness={0.3} metalness={0.8} />
      </mesh>
      <mesh position={[0, -0.48, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.35, 0.02, 8, 24]} />
        <meshStandardMaterial color={storeColor} emissive={storeColor} emissiveIntensity={2} />
      </mesh>

      {/* Rotating product model */}
      <group ref={productRef}>
        <ProductModel type={product.model} color={product.color} />
      </group>

      {showInfo && (
        <group position={[0, 1.5, 0]}>
          <Plane args={[3, 1.5]} position={[0, 0, 0.1]}>
            <meshStandardMaterial
              color="#000011"
              transparent
              opacity={0.9}
              emissive={storeColor}
              emissiveIntensity={0.1}
            />
          </Plane>
          
          <Text
            position={[0, 0.3, 0.2]}
            fontSize={0.3}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
          >
            {product.name}
          </Text>
          
          <Text
            position={[0, -0.1, 0.2]}
            fontSize={0.25}
            color={storeColor}
            anchorX="center"
            anchorY="middle"
          >
            ${product.price}
          </Text>
          
          <Text
            position={[0, -0.4, 0.2]}
            fontSize={0.2}
            color="#888888"
            anchorX="center"
            anchorY="middle"
          >
            Enter Waitlist
          </Text>
        </group>
      )}
    </group>
  )
}

// Street Lighting
function StreetLights() {
  return (
    <group>
      {/* Street Lamps */}
      {[-10, -5, 0, 5, 10].map((z, index) => (
        <group key={index}>
          {/* Left Side */}
          <group position={[-12, 0, z]}>
            <Box args={[0.2, 8, 0.2]} position={[0, 4, 0]}>
              <meshStandardMaterial color="#333333" />
            </Box>
            <pointLight
              position={[0, 7, 0]}
              intensity={2}
              distance={15}
              color="#44d7ff"
            />
          </group>
          
          {/* Right Side */}
          <group position={[12, 0, z]}>
            <Box args={[0.2, 8, 0.2]} position={[0, 4, 0]}>
              <meshStandardMaterial color="#333333" />
            </Box>
            <pointLight
              position={[0, 7, 0]}
              intensity={2}
              distance={15}
              color="#9b6cff"
            />
          </group>
        </group>
      ))}
    </group>
  )
}

// Main Street Scene
function StreetScene() {
  const storefronts = [
    {
      position: [-12, 0, -8],
      brand: "NEXUS",
      color: "#44d7ff",
      accentColor: "#00ff88",
      products: [
        { name: "Neural Interface", price: 2499, color: "#44d7ff", model: "headset" },
        { name: "Quantum Processor", price: 1899, color: "#00ff88", model: "chip" },
        { name: "Holo Display", price: 999, color: "#44d7ff", model: "screen" }
      ]
    },
    {
      position: [12, 0, -8],
      brand: "VORTEX",
      color: "#9b6cff",
      accentColor: "#ff6b9d",
      products: [
        { name: "Gravity Boots", price: 799, color: "#9b6cff", model: "sneaker" },
        { name: "Phase Jacket", price: 1299, color: "#ff6b9d", model: "jacket" },
        { name: "Time Watch", price: 3499, color: "#9b6cff", model: "watch" }
      ]
    },
    {
      position: [-12, 0, 5],
      brand: "FLUX",
      color: "#00ff88",
      accentColor: "#44d7ff",
      products: [
        { name: "Energy Drink", price: 29, color: "#00ff88", model: "can" },
        { name: "Nano Pills", price: 199, color: "#44d7ff", model: "can" },
        { name: "Bio Scanner", price: 899, color: "#00ff88", model: "chip" }
      ]
    },
    {
      position: [12, 0, 5],
      brand: "APEX",
      color: "#ff6b9d",
      accentColor: "#9b6cff",
      products: [
        { name: "Cyber Sneakers", price: 599, color: "#ff6b9d", model: "sneaker" },
        { name: "Smart Lens", price: 1499, color: "#9b6cff", model: "screen" },
        { name: "Voice Mod", price: 399, color: "#ff6b9d", model: "headset" }
      ]
    }
  ]
  
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.15} color="#0a0a2e" />
      <directionalLight
        position={[10, 20, 5]}
        intensity={0.3}
        color="#44d7ff"
        castShadow
      />
      <fog attach="fog" args={['#000011', 8, 30]} />
      
      {/* Environment */}
      <Street />
      <StreetLights />
      <RainEffect />
      <AtmosphericParticles />
      <CollisionBoxes />
      
      {/* Storefronts */}
      {storefronts.map((store, index) => (
        <Storefront key={index} {...store} />
      ))}

      {/* Controls */}
      <FPSControls />
      <VRLocomotion />
      <Controllers />
      <Hands />
    </>
  )
}

// Post-processing (desktop only — EffectComposer conflicts with the WebXR render loop)
function Effects() {
  const isPresenting = useXR((state) => state.isPresenting)
  if (isPresenting) return null

  return (
    <EffectComposer>
      <Bloom
        intensity={0.6}
        luminanceThreshold={0.2}
        luminanceSmoothing={0.9}
        mipmapBlur
      />
    </EffectComposer>
  )
}

// Loading Screen
function LoadingScreen({ isLoading }) {
  if (!isLoading) return null
  
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#040824] via-[#120538] to-[#01010f] flex items-center justify-center z-50">
      <div className="text-center">
        <div className="w-32 h-32 mx-auto mb-8 relative">
          <div className="absolute inset-0 border-4 border-cyan-400/30 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl font-bold text-cyan-300">Q</span>
          </div>
        </div>
        <p className="text-cyan-300 text-xl font-semibold mb-4">Loading QSV Street...</p>
        <p className="text-cyan-300/60 text-sm">Initializing futuristic shopping district</p>
      </div>
    </div>
  )
}

// Instructions Overlay
function Instructions({ show }) {
  if (!show) return null
  
  return (
    <div className="absolute top-4 left-4 z-10 bg-black/80 backdrop-blur-sm border border-cyan-400/30 rounded-lg p-4 max-w-sm">
      <h3 className="text-cyan-300 font-semibold mb-2">QSV Street Controls</h3>
      <div className="text-sm text-gray-300 space-y-1">
        <p><span className="text-cyan-300">Click</span> to enter first-person mode</p>
        <p><span className="text-cyan-300">WASD</span> to move around</p>
        <p><span className="text-cyan-300">Mouse</span> to look around</p>
        <p><span className="text-cyan-300">ESC</span> to exit first-person mode</p>
        <p className="mt-2"><span className="text-violet-300">VR headset:</span> click Enter VR, left stick to move, right stick to turn</p>
        <p className="text-cyan-300/60 text-xs mt-2">Walk close to products to see details</p>
      </div>
    </div>
  )
}

export default function QSVStreet() {
  const [isLoading, setIsLoading] = useState(true)
  const [isClient, setIsClient] = useState(false)
  const [showInstructions, setShowInstructions] = useState(true)
  
  useEffect(() => {
    setIsClient(true)
    const timer = setTimeout(() => {
      setIsLoading(false)
      setTimeout(() => setShowInstructions(false), 8000)
    }, 3000)
    return () => clearTimeout(timer)
  }, [])
  
  if (!isClient) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center">
        <p className="text-white">Initializing QSV Street...</p>
      </div>
    )
  }
  
  return (
    <>
      <Head>
        <title>QSV Street - Futuristic Shopping District</title>
        <meta name="description" content="Explore the future of retail in QSV Street" />
      </Head>
      
      <LoadingScreen isLoading={isLoading} />
      
      <div className="w-full h-screen bg-black relative">
        {/* Exit + Enter VR Buttons */}
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <XRButton
            mode="VR"
            sessionInit={{ optionalFeatures: ['local-floor', 'hand-tracking'] }}
            className="px-4 py-2 bg-violet-500/20 border border-violet-400/40 text-violet-300 rounded-lg hover:bg-violet-500/30 transition-colors"
          >
            {(status) =>
              status === 'unsupported'
                ? 'VR: headset required'
                : status === 'entered'
                  ? 'Exit VR'
                  : 'Enter VR'
            }
          </XRButton>
          <button
            onClick={() => window.location.href = '/'}
            className="px-4 py-2 bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 rounded-lg hover:bg-cyan-500/30 transition-colors"
          >
            Exit Street
          </button>
        </div>
        
        <Instructions show={showInstructions} />
        
        {/* Street Info */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-black/60 backdrop-blur-sm border border-cyan-400/30 rounded-lg px-6 py-3">
            <p className="text-cyan-300 text-sm text-center">
              QSV Street • Futuristic Shopping District • Walk close to products for details
            </p>
          </div>
        </div>
        
        <Canvas
          camera={{
            position: [0, 1.7, 10],
            fov: 75,
            near: 0.1,
            far: 100
          }}
          style={{ background: 'linear-gradient(to bottom, #000011 0%, #0a0a2e 100%)' }}
        >
          <XR referenceSpace="local-floor">
            <Suspense fallback={null}>
              <StreetScene />
              <Effects />
            </Suspense>
          </XR>
        </Canvas>
      </div>
    </>
  )
}