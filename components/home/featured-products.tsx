"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
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
    <section id="collection" className="py-24 md:py-32 bg-cream">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center mb-16 md:mb-20">
          <span className="text-gold text-xs tracking-[0.4em] uppercase">Коллекция</span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-sage-dark mt-4 text-balance">
            Для кухни и сервировки
          </h2>
          <div className="w-16 h-px bg-gold mx-auto mt-8" />
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
                    <div className="mt-6">
                      <span className="inline-flex items-center gap-2 text-sage group-hover:text-gold text-xs tracking-widest uppercase transition-colors">
                        Смотреть
                        <span className="w-8 h-px bg-current transition-all group-hover:w-12" />
                      </span>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}

        <div className="text-center mt-16">
          <Link
            href="/catalog"
            className="inline-flex items-center gap-3 border border-sage-dark/20 hover:border-gold px-8 py-4 text-xs tracking-widest uppercase text-sage-dark hover:text-gold transition-colors"
          >
            Весь каталог
          </Link>
        </div>
      </div>
    </section>
  )
}
