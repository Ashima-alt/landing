import { pool, query } from "./db.js"

const SEED_CATEGORIES = [
  { name: "Piatti", slug: "plates", sort_order: 1 },
  { name: "Tazze", slug: "cups", sort_order: 2 },
  { name: "Posate", slug: "cutlery", sort_order: 3 },
  { name: "Set", slug: "sets", sort_order: 4 },
]

export async function migrate() {
  await query(`
    CREATE EXTENSION IF NOT EXISTS "pgcrypto";

    CREATE TABLE IF NOT EXISTS categories (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      sort_order INT NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS products (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
      title TEXT NOT NULL,
      article TEXT NOT NULL,
      size TEXT NOT NULL DEFAULT '',
      material TEXT NOT NULL DEFAULT '',
      description TEXT NOT NULL DEFAULT '',
      sort_order INT NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS product_images (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      path TEXT NOT NULL,
      sort_order INT NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS admin_users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS admin_sessions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
      token_hash TEXT NOT NULL UNIQUE,
      expires_at TIMESTAMPTZ NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON admin_sessions(token_hash);
    CREATE INDEX IF NOT EXISTS idx_admin_sessions_user ON admin_sessions(user_id);
    CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
    CREATE INDEX IF NOT EXISTS idx_products_material ON products(material);
    CREATE INDEX IF NOT EXISTS idx_products_size ON products(size);
    CREATE INDEX IF NOT EXISTS idx_products_article ON products(article);
    CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);
  `)

  // Optional category cover photo (nullable)
  await query(`
    ALTER TABLE categories
    ADD COLUMN IF NOT EXISTS image_path TEXT
  `)

  for (const cat of SEED_CATEGORIES) {
    await query(
      `INSERT INTO categories (name, slug, sort_order)
       VALUES ($1, $2, $3)
       ON CONFLICT (slug) DO NOTHING`,
      [cat.name, cat.slug, cat.sort_order]
    )
  }
}

const isDirectRun = process.argv[1]?.includes("migrate")

if (isDirectRun) {
  migrate()
    .then(async () => {
      console.log("Migration complete")
      await pool.end()
    })
    .catch(async (err) => {
      console.error(err)
      await pool.end()
      process.exit(1)
    })
}
