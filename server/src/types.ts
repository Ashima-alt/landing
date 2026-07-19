export interface Category {
  id: string
  name: string
  slug: string
  sort_order: number
  created_at: string
  image_path?: string | null
  image_url?: string | null
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

export function imageUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("/")) {
    return path.startsWith("/") ? path : `/${path}`
  }
  return `/uploads/${path}`
}

export function mapCategory(row: {
  id: string
  name: string
  slug: string
  sort_order: number
  created_at: string
  image_path?: string | null
}): Category {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    sort_order: row.sort_order,
    created_at: row.created_at,
    image_path: row.image_path ?? null,
    image_url: row.image_path ? imageUrl(row.image_path) : null,
  }
}
