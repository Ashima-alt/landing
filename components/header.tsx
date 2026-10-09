"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect, useRef } from "react"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

export function Header() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [pathname])

  useEffect(() => {
    if (!isMobileMenuOpen) return
    const previousFocus = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    const desktop = window.matchMedia("(min-width: 768px)")
    const onViewportChange = () => {
      if (desktop.matches) setIsMobileMenuOpen(false)
    }
    desktop.addEventListener("change", onViewportChange)
    document.body.style.overflow = "hidden"
    const focusable = () => Array.from(
      menuRef.current?.querySelectorAll<HTMLElement>('button, a[href]') ?? []
    )
    focusable()[0]?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMobileMenuOpen(false)
      if (event.key !== "Tab") return
      const items = focusable()
      const first = items[0]
      const last = items[items.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last?.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first?.focus()
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener("keydown", onKeyDown)
      desktop.removeEventListener("change", onViewportChange)
      previousFocus?.focus()
    }
  }, [isMobileMenuOpen])

  return (
    <header className="vm-site-header" data-scrolled={isScrolled}>
      <nav className="vm-shell" aria-label="Основная навигация">
        <div className="flex items-center justify-between">
          <Link href="/" className="vm-logo-link group relative">
            <span
              className="vm-header-logo font-serif md:text-2xl md:tracking-[0.3em] uppercase text-sage-dark"
            >
              Valore Milano
            </span>
            <span className="absolute -bottom-1 left-0 w-0 h-px bg-brand-gold transition-all duration-200 group-hover:w-full" aria-hidden="true" />
          </Link>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-8 lg:gap-10">
              <Link
                href="/catalog"
                className="vm-navigation-link"
                aria-current={pathname === "/catalog" ? "page" : undefined}
              >
                Каталог
              </Link>
              <Link
                href="/#about"
                className="vm-navigation-link"
              >
                О бренде
              </Link>
              <Link
                href="/#contact"
                className="vm-navigation-link"
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
              className="vm-menu-button md:hidden text-sage-dark"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      <div
        id="mobile-menu"
        ref={menuRef}
        role="dialog"
        aria-label="Меню сайта"
        aria-modal={isMobileMenuOpen ? true : undefined}
        aria-hidden={!isMobileMenuOpen}
        inert={!isMobileMenuOpen}
        className={cn(
          "vm-mobile-menu fixed inset-0 z-50 transition-opacity duration-200 md:hidden overflow-y-auto",
          isMobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
      >
        <div className="vm-shell py-6">
          <div className="flex items-center justify-between mb-8 sm:mb-12">
            <span className="vm-header-logo font-serif uppercase text-cream">
              Valore Milano
            </span>
            <button
              type="button"
              aria-label="Закрыть меню"
              onClick={() => setIsMobileMenuOpen(false)}
              className="vm-menu-button text-cream"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <nav className="flex flex-col gap-4 sm:gap-6" aria-label="Мобильная навигация">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="font-serif text-2xl sm:text-3xl min-h-11 py-1 text-cream transition-colors"
            >
              Главная
            </Link>
            <Link
              href="/catalog"
              onClick={() => setIsMobileMenuOpen(false)}
              className="font-serif text-2xl sm:text-3xl min-h-11 py-1 text-cream transition-colors"
            >
              Каталог
            </Link>
            <Link
              href="/#about"
              onClick={() => setIsMobileMenuOpen(false)}
              className="font-serif text-2xl sm:text-3xl min-h-11 py-1 text-cream transition-colors"
            >
              О бренде
            </Link>
            <Link
              href="/#contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="font-serif text-2xl sm:text-3xl min-h-11 py-1 text-cream transition-colors"
            >
              Контакты
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
