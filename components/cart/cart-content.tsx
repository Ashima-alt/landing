"use client"

import Image from "next/image"
import Link from "next/link"
import { useStore } from "@/lib/store-context"
import { formatPrice } from "@/lib/products"
import { Minus, Plus, X, ShoppingBag, ArrowRight } from "lucide-react"

export function CartContent() {
  const { cart, cartTotal, updateQuantity, removeFromCart } = useStore()

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-6 lg:px-12 pb-24">
        <div className="max-w-lg mx-auto text-center py-20">
          <div className="w-20 h-20 rounded-full bg-cream-dark flex items-center justify-center mx-auto mb-8">
            <ShoppingBag className="w-8 h-8 text-sage-light" />
          </div>
          <h1 className="font-serif text-2xl md:text-3xl text-sage-dark mb-4">
            Корзина пуста
          </h1>
          <p className="text-sage-light mb-8">
            Добавьте товары из нашего каталога, чтобы начать покупки
          </p>
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 bg-gold hover:bg-gold-dark text-cream px-8 py-4 text-sm tracking-widest uppercase transition-colors"
          >
            Перейти в каталог
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-6 lg:px-12 pb-24">
      {/* Page Header */}
      <div className="text-center mb-12 md:mb-16">
        <span className="text-gold text-xs tracking-[0.4em] uppercase">
          Покупки
        </span>
        <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-sage-dark mt-4">
          Корзина
        </h1>
        <div className="w-16 h-px bg-gold mx-auto mt-6" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="border-b border-border pb-4 mb-6 hidden md:grid grid-cols-12 gap-4 text-xs tracking-widest uppercase text-sage-light">
            <div className="col-span-6">Товар</div>
            <div className="col-span-2 text-center">Количество</div>
            <div className="col-span-2 text-center">Цена</div>
            <div className="col-span-2 text-right">Итого</div>
          </div>

          <div className="space-y-6">
            {cart.map((item) => (
              <div
                key={item.id}
                className="border-b border-border pb-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-center"
              >
                {/* Product Info */}
                <div className="md:col-span-6 flex gap-6">
                  <Link href={`/product/${item.id}`} className="flex-shrink-0">
                    <div className="relative w-24 h-24 overflow-hidden bg-cream-dark">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </div>
                  </Link>
                  <div className="flex flex-col justify-center">
                    <Link
                      href={`/product/${item.id}`}
                      className="font-serif text-lg text-sage-dark hover:text-gold transition-colors"
                    >
                      {item.name}
                    </Link>
                    <p className="text-sage-light text-sm mt-1">
                      {formatPrice(item.price)}
                    </p>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="mt-2 flex items-center gap-1 text-sage-light hover:text-destructive text-xs tracking-wider uppercase transition-colors md:hidden"
                    >
                      <X className="w-3 h-3" />
                      Удалить
                    </button>
                  </div>
                </div>

                {/* Quantity */}
                <div className="md:col-span-2 flex justify-center">
                  <div className="inline-flex items-center border border-border">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-2 text-sage hover:text-gold transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center text-sm text-sage-dark">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-2 text-sage hover:text-gold transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Price */}
                <div className="md:col-span-2 text-center text-sage hidden md:block">
                  {formatPrice(item.price)}
                </div>

                {/* Total */}
                <div className="md:col-span-2 flex items-center justify-between md:justify-end gap-4">
                  <span className="md:hidden text-xs text-sage-light uppercase tracking-wider">
                    Итого:
                  </span>
                  <span className="text-sage-dark font-medium">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="hidden md:flex text-sage-light hover:text-destructive transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 text-sage hover:text-gold text-sm tracking-widest uppercase mt-8 transition-colors"
          >
            Продолжить покупки
          </Link>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-cream-dark p-8">
            <h2 className="font-serif text-xl text-sage-dark mb-6">
              Итого заказа
            </h2>
            
            <div className="space-y-4 pb-6 border-b border-border">
              <div className="flex justify-between text-sm">
                <span className="text-sage-light">Подытог</span>
                <span className="text-sage-dark">{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-sage-light">Доставка</span>
                <span className="text-sage-dark">
                  {cartTotal >= 15000 ? "Бесплатно" : formatPrice(1500)}
                </span>
              </div>
            </div>

            <div className="flex justify-between py-6 border-b border-border">
              <span className="text-sage-dark font-medium">Итого</span>
              <span className="font-serif text-xl text-sage-dark">
                {formatPrice(cartTotal >= 15000 ? cartTotal : cartTotal + 1500)}
              </span>
            </div>

            {cartTotal < 15000 && (
              <p className="text-xs text-sage-light mt-4">
                До бесплатной доставки осталось{" "}
                <span className="text-gold">{formatPrice(15000 - cartTotal)}</span>
              </p>
            )}

            <Link
              href="/checkout"
              className="w-full mt-6 bg-gold hover:bg-gold-dark text-cream py-4 text-sm tracking-widest uppercase flex items-center justify-center gap-2 transition-colors gold-glow"
            >
              Оформить заказ
              <ArrowRight className="w-4 h-4" />
            </Link>

            <p className="text-xs text-sage-light text-center mt-4">
              Безопасная оплата
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
