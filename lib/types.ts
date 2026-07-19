export interface Category {
  id: string
  name: string
  slug: string
  sort_order: number
  created_at: string
}

export interface ProductImage {
  id: string
  product_id: string
  path: string
  sort_order: number
  url: string
}

export interface Product {
  id: string
  category_id: string
  title: string
  article: string
  size: string
  material: string
  description: string
  sort_order: number
  created_at: string
  updated_at: string
  category?: Category | null
  images: ProductImage[]
}

export interface CatalogFilters {
  materials: string[]
  sizes: string[]
}

export interface ProductQuery {
  category?: string
  material?: string
  size?: string
  q?: string
}
