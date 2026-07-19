import type { FastifyInstance } from "fastify"
import { query } from "../db.js"
import { slugify } from "../slug.js"
import type { Category } from "../types.js"

export async function categoryRoutes(app: FastifyInstance) {
  app.get("/api/categories", async () => {
    const { rows } = await query<Category>(
      `SELECT id, name, slug, sort_order, created_at
       FROM categories
       ORDER BY sort_order ASC, name ASC`
    )
    return rows
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
      const { rows } = await query<Category>(
        `INSERT INTO categories (name, slug, sort_order)
         VALUES ($1, $2, $3)
         RETURNING id, name, slug, sort_order, created_at`,
        [name, slug, sortOrder]
      )
      return reply.code(201).send(rows[0])
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
    const existing = await query<Category>(
      `SELECT id, name, slug, sort_order, created_at FROM categories WHERE id = $1`,
      [id]
    )
    if (!existing.rows[0]) {
      return reply.code(404).send({ error: "category not found" })
    }

    const name = req.body.name?.trim() ?? existing.rows[0].name
    const slug = (req.body.slug?.trim() || existing.rows[0].slug).toLowerCase()
    const sortOrder = req.body.sort_order ?? existing.rows[0].sort_order

    try {
      const { rows } = await query<Category>(
        `UPDATE categories
         SET name = $1, slug = $2, sort_order = $3
         WHERE id = $4
         RETURNING id, name, slug, sort_order, created_at`,
        [name, slug, sortOrder, id]
      )
      return rows[0]
    } catch (err: unknown) {
      const e = err as { code?: string }
      if (e.code === "23505") {
        return reply.code(409).send({ error: "slug already exists" })
      }
      throw err
    }
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

    const result = await query(`DELETE FROM categories WHERE id = $1`, [id])
    if (result.rowCount === 0) {
      return reply.code(404).send({ error: "category not found" })
    }
    return reply.code(204).send()
  })
}
