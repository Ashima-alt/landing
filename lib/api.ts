import type { CatalogFilters, Category, Product, ProductQuery } from "./types"

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "")

function apiPath(path: string): string {
  if (path.startsWith("http")) return path
  return `${API_URL}${path}`
}

export function mediaUrl(url?: string | null): string {
  if (!url) return "/placeholder.svg"
  if (url.startsWith("http://") || url.startsWith("https://")) return url
  if (url.startsWith("/uploads")) return apiPath(url)
  if (url.startsWith("/")) return url
  return apiPath(`/uploads/${url}`)
}

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(apiPath(path), {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init?.headers || {}),
    },
    cache: "no-store",
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error((body as { error?: string }).error || `API error ${res.status}`)
  }

  return res.json() as Promise<T>
}

export async function getCategories(): Promise<Category[]> {
  return fetchJson<Category[]>("/api/categories")
}

export async function getProducts(query: ProductQuery = {}): Promise<Product[]> {
  const params = new URLSearchParams()
  if (query.category) params.set("category", query.category)
  if (query.material) params.set("material", query.material)
  if (query.size) params.set("size", query.size)
  if (query.q) params.set("q", query.q)
  const qs = params.toString()
  return fetchJson<Product[]>(`/api/products${qs ? `?${qs}` : ""}`)
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    return await fetchJson<Product>(`/api/products/${id}`)
  } catch {
    return null
  }
}

export async function getFilters(category?: string): Promise<CatalogFilters> {
  const qs = category ? `?category=${encodeURIComponent(category)}` : ""
  return fetchJson<CatalogFilters>(`/api/filters${qs}`)
}

export function productCover(product: Product): string {
  return mediaUrl(product.images?.[0]?.url)
}
