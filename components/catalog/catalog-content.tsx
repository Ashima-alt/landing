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
        <h3 className="vm-eyebrow mb-5">Категория</h3>
        <div className="space-y-1">
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
          <h3 className="vm-eyebrow mb-5">Материал</h3>
          <div className="space-y-1">
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
          <h3 className="vm-eyebrow mb-5">Размер</h3>
          <div className="space-y-1">
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
    <div className="vm-catalog vm-shell">
      <div className="vm-catalog-heading">
        <span className="vm-eyebrow">Коллекция Valore Milano</span>
        <h1 className="vm-page-heading mt-4">
          Каталог
        </h1>
      </div>

      <div className="vm-catalog-toolbar">
        <p className="vm-meta" aria-live="polite">
          {loading
            ? "Загрузка…"
            : `${products.length} ${products.length === 1 ? "товар" : "товаров"}`}
        </p>

        <button
          type="button"
          onClick={() => setIsFilterOpen(true)}
          className="lg:hidden vm-link flex items-center gap-2"
          aria-expanded={isFilterOpen}
          aria-controls="catalog-filters"
        >
          <Filter className="w-4 h-4" />
          Фильтры
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[200px_minmax(0,1fr)] gap-10 xl:gap-16">
        <aside className="hidden lg:block sticky top-28 self-start" aria-label="Фильтры каталога">{filterPanel}</aside>

        <div className="min-w-0">
          {error && (
            <div className="mb-8 text-sage text-sm" role="alert">
              Не удалось загрузить каталог. Попробуйте обновить страницу.
            </div>
          )}

          {loading ? (
            <div className="min-h-[40vh] flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : products.length === 0 ? (
            <div className="min-h-[40vh] flex flex-col items-center justify-center text-center">
              <p className="vm-card-title mb-3">Ничего не найдено</p>
              <p className="vm-body mb-6">
                Измените фильтры, чтобы посмотреть другие товары
              </p>
              <Link href="/catalog" className="vm-link">
                Сбросить
              </Link>
            </div>
          ) : (
            <div className="vm-catalog-grid">
              {products.map((product, index) => (
                <article
                  key={product.id}
                  className="vm-product-card group opacity-0 animate-fade-in"
                  style={{ animationDelay: `${Math.min(index, 8) * 80}ms`, animationFillMode: "forwards" }}
                >
                  <Link href={`/product/${product.id}`} className="vm-product-card-link block" aria-label={product.title} title={product.title}>
                    <ProductCardMedia
                      product={product}
                      className="isolate bg-white [&_img]:mix-blend-multiply"
                      sizes="(max-width: 767px) calc((100vw - 44px) / 2), (max-width: 1023px) 45vw, (max-width: 1279px) 35vw, 300px"
                    />
                    <div className="vm-card-copy">
                      <h3 className="vm-card-title group-hover:text-primary transition-colors">
                        {product.title}
                      </h3>
                      <p className="vm-meta vm-card-meta" title={`Арт. ${product.article}`}>
                        Арт. {product.article}
                      </p>
                      <p className="vm-meta vm-card-meta vm-card-details" title={[product.material, product.size].filter(Boolean).join(" · ")}>
                        {[product.material, product.size].filter(Boolean).join(" · ")}
                      </p>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>

      {isFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-sage-dark/40"
            onClick={() => setIsFilterOpen(false)}
            aria-label="Закрыть"
          />
          <div id="catalog-filters" role="dialog" aria-modal="true" aria-labelledby="catalog-filters-title" className="vm-filter-drawer absolute inset-y-0 right-0 w-[85%] max-w-sm bg-cream p-7 overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 id="catalog-filters-title" className="vm-card-title">Фильтры</h2>
              <button type="button" onClick={() => setIsFilterOpen(false)} aria-label="Закрыть фильтры" className="vm-filter-close text-sage hover:text-primary transition-colors">
                <X className="w-5 h-5 text-sage" />
              </button>
            </div>
            {filterPanel}
            <button
              type="button"
              onClick={() => setIsFilterOpen(false)}
              className="vm-button mt-10 w-full"
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
      aria-pressed={active}
      className={`vm-filter-option flex w-full items-center justify-between gap-3 py-2 text-left text-sm transition-colors ${
        active ? "text-sage-dark font-medium" : "text-sage hover:text-primary"
      }`}
    >
      <span>{label}</span>
      {active && <ChevronDown className="w-3.5 h-3.5 -rotate-90" />}
    </button>
  )
}
