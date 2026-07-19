import type { FastifyInstance } from "fastify"
import { query } from "../db.js"
import {
  SESSION_COOKIE,
  clearSessionCookie,
  createSession,
  destroySession,
  loadAdminUser,
  setSessionCookie,
  verifyPassword,
} from "../auth.js"

interface UserRow {
  id: string
  username: string
  password_hash: string
}

export async function authRoutes(app: FastifyInstance) {
  app.post<{
    Body: { username?: string; password?: string }
  }>("/api/auth/login", async (req, reply) => {
    const username = req.body?.username?.trim()
    const password = req.body?.password ?? ""
    if (!username || !password) {
      return reply.code(400).send({ error: "username and password are required" })
    }

    const { rows } = await query<UserRow>(
      `SELECT id, username, password_hash FROM admin_users WHERE username = $1`,
      [username]
    )
    const user = rows[0]
    if (!user || !verifyPassword(password, user.password_hash)) {
      return reply.code(401).send({ error: "Неверный логин или пароль" })
    }

    const token = await createSession(user.id)
    setSessionCookie(reply, token)
    return { id: user.id, username: user.username }
  })

  app.post("/api/auth/logout", async (req, reply) => {
    const token = req.cookies?.[SESSION_COOKIE]
    await destroySession(token)
    clearSessionCookie(reply)
    return { ok: true }
  })

  app.get("/api/auth/me", async (req, reply) => {
    await loadAdminUser(req)
    if (!req.adminUser) {
      return reply.code(401).send({ error: "unauthorized" })
    }
    return req.adminUser
  })
}
