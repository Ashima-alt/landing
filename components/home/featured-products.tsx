"use client"

import Link from "next/link"
import Image from "next/image"
import { products, formatPrice } from "@/lib/products"

export function FeaturedProducts() {
  const featured = products.slice(0, 4)

  return (
    <section id="collection" className="py-24 md:py-32 bg-cream">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-16 md:mb-20">
          <span className="text-gold text-xs tracking-[0.4em] uppercase">
            Коллекция
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-sage-dark mt-4 text-balance">
            Популярные изделия
          </h2>
          <div className="w-16 h-px bg-gold mx-auto mt-8" />
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6">
          {featured.map((product, index) => (
            <article
              key={product.id}
              className="group opacity-0 animate-fade-in"
              style={{ animationDelay: `${index * 150}ms`, animationFillMode: "forwards" }}
            >
              <div className="relative aspect-square overflow-hidden bg-cream-dark mb-6 image-zoom">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-sage-dark/0 group-hover:bg-sage-dark/20 transition-colors duration-500" />
              </div>

              <div className="text-center">
                <h3 className="font-serif text-lg text-sage-dark mb-2 group-hover:text-gold transition-colors">
                  {product.name}
                </h3>
                <p className="text-sage text-sm tracking-wider">
                  {formatPrice(product.price)}
                </p>
                <div className="mt-6">
                  <Link
                    href="#contact"
                    className="inline-flex items-center gap-2 text-sage hover:text-gold text-xs tracking-widest uppercase transition-colors group"
                  >
                    Узнать подробности
                    <span className="w-8 h-px bg-current transition-all group-hover:w-12" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* View All */}
        <div className="text-center mt-16">
          <Link
            href="#categories"
            className="inline-flex items-center gap-2 text-sage hover:text-gold text-sm tracking-widest uppercase transition-colors group"
          >
            Смотреть категории
            <span className="w-8 h-px bg-current transition-all group-hover:w-12" />
          </Link>
        </div>
      </div>
    </section>
  )
}
