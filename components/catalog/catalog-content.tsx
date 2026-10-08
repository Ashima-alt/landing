"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import type { CatalogFilters, Category, Product } from "@/lib/types"
import { getCategories, getFilters, getProducts } from "@/lib/api"
import { ProductCardMedia } from "@/components/product/product-card-media"
import { Filter, X, ChevronDown } from "lucide-react"

export function CatalogContent() {
  const searchParams = useSearchParams()
  const initialCategory = searchParams.get("category") || "all"

  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [filters, setFilters] = useState<CatalogFilters>({ materials: [], sizes: [] })
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [selectedMaterial, setSelectedMaterial] = useState("all")
  const [selectedSize, setSelectedSize] = useState("all")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => setCategories([]))
  }, [])

  useEffect(() => {
    const category = selectedCategory === "all" ? undefined : selectedCategory
    getFilters(category)
      .then(setFilters)
      .catch(() => setFilters({ materials: [], sizes: [] }))
  }, [selectedCategory])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    getProducts({
      category: selectedCategory === "all" ? undefined : selectedCategory,
      material: selectedMaterial === "all" ? undefined : selectedMaterial,
      size: selectedSize === "all" ? undefined : selectedSize,
    })
      .then((items) => {
        if (!cancelled) setProducts(items)
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setProducts([])
          setError(err.message || "Не удалось загрузить каталог")
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [selectedCategory, selectedMaterial, selectedSize])

  const filterPanel = (
    <div className="space-y-8">
      <div>
        <h3 className="text-xs tracking-widest uppercase text-sage-dark mb-4">Категория</h3>
        <div className="space-y-2">
          <FilterOption
            active={selectedCategory === "all"}
            label="Все"
            onClick={() => {
              setSelectedCategory("all")
              setSelectedMaterial("all")
              setSelectedSize("all")
            }}
          />
          {categories.map((category) => (
            <FilterOption
              key={category.id}
              active={selectedCategory === category.slug}
              label={category.name}
              onClick={() => {
                setSelectedCategory(category.slug)
                setSelectedMaterial("all")
                setSelectedSize("all")
              }}
            />
          ))}
        </div>
      </div>

      {filters.materials.length > 0 && (
        <div>
          <h3 className="text-xs tracking-widest uppercase text-sage-dark mb-4">Материал</h3>
          <div className="space-y-2">
            <FilterOption
              active={selectedMaterial === "all"}
              label="Все"
              onClick={() => setSelectedMaterial("all")}
            />
            {filters.materials.map((material) => (
              <FilterOption
                key={material}
                active={selectedMaterial === material}
                label={material}
                onClick={() => setSelectedMaterial(material)}
              />
            ))}
          </div>
        </div>
      )}

      {filters.sizes.length > 0 && (
        <div>
          <h3 className="text-xs tracking-widest uppercase text-sage-dark mb-4">Размер</h3>
          <div className="space-y-2">
            <FilterOption
              active={selectedSize === "all"}
              label="Все"
              onClick={() => setSelectedSize("all")}
            />
            {filters.sizes.map((size) => (
              <FilterOption
                key={size}
                active={selectedSize === size}
                label={size}
                onClick={() => setSelectedSize(size)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div className="container mx-auto px-6 lg:px-12 pb-24">
      <div className="text-center mb-12 md:mb-16">
        <span className="text-gold text-xs tracking-[0.4em] uppercase">Коллекция</span>
        <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl leading-tight text-sage-dark mt-4">
          Каталог
        </h1>
        <div className="w-16 h-px bg-brand-yellow mx-auto mt-6" />
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-8 border-b border-border/50">
        <p className="text-sage-light text-sm">
          {loading
            ? "Загрузка…"
            : `${products.length} ${products.length === 1 ? "товар" : "товаров"}`}
        </p>

        <button
          type="button"
          onClick={() => setIsFilterOpen(true)}
          className="md:hidden flex items-center gap-2 text-sage hover:text-gold text-sm tracking-wider uppercase transition-colors"
        >
          <Filter className="w-4 h-4" />
          Фильтры
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-10">
        <aside className="hidden lg:block sticky top-28 self-start">{filterPanel}</aside>

        <div>
          {error && (
            <div className="mb-8 border border-border bg-cream-dark/50 px-6 py-4 text-sage text-sm">
              {error}. Проверьте, что API запущен.
            </div>
          )}

          {loading ? (
            <div className="min-h-[40vh] flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
            </div>
          ) : products.length === 0 ? (
            <div className="min-h-[40vh] flex flex-col items-center justify-center text-center">
              <p className="font-serif text-2xl text-sage-dark mb-3">Ничего не найдено</p>
              <p className="text-sage-light text-sm mb-6">
                Измените фильтры или добавьте товары в админке
              </p>
              <Link href="/catalog" className="text-gold text-xs tracking-widest uppercase">
                Сбросить
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-12 md:gap-y-16">
              {products.map((product, index) => (
                <article
                  key={product.id}
                  className="group opacity-0 animate-fade-in"
                  style={{ animationDelay: `${Math.min(index, 8) * 80}ms`, animationFillMode: "forwards" }}
                >
                  <Link href={`/product/${product.id}`} className="block">
                    <ProductCardMedia
                      product={product}
                      className="isolate mb-6 bg-cream [&_img]:mix-blend-multiply"
                      sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    />
                    <h3 className="font-serif text-xl leading-snug text-sage-dark mb-2 group-hover:text-gold transition-colors">
                      {product.title}
                    </h3>
                    <p className="text-sage-light text-xs tracking-wider mb-2">
                      Арт. {product.article}
                    </p>
                    <p className="text-sage text-sm">
                      {[product.material, product.size].filter(Boolean).join(" · ")}
                    </p>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>

      {isFilterOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-sage-dark/40"
            onClick={() => setIsFilterOpen(false)}
            aria-label="Закрыть"
          />
          <div className="absolute inset-y-0 right-0 w-[85%] max-w-sm bg-cream p-6 overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-serif text-2xl text-sage-dark">Фильтры</h2>
              <button type="button" onClick={() => setIsFilterOpen(false)}>
                <X className="w-5 h-5 text-sage" />
              </button>
            </div>
            {filterPanel}
            <button
              type="button"
              onClick={() => setIsFilterOpen(false)}
              className="mt-10 w-full bg-sage-dark text-cream py-3 text-xs tracking-widest uppercase"
            >
              Показать
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function FilterOption({
  active,
  label,
  onClick,
}: {
  active: boolean
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center justify-between text-left text-sm transition-colors ${
        active ? "text-gold" : "text-sage hover:text-gold"
      }`}
    >
      <span>{label}</span>
      {active && <ChevronDown className="w-3.5 h-3.5 -rotate-90" />}
    </button>
  )
}
