"use client"

import { use } from "react"
import { notFound } from "next/navigation"
import { StoreProvider } from "@/lib/store-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductDetail } from "@/components/product/product-detail"
import { getProductById } from "@/lib/products"

interface ProductPageProps {
  params: Promise<{ id: string }>
}

export default function ProductPage({ params }: ProductPageProps) {
  const { id } = use(params)
  const product = getProductById(id)

  if (!product) {
    notFound()
  }

  return (
    <StoreProvider>
      <div className="min-h-screen bg-cream">
        <Header />
        <main className="pt-24 md:pt-32">
          <ProductDetail product={product} />
        </main>
        <Footer />
      </div>
    </StoreProvider>
  )
}
