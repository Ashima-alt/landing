"use client"

import { StoreProvider } from "@/lib/store-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CheckoutContent } from "@/components/checkout/checkout-content"

export default function CheckoutPage() {
  return (
    <StoreProvider>
      <div className="min-h-screen bg-cream">
        <Header />
        <main className="pt-24 md:pt-32">
          <CheckoutContent />
        </main>
        <Footer />
      </div>
    </StoreProvider>
  )
}
