import { createWriteStream } from "node:fs"
import { mkdir, unlink } from "node:fs/promises"
import path from "node:path"
import { pipeline } from "node:stream/promises"
import { randomUUID } from "node:crypto"
import type { FastifyInstance } from "fastify"
import { query } from "../db.js"
import { slugify } from "../slug.js"
import { mapCategory } from "../types.js"

interface CategoryRow {
  id: string
  name: string
  slug: string
  sort_order: number
  created_at: string
  image_path: string | null
}

const SELECT = `SELECT id, name, slug, sort_order, created_at, image_path FROM categories`

export async function categoryRoutes(app: FastifyInstance, uploadDir: string) {
  app.get("/api/categories", async () => {
    const { rows } = await query<CategoryRow>(
      `${SELECT} ORDER BY sort_order ASC, name ASC`
    )
    return rows.map(mapCategory)
  })

  app.post<{
    Body: { name: string; slug?: string; sort_order?: number }
  }>("/api/categories", async (req, reply) => {
    const name = req.body?.name?.trim()
    if (!name) {
      return reply.code(400).send({ error: "name is required" })
    }
    const slug = (req.body.slug?.trim() || slugify(name)).toLowerCase()
    const sortOrder = req.body.sort_order ?? 0

    try {
      const { rows } = await query<CategoryRow>(
        `INSERT INTO categories (name, slug, sort_order)
         VALUES ($1, $2, $3)
         RETURNING id, name, slug, sort_order, created_at, image_path`,
        [name, slug, sortOrder]
      )
      return reply.code(201).send(mapCategory(rows[0]))
    } catch (err: unknown) {
      const e = err as { code?: string }
      if (e.code === "23505") {
        return reply.code(409).send({ error: "slug already exists" })
      }
      throw err
    }
  })

  app.put<{
    Params: { id: string }
    Body: { name?: string; slug?: string; sort_order?: number }
  }>("/api/categories/:id", async (req, reply) => {
    const { id } = req.params
    const existing = await query<CategoryRow>(`${SELECT} WHERE id = $1`, [id])
    if (!existing.rows[0]) {
      return reply.code(404).send({ error: "category not found" })
    }

    const cur = existing.rows[0]
    const name = req.body.name?.trim() ?? cur.name
    const slug = (req.body.slug?.trim() || cur.slug).toLowerCase()
    const sortOrder = req.body.sort_order ?? cur.sort_order

    try {
      const { rows } = await query<CategoryRow>(
        `UPDATE categories
         SET name = $1, slug = $2, sort_order = $3
         WHERE id = $4
         RETURNING id, name, slug, sort_order, created_at, image_path`,
        [name, slug, sortOrder, id]
      )
      return mapCategory(rows[0])
    } catch (err: unknown) {
      const e = err as { code?: string }
      if (e.code === "23505") {
        return reply.code(409).send({ error: "slug already exists" })
      }
      throw err
    }
  })

  app.post<{ Params: { id: string } }>("/api/categories/:id/image", async (req, reply) => {
    const { id } = req.params
    const existing = await query<CategoryRow>(`${SELECT} WHERE id = $1`, [id])
    if (!existing.rows[0]) {
      return reply.code(404).send({ error: "category not found" })
    }

    await mkdir(uploadDir, { recursive: true })
    const file = await req.file()
    if (!file) {
      return reply.code(400).send({ error: "image file is required" })
    }

    const ext = path.extname(file.filename || "").toLowerCase() || ".jpg"
    const allowed = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"]
    if (!allowed.includes(ext)) {
      file.file.resume()
      return reply.code(400).send({ error: "unsupported image type" })
    }

    const filename = `category-${randomUUID()}${ext}`
    const dest = path.join(uploadDir, filename)
    await pipeline(file.file, createWriteStream(dest))

    const prev = existing.rows[0].image_path
    if (prev) {
      await unlink(path.join(uploadDir, path.basename(prev))).catch(() => undefined)
    }

    const { rows } = await query<CategoryRow>(
      `UPDATE categories SET image_path = $1 WHERE id = $2
       RETURNING id, name, slug, sort_order, created_at, image_path`,
      [filename, id]
    )
    return reply.code(201).send(mapCategory(rows[0]))
  })

  app.delete<{ Params: { id: string } }>("/api/categories/:id/image", async (req, reply) => {
    const { id } = req.params
    const existing = await query<CategoryRow>(`${SELECT} WHERE id = $1`, [id])
    if (!existing.rows[0]) {
      return reply.code(404).send({ error: "category not found" })
    }

    const prev = existing.rows[0].image_path
    await query(`UPDATE categories SET image_path = NULL WHERE id = $1`, [id])
    if (prev) {
      await unlink(path.join(uploadDir, path.basename(prev))).catch(() => undefined)
    }

    const { rows } = await query<CategoryRow>(`${SELECT} WHERE id = $1`, [id])
    return mapCategory(rows[0])
  })

  app.delete<{ Params: { id: string } }>("/api/categories/:id", async (req, reply) => {
    const { id } = req.params
    const inUse = await query<{ count: string }>(
      `SELECT COUNT(*)::text AS count FROM products WHERE category_id = $1`,
      [id]
    )
    if (Number(inUse.rows[0]?.count ?? 0) > 0) {
      return reply.code(409).send({ error: "category has products" })
    }

    const existing = await query<CategoryRow>(`${SELECT} WHERE id = $1`, [id])
    const result = await query(`DELETE FROM categories WHERE id = $1`, [id])
    if (result.rowCount === 0) {
      return reply.code(404).send({ error: "category not found" })
    }

    const prev = existing.rows[0]?.image_path
    if (prev) {
      await unlink(path.join(uploadDir, path.basename(prev))).catch(() => undefined)
    }

    return reply.code(204).send()
  })
}
