"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

export function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <section id="top" className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-tableware.jpg"
          alt="Luxury Italian tableware"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-sage-dark/60 via-sage-dark/40 to-sage-dark/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 lg:px-12 text-center">
        <div
          className={`transition-all duration-1000 delay-300 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="inline-block text-gold text-xs tracking-[0.4em] uppercase mb-6">
            Итальянское мастерство
          </span>
        </div>

        <h1
          className={`font-serif text-4xl md:text-6xl lg:text-7xl text-cream leading-tight mb-8 text-balance transition-all duration-1000 delay-500 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          Timeless Tableware
          <br />
          <span className="text-gold">Elegance</span>
        </h1>

        <p
          className={`text-cream/80 text-lg md:text-xl max-w-xl mx-auto mb-12 leading-relaxed transition-all duration-1000 delay-700 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          Откройте для себя коллекцию премиальной посуды, созданной с безупречным вниманием к каждой детали
        </p>

        <div
          className={`transition-all duration-1000 delay-1000 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <Link
            href="#collection"
            className="group inline-flex items-center gap-3 bg-gold hover:bg-gold-dark text-sage-dark px-8 py-4 text-sm tracking-widest uppercase transition-all duration-300 gold-glow"
          >
            Смотреть коллекцию
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className={`absolute bottom-12 left-1/2 -translate-x-1/2 transition-all duration-1000 delay-[1200ms] ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="w-px h-16 bg-gradient-to-b from-transparent via-gold to-transparent animate-pulse" />
      </div>
    </section>
  )
}
