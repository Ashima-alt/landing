"use client"

import { Suspense } from "react"
import { StoreProvider } from "@/lib/store-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CatalogContent } from "@/components/catalog/catalog-content"

function CatalogLoading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

export default function CatalogPage() {
  return (
    <StoreProvider>
      <div className="min-h-screen bg-cream">
        <Header />
        <main className="pt-24 md:pt-32">
          <Suspense fallback={<CatalogLoading />}>
            <CatalogContent />
          </Suspense>
        </main>
        <Footer />
      </div>
    </StoreProvider>
  )
}
