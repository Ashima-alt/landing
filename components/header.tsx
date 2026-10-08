"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

export function Header() {
  const pathname = usePathname()
  const isHome = pathname === "/"
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [pathname])

  // On catalog/product (cream pages) always use solid header — transparent + cream text disappears
  const solid = !isHome || isScrolled

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        solid
          ? "bg-cream/95 backdrop-blur-md shadow-sm py-4"
          : "bg-transparent py-6"
      )}
    >
      <nav className="container mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between">
          <Link href="/" className="group relative">
            <span
              className={cn(
                "font-serif text-lg sm:text-xl md:text-2xl tracking-[0.2em] md:tracking-[0.3em] uppercase transition-colors duration-300",
                solid ? "text-sage-dark" : "text-cream"
              )}
            >
              Valore Milano
            </span>
            <span className="absolute -bottom-1 left-0 w-0 h-px bg-brand-yellow transition-all duration-300 group-hover:w-full" />
          </Link>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-8 lg:gap-10">
              <Link
                href="/catalog"
                className={cn(
                  "text-xs tracking-widest uppercase transition-colors duration-300",
                  solid ? "text-sage hover:text-brand-blue" : "text-cream/90 hover:text-brand-yellow"
                )}
              >
                Каталог
              </Link>
              <Link
                href="/#about"
                className={cn(
                  "text-xs tracking-widest uppercase transition-colors duration-300",
                  solid ? "text-sage hover:text-brand-blue" : "text-cream/90 hover:text-brand-yellow"
                )}
              >
                О бренде
              </Link>
              <Link
                href="/#contact"
                className={cn(
                  "text-xs tracking-widest uppercase transition-colors duration-300",
                  solid ? "text-sage hover:text-brand-blue" : "text-cream/90 hover:text-brand-yellow"
                )}
              >
                Контакты
              </Link>
            </div>
            <button
              type="button"
              aria-label="Открыть меню"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              onClick={() => setIsMobileMenuOpen(true)}
              className={cn(
                "md:hidden -m-2 p-2 transition-colors duration-300",
                solid ? "text-sage" : "text-cream"
              )}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      <div
        id="mobile-menu"
        aria-hidden={!isMobileMenuOpen}
        inert={!isMobileMenuOpen}
        className={cn(
          "fixed inset-0 bg-brand-blue z-50 transition-all duration-500 md:hidden",
          isMobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
      >
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-16">
            <span className="font-serif text-lg sm:text-xl tracking-[0.2em] uppercase text-cream">
              Valore Milano
            </span>
            <button
              type="button"
              aria-label="Закрыть меню"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-cream -m-2 p-2"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <nav className="flex flex-col gap-8">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="font-serif text-3xl text-cream hover:text-brand-yellow transition-colors"
            >
              Главная
            </Link>
            <Link
              href="/catalog"
              onClick={() => setIsMobileMenuOpen(false)}
              className="font-serif text-3xl text-cream hover:text-brand-yellow transition-colors"
            >
              Каталог
            </Link>
            <Link
              href="/#about"
              onClick={() => setIsMobileMenuOpen(false)}
              className="font-serif text-3xl text-cream hover:text-brand-yellow transition-colors"
            >
              О бренде
            </Link>
            <Link
              href="/#contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="font-serif text-3xl text-cream hover:text-brand-yellow transition-colors"
            >
              Контакты
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
