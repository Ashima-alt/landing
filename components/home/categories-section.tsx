"use client"

import Link from "next/link"
import Image from "next/image"
import { categories } from "@/lib/products"
import { ArrowUpRight } from "lucide-react"

export function CategoriesSection() {
  return (
    <section id="categories" className="py-24 md:py-32 bg-cream">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-16 md:mb-20">
          <span className="text-gold text-xs tracking-[0.4em] uppercase">
            Коллекции
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-sage-dark mt-4 text-balance">
            Исследуйте категории
          </h2>
          <div className="w-16 h-px bg-gold mx-auto mt-8" />
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              href="#contact"
              className="group relative aspect-[16/10] overflow-hidden opacity-0 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms`, animationFillMode: "forwards" }}
            >
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-sage-dark/80 via-sage-dark/20 to-transparent" />
              
              {/* Content */}
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <div className="flex items-end justify-between">
                  <div>
                    <h3 className="font-serif text-2xl md:text-3xl text-cream mb-2">
                      {category.name}
                    </h3>
                    <p className="text-cream/70 text-sm">
                      {category.description}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full border border-gold/50 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-sage-dark transition-all duration-300">
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
