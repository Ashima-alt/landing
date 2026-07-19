export type { Category, Product, ProductImage, CatalogFilters } from "./types"
export {
  getCategories,
  getProducts,
  getProductById,
  getFilters,
  mediaUrl,
  productCover,
} from "./api"

/** Kept for legacy cart/checkout components that are no longer linked. */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(price)
}
