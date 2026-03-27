"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useStore } from "@/lib/store-context"
import { formatPrice } from "@/lib/products"
import { ShoppingBag, ArrowRight, Check, Lock } from "lucide-react"

export function CheckoutContent() {
  const router = useRouter()
  const { cart, cartTotal, clearCart } = useStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  if (cart.length === 0 && !isComplete) {
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
            Добавьте товары для оформления заказа
          </p>
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 bg-gold hover:bg-gold-dark text-sage-dark px-8 py-4 text-sm tracking-widest uppercase transition-colors"
          >
            Перейти в каталог
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    )
  }

  if (isComplete) {
    return (
      <div className="container mx-auto px-6 lg:px-12 pb-24">
        <div className="max-w-lg mx-auto text-center py-20">
          <div className="w-20 h-20 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-8">
            <Check className="w-10 h-10 text-gold" />
          </div>
          <h1 className="font-serif text-2xl md:text-3xl text-sage-dark mb-4">
            Заказ оформлен
          </h1>
          <p className="text-sage-light mb-2">
            Благодарим за покупку!
          </p>
          <p className="text-sage-light mb-8">
            Номер заказа: <span className="text-gold">ORD-{Date.now().toString().slice(-6)}</span>
          </p>
          <Link
            href="/profile"
            className="inline-flex items-center gap-2 bg-gold hover:bg-gold-dark text-sage-dark px-8 py-4 text-sm tracking-widest uppercase transition-colors"
          >
            Мои заказы
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate order processing
    await new Promise((resolve) => setTimeout(resolve, 1500))
    clearCart()
    setIsComplete(true)
    setIsSubmitting(false)
  }

  const shippingCost = cartTotal >= 15000 ? 0 : 1500
  const total = cartTotal + shippingCost

  return (
    <div className="container mx-auto px-6 lg:px-12 pb-24">
      {/* Page Header */}
      <div className="text-center mb-12 md:mb-16">
        <span className="text-gold text-xs tracking-[0.4em] uppercase">
          Оформление
        </span>
        <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-sage-dark mt-4">
          Checkout
        </h1>
        <div className="w-16 h-px bg-gold mx-auto mt-6" />
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-10">
            {/* Contact Info */}
            <section>
              <h2 className="font-serif text-xl text-sage-dark mb-6">
                Контактные данные
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs tracking-widest uppercase text-sage-light mb-2 block">
                    Имя *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full border border-border px-4 py-3 text-sm bg-transparent focus:outline-none focus:border-gold transition-colors"
                    placeholder="Введите имя"
                  />
                </div>
                <div>
                  <label className="text-xs tracking-widest uppercase text-sage-light mb-2 block">
                    Фамилия *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full border border-border px-4 py-3 text-sm bg-transparent focus:outline-none focus:border-gold transition-colors"
                    placeholder="Введите фамилию"
                  />
                </div>
                <div>
                  <label className="text-xs tracking-widest uppercase text-sage-light mb-2 block">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full border border-border px-4 py-3 text-sm bg-transparent focus:outline-none focus:border-gold transition-colors"
                    placeholder="email@example.com"
                  />
                </div>
                <div>
                  <label className="text-xs tracking-widest uppercase text-sage-light mb-2 block">
                    Телефон *
                  </label>
                  <input
                    type="tel"
                    required
                    className="w-full border border-border px-4 py-3 text-sm bg-transparent focus:outline-none focus:border-gold transition-colors"
                    placeholder="+7 (999) 123-45-67"
                  />
                </div>
              </div>
            </section>

            {/* Shipping Address */}
            <section>
              <h2 className="font-serif text-xl text-sage-dark mb-6">
                Адрес доставки
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-xs tracking-widest uppercase text-sage-light mb-2 block">
                    Город *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full border border-border px-4 py-3 text-sm bg-transparent focus:outline-none focus:border-gold transition-colors"
                    placeholder="Москва"
                  />
                </div>
                <div>
                  <label className="text-xs tracking-widest uppercase text-sage-light mb-2 block">
                    Адрес *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full border border-border px-4 py-3 text-sm bg-transparent focus:outline-none focus:border-gold transition-colors"
                    placeholder="Улица, дом, квартира"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs tracking-widest uppercase text-sage-light mb-2 block">
                      Индекс *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full border border-border px-4 py-3 text-sm bg-transparent focus:outline-none focus:border-gold transition-colors"
                      placeholder="123456"
                    />
                  </div>
                  <div>
                    <label className="text-xs tracking-widest uppercase text-sage-light mb-2 block">
                      Страна
                    </label>
                    <select className="w-full border border-border px-4 py-3 text-sm bg-transparent focus:outline-none focus:border-gold transition-colors appearance-none cursor-pointer">
                      <option>Россия</option>
                      <option>Казахстан</option>
                      <option>Беларусь</option>
                    </select>
                  </div>
                </div>
              </div>
            </section>

            {/* Payment */}
            <section>
              <h2 className="font-serif text-xl text-sage-dark mb-6">
                Способ оплаты
              </h2>
              <div className="space-y-3">
                <label className="flex items-center gap-4 border border-border p-4 cursor-pointer hover:border-gold transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    defaultChecked
                    className="w-4 h-4 accent-gold"
                  />
                  <span className="text-sm text-sage-dark">Банковская карта</span>
                </label>
                <label className="flex items-center gap-4 border border-border p-4 cursor-pointer hover:border-gold transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    className="w-4 h-4 accent-gold"
                  />
                  <span className="text-sm text-sage-dark">При получении</span>
                </label>
              </div>
            </section>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-cream-dark p-8 sticky top-32">
              <h2 className="font-serif text-xl text-sage-dark mb-6">
                Ваш заказ
              </h2>

              {/* Items */}
              <div className="space-y-4 pb-6 border-b border-border">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative w-16 h-16 flex-shrink-0 overflow-hidden bg-cream">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-sage-dark text-cream text-xs rounded-full flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-sage-dark truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-sage-light">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-3 py-6 border-b border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-sage-light">Подытог</span>
                  <span className="text-sage-dark">{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-sage-light">Доставка</span>
                  <span className="text-sage-dark">
                    {shippingCost === 0 ? "Бесплатно" : formatPrice(shippingCost)}
                  </span>
                </div>
              </div>

              <div className="flex justify-between py-6">
                <span className="text-sage-dark font-medium">Итого</span>
                <span className="font-serif text-xl text-sage-dark">
                  {formatPrice(total)}
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gold hover:bg-gold-dark disabled:bg-gold/50 text-sage-dark py-4 text-sm tracking-widest uppercase flex items-center justify-center gap-2 transition-colors gold-glow"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-sage-dark/30 border-t-sage-dark rounded-full animate-spin" />
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    Подтвердить заказ
                  </>
                )}
              </button>

              <p className="text-xs text-sage-light text-center mt-4 flex items-center justify-center gap-2">
                <Lock className="w-3 h-3" />
                Безопасная оплата SSL
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
