"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useStore } from "@/lib/store-context"
import { formatPrice } from "@/lib/products"
import { User, Package, Heart, Settings, ShoppingBag, X, ChevronRight } from "lucide-react"

type Tab = "orders" | "saved" | "settings"

export function ProfileContent() {
  const [activeTab, setActiveTab] = useState<Tab>("orders")
  const { orders, savedItems, toggleSavedItem } = useStore()

  const tabs = [
    { id: "orders" as Tab, label: "Заказы", icon: Package, count: orders.length },
    { id: "saved" as Tab, label: "Избранное", icon: Heart, count: savedItems.length },
    { id: "settings" as Tab, label: "Настройки", icon: Settings },
  ]

  return (
    <div className="container mx-auto px-6 lg:px-12 pb-24">
      {/* Page Header */}
      <div className="text-center mb-12 md:mb-16">
        <span className="text-gold text-xs tracking-[0.4em] uppercase">
          Личный кабинет
        </span>
        <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-sage-dark mt-4">
          Профиль
        </h1>
        <div className="w-16 h-px bg-gold mx-auto mt-6" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Sidebar */}
        <aside className="lg:col-span-1">
          {/* User Info */}
          <div className="text-center lg:text-left mb-8 pb-8 border-b border-border">
            <div className="w-20 h-20 rounded-full bg-cream-dark flex items-center justify-center mx-auto lg:mx-0 mb-4">
              <User className="w-8 h-8 text-sage-light" />
            </div>
            <h2 className="font-serif text-xl text-sage-dark">Гость</h2>
            <p className="text-sage-light text-sm">guest@example.com</p>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-colors ${
                  activeTab === tab.id
                    ? "bg-gold/10 text-gold"
                    : "text-sage hover:text-gold hover:bg-cream-dark"
                }`}
              >
                <span className="flex items-center gap-3">
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="text-xs bg-sage-light/20 px-2 py-0.5 rounded-full">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <div className="lg:col-span-3">
          {activeTab === "orders" && <OrdersTab orders={orders} />}
          {activeTab === "saved" && (
            <SavedTab savedItems={savedItems} toggleSavedItem={toggleSavedItem} />
          )}
          {activeTab === "settings" && <SettingsTab />}
        </div>
      </div>
    </div>
  )
}

interface OrdersTabProps {
  orders: Array<{
    id: string
    items: Array<{
      id: string
      name: string
      price: number
      image: string
      quantity: number
    }>
    total: number
    status: "processing" | "shipped" | "delivered"
    date: Date
  }>
}

function OrdersTab({ orders }: OrdersTabProps) {
  const statusLabels = {
    processing: "В обработке",
    shipped: "Отправлен",
    delivered: "Доставлен",
  }

  const statusColors = {
    processing: "bg-gold/20 text-gold-dark",
    shipped: "bg-blue-100 text-blue-800",
    delivered: "bg-green-100 text-green-800",
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 rounded-full bg-cream-dark flex items-center justify-center mx-auto mb-6">
          <Package className="w-6 h-6 text-sage-light" />
        </div>
        <h3 className="font-serif text-xl text-sage-dark mb-2">Нет заказов</h3>
        <p className="text-sage-light text-sm mb-6">
          Ваши заказы появятся здесь
        </p>
        <Link
          href="/catalog"
          className="inline-flex items-center gap-2 text-gold text-sm tracking-wider uppercase hover:underline"
        >
          Перейти в каталог
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    )
  }

  return (
    <div>
      <h2 className="font-serif text-xl text-sage-dark mb-6">История заказов</h2>
      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="border border-border p-6 hover:border-gold/30 transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-border">
              <div>
                <p className="text-sm text-sage-light">Заказ</p>
                <p className="font-medium text-sage-dark">{order.id}</p>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-sm text-sage-light">
                  {order.date.toLocaleDateString("ru-RU")}
                </p>
                <span
                  className={`inline-block mt-1 text-xs px-3 py-1 ${
                    statusColors[order.status]
                  }`}
                >
                  {statusLabels[order.status]}
                </span>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative w-16 h-16 flex-shrink-0 overflow-hidden bg-cream-dark">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-sage-dark">{item.name}</p>
                    <p className="text-xs text-sage-light">
                      {item.quantity} x {formatPrice(item.price)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-border">
              <span className="text-sm text-sage-light">Итого</span>
              <span className="font-serif text-lg text-sage-dark">
                {formatPrice(order.total)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

interface SavedTabProps {
  savedItems: Array<{
    id: string
    name: string
    price: number
    image: string
  }>
  toggleSavedItem: (product: { id: string; name: string; price: number; image: string; category: string; description: string; inStock: boolean }) => void
}

function SavedTab({ savedItems, toggleSavedItem }: SavedTabProps) {
  if (savedItems.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 rounded-full bg-cream-dark flex items-center justify-center mx-auto mb-6">
          <Heart className="w-6 h-6 text-sage-light" />
        </div>
        <h3 className="font-serif text-xl text-sage-dark mb-2">Нет избранного</h3>
        <p className="text-sage-light text-sm mb-6">
          Сохраняйте понравившиеся товары
        </p>
        <Link
          href="/catalog"
          className="inline-flex items-center gap-2 text-gold text-sm tracking-wider uppercase hover:underline"
        >
          Перейти в каталог
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    )
  }

  return (
    <div>
      <h2 className="font-serif text-xl text-sage-dark mb-6">
        Избранные товары
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {savedItems.map((item) => (
          <div key={item.id} className="group relative">
            <Link href={`/product/${item.id}`}>
              <div className="relative aspect-square overflow-hidden bg-cream-dark mb-4">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
            </Link>
            <button
              onClick={() =>
                toggleSavedItem({
                  ...item,
                  category: "",
                  description: "",
                  inStock: true,
                })
              }
              className="absolute top-3 right-3 w-8 h-8 bg-cream rounded-full flex items-center justify-center text-sage hover:text-destructive transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="font-serif text-sage-dark group-hover:text-gold transition-colors">
              {item.name}
            </h3>
            <p className="text-sage text-sm">{formatPrice(item.price)}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function SettingsTab() {
  return (
    <div>
      <h2 className="font-serif text-xl text-sage-dark mb-6">Настройки</h2>
      
      <div className="space-y-8">
        {/* Personal Info */}
        <section>
          <h3 className="text-xs tracking-widest uppercase text-sage-light mb-4">
            Личные данные
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs tracking-widest uppercase text-sage-light mb-2 block">
                Имя
              </label>
              <input
                type="text"
                className="w-full border border-border px-4 py-3 text-sm bg-transparent focus:outline-none focus:border-gold transition-colors"
                placeholder="Введите имя"
              />
            </div>
            <div>
              <label className="text-xs tracking-widest uppercase text-sage-light mb-2 block">
                Фамилия
              </label>
              <input
                type="text"
                className="w-full border border-border px-4 py-3 text-sm bg-transparent focus:outline-none focus:border-gold transition-colors"
                placeholder="Введите фамилию"
              />
            </div>
            <div>
              <label className="text-xs tracking-widest uppercase text-sage-light mb-2 block">
                Email
              </label>
              <input
                type="email"
                className="w-full border border-border px-4 py-3 text-sm bg-transparent focus:outline-none focus:border-gold transition-colors"
                placeholder="email@example.com"
              />
            </div>
            <div>
              <label className="text-xs tracking-widest uppercase text-sage-light mb-2 block">
                Телефон
              </label>
              <input
                type="tel"
                className="w-full border border-border px-4 py-3 text-sm bg-transparent focus:outline-none focus:border-gold transition-colors"
                placeholder="+7 (999) 123-45-67"
              />
            </div>
          </div>
        </section>

        {/* Address */}
        <section>
          <h3 className="text-xs tracking-widest uppercase text-sage-light mb-4">
            Адрес доставки
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs tracking-widest uppercase text-sage-light mb-2 block">
                Адрес
              </label>
              <input
                type="text"
                className="w-full border border-border px-4 py-3 text-sm bg-transparent focus:outline-none focus:border-gold transition-colors"
                placeholder="Город, улица, дом, квартира"
              />
            </div>
          </div>
        </section>

        {/* Save Button */}
        <button className="bg-gold hover:bg-gold-dark text-sage-dark px-8 py-3 text-sm tracking-widest uppercase transition-colors">
          Сохранить
        </button>
      </div>
    </div>
  )
}
