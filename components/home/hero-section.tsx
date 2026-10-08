"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

export function HeroSection() {
  return (
    <section id="top" className="relative h-[88svh] min-h-[560px] md:min-h-[640px] max-h-[960px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/images/hero-tableware.jpg"
          alt="Сервировка стола Valore Milano"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-sage-dark/50" />
      </div>

      <div className="relative z-10 container mx-auto px-6 lg:px-12 pt-24 pb-16 text-center">
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-cream leading-[1.15] tracking-[-0.02em] mb-6 text-balance">
          Красота
          <br />
          каждого дня
        </h1>
        <p className="text-cream/90 text-base md:text-lg max-w-md mx-auto mb-9 leading-relaxed text-balance">
          Посуда и аксессуары для кухни и сервировки.
        </p>
        <Link
          href="/catalog"
          className="group inline-flex items-center gap-3 bg-brand-blue hover:bg-brand-blue-dark text-cream px-7 py-4 text-xs tracking-widest uppercase transition-colors duration-300"
        >
          Смотреть каталог
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  )
}
