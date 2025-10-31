import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Suspense, useState, useEffect, useRef } from 'react'
import Head from 'next/head'
import * as THREE from 'three'

// Simple Q Portal
function QPortal() {
  const portalRef = useRef()
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    if (portalRef.current) {
      portalRef.current.rotation.z = time * 0.2
    }
  })
  
  return (
    <group position={[0, 0, 0]}>
      <mesh ref={portalRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2, 0.1, 16, 100]} />
        <meshBasicMaterial color="#44d7ff" />
      </mesh>
      
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.8]} />
        <meshBasicMaterial 
          color="#9b6cff" 
          transparent
          opacity={0.3}
        />
      </mesh>
      
      <mesh position={[0, 0, 0.1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
    </group>
  )
}

// Simple Product Component
function ShoppableProduct({ position, color, name, price, type, onAddToCart }) {
  const [hovered, setHovered] = useState(false)
  const productRef = useRef()
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    if (productRef.current) {
      productRef.current.position.y = position[1] + Math.sin(time * 2 + position[0]) * 0.1
      productRef.current.rotation.y = time * 0.3
    }
  })
  
  const handleClick = () => {
    if (onAddToCart) {
      onAddToCart({
        name,
        price,
        type,
        color
      })
    }
  }
  
  return (
    <group position={position}>
      <group ref={productRef}>
        {/* Product Shape */}
        <mesh
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onClick={handleClick}
        >
          {type === 'sneaker' && <boxGeometry args={[1.2, 0.6, 0.8]} />}
          {type === 'watch' && <cylinderGeometry args={[0.4, 0.4, 0.2, 32]} />}
          {type === 'headset' && <sphereGeometry args={[0.5]} />}
          
          <meshBasicMaterial 
            color={hovered ? "#ffffff" : color}
          />
        </mesh>
        
        {/* Product Glow */}
        {hovered && (
          <mesh>
            {type === 'sneaker' && <boxGeometry args={[1.4, 0.8, 1.0]} />}
            {type === 'watch' && <cylinderGeometry args={[0.5, 0.5, 0.3, 32]} />}
            {type === 'headset' && <sphereGeometry args={[0.6]} />}
            
            <meshBasicMaterial 
              color={color}
              transparent
              opacity={0.3}
            />
          </mesh>
        )}
      </group>
      
      {/* Product Info */}
      {hovered && (
        <group position={[0, 1.5, 0]}>
          <mesh>
            <planeGeometry args={[2, 1]} />
            <meshBasicMaterial 
              color="#000000"
              transparent
              opacity={0.8}
            />
          </mesh>
          <mesh position={[0, 0, 0.01]}>
            <planeGeometry args={[1.8, 0.3]} />
            <meshBasicMaterial color="#44d7ff" />
          </mesh>
        </group>
      )}
    </group>
  )
}

