"use client"

import Image from "next/image"

export function AboutSection() {
  return (
    <section id="about" className="py-24 md:py-32 bg-sage-dark overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Image */}
          <div className="relative order-2 lg:order-1">
            <div className="aspect-[4/5] relative">
              <Image
                src="/images/lifestyle-dining.jpg"
                alt="Luxury dining experience"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            {/* Decorative frame */}
            <div className="absolute -bottom-6 -right-6 w-full h-full border border-gold/30 -z-10" />
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2">
            <span className="text-gold text-xs tracking-[0.4em] uppercase">
              О бренде
            </span>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-cream mt-4 mb-8 leading-tight text-balance">
              Традиции итальянского мастерства
            </h2>
            <div className="w-16 h-px bg-gold mb-8" />
            <p className="text-cream/70 leading-relaxed mb-6">
              Valore Milano — это воплощение итальянской элегантности и безупречного качества. Каждое изделие создается мастерами, которые передают свое искусство из поколения в поколение.
            </p>
            <p className="text-cream/70 leading-relaxed mb-8">
              Мы верим, что красивая посуда способна превратить обычный прием пищи в незабываемый ритуал, создавая атмосферу роскоши и утонченности за вашим столом.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-cream/10">
              <div>
                <span className="font-serif text-3xl md:text-4xl text-gold">50+</span>
                <p className="text-cream/60 text-xs tracking-wider uppercase mt-2">
                  Лет опыта
                </p>
              </div>
              <div>
                <span className="font-serif text-3xl md:text-4xl text-gold">100%</span>
                <p className="text-cream/60 text-xs tracking-wider uppercase mt-2">
                  Ручная работа
                </p>
              </div>
              <div>
                <span className="font-serif text-3xl md:text-4xl text-gold">40+</span>
                <p className="text-cream/60 text-xs tracking-wider uppercase mt-2">
                  Стран мира
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
