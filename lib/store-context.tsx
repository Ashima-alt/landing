"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

export interface Product {
  id: string
  name: string
  price: number
  image: string
  category: string
  description: string
  inStock: boolean
}

export interface CartItem extends Product {
  quantity: number
}

export interface SavedItem extends Product {
  savedAt: Date
}

interface Order {
  id: string
  items: CartItem[]
  total: number
  status: "processing" | "shipped" | "delivered"
  date: Date
}

interface StoreContextType {
  cart: CartItem[]
  savedItems: SavedItem[]
  orders: Order[]
  addToCart: (product: Product, quantity?: number) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  toggleSavedItem: (product: Product) => void
  isSaved: (productId: string) => boolean
  cartTotal: number
  cartCount: number
}

const StoreContext = createContext<StoreContextType | undefined>(undefined)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [savedItems, setSavedItems] = useState<SavedItem[]>([])
  const [orders] = useState<Order[]>([
    {
      id: "ORD-001",
      items: [
        {
          id: "1",
          name: "Piatto Elegante",
          price: 89,
          image: "/images/products/plate-elegante.jpg",
          category: "plates",
          description: "Premium porcelain dinner plate",
          inStock: true,
          quantity: 4,
        },
      ],
      total: 356,
      status: "delivered",
      date: new Date("2026-03-18"),
    },
    {
      id: "ORD-002",
      items: [
        {
          id: "2",
          name: "Tazza Milano",
          price: 65,
          image: "/images/products/cup-milano.jpg",
          category: "cups",
          description: "Elegant coffee cup with saucer",
          inStock: true,
          quantity: 6,
        },
      ],
      total: 390,
      status: "shipped",
      date: new Date("2026-03-18"),
    },
  ])

  const addToCart = useCallback((product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      return [...prev, { ...product, quantity }]
    })
  }, [])

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== productId))
  }, [])

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    )
  }, [removeFromCart])

  const clearCart = useCallback(() => {
    setCart([])
  }, [])

  const toggleSavedItem = useCallback((product: Product) => {
    setSavedItems((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      if (existing) {
        return prev.filter((item) => item.id !== product.id)
      }
      return [...prev, { ...product, savedAt: new Date() }]
    })
  }, [])

  const isSaved = useCallback(
    (productId: string) => savedItems.some((item) => item.id === productId),
    [savedItems]
  )

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <StoreContext.Provider
      value={{
        cart,
        savedItems,
        orders,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleSavedItem,
        isSaved,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const context = useContext(StoreContext)
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider")
  }
  return context
}
