"use client"

import { useState, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { products, categories, formatPrice } from "@/lib/products"
import { useStore } from "@/lib/store-context"
import { ShoppingBag, Heart, Filter, X, ChevronDown } from "lucide-react"

type SortOption = "featured" | "price-asc" | "price-desc" | "name"

export function CatalogContent() {
  const searchParams = useSearchParams()
  const initialCategory = searchParams.get("category") || "all"
  
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500])
  const [sortBy, setSortBy] = useState<SortOption>("featured")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  
  const { addToCart, toggleSavedItem, isSaved } = useStore()

  const filteredProducts = useMemo(() => {
    let result = [...products]

    // Category filter
    if (selectedCategory !== "all") {
      result = result.filter((p) => p.category === selectedCategory)
    }

    // Price filter
    result = result.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    )

    // Sort
    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price)
        break
      case "price-desc":
        result.sort((a, b) => b.price - a.price)
        break
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
      default:
        // featured - keep original order
        break
    }

    return result
  }, [selectedCategory, priceRange, sortBy])

  return (
    <div className="container mx-auto px-6 lg:px-12 pb-24">
      {/* Page Header */}
      <div className="text-center mb-12 md:mb-16">
        <span className="text-gold text-xs tracking-[0.4em] uppercase">
          Коллекция
        </span>
        <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-sage-dark mt-4">
          Каталог
        </h1>
        <div className="w-16 h-px bg-gold mx-auto mt-6" />
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-8 border-b border-border">
        <p className="text-sage-light text-sm">
          {filteredProducts.length} {filteredProducts.length === 1 ? "товар" : "товаров"}
        </p>

        <div className="flex items-center gap-4">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setIsFilterOpen(true)}
            className="md:hidden flex items-center gap-2 text-sage hover:text-gold text-sm tracking-wider uppercase transition-colors"
          >
            <Filter className="w-4 h-4" />
            Фильтры
          </button>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="appearance-none bg-transparent border border-border px-4 py-2 pr-10 text-sm text-sage cursor-pointer hover:border-gold transition-colors focus:outline-none focus:border-gold"
            >
              <option value="featured">По умолчанию</option>
              <option value="price-asc">Цена: по возрастанию</option>
              <option value="price-desc">Цена: по убыванию</option>
              <option value="name">По названию</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sage pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="flex gap-12">
        {/* Desktop Filters Sidebar */}
        <aside className="hidden md:block w-64 flex-shrink-0">
          <FilterContent
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
          />
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-sage-light mb-4">Товары не найдены</p>
              <button
                onClick={() => {
                  setSelectedCategory("all")
                  setPriceRange([0, 500])
                }}
                className="text-gold text-sm tracking-wider uppercase hover:underline"
              >
                Сбросить фильтры
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product, index) => (
                <article
                  key={product.id}
                  className="group opacity-0 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms`, animationFillMode: "forwards" }}
                >
                  <Link href={`/product/${product.id}`} className="block">
                    <div className="relative aspect-square overflow-hidden bg-cream-dark mb-6">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      
                      {/* Out of stock badge */}
                      {!product.inStock && (
                        <div className="absolute top-4 left-4 bg-sage-dark/80 text-cream text-xs tracking-wider uppercase px-3 py-1">
                          Нет в наличии
                        </div>
                      )}

                      {/* Quick actions */}
                      <div className="absolute bottom-4 left-4 right-4 flex gap-2 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            if (product.inStock) addToCart(product)
                          }}
                          disabled={!product.inStock}
                          className="flex-1 bg-cream hover:bg-gold hover:text-sage-dark text-sage-dark py-3 text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ShoppingBag className="w-4 h-4" />
                          В корзину
                        </button>
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            toggleSavedItem(product)
                          }}
                          className={`p-3 transition-colors ${
                            isSaved(product.id)
                              ? "bg-gold text-sage-dark"
                              : "bg-cream hover:bg-gold hover:text-sage-dark text-sage-dark"
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${isSaved(product.id) ? "fill-current" : ""}`} />
                        </button>
                      </div>
                    </div>
                  </Link>

                  <div className="text-center">
                    <h3 className="font-serif text-lg text-sage-dark mb-2 group-hover:text-gold transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-sage text-sm tracking-wider">
                      {formatPrice(product.price)}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <div
        className={`fixed inset-0 z-50 md:hidden transition-all duration-300 ${
          isFilterOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-sage-dark/50"
          onClick={() => setIsFilterOpen(false)}
        />
        <div
          className={`absolute right-0 top-0 bottom-0 w-80 max-w-full bg-cream p-6 transition-transform duration-300 ${
            isFilterOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-serif text-xl text-sage-dark">Фильтры</h2>
            <button onClick={() => setIsFilterOpen(false)}>
              <X className="w-6 h-6 text-sage" />
            </button>
          </div>
          <FilterContent
            selectedCategory={selectedCategory}
            setSelectedCategory={(cat) => {
              setSelectedCategory(cat)
            }}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
          />
          <button
            onClick={() => setIsFilterOpen(false)}
            className="w-full mt-8 bg-gold hover:bg-gold-dark text-sage-dark py-3 text-sm tracking-widest uppercase transition-colors"
          >
            Применить
          </button>
        </div>
      </div>
    </div>
  )
}

interface FilterContentProps {
  selectedCategory: string
  setSelectedCategory: (category: string) => void
  priceRange: [number, number]
  setPriceRange: (range: [number, number]) => void
}

function FilterContent({
  selectedCategory,
  setSelectedCategory,
  priceRange,
  setPriceRange,
}: FilterContentProps) {
  return (
    <div className="space-y-8">
      {/* Categories */}
      <div>
        <h3 className="text-xs tracking-widest uppercase text-sage mb-4">
          Категория
        </h3>
        <div className="space-y-3">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`block text-sm transition-colors ${
              selectedCategory === "all"
                ? "text-gold"
                : "text-sage hover:text-gold"
            }`}
          >
            Все товары
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`block text-sm transition-colors ${
                selectedCategory === category.id
                  ? "text-gold"
                  : "text-sage hover:text-gold"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-xs tracking-widest uppercase text-sage mb-4">
          Цена
        </h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="text-xs text-sage-light mb-1 block">От</label>
              <input
                type="number"
                min={0}
                max={priceRange[1]}
                value={priceRange[0]}
                onChange={(e) =>
                  setPriceRange([Number(e.target.value), priceRange[1]])
                }
                className="w-full border border-border px-3 py-2 text-sm bg-transparent focus:outline-none focus:border-gold"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-sage-light mb-1 block">До</label>
              <input
                type="number"
                min={priceRange[0]}
                max={1000}
                value={priceRange[1]}
                onChange={(e) =>
                  setPriceRange([priceRange[0], Number(e.target.value)])
                }
                className="w-full border border-border px-3 py-2 text-sm bg-transparent focus:outline-none focus:border-gold"
              />
            </div>
          </div>
          <input
            type="range"
            min={0}
            max={500}
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
            className="w-full accent-gold"
          />
        </div>
      </div>

      {/* Reset */}
      <button
        onClick={() => {
          setSelectedCategory("all")
          setPriceRange([0, 500])
        }}
        className="text-sage-light text-xs tracking-wider uppercase hover:text-gold transition-colors"
      >
        Сбросить все
      </button>
    </div>
  )
}
