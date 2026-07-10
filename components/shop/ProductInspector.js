import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stage, Environment } from '@react-three/drei'
import { DigitizedModel, ScanErrorBoundary } from '../products/ProductModel'
import { useCart } from '../cart/CartContext'
import { formatPrice, STORES } from '../../lib/products'

// Full-screen 360° inspector for digitized (scanned) products.
// This is the digitization moat made visible: a real product scan the
// shopper can spin, tilt, and zoom like they're holding it.
export default function ProductInspector({ product, onClose }) {
  const { addItem } = useCart()

  if (!product || !product.modelUrl) return null

  const store = STORES[product.store]

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between p-5">
        <div>
          <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-cyan-300 bg-cyan-500/15 border border-cyan-400/40 rounded-full px-3 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-pulse" />
            Digitized by QSV
          </span>
          <h2 className="text-2xl font-bold text-white mt-3">{product.name}</h2>
          <p className="text-sm" style={{ color: store.color }}>{store.name} · {product.category}</p>
        </div>
        <button
          onClick={onClose}
          aria-label="Close inspector"
          className="text-gray-400 hover:text-white text-3xl leading-none px-2"
        >
          ×
        </button>
      </div>

      {/* 360° stage */}
      <div className="flex-1 min-h-0">
        <Canvas camera={{ position: [0.6, 0.4, 0.9], fov: 45 }} dpr={[1, 2]}>
          <ScanErrorBoundary
            fallback={null}
          >
            <Suspense fallback={null}>
              <Stage adjustCamera={1.3} intensity={0.5} environment={null} shadows="contact">
                <DigitizedModel url={product.modelUrl} />
              </Stage>
              <Environment files="/hdr/street.hdr" />
            </Suspense>
          </ScanErrorBoundary>
          <OrbitControls
            makeDefault
            autoRotate
            autoRotateSpeed={1.2}
            enablePan={false}
            minDistance={0.3}
            maxDistance={3}
          />
        </Canvas>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between p-5 border-t border-cyan-400/20 bg-black/40">
        <div>
          <p className="text-xl font-bold text-white">{formatPrice(product.price)}</p>
          <p className="text-gray-500 text-xs">Drag to rotate · scroll to zoom</p>
        </div>
        <button
          onClick={() => {
            addItem(product.id)
            onClose()
          }}
          className="px-6 py-2.5 rounded-lg font-semibold text-sm text-white bg-gradient-to-r from-cyan-500 to-violet-500 hover:opacity-90 transition-opacity"
        >
          Add to cart · {formatPrice(product.price)}
        </button>
      </div>
    </div>
  )
}
