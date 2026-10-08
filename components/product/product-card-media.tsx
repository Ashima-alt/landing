"use client"

import { useState, type MouseEvent } from "react"
import Image from "next/image"
import type { Product } from "@/lib/types"
import { mediaUrl } from "@/lib/api"
import { cn } from "@/lib/utils"

interface ProductCardMediaProps {
  product: Product
  sizes: string
  className?: string
  showOverlay?: boolean
}

export function ProductCardMedia({
  product,
  sizes,
  className,
  showOverlay = false,
}: ProductCardMediaProps) {
  const images = product.images?.length
    ? product.images
    : []
  const [index, setIndex] = useState(0)

  const active = images[index] ?? images[0]
  const src = active ? mediaUrl(active.url) : "/placeholder.svg"

  const onMove = (event: MouseEvent<HTMLDivElement>) => {
    if (images.length < 2) return
    const rect = event.currentTarget.getBoundingClientRect()
    const x = Math.min(Math.max(event.clientX - rect.left, 0), rect.width)
    const next = Math.min(
      images.length - 1,
      Math.floor((x / rect.width) * images.length)
    )
    if (next !== index) setIndex(next)
  }

  return (
    <div
      className={cn("product-card-media relative aspect-square overflow-hidden bg-cream-dark", className)}
      onMouseMove={onMove}
      onMouseLeave={() => setIndex(0)}
    >
      <Image
        src={src}
        alt={product.title}
        fill
        className="object-contain object-center p-3 transition-opacity duration-200"
        sizes={sizes}
      />
      {showOverlay && (
        <div className="absolute inset-0 bg-sage-dark/0 group-hover:bg-sage-dark/20 transition-colors duration-500" />
      )}
      {images.length > 1 && (
        <div className="absolute bottom-3 left-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {images.map((img, i) => (
            <span
              key={img.id}
              className={cn(
                "h-0.5 flex-1 rounded-full transition-colors",
                i === index ? "bg-gold" : "bg-cream/50"
              )}
            />
          ))}
        </div>
      )}
    </div>
  )
}
