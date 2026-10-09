"use client"

import { use, useEffect, useState } from "react"
import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductDetail } from "@/components/product/product-detail"
import { getProductById } from "@/lib/api"
import type { Product } from "@/lib/types"

interface ProductPageProps {
  params: Promise<{ id: string }>
}

export default function ProductPage({ params }: ProductPageProps) {
  const { id } = use(params)
  const [product, setProduct] = useState<Product | null | undefined>(undefined)

  useEffect(() => {
    let cancelled = false
    getProductById(id).then((item) => {
      if (!cancelled) setProduct(item)
    })
    return () => {
      cancelled = true
    }
  }, [id])

  if (product === undefined) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!product) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <main className="vm-page">
        <ProductDetail product={product as Product} />
      </main>
      <Footer />
    </div>
  )
}
