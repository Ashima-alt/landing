import { createHash, randomBytes, scryptSync, timingSafeEqual } from "node:crypto"
import type { FastifyReply, FastifyRequest } from "fastify"
import { query } from "./db.js"

export const SESSION_COOKIE = "admin_session"
const SESSION_DAYS = 14

export interface AdminUser {
  id: string
  username: string
}

declare module "fastify" {
  interface FastifyRequest {
    adminUser?: AdminUser | null
  }
}

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex")
  const hash = scryptSync(password, salt, 64).toString("hex")
  return `${salt}:${hash}`
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":")
  if (!salt || !hash) return false
  const next = scryptSync(password, salt, 64)
  const prev = Buffer.from(hash, "hex")
  if (prev.length !== next.length) return false
  return timingSafeEqual(prev, next)
}

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex")
}

export async function createSession(userId: string): Promise<string> {
  const token = randomBytes(32).toString("hex")
  const expires = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000)
  await query(
    `INSERT INTO admin_sessions (user_id, token_hash, expires_at)
     VALUES ($1, $2, $3)`,
    [userId, hashToken(token), expires.toISOString()]
  )
  return token
}

export async function destroySession(token: string | undefined): Promise<void> {
  if (!token) return
  await query(`DELETE FROM admin_sessions WHERE token_hash = $1`, [hashToken(token)])
}

export async function getUserFromToken(token: string | undefined): Promise<AdminUser | null> {
  if (!token) return null
  const { rows } = await query<AdminUser & { expires_at: string }>(
    `SELECT u.id, u.username, s.expires_at
     FROM admin_sessions s
     JOIN admin_users u ON u.id = s.user_id
     WHERE s.token_hash = $1
     LIMIT 1`,
    [hashToken(token)]
  )
  const row = rows[0]
  if (!row) return null
  if (new Date(row.expires_at).getTime() < Date.now()) {
    await destroySession(token)
    return null
  }
  return { id: row.id, username: row.username }
}

export function setSessionCookie(reply: FastifyReply, token: string) {
  reply.setCookie(SESSION_COOKIE, token, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.COOKIE_SECURE === "true",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  })
}

export function clearSessionCookie(reply: FastifyReply) {
  reply.clearCookie(SESSION_COOKIE, { path: "/" })
}

export async function loadAdminUser(req: FastifyRequest) {
  const token = req.cookies?.[SESSION_COOKIE]
  req.adminUser = await getUserFromToken(token)
}

export async function requireAdmin(req: FastifyRequest, reply: FastifyReply) {
  await loadAdminUser(req)
  if (!req.adminUser) {
    return reply.code(401).send({ error: "unauthorized" })
  }
}

export async function ensureSeedUsers() {
  const seeds = [
    {
      username: process.env.ADMIN_USERNAME || "admin",
      password: process.env.ADMIN_PASSWORD || "admin123",
    },
  ]

  // Optional second admin from .env (leave empty to skip)
  if (process.env.EDITOR_USERNAME && process.env.EDITOR_PASSWORD) {
    seeds.push({
      username: process.env.EDITOR_USERNAME,
      password: process.env.EDITOR_PASSWORD,
    })
  }

  for (const seed of seeds) {
    if (!seed.username || !seed.password) continue
    const hash = hashPassword(seed.password)
    const existing = await query<{ id: string }>(
      `SELECT id FROM admin_users WHERE username = $1`,
      [seed.username]
    )
    if (existing.rows[0]) {
      // Keep .env as source of truth on deploy/restart
      await query(`UPDATE admin_users SET password_hash = $1 WHERE id = $2`, [
        hash,
        existing.rows[0].id,
      ])
      console.log(`Synced admin password from .env: ${seed.username}`)
    } else {
      await query(
        `INSERT INTO admin_users (username, password_hash) VALUES ($1, $2)`,
        [seed.username, hash]
      )
      console.log(`Seeded admin user: ${seed.username}`)
    }
  }
}
