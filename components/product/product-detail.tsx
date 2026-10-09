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
    <div className="vm-product-detail vm-shell">
      <nav className="vm-product-breadcrumbs" aria-label="Путь к товару">
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
        className="vm-product-back vm-link flex items-center gap-2"
      >
        <ChevronLeft className="w-4 h-4" />
        Назад
      </button>

      <div className="vm-product-layout grid grid-cols-1 lg:grid-cols-2 items-start">
        <ProductGallery images={product.images || []} title={product.title} />

        <div className="lg:pt-6 opacity-0 animate-fade-in" style={{ animationDelay: "120ms", animationFillMode: "forwards" }}>
          {product.category && (
            <span className="vm-eyebrow">
              {product.category.name}
            </span>
          )}
          <h1 className="vm-product-title vm-heading mt-4 mb-4 text-balance">
            {product.title}
          </h1>
          <p className="vm-product-article vm-meta">
            Артикул: {product.article}
          </p>

          <dl className="vm-product-specs grid grid-cols-2">
            {product.size && (
              <div>
                <dt className="vm-eyebrow">
                  Размер
                </dt>
                <dd className="text-sage-dark text-sm leading-relaxed">{product.size}</dd>
              </div>
            )}
            {product.material && (
              <div>
                <dt className="vm-eyebrow">
                  Материал
                </dt>
                <dd className="text-sage-dark text-sm leading-relaxed">{product.material}</dd>
              </div>
            )}
          </dl>

          <div className="vm-product-rule w-12 h-px bg-gold" aria-hidden="true" />

          <div className="vm-body max-w-lg whitespace-pre-line">
            {product.description || "Описание скоро появится."}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="vm-related-products">
          <h2 className="vm-heading">
            Похожие товары
          </h2>
          <div className="vm-related-grid">
            {related.map((item, index) => (
              <Link
                key={item.id}
                href={`/product/${item.id}`}
                className="vm-product-card vm-product-card-link group opacity-0 animate-fade-in"
                aria-label={item.title}
                title={item.title}
                style={{ animationDelay: `${index * 100}ms`, animationFillMode: "forwards" }}
              >
                <ProductCardMedia
                  product={item}
                  className="isolate bg-white [&_img]:mix-blend-multiply"
                  sizes="(max-width: 767px) calc((100vw - 44px) / 2), (max-width: 1023px) 45vw, 33vw"
                />
                <div className="vm-card-copy">
                  <h3 className="vm-card-title group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="vm-meta vm-card-meta" title={`Арт. ${item.article}`}>
                    Арт. {item.article}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
