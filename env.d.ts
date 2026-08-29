/// <reference types="@cloudflare/workers-types" />

// Cloudflare environment bindings — available via getCloudflareContext().env

interface CloudflareEnv {
  /** D1 SQLite database */
  DB: D1Database
  /** R2 bucket for work images */
  WORKS_BUCKET: R2Bucket
  /** HMAC secret for session signing */
  SESSION_SECRET: string
  /** Public URL prefix for R2 bucket (e.g. https://pub-xxx.r2.dev) */
  R2_PUBLIC_URL: string
  /** Public site URL */
  NEXT_PUBLIC_SITE_URL: string
  /** WhatsApp number without + */
  NEXT_PUBLIC_WHATSAPP_NUMBER: string
}
