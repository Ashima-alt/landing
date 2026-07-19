"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { Product } from "@/lib/types"
import { getProducts, productCover } from "@/lib/api"
import { ProductGallery } from "@/components/product/product-gallery"
import { ChevronLeft } from "lucide-react"

interface ProductDetailProps {
  product: Product
}

export function ProductDetail({ product }: ProductDetailProps) {
  const router = useRouter()
  const [related, setRelated] = useState<Product[]>([])

  useEffect(() => {
    let cancelled = false
    const slug = product.category?.slug
    if (!slug) return

    getProducts({ category: slug })
      .then((items) => {
        if (cancelled) return
        setRelated(items.filter((p) => p.id !== product.id).slice(0, 3))
      })
      .catch(() => {
        if (!cancelled) setRelated([])
      })

    return () => {
      cancelled = true
    }
  }, [product.id, product.category?.slug])

  return (
    <div className="container mx-auto px-6 lg:px-12 pb-24">
      <nav className="mb-12">
        <ol className="flex flex-wrap items-center gap-2 text-sm text-sage-light">
          <li>
            <Link href="/" className="hover:text-gold transition-colors">
              Главная
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link href="/catalog" className="hover:text-gold transition-colors">
              Каталог
            </Link>
          </li>
          {product.category && (
            <>
              <li>/</li>
              <li>
                <Link
                  href={`/catalog?category=${product.category.slug}`}
                  className="hover:text-gold transition-colors"
                >
                  {product.category.name}
                </Link>
              </li>
            </>
          )}
          <li>/</li>
          <li className="text-sage-dark">{product.title}</li>
        </ol>
      </nav>

      <button
        type="button"
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sage hover:text-gold text-sm tracking-wider uppercase mb-8 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Назад
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        <ProductGallery images={product.images || []} title={product.title} />

        <div className="lg:py-8 opacity-0 animate-fade-in" style={{ animationDelay: "120ms", animationFillMode: "forwards" }}>
          {product.category && (
            <span className="text-gold text-xs tracking-[0.3em] uppercase">
              {product.category.name}
            </span>
          )}
          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-sage-dark mt-2 mb-3 text-balance">
            {product.title}
          </h1>
          <p className="text-sage-light text-sm tracking-wide mb-8">
            Артикул: {product.article}
          </p>

          <div className="flex flex-wrap gap-3 mb-10">
            {product.size && (
              <div className="border border-border px-4 py-3 min-w-[140px]">
                <p className="text-[10px] tracking-[0.2em] uppercase text-sage-light mb-1">
                  Размер
                </p>
                <p className="text-sage-dark text-sm">{product.size}</p>
              </div>
            )}
            {product.material && (
              <div className="border border-border px-4 py-3 min-w-[140px]">
                <p className="text-[10px] tracking-[0.2em] uppercase text-sage-light mb-1">
                  Материал
                </p>
                <p className="text-sage-dark text-sm">{product.material}</p>
              </div>
            )}
          </div>

          <div className="w-16 h-px bg-gold mb-8" />

          <div className="text-sage leading-relaxed whitespace-pre-line">
            {product.description || "Описание скоро появится."}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-24 pt-16 border-t border-border">
          <h2 className="font-serif text-2xl md:text-3xl text-sage-dark text-center mb-12">
            Похожие товары
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {related.map((item, index) => (
              <Link
                key={item.id}
                href={`/product/${item.id}`}
                className="group opacity-0 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms`, animationFillMode: "forwards" }}
              >
                <div className="relative aspect-square overflow-hidden bg-cream-dark mb-6">
                  <Image
                    src={productCover(item)}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <h3 className="font-serif text-lg text-sage-dark mb-1 group-hover:text-gold transition-colors text-center">
                  {item.title}
                </h3>
                <p className="text-sage-light text-xs tracking-wider text-center">
                  Арт. {item.article}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
