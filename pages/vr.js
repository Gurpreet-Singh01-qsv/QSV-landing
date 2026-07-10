import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { PointerLockControls, Text, Box, Plane, Environment, PerformanceMonitor } from '@react-three/drei'
import { XR, Controllers, Hands, XRButton, useXR } from '@react-three/xr'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { Suspense, useState, useEffect, useRef, useMemo } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import * as THREE from 'three'
import ProductModel, { ScanErrorBoundary } from '../components/products/ProductModel'
import ProductModal from '../components/shop/ProductModal'
import CartDrawer from '../components/shop/CartDrawer'
import AssistantChat from '../components/shop/AssistantChat'
import { useCart } from '../components/cart/CartContext'
import { getProduct, getProductsByStore, getCategories, STORES } from '../lib/products'

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
      player.position.set(0, 0, 18)
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
function RainEffect({ count = 600 }) {
  const rainRef = useRef()
  const raindrops = useRef([])

  useEffect(() => {
    const drops = []
    for (let i = 0; i < count; i++) {
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
  }, [count])

  useFrame((state) => {
    if (!rainRef.current) return
    
    const time = state.clock.getElapsedTime()
    
    raindrops.current.forEach((drop, i) => {
      if (i >= count) return
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
  
  const positions = new Float32Array(count * 3)
  raindrops.current.forEach((drop, i) => {
    if (i >= count) return
    positions[i * 3] = drop.x
    positions[i * 3 + 1] = drop.y
    positions[i * 3 + 2] = drop.z
  })

  return (
    <points ref={rainRef} key={count}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
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
function AtmosphericParticles({ count = 150 }) {
  const particlesRef = useRef()
  const particles = useRef([])

  useEffect(() => {
    const particleArray = []
    for (let i = 0; i < count; i++) {
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
  }, [count])

  useFrame((state) => {
    if (!particlesRef.current) return

    const time = state.clock.getElapsedTime()

    particles.current.forEach((particle, i) => {
      if (i >= count) return
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
  
  const positions = new Float32Array(count * 3)
  particles.current.forEach((particle, i) => {
    if (i >= count) return
    positions[i * 3] = particle.x
    positions[i * 3 + 1] = particle.y
    positions[i * 3 + 2] = particle.z
  })

  return (
    <points ref={particlesRef} key={count}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
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
  
  // Set emissive intensity once per hover change instead of every frame
  useEffect(() => {
    if (!storeRef.current) return
    const intensity = hovered ? 1.2 : 0.8
    storeRef.current.children.forEach(child => {
      if (child.material && child.material.emissive) {
        child.material.emissiveIntensity = intensity
      }
    })
  }, [hovered])
  
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

  // The ProximityTracker broadcasts the single nearest product; this display
  // lights up only when it's the one.
  useEffect(() => {
    const onNearest = (e) => setShowInfo(e.detail.id === product.id)
    window.addEventListener('qsv:nearest-product', onNearest)
    return () => window.removeEventListener('qsv:nearest-product', onNearest)
  }, [product.id])
  
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
        <ProductModel
          type={product.model}
          color={product.color}
          modelUrl={product.modelUrl}
          modelScale={product.modelScale}
          modelYOffset={product.modelYOffset}
          modelRotationY={product.modelRotationY}
        />
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
            Press E for details
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
      {/* Lamp posts on both sides, but only one light per row (alternating sides)
          — halves the light count, which is the main fragment-shader cost */}
      {[-10, -5, 0, 5, 10].map((z, index) => (
        <group key={index}>
          {/* Left Side */}
          <group position={[-12, 0, z]}>
            <Box args={[0.2, 8, 0.2]} position={[0, 4, 0]}>
              <meshStandardMaterial color="#333333" />
            </Box>
            {index % 2 === 0 && (
              <pointLight
                position={[0, 7, 0]}
                intensity={2.5}
                distance={18}
                color="#44d7ff"
              />
            )}
          </group>

          {/* Right Side */}
          <group position={[12, 0, z]}>
            <Box args={[0.2, 8, 0.2]} position={[0, 4, 0]}>
              <meshStandardMaterial color="#333333" />
            </Box>
            {index % 2 === 1 && (
              <pointLight
                position={[0, 7, 0]}
                intensity={2.5}
                distance={18}
                color="#9b6cff"
              />
            )}
          </group>
        </group>
      ))}
    </group>
  )
}

// Tracks which product the shopper is closest to (one loop for the whole
// street — replaces per-product distance checks). Radius 5.5 so products in
// the near-side stores (FLUX/APEX), which sit ~4.4m behind their collision
// wall, are reachable.
function ProximityTracker({ storefronts }) {
  const { camera } = useThree()
  const nearestRef = useRef(null)
  const head = useRef(new THREE.Vector3())

  const productPositions = useMemo(() => {
    const list = []
    storefronts.forEach((store) => {
      store.products.forEach((p, i) => {
        list.push({
          id: p.id,
          pos: new THREE.Vector3(
            store.position[0] + (i - store.products.length / 2 + 0.5) * 2,
            1.5,
            store.position[2] + 1.4
          )
        })
      })
    })
    return list
  }, [storefronts])

  useFrame(() => {
    camera.getWorldPosition(head.current)
    let best = null
    let bestDistance = 5.5
    for (const { id, pos } of productPositions) {
      const d = head.current.distanceTo(pos)
      if (d < bestDistance) {
        bestDistance = d
        best = id
      }
    }
    if (best !== nearestRef.current) {
      nearestRef.current = best
      window.dispatchEvent(new CustomEvent('qsv:nearest-product', { detail: { id: best } }))
    }
  })

  return null
}

// Glowing beacon above storefronts that stock the active verse's category
function VerseBeacon({ position, color }) {
  const beaconRef = useRef()

  useFrame((state) => {
    if (beaconRef.current) {
      const t = state.clock.getElapsedTime()
      beaconRef.current.position.y = 7.5 + Math.sin(t * 2) * 0.3
      beaconRef.current.rotation.y = t * 1.5
    }
  })

  return (
    <group position={position}>
      <group ref={beaconRef} position={[0, 7.5, 0]}>
        <mesh>
          <coneGeometry args={[0.5, 1, 4]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2.5} transparent opacity={0.9} />
        </mesh>
      </group>
      {/* Light pillar */}
      <mesh position={[0, 10, 0]}>
        <cylinderGeometry args={[0.08, 0.35, 6, 8, 1, true]} />
        <meshBasicMaterial color={color} transparent opacity={0.15} side={THREE.DoubleSide} />
      </mesh>
      <pointLight position={[0, 7.5, 0]} intensity={1.5} distance={10} color={color} />
    </group>
  )
}

// Main Street Scene
function StreetScene({ verse }) {
  // Drops effects and particle counts automatically if the device can't hold frame rate
  const [degraded, setDegraded] = useState(false)

  // Store positions in the street; products come from the unified catalog
  const storefronts = useMemo(() => {
    const storePositions = { NEXUS: [-12, 0, -8], VORTEX: [12, 0, -8], FLUX: [-12, 0, 5], APEX: [12, 0, 5] }
    return Object.entries(storePositions).map(([brand, position]) => ({
      position,
      brand,
      color: STORES[brand].color,
      accentColor: STORES[brand].accentColor,
      products: getProductsByStore(brand)
    }))
  }, [])

  return (
    <>
      <PerformanceMonitor onDecline={() => setDegraded(true)} />

      {/* Lighting */}
      <ambientLight intensity={0.15} color="#0a0a2e" />
      <directionalLight
        position={[10, 20, 5]}
        intensity={0.3}
        color="#44d7ff"
      />
      <fog attach="fog" args={['#000011', 8, 30]} />

      {/* HDR image-based lighting — makes PBR materials (esp. digitized scans) read as real.
          Wrapped so a failed HDR fetch degrades to the existing lights, never a crash. */}
      <ScanErrorBoundary fallback={null}>
        <Environment files="/hdr/street.hdr" />
      </ScanErrorBoundary>

      {/* Environment */}
      <Street />
      <StreetLights />
      <RainEffect count={degraded ? 250 : 600} />
      <AtmosphericParticles count={degraded ? 60 : 150} />
      <CollisionBoxes />

      {/* Storefronts */}
      {storefronts.map((store, index) => (
        <Storefront key={index} {...store} />
      ))}

      {/* Verse beacons: guide the shopper to stores stocking the chosen category */}
      {verse && storefronts
        .filter((store) => store.products.some((p) => p.category === verse))
        .map((store) => (
          <VerseBeacon key={`beacon-${store.brand}`} position={store.position} color={store.color} />
        ))}

      {/* Controls + interaction */}
      <ProximityTracker storefronts={storefronts} />
      <FPSControls />
      <VRLocomotion />
      <Controllers />
      <Hands />

      {/* Bloom is the first thing to go on weak GPUs */}
      {!degraded && <Effects />}
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
        intensity={0.45}
        luminanceThreshold={0.4}
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
        <p><span className="text-cyan-300">E</span> near a product to shop it</p>
        <p><span className="text-cyan-300">Q</span> for QSV AI · <span className="text-cyan-300">C</span> for cart</p>
        <p><span className="text-cyan-300">ESC</span> to exit first-person mode</p>
        <p className="mt-2"><span className="text-violet-300">VR headset:</span> click Enter VR, left stick to move, right stick to turn</p>
      </div>
    </div>
  )
}

export default function QSVStreet() {
  const [isLoading, setIsLoading] = useState(true)
  const [isClient, setIsClient] = useState(false)
  const [showInstructions, setShowInstructions] = useState(true)
  const [activeProduct, setActiveProduct] = useState(null)
  const [cartOpen, setCartOpen] = useState(false)
  const [aiOpen, setAiOpen] = useState(false)
  const [nearProduct, setNearProduct] = useState(null) // product shopper is standing near
  const [isLocked, setIsLocked] = useState(false) // pointer-lock (walk mode) state
  const [toast, setToast] = useState('')
  const nearProductId = useRef(null)
  const toastTimer = useRef(null)
  const { count } = useCart()
  const router = useRouter()

  // Category verse mode (?verse=Footwear): beacons + AI-guided tour
  const verseParam = typeof router.query.verse === 'string' ? router.query.verse : null
  const verse = verseParam && getCategories().includes(verseParam) ? verseParam : null

  useEffect(() => {
    if (verse && !isLoading) {
      // Open the assistant with a guided tour of the chosen verse
      const timer = setTimeout(() => setAiOpen(true), 1200)
      return () => clearTimeout(timer)
    }
  }, [verse, isLoading])

  const showToast = (msg) => {
    setToast(msg)
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(''), 2500)
  }

  useEffect(() => {
    setIsClient(true)
    const timer = setTimeout(() => {
      setIsLoading(false)
      setTimeout(() => setShowInstructions(false), 8000)
    }, 3000)
    return () => clearTimeout(timer)
  }, [])

  // Track which product the shopper is standing near; open it with E or click.
  // Every path gives visible feedback — nothing fails silently.
  useEffect(() => {
    const openNearProduct = () => {
      const product = nearProductId.current && getProduct(nearProductId.current)
      if (product) {
        document.exitPointerLock?.()
        setActiveProduct(product)
        return true
      }
      return false
    }

    const onNearest = (e) => {
      const { id } = e.detail
      nearProductId.current = id
      setNearProduct(id ? getProduct(id) : null)
    }

    const onKey = (e) => {
      // Ignore keystrokes aimed at form fields (e.g. the AI chat input)
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (e.code === 'KeyE' && !openNearProduct()) {
        showToast('Walk closer to a product to inspect it')
      }
      // Q and C work even while the mouse is pointer-locked
      if (e.code === 'KeyQ') {
        document.exitPointerLock?.()
        setAiOpen(true)
      }
      if (e.code === 'KeyC') {
        document.exitPointerLock?.()
        setCartOpen(true)
      }
    }

    // Clicking while in walk mode also inspects the nearby product
    const onMouseDown = () => {
      if (document.pointerLockElement) openNearProduct()
    }

    const onLockChange = () => setIsLocked(!!document.pointerLockElement)

    window.addEventListener('qsv:nearest-product', onNearest)
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onMouseDown)
    document.addEventListener('pointerlockchange', onLockChange)
    return () => {
      window.removeEventListener('qsv:nearest-product', onNearest)
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onMouseDown)
      document.removeEventListener('pointerlockchange', onLockChange)
    }
  }, [])

  const openOverlay = (setter) => {
    document.exitPointerLock?.()
    setter(true)
  }
  
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

        {/* Verse banner */}
        {verse && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-10">
            <div className="bg-black/70 backdrop-blur-sm border border-violet-400/50 rounded-xl px-6 py-2 text-center">
              <p className="text-[10px] tracking-[0.3em] uppercase text-violet-300/70">Now exploring</p>
              <p className="text-white font-bold">{verse} Verse</p>
              <p className="text-cyan-300/60 text-xs">Follow the beacons — QSV AI has your tour ready</p>
            </div>
          </div>
        )}

        {/* Street Info */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-black/60 backdrop-blur-sm border border-cyan-400/30 rounded-lg px-6 py-3">
            <p className="text-cyan-300 text-sm text-center">
              QSV Street • Walk up to a product and press <span className="text-white font-semibold">E</span> to shop
            </p>
          </div>
        </div>

        {/* Walk-mode overlays: crosshair, ESC hint, product prompt, toast */}
        {isLocked && (
          <>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-1.5 h-1.5 rounded-full bg-cyan-300/90 shadow shadow-cyan-400" />
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-black/60 backdrop-blur-sm border border-cyan-400/20 rounded-lg px-4 py-1.5">
              <p className="text-cyan-300/80 text-xs">
                <span className="text-white font-semibold">Q</span> QSV AI · <span className="text-white font-semibold">C</span> cart · <span className="text-white font-semibold">E</span> inspect product · <span className="text-white font-semibold">ESC</span> free cursor
              </p>
            </div>
          </>
        )}
        {nearProduct && !activeProduct && (
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10 animate-pulse">
            <div className="bg-black/80 backdrop-blur-sm border border-cyan-400/60 rounded-xl px-6 py-3 text-center">
              <p className="text-white font-semibold">
                <span className="inline-block w-6 h-6 mr-2 text-center leading-6 bg-cyan-500/30 border border-cyan-300 rounded text-cyan-200 text-sm">E</span>
                View {nearProduct.name}
              </p>
              <p className="text-cyan-300/60 text-xs mt-0.5">or click</p>
            </div>
          </div>
        )}
        {toast && (
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10">
            <div className="bg-black/80 backdrop-blur-sm border border-yellow-400/50 rounded-lg px-5 py-2">
              <p className="text-yellow-200 text-sm">{toast}</p>
            </div>
          </div>
        )}

        {/* Shopping HUD: AI assistant (bottom-left) and cart (bottom-right) */}
        <div className="absolute bottom-4 left-4 z-10">
          <button
            onClick={() => openOverlay(setAiOpen)}
            className="flex items-center gap-2 px-4 py-3 bg-violet-500/20 backdrop-blur-sm border border-violet-400/40 text-violet-200 rounded-xl hover:bg-violet-500/35 transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
            <span className="font-semibold text-sm">QSV AI</span>
          </button>
        </div>
        <div className="absolute bottom-4 right-4 z-10">
          <button
            onClick={() => openOverlay(setCartOpen)}
            className="relative flex items-center gap-2 px-4 py-3 bg-cyan-500/20 backdrop-blur-sm border border-cyan-400/40 text-cyan-200 rounded-xl hover:bg-cyan-500/35 transition-colors"
          >
            <span className="font-semibold text-sm">🛒 Cart</span>
            {count > 0 && (
              <span className="absolute -top-2 -right-2 w-6 h-6 flex items-center justify-center text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-violet-500 rounded-full">
                {count}
              </span>
            )}
          </button>
        </div>

        {/* Shopping overlays */}
        <ProductModal product={activeProduct} onClose={() => setActiveProduct(null)} />
        <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
        <AssistantChat
          open={aiOpen}
          onClose={() => setAiOpen(false)}
          seedQuery={verse ? `compare ${verse.toLowerCase()}` : undefined}
        />

        <Canvas
          camera={{
            position: [0, 1.7, 18],
            fov: 75,
            near: 0.1,
            far: 100
          }}
          dpr={[1, 1.5]}
          style={{ background: 'linear-gradient(to bottom, #000011 0%, #0a0a2e 100%)' }}
        >
          <XR referenceSpace="local-floor">
            <Suspense fallback={null}>
              <StreetScene verse={verse} />
            </Suspense>
          </XR>
        </Canvas>
      </div>
    </>
  )
}