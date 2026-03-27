"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { Product } from "@/lib/store-context"
import { useStore } from "@/lib/store-context"
import { formatPrice, products, categories } from "@/lib/products"
import { Heart, Minus, Plus, ShoppingBag, ChevronLeft, Check } from "lucide-react"

interface ProductDetailProps {
  product: Product
}

export function ProductDetail({ product }: ProductDetailProps) {
  const router = useRouter()
  const [quantity, setQuantity] = useState(1)
  const [isAdded, setIsAdded] = useState(false)
  const { addToCart, toggleSavedItem, isSaved } = useStore()

  const category = categories.find((c) => c.id === product.category)
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3)

  const handleAddToCart = () => {
    addToCart(product, quantity)
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  return (
    <div className="container mx-auto px-6 lg:px-12 pb-24">
      {/* Breadcrumb */}
      <nav className="mb-12">
        <ol className="flex items-center gap-2 text-sm text-sage-light">
          <li>
            <Link href="/" className="hover:text-gold transition-colors">
              Главная
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link href="/catalog" className="hover:text-gold transition-colors">
              Каталог
            </Link>
          </li>
          {category && (
            <>
              <li>/</li>
              <li>
                <Link
                  href={`/catalog?category=${category.id}`}
                  className="hover:text-gold transition-colors"
                >
                  {category.name}
                </Link>
              </li>
            </>
          )}
          <li>/</li>
          <li className="text-sage-dark">{product.name}</li>
        </ol>
      </nav>

      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sage hover:text-gold text-sm tracking-wider uppercase mb-8 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Назад
      </button>

      {/* Product Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden bg-cream-dark">
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {!product.inStock && (
              <div className="absolute top-6 left-6 bg-sage-dark/80 text-cream text-xs tracking-wider uppercase px-4 py-2">
                Нет в наличии
              </div>
            )}
          </div>
          {/* Thumbnail grid placeholder */}
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className={`relative aspect-square overflow-hidden bg-cream-dark cursor-pointer transition-all ${
                  i === 0 ? "ring-1 ring-gold" : "opacity-60 hover:opacity-100"
                }`}
              >
                <Image
                  src={product.image}
                  alt={`${product.name} view ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="100px"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="lg:py-8">
          {category && (
            <span className="text-gold text-xs tracking-[0.3em] uppercase">
              {category.name}
            </span>
          )}
          <h1 className="font-serif text-3xl md:text-4xl text-sage-dark mt-2 mb-4">
            {product.name}
          </h1>
          <p className="text-2xl text-sage mb-8">{formatPrice(product.price)}</p>

          <div className="w-16 h-px bg-gold mb-8" />

          <p className="text-sage leading-relaxed mb-10">
            {product.description}
          </p>

          {/* Quantity & Add to Cart */}
          <div className="space-y-6">
            {/* Quantity Selector */}
            <div>
              <label className="text-xs tracking-widest uppercase text-sage-light mb-3 block">
                Количество
              </label>
              <div className="inline-flex items-center border border-border">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 text-sage hover:text-gold transition-colors"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center text-sage-dark">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 text-sage hover:text-gold transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`flex-1 py-4 text-sm tracking-widest uppercase flex items-center justify-center gap-3 transition-all ${
                  isAdded
                    ? "bg-sage-dark text-cream"
                    : product.inStock
                    ? "bg-gold hover:bg-gold-dark text-sage-dark gold-glow"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-5 h-5" />
                    Добавлено
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" />
                    {product.inStock ? "Добавить в корзину" : "Нет в наличии"}
                  </>
                )}
              </button>
              <button
                onClick={() => toggleSavedItem(product)}
                className={`w-14 h-14 border flex items-center justify-center transition-colors ${
                  isSaved(product.id)
                    ? "bg-gold border-gold text-sage-dark"
                    : "border-border text-sage hover:border-gold hover:text-gold"
                }`}
              >
                <Heart className={`w-5 h-5 ${isSaved(product.id) ? "fill-current" : ""}`} />
              </button>
            </div>
          </div>

          {/* Details Accordion */}
          <div className="mt-12 pt-8 border-t border-border space-y-6">
            <details className="group">
              <summary className="flex items-center justify-between cursor-pointer text-sm tracking-widest uppercase text-sage hover:text-gold transition-colors">
                Характеристики
                <Plus className="w-4 h-4 group-open:hidden" />
                <Minus className="w-4 h-4 hidden group-open:block" />
              </summary>
              <div className="mt-4 text-sage-light text-sm leading-relaxed">
                <ul className="space-y-2">
                  <li>Материал: премиальный фарфор</li>
                  <li>Страна производства: Италия</li>
                  <li>Можно мыть в посудомоечной машине</li>
                  <li>Подходит для микроволновой печи</li>
                </ul>
              </div>
            </details>
            <details className="group">
              <summary className="flex items-center justify-between cursor-pointer text-sm tracking-widest uppercase text-sage hover:text-gold transition-colors">
                Доставка
                <Plus className="w-4 h-4 group-open:hidden" />
                <Minus className="w-4 h-4 hidden group-open:block" />
              </summary>
              <div className="mt-4 text-sage-light text-sm leading-relaxed">
                <p>Бесплатная доставка при заказе от 15 000 ₽</p>
                <p className="mt-2">Срок доставки: 3-7 рабочих дней</p>
              </div>
            </details>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-24 pt-16 border-t border-border">
          <h2 className="font-serif text-2xl md:text-3xl text-sage-dark text-center mb-12">
            Похожие товары
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedProducts.map((relatedProduct) => (
              <Link
                key={relatedProduct.id}
                href={`/product/${relatedProduct.id}`}
                className="group"
              >
                <div className="relative aspect-square overflow-hidden bg-cream-dark mb-6">
                  <Image
                    src={relatedProduct.image}
                    alt={relatedProduct.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <h3 className="font-serif text-lg text-sage-dark mb-2 group-hover:text-gold transition-colors text-center">
                  {relatedProduct.name}
                </h3>
                <p className="text-sage text-sm tracking-wider text-center">
                  {formatPrice(relatedProduct.price)}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
