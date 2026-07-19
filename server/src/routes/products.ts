import { createWriteStream } from "node:fs"
import { mkdir, unlink } from "node:fs/promises"
import path from "node:path"
import { pipeline } from "node:stream/promises"
import { randomUUID } from "node:crypto"
import type { FastifyInstance } from "fastify"
import { query } from "../db.js"
import { imageUrl, type Category, type Product, type ProductImage } from "../types.js"

interface ProductRow {
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
  category_name?: string | null
  category_slug?: string | null
  category_sort_order?: number | null
  category_created_at?: string | null
}

interface ImageRow {
  id: string
  product_id: string
  path: string
  sort_order: number
}

function mapImage(row: ImageRow): ProductImage {
  return {
    id: row.id,
    product_id: row.product_id,
    path: row.path,
    sort_order: row.sort_order,
    url: imageUrl(row.path),
  }
}

function mapProduct(row: ProductRow, images: ProductImage[]): Product {
  const category: Category | null =
    row.category_name && row.category_slug
      ? {
          id: row.category_id,
          name: row.category_name,
          slug: row.category_slug,
          sort_order: row.category_sort_order ?? 0,
          created_at: row.category_created_at ?? "",
        }
      : null

  return {
    id: row.id,
    category_id: row.category_id,
    title: row.title,
    article: row.article,
    size: row.size,
    material: row.material,
    description: row.description,
    sort_order: row.sort_order,
    created_at: row.created_at,
    updated_at: row.updated_at,
    category,
    images,
  }
}

async function fetchImages(productIds: string[]): Promise<Map<string, ProductImage[]>> {
  const map = new Map<string, ProductImage[]>()
  if (productIds.length === 0) return map

  const { rows } = await query<ImageRow>(
    `SELECT id, product_id, path, sort_order
     FROM product_images
     WHERE product_id = ANY($1::uuid[])
     ORDER BY sort_order ASC, id ASC`,
    [productIds]
  )

  for (const row of rows) {
    const list = map.get(row.product_id) ?? []
    list.push(mapImage(row))
    map.set(row.product_id, list)
  }
  return map
}

const PRODUCT_SELECT = `
  SELECT
    p.id, p.category_id, p.title, p.article, p.size, p.material,
    p.description, p.sort_order, p.created_at, p.updated_at,
    c.name AS category_name, c.slug AS category_slug,
    c.sort_order AS category_sort_order, c.created_at AS category_created_at
  FROM products p
  LEFT JOIN categories c ON c.id = p.category_id
`

