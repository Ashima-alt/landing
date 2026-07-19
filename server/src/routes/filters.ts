import type { FastifyInstance } from "fastify"
import { query } from "../db.js"

export async function filterRoutes(app: FastifyInstance) {
  app.get<{
    Querystring: { category?: string }
  }>("/api/filters", async (req) => {
    const { category } = req.query
    const params: unknown[] = []
    let join = ""
    let where = ""

    if (category) {
      params.push(category)
      join = "JOIN categories c ON c.id = p.category_id"
      where = `WHERE (c.slug = $1 OR p.category_id::text = $1)`
    }

    const materialWhere = where
      ? `${where} AND p.material <> ''`
      : `WHERE p.material <> ''`
    const sizeWhere = where
      ? `${where} AND p.size <> ''`
      : `WHERE p.size <> ''`

    const materials = await query<{ material: string }>(
      `SELECT DISTINCT p.material
       FROM products p
       ${join}
       ${materialWhere}
       ORDER BY p.material ASC`,
      params
    )

    const sizes = await query<{ size: string }>(
      `SELECT DISTINCT p.size
       FROM products p
       ${join}
       ${sizeWhere}
       ORDER BY p.size ASC`,
      params
    )

    return {
      materials: materials.rows.map((r) => r.material),
      sizes: sizes.rows.map((r) => r.size),
    }
  })
}
