import { createContext, useContext, useEffect, useReducer, useState } from 'react'
import { getProduct } from '../../lib/products'

const CartContext = createContext(null)

const STORAGE_KEY = 'qsv-cart-v1'

function cartReducer(items, action) {
  switch (action.type) {
    case 'hydrate':
      return action.items
    case 'add': {
      const existing = items.find((i) => i.id === action.id)
      if (existing) {
        return items.map((i) => (i.id === action.id ? { ...i, qty: i.qty + 1 } : i))
      }
      return [...items, { id: action.id, qty: 1 }]
    }
    case 'remove':
      return items.filter((i) => i.id !== action.id)
    case 'setQty': {
      if (action.qty <= 0) return items.filter((i) => i.id !== action.id)
      return items.map((i) => (i.id === action.id ? { ...i, qty: action.qty } : i))
    }
    case 'clear':
      return []
    default:
      return items
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, [])
  const [hydrated, setHydrated] = useState(false)

  // Hydrate from localStorage on the client only (avoids SSR mismatch)
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
      if (Array.isArray(saved)) {
        dispatch({ type: 'hydrate', items: saved.filter((i) => getProduct(i.id)) })
      }
    } catch (e) {
      /* corrupted cart — start fresh */
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    }
  }, [items, hydrated])

  const detailed = items
    .map((i) => ({ ...i, product: getProduct(i.id) }))
    .filter((i) => i.product)

  const value = {
    items: detailed,
    count: detailed.reduce((sum, i) => sum + i.qty, 0),
    total: detailed.reduce((sum, i) => sum + i.qty * i.product.price, 0),
    addItem: (id) => dispatch({ type: 'add', id }),
    removeItem: (id) => dispatch({ type: 'remove', id }),
    setQty: (id, qty) => dispatch({ type: 'setQty', id, qty }),
    clearCart: () => dispatch({ type: 'clear' })
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