export async function productRoutes(app: FastifyInstance, uploadDir: string) {
  app.get<{
    Querystring: {
      category?: string
      material?: string
      size?: string
      q?: string
    }
  }>("/api/products", async (req) => {
    const { category, material, size, q } = req.query
    const conditions: string[] = []
    const params: unknown[] = []

    if (category) {
      params.push(category)
      conditions.push(`(c.slug = $${params.length} OR p.category_id::text = $${params.length})`)
    }
    if (material) {
      params.push(material)
      conditions.push(`p.material = $${params.length}`)
    }
    if (size) {
      params.push(size)
      conditions.push(`p.size = $${params.length}`)
    }
    if (q?.trim()) {
      params.push(`%${q.trim()}%`)
      conditions.push(
        `(p.title ILIKE $${params.length} OR p.article ILIKE $${params.length} OR p.description ILIKE $${params.length})`
      )
    }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : ""
    const { rows } = await query<ProductRow>(
      `${PRODUCT_SELECT}
       ${where}
       ORDER BY p.sort_order ASC, p.created_at DESC`,
      params
    )

    const images = await fetchImages(rows.map((r) => r.id))
    return rows.map((row) => mapProduct(row, images.get(row.id) ?? []))
  })

  app.get<{ Params: { id: string } }>("/api/products/:id", async (req, reply) => {
    const { rows } = await query<ProductRow>(
      `${PRODUCT_SELECT} WHERE p.id = $1`,
      [req.params.id]
    )
    if (!rows[0]) {
      return reply.code(404).send({ error: "product not found" })
    }
    const images = await fetchImages([rows[0].id])
    return mapProduct(rows[0], images.get(rows[0].id) ?? [])
  })

  app.post<{
    Body: {
      category_id: string
      title: string
      article: string
      size?: string
      material?: string
      description?: string
      sort_order?: number
    }
  }>("/api/products", async (req, reply) => {
    const body = req.body
    if (!body?.category_id || !body?.title?.trim() || !body?.article?.trim()) {
      return reply.code(400).send({ error: "category_id, title and article are required" })
    }

    const { rows } = await query<ProductRow>(
      `INSERT INTO products (category_id, title, article, size, material, description, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, category_id, title, article, size, material, description, sort_order, created_at, updated_at`,
      [
        body.category_id,
        body.title.trim(),
        body.article.trim(),
        body.size?.trim() ?? "",
        body.material?.trim() ?? "",
        body.description?.trim() ?? "",
        body.sort_order ?? 0,
      ]
    )

    const full = await query<ProductRow>(`${PRODUCT_SELECT} WHERE p.id = $1`, [rows[0].id])
    return reply.code(201).send(mapProduct(full.rows[0], []))
  })

  app.put<{
    Params: { id: string }
    Body: {
      category_id?: string
      title?: string
      article?: string
      size?: string
      material?: string
      description?: string
      sort_order?: number
    }
  }>("/api/products/:id", async (req, reply) => {
    const existing = await query<ProductRow>(
      `SELECT id, category_id, title, article, size, material, description, sort_order, created_at, updated_at
       FROM products WHERE id = $1`,
      [req.params.id]
    )
    if (!existing.rows[0]) {
      return reply.code(404).send({ error: "product not found" })
    }

    const cur = existing.rows[0]
    const body = req.body
    const { rows } = await query<ProductRow>(
      `UPDATE products SET
         category_id = $1,
         title = $2,
         article = $3,
         size = $4,
         material = $5,
         description = $6,
         sort_order = $7,
         updated_at = NOW()
       WHERE id = $8
       RETURNING id`,
      [
        body.category_id ?? cur.category_id,
        body.title?.trim() ?? cur.title,
        body.article?.trim() ?? cur.article,
        body.size !== undefined ? body.size.trim() : cur.size,
        body.material !== undefined ? body.material.trim() : cur.material,
        body.description !== undefined ? body.description.trim() : cur.description,
        body.sort_order ?? cur.sort_order,
        req.params.id,
      ]
    )

    const full = await query<ProductRow>(`${PRODUCT_SELECT} WHERE p.id = $1`, [rows[0].id])
    const images = await fetchImages([rows[0].id])
    return mapProduct(full.rows[0], images.get(rows[0].id) ?? [])
  })

  app.delete<{ Params: { id: string } }>("/api/products/:id", async (req, reply) => {
    const images = await query<ImageRow>(
      `SELECT id, product_id, path, sort_order FROM product_images WHERE product_id = $1`,
      [req.params.id]
    )

    const result = await query(`DELETE FROM products WHERE id = $1`, [req.params.id])
    if (result.rowCount === 0) {
      return reply.code(404).send({ error: "product not found" })
    }

    for (const img of images.rows) {
      const filePath = path.join(uploadDir, path.basename(img.path))
      await unlink(filePath).catch(() => undefined)
    }

    return reply.code(204).send()
  })

  app.post<{ Params: { id: string } }>("/api/products/:id/images", async (req, reply) => {
    const productId = req.params.id
    const exists = await query(`SELECT id FROM products WHERE id = $1`, [productId])
    if (!exists.rows[0]) {
      return reply.code(404).send({ error: "product not found" })
    }

    await mkdir(uploadDir, { recursive: true })

    const parts = req.files()
    const created: ProductImage[] = []

    const maxOrder = await query<{ max: number | null }>(
      `SELECT MAX(sort_order) AS max FROM product_images WHERE product_id = $1`,
      [productId]
    )
    let nextOrder = (maxOrder.rows[0]?.max ?? -1) + 1

    for await (const part of parts) {
      if (part.type !== "file") continue
      const ext = path.extname(part.filename || "").toLowerCase() || ".jpg"
      const allowed = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"]
      if (!allowed.includes(ext)) {
        part.file.resume()
        continue
      }

      const filename = `${randomUUID()}${ext}`
      const dest = path.join(uploadDir, filename)
      await pipeline(part.file, createWriteStream(dest))

      const { rows } = await query<ImageRow>(
        `INSERT INTO product_images (product_id, path, sort_order)
         VALUES ($1, $2, $3)
         RETURNING id, product_id, path, sort_order`,
        [productId, filename, nextOrder++]
      )
      created.push(mapImage(rows[0]))
    }

    if (created.length === 0) {
      return reply.code(400).send({ error: "no valid images uploaded" })
    }

    return reply.code(201).send(created)
  })

  app.delete<{ Params: { id: string; imageId: string } }>(
    "/api/products/:id/images/:imageId",
    async (req, reply) => {
      const { rows } = await query<ImageRow>(
        `SELECT id, product_id, path, sort_order
         FROM product_images
         WHERE id = $1 AND product_id = $2`,
        [req.params.imageId, req.params.id]
      )
      if (!rows[0]) {
        return reply.code(404).send({ error: "image not found" })
      }

      await query(`DELETE FROM product_images WHERE id = $1`, [rows[0].id])
      await unlink(path.join(uploadDir, path.basename(rows[0].path))).catch(() => undefined)
      return reply.code(204).send()
    }
  )

  app.patch<{
    Params: { id: string }
    Body: { image_ids: string[] }
  }>("/api/products/:id/images/reorder", async (req, reply) => {
    const imageIds = req.body?.image_ids
    if (!Array.isArray(imageIds) || imageIds.length === 0) {
      return reply.code(400).send({ error: "image_ids array is required" })
    }

    const client = await (await import("../db.js")).pool.connect()
    try {
      await client.query("BEGIN")
      for (let i = 0; i < imageIds.length; i++) {
        await client.query(
          `UPDATE product_images SET sort_order = $1
           WHERE id = $2 AND product_id = $3`,
          [i, imageIds[i], req.params.id]
        )
      }
      await client.query("COMMIT")
    } catch (err) {
      await client.query("ROLLBACK")
      throw err
    } finally {
      client.release()
    }

    const images = await fetchImages([req.params.id])
    return images.get(req.params.id) ?? []
  })
}
