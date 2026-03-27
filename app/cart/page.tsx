"use client"

import { StoreProvider } from "@/lib/store-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CartContent } from "@/components/cart/cart-content"

export default function CartPage() {
  return (
    <StoreProvider>
      <div className="min-h-screen bg-cream">
        <Header />
        <main className="pt-24 md:pt-32">
          <CartContent />
        </main>
        <Footer />
      </div>
    </StoreProvider>
  )
}
