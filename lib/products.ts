import type { Product } from "./store-context"

export const products: Product[] = [
  {
    id: "1",
    name: "Piatto Elegante",
    price: 89,
    image: "/images/products/plate-elegante.jpg",
    category: "plates",
    description: "Exquisite handcrafted porcelain dinner plate with delicate gold rim detailing. Each piece is a testament to Italian craftsmanship, featuring a perfectly balanced form and luxurious finish that elevates any dining experience.",
    inStock: true,
  },
  {
    id: "2",
    name: "Tazza Milano",
    price: 65,
    image: "/images/products/cup-milano.jpg",
    category: "cups",
    description: "Elegant espresso cup and saucer set with refined gold handle accents. The perfect balance of form and function, designed for those who appreciate the art of Italian coffee culture.",
    inStock: true,
  },
  {
    id: "3",
    name: "Set Completo",
    price: 450,
    image: "/images/products/set-completo.jpg",
    category: "sets",
    description: "Complete 24-piece luxury dinnerware collection including dinner plates, salad plates, bowls, and cups. A comprehensive set that brings cohesive elegance to your table.",
    inStock: true,
  },
  {
    id: "4",
    name: "Posate Oro",
    price: 320,
    image: "/images/products/cutlery-oro.jpg",
    category: "cutlery",
    description: "24-karat gold-plated cutlery set featuring a timeless design. Each piece is meticulously crafted to provide the perfect weight and balance for an exceptional dining experience.",
    inStock: true,
  },
  {
    id: "5",
    name: "Ciotola Classico",
    price: 75,
    image: "/images/products/bowl-classico.jpg",
    category: "plates",
    description: "Versatile serving bowl with subtle gold rim accent. Perfect for soups, salads, or as a decorative centerpiece. Crafted from premium Italian porcelain.",
    inStock: true,
  },
  {
    id: "6",
    name: "Teiera Reale",
    price: 185,
    image: "/images/products/teapot-reale.jpg",
    category: "cups",
    description: "Regal porcelain teapot with graceful curves and gold detailing. A statement piece that combines functionality with artistic expression.",
    inStock: false,
  },
]

export const categories = [
  {
    id: "plates",
    name: "Piatti",
    nameEn: "Plates",
    image: "/images/categories/plates.jpg",
    description: "Handcrafted dinner and serving plates",
  },
  {
    id: "cups",
    name: "Tazze",
    nameEn: "Cups",
    image: "/images/categories/cups.jpg",
    description: "Elegant cups and saucers",
  },
  {
    id: "cutlery",
    name: "Posate",
    nameEn: "Cutlery",
    image: "/images/categories/cutlery.jpg",
    description: "Premium gold-plated flatware",
  },
  {
    id: "sets",
    name: "Set",
    nameEn: "Sets",
    image: "/images/categories/sets.jpg",
    description: "Complete dinnerware collections",
  },
]

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id)
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter((p) => p.category === category)
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(price)
}