// Shopping Cart Component
function ShoppingCart({ items, onRemoveItem, onCheckout }) {
  const [isOpen, setIsOpen] = useState(false)
  const totalPrice = items.reduce((sum, item) => sum + item.price, 0)
  
  if (!isOpen && items.length === 0) return null
  
  return (
    <div className="fixed top-4 right-20 z-20 max-w-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gradient-to-r from-cyan-500 to-violet-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 mb-2"
      >
        🛒 Cart ({items.length}) - ${totalPrice}
      </button>
      
      {isOpen && (
        <div className="bg-black/80 backdrop-blur-sm border border-cyan-400/30 rounded-lg p-4 shadow-xl">
          <h3 className="text-cyan-300 font-semibold mb-3">Shopping Cart</h3>
          
          {items.length === 0 ? (
            <p className="text-gray-400 text-sm">Your cart is empty</p>
          ) : (
            <>
              {items.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-gray-600">
                  <div>
                    <p className="text-white text-sm font-medium">{item.name}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-300 font-semibold">${item.price}</span>
                    <button
                      onClick={() => onRemoveItem(index)}
                      className="text-red-400 hover:text-red-300 text-xs"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
              
              <div className="mt-4 pt-3 border-t border-gray-600">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-white font-semibold">Total:</span>
                  <span className="text-cyan-300 font-bold text-lg">${totalPrice}</span>
                </div>
                
                <button
                  onClick={onCheckout}
                  className="w-full bg-gradient-to-r from-green-500 to-cyan-500 text-white py-2 rounded-lg font-semibold hover:scale-105 transition-transform"
                >
                  Checkout
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

// Simple VR Scene
function VRScene({ onAddToCart }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#44d7ff" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#9b6cff" />
      
      <fog attach="fog" args={['#000011', 8, 20]} />
      
      <QPortal />
      
      <ShoppableProduct 
        position={[-3, 0, -2]} 
        color="#44d7ff" 
        name="Hyper-Sneaker"
        price={299}
        type="sneaker"
        onAddToCart={onAddToCart}
      />
      
      <ShoppableProduct 
        position={[3, 0, -2]} 
        color="#9b6cff" 
        name="Quantum Watch"
        price={899}
        type="watch"
        onAddToCart={onAddToCart}
      />
      
      <ShoppableProduct 
        position={[0, 0, -4]} 
        color="#00ff88" 
        name="Neural Headset"
        price={1299}
        type="headset"
        onAddToCart={onAddToCart}
      />
      
      <OrbitControls 
        enablePan={true} 
        enableZoom={true} 
        enableRotate={true}
        autoRotate={true}
        autoRotateSpeed={0.2}
      />
    </>
  )
}

export default function SimpleVRPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isClient, setIsClient] = useState(false)
  const [cartItems, setCartItems] = useState([])
  
  useEffect(() => {
    setIsClient(true)
    const timer = setTimeout(() => setIsLoading(false), 2000)
    return () => clearTimeout(timer)
  }, [])
  
  const addToCart = (product) => {
    setCartItems(prev => [...prev, product])
    console.log(`Added ${product.name} to cart - $${product.price}`)
  }
  
  const removeFromCart = (index) => {
    setCartItems(prev => prev.filter((_, i) => i !== index))
  }
  
  const handleCheckout = () => {
    console.log('Checkout:', cartItems)
    alert(`Checkout ${cartItems.length} items for $${cartItems.reduce((sum, item) => sum + item.price, 0)}`)
  }

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
        <title>QSV Shopping - Simple VR Experience</title>
      </Head>
      
      {isLoading && (
        <div className="fixed inset-0 bg-gradient-to-br from-[#040824] via-[#120538] to-[#01010f] flex items-center justify-center z-50">
          <div className="text-center">
            <div className="w-32 h-32 mx-auto mb-8 relative">
              <div className="absolute inset-0 border-4 border-cyan-400/30 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl font-bold text-cyan-300">Q</span>
              </div>
            </div>
            <p className="text-cyan-300 text-xl font-semibold">Loading QSV Shopping...</p>
          </div>
        </div>
      )}
      
      <div className="w-full h-screen bg-black">
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={() => window.location.href = '/'}
            className="px-4 py-2 bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 rounded-lg hover:bg-cyan-500/30 transition-colors"
          >
            Exit
          </button>
        </div>
        
        <ShoppingCart 
          items={cartItems}
          onRemoveItem={removeFromCart}
          onCheckout={handleCheckout}
        />
        
        <Canvas
          camera={{ position: [0, 3, 8], fov: 60 }}
          style={{ background: 'radial-gradient(circle at center, #0a0a2e 0%, #000000 100%)' }}
        >
          <Suspense fallback={null}>
            <VRScene onAddToCart={addToCart} />
          </Suspense>
        </Canvas>
        
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-black/60 backdrop-blur-sm border border-cyan-400/30 rounded-lg px-6 py-3">
            <p className="text-cyan-300 text-sm text-center">
              QSV Shopping Experience • Click products to add to cart
            </p>
          </div>
        </div>
      </div>
    </>
  )
}