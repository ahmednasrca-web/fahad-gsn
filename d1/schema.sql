-- Fahad Gsn — D1/SQLite Schema
-- Run: npx wrangler d1 execute fahad-gsn-db --remote --file=d1/schema.sql

PRAGMA foreign_keys = ON;

-- ─── Categories ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
  id          TEXT PRIMARY KEY,
  slug        TEXT UNIQUE NOT NULL,
  name_ar     TEXT NOT NULL,
  name_en     TEXT NOT NULL,
  description_ar TEXT,
  description_en TEXT,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  is_active   INTEGER NOT NULL DEFAULT 1,
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_categories_active ON categories (is_active, sort_order);

-- ─── Works ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS works (
  id               TEXT PRIMARY KEY,
  slug             TEXT UNIQUE NOT NULL,
  category_id      TEXT REFERENCES categories(id) ON DELETE SET NULL,
  title_ar         TEXT NOT NULL,
  title_en         TEXT NOT NULL,
  description_ar   TEXT,
  description_en   TEXT,
  price            REAL,
  primary_image_url TEXT,
  image_urls       TEXT NOT NULL DEFAULT '[]',   -- JSON array of strings
  is_published     INTEGER NOT NULL DEFAULT 0,
  is_featured      INTEGER NOT NULL DEFAULT 0,
  sort_order       INTEGER NOT NULL DEFAULT 0,
  created_at       TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at       TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_works_published  ON works (is_published, sort_order, created_at);
CREATE INDEX IF NOT EXISTS idx_works_featured   ON works (is_featured, is_published);
CREATE INDEX IF NOT EXISTS idx_works_category   ON works (category_id, is_published);
CREATE INDEX IF NOT EXISTS idx_works_slug       ON works (slug);

-- ─── Site Content (CMS) ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS site_content (
  key        TEXT PRIMARY KEY,
  value_ar   TEXT,
  value_en   TEXT,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ─── Contact Messages ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS contact_messages (
  id         TEXT PRIMARY KEY,
  name       TEXT NOT NULL,
  email      TEXT,
  phone      TEXT,
  message    TEXT NOT NULL,
  work_slug  TEXT,
  is_read    INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_messages_read ON contact_messages (is_read, created_at);

-- ─── Admin Users ──────────────────────────────────────────────────────────────
-- Stores the single admin account (Fahad).
-- Password is hashed using PBKDF2-SHA256 via Web Crypto API.
-- Format: "pbkdf2:<salt_hex>:<hash_hex>"
CREATE TABLE IF NOT EXISTS admin_users (
  id            TEXT PRIMARY KEY,
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);
