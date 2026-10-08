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
    <section id="collection" className="py-20 md:py-24 bg-cream">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-sage-dark text-balance">
            Для кухни и сервировки
          </h2>
        </div>

        {featured.length === 0 ? (
          <div className="text-center text-sage-light text-sm">
            Добавьте товары в{" "}
            <a href="/admin/" className="text-gold hover:underline">
              админ-панели
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6">
            {featured.map((product, index) => (
              <article
                key={product.id}
                className="group opacity-0 animate-fade-in"
                style={{ animationDelay: `${index * 150}ms`, animationFillMode: "forwards" }}
              >
                <Link href={`/product/${product.id}`} className="block">
                  <ProductCardMedia
                    product={product}
                    className="isolate mb-6 bg-cream [&_img]:mix-blend-multiply"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="text-center">
                    <h3 className="font-serif text-lg text-sage-dark mb-2 group-hover:text-gold transition-colors">
                      {product.title}
                    </h3>
                    <p className="text-sage text-sm tracking-wider">Арт. {product.article}</p>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}

        <div className="text-center mt-12 md:mt-14">
          <Link
            href="/catalog"
            className="group inline-flex items-center gap-3 py-3 text-xs tracking-widest uppercase text-sage-dark hover:text-gold transition-colors"
          >
            Весь каталог
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  )
}
