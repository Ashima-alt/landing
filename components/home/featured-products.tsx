"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import type { Product } from "@/lib/types"
import { getProducts } from "@/lib/api"
import { ProductCardMedia } from "@/components/product/product-card-media"

export function FeaturedProducts() {
  const [featured, setFeatured] = useState<Product[]>([])

  useEffect(() => {
    getProducts()
      .then((items) => setFeatured(items.slice(0, 4)))
      .catch(() => setFeatured([]))
  }, [])

  return (
    <section id="collection" className="vm-section bg-cream">
      <div className="vm-shell">
        <div className="vm-section-heading">
          <h2 className="vm-heading max-w-xl">
            Для кухни и сервировки
          </h2>
          <Link href="/catalog" className="vm-link shrink-0">
            Весь каталог
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>

        {featured.length === 0 ? (
          <div className="text-sage-light text-sm">
            Коллекция скоро появится.
          </div>
        ) : (
          <div className="vm-featured-grid">
            {featured.map((product, index) => (
              <article
                key={product.id}
                className="vm-product-card group opacity-0 animate-fade-in"
                style={{ animationDelay: `${index * 80}ms`, animationFillMode: "forwards" }}
              >
                <Link href={`/product/${product.id}`} className="block">
                  <ProductCardMedia
                    product={product}
                    className="isolate bg-cream [&_img]:mix-blend-multiply"
                    sizes="(max-width: 479px) 100vw, (max-width: 1023px) 50vw, 25vw"
                  />
                  <div>
                    <h3 className="vm-card-title mb-2">
                      {product.title}
                    </h3>
                    <p className="vm-meta">Арт. {product.article}</p>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}

      </div>
    </section>
  )
}
