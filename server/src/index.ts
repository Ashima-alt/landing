import path from "node:path"
import { fileURLToPath } from "node:url"
import { mkdir } from "node:fs/promises"
import Fastify from "fastify"
import cors from "@fastify/cors"
import cookie from "@fastify/cookie"
import multipart from "@fastify/multipart"
import fastifyStatic from "@fastify/static"
import "dotenv/config"
import { ensureSeedUsers, requireAdmin } from "./auth.js"
import { migrate } from "./migrate.js"
import { authRoutes } from "./routes/auth.js"
import { categoryRoutes } from "./routes/categories.js"
import { productRoutes } from "./routes/products.js"
import { filterRoutes } from "./routes/filters.js"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, "..")
const uploadDir = path.resolve(process.env.UPLOAD_DIR || path.join(rootDir, "uploads"))
const adminDir = path.join(rootDir, "admin")
const port = Number(process.env.PORT || 4000)
const host = process.env.HOST || "0.0.0.0"

async function main() {
  await mkdir(uploadDir, { recursive: true })
  await migrate()
  await ensureSeedUsers()

  const app = Fastify({
    logger: true,
    bodyLimit: 20 * 1024 * 1024,
  })

  await app.register(cors, {
    origin: true,
    credentials: true,
  })
  await app.register(cookie, {
    secret: process.env.COOKIE_SECRET || "valore-milano-admin-cookie-secret",
  })
  await app.register(multipart, {
    limits: {
      fileSize: 15 * 1024 * 1024,
      files: 20,
    },
  })

  await app.register(fastifyStatic, {
    root: uploadDir,
    prefix: "/uploads/",
    decorateReply: false,
  })

  await app.register(fastifyStatic, {
    root: adminDir,
    prefix: "/admin/",
    decorateReply: false,
    index: ["index.html"],
  })

  app.get("/admin", async (_req, reply) => reply.redirect("/admin/"))

  app.get("/api/health", async () => ({ ok: true }))

  app.addHook("preHandler", async (req, reply) => {
    const method = req.method.toUpperCase()
    if (method === "GET" || method === "HEAD" || method === "OPTIONS") return
    const url = req.url.split("?")[0]
    if (url === "/api/auth/login" || url === "/api/auth/logout") return
    if (!url.startsWith("/api/")) return
    return requireAdmin(req, reply)
  })

  await authRoutes(app)
  await categoryRoutes(app, uploadDir)
  await productRoutes(app, uploadDir)
  await filterRoutes(app)

  await app.listen({ port, host })
  console.log(`API listening on http://${host}:${port}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
