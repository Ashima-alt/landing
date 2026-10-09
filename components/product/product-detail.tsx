"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { Product } from "@/lib/types"
import { getProducts } from "@/lib/api"
import { ProductGallery } from "@/components/product/product-gallery"
import { ProductCardMedia } from "@/components/product/product-card-media"
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
    <div className="vm-shell pb-20 md:pb-28">
      <nav className="mb-6 md:mb-8" aria-label="Путь к товару">
        <ol className="vm-meta flex flex-wrap items-center gap-x-2 gap-y-1">
          <li>
            <Link href="/" className="hover:text-primary transition-colors">
              Главная
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/catalog" className="hover:text-primary transition-colors">
              Каталог
            </Link>
          </li>
          {product.category && (
            <>
              <li aria-hidden="true">/</li>
              <li>
                <Link
                  href={`/catalog?category=${product.category.slug}`}
                  className="hover:text-primary transition-colors"
                >
                  {product.category.name}
                </Link>
              </li>
            </>
          )}
          <li aria-hidden="true">/</li>
          <li className="text-sage-dark" aria-current="page">{product.title}</li>
        </ol>
      </nav>

      <button
        type="button"
        onClick={() => router.back()}
        className="vm-link flex items-center gap-2 mb-8 md:mb-10"
      >
        <ChevronLeft className="w-4 h-4" />
        Назад
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 xl:gap-24 items-start">
        <ProductGallery images={product.images || []} title={product.title} />

        <div className="lg:pt-6 opacity-0 animate-fade-in" style={{ animationDelay: "120ms", animationFillMode: "forwards" }}>
          {product.category && (
            <span className="vm-eyebrow">
              {product.category.name}
            </span>
          )}
          <h1 className="vm-heading mt-4 mb-4 text-balance">
            {product.title}
          </h1>
          <p className="vm-meta mb-9 md:mb-12">
            Артикул: {product.article}
          </p>

          <dl className="grid grid-cols-2 gap-x-6 gap-y-7 mb-10 md:mb-12">
            {product.size && (
              <div>
                <dt className="vm-eyebrow mb-3">
                  Размер
                </dt>
                <dd className="text-sage-dark text-sm leading-relaxed">{product.size}</dd>
              </div>
            )}
            {product.material && (
              <div>
                <dt className="vm-eyebrow mb-3">
                  Материал
                </dt>
                <dd className="text-sage-dark text-sm leading-relaxed">{product.material}</dd>
              </div>
            )}
          </dl>

          <div className="w-12 h-px bg-gold mb-8" aria-hidden="true" />

          <div className="vm-body max-w-lg whitespace-pre-line">
            {product.description || "Описание скоро появится."}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20 md:mt-28">
          <h2 className="vm-heading mb-8 md:mb-12">
            Похожие товары
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {related.map((item, index) => (
              <Link
                key={item.id}
                href={`/product/${item.id}`}
                className="group opacity-0 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms`, animationFillMode: "forwards" }}
              >
                <ProductCardMedia
                  product={item}
                  className="isolate mb-5 bg-white [&_img]:mix-blend-multiply"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <h3 className="vm-card-title mb-2 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="vm-meta">
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
