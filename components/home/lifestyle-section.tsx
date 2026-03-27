"use client"

import Image from "next/image"
import Link from "next/link"

export function LifestyleSection() {
  return (
    <section className="py-24 md:py-32 bg-cream-dark">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Large Image */}
          <div className="lg:col-span-7 relative aspect-[4/5] lg:aspect-auto lg:h-[700px] group overflow-hidden">
            <Image
              src="/images/hero-tableware.jpg"
              alt="Elegant table setting"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-sage-dark/60 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8">
              <span className="text-gold text-xs tracking-[0.3em] uppercase">
                Новая коллекция
              </span>
              <h3 className="font-serif text-3xl md:text-4xl text-cream mt-3 mb-4">
                Oro Collection
              </h3>
              <Link
                href="/catalog"
                className="inline-block text-cream text-sm tracking-wider border-b border-gold pb-1 hover:text-gold transition-colors"
              >
                Подробнее
              </Link>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Top Image */}
            <div className="relative aspect-[4/3] group overflow-hidden">
              <Image
                src="/images/lifestyle-dining.jpg"
                alt="Fine dining atmosphere"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-sage-dark/60 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <h3 className="font-serif text-xl text-cream">
                  Искусство сервировки
                </h3>
              </div>
            </div>

            {/* Text Block */}
            <div className="flex-1 bg-sage-dark p-8 md:p-12 flex flex-col justify-center">
              <blockquote className="font-serif text-xl md:text-2xl text-cream/90 italic leading-relaxed mb-6">
                {'"'}Красота в деталях — философия, которая определяет каждое наше изделие{'"'}
              </blockquote>
              <p className="text-gold text-sm tracking-wider">
                — Giovanni Valore, Основатель
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
