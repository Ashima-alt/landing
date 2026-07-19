"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import type { Category } from "@/lib/types"
import { getCategories } from "@/lib/api"
import { ArrowUpRight } from "lucide-react"

const CATEGORY_IMAGES: Record<string, { image: string; description: string }> = {
  plates: {
    image: "/images/categories/plates.jpg",
    description: "Handcrafted dinner and serving plates",
  },
  cups: {
    image: "/images/categories/cups.jpg",
    description: "Elegant cups and saucers",
  },
  cutlery: {
    image: "/images/categories/cutlery.jpg",
    description: "Premium gold-plated flatware",
  },
  sets: {
    image: "/images/categories/sets.jpg",
    description: "Complete dinnerware collections",
  },
}

export function CategoriesSection() {
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => setCategories([]))
  }, [])

  return (
    <section id="categories" className="py-24 md:py-32 bg-cream">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center mb-16 md:mb-20">
          <span className="text-gold text-xs tracking-[0.4em] uppercase">Коллекции</span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-sage-dark mt-4 text-balance">
            Исследуйте категории
          </h2>
          <div className="w-16 h-px bg-gold mx-auto mt-8" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((category, index) => {
            const meta = CATEGORY_IMAGES[category.slug]
            return (
              <Link
                key={category.id}
                href={`/catalog?category=${category.slug}`}
                className="group relative aspect-[16/10] overflow-hidden opacity-0 animate-fade-in bg-cream-dark"
                style={{ animationDelay: `${index * 100}ms`, animationFillMode: "forwards" }}
              >
                {meta?.image && (
                  <Image
                    src={meta.image}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-sage-dark/80 via-sage-dark/20 to-transparent" />
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <div className="flex items-end justify-between">
                    <div>
                      <h3 className="font-serif text-2xl md:text-3xl text-cream mb-2">
                        {category.name}
                      </h3>
                      <p className="text-cream/70 text-sm">
                        {meta?.description || "Смотреть коллекцию"}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-full border border-gold/50 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-sage-dark transition-all duration-300">
                      <ArrowUpRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
