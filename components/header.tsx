"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled
          ? "bg-cream/95 backdrop-blur-md shadow-sm py-4"
          : "bg-transparent py-6"
      )}
    >
      <nav className="container mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="group relative"
          >
            <span
              className={cn(
                "font-serif text-xl md:text-2xl tracking-[0.3em] uppercase transition-colors duration-300",
                isScrolled ? "text-sage-dark" : "text-cream"
              )}
            >
              Valore Milano
            </span>
            <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold transition-all duration-300 group-hover:w-full" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-12">
            <Link
              href="#collection"
              className={cn(
                "text-sm tracking-widest uppercase transition-colors duration-300 hover:text-gold",
                isScrolled ? "text-sage" : "text-cream/90"
              )}
            >
              Коллекция
            </Link>
            <Link
              href="#about"
              className={cn(
                "text-sm tracking-widest uppercase transition-colors duration-300 hover:text-gold",
                isScrolled ? "text-sage" : "text-cream/90"
              )}
            >
              О бренде
            </Link>
            <Link
              href="#categories"
              className={cn(
                "text-sm tracking-widest uppercase transition-colors duration-300 hover:text-gold",
                isScrolled ? "text-sage" : "text-cream/90"
              )}
            >
              Категории
            </Link>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-6">
            <Link
              href="#contact"
              className={cn(
                "hidden md:inline-flex items-center justify-center bg-gold hover:bg-gold-dark text-sage-dark px-6 py-3 text-xs tracking-widest uppercase transition-colors",
                isScrolled ? "shadow-sm" : "gold-glow"
              )}
            >
              Связаться
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className={cn(
                "md:hidden transition-colors duration-300",
                isScrolled ? "text-sage" : "text-cream"
              )}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={cn(
          "fixed inset-0 bg-sage-dark z-50 transition-all duration-500 md:hidden",
          isMobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
      >
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-16">
            <span className="font-serif text-xl tracking-[0.3em] uppercase text-cream">
              Valore Milano
            </span>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-cream"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <nav className="flex flex-col gap-8">
            <Link
              href="#top"
              onClick={() => setIsMobileMenuOpen(false)}
              className="font-serif text-3xl text-cream hover:text-gold transition-colors"
            >
              Главная
            </Link>
            <Link
              href="#collection"
              onClick={() => setIsMobileMenuOpen(false)}
              className="font-serif text-3xl text-cream hover:text-gold transition-colors"
            >
              Коллекция
            </Link>
            <Link
              href="#about"
              onClick={() => setIsMobileMenuOpen(false)}
              className="font-serif text-3xl text-cream hover:text-gold transition-colors"
            >
              О бренде
            </Link>
            <Link
              href="#contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="font-serif text-3xl text-cream hover:text-gold transition-colors"
            >
              Контакты
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
