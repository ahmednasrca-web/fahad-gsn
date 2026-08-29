/**
 * Cloudflare binding accessors using @opennextjs/cloudflare.
 *
 * Access D1 and R2 via getCloudflareContext().env — available in
 * all server-side contexts (API routes, Server Components, Actions).
 *
 * IMPORTANT: Call only inside request handlers, not at module level.
 */
import { getCloudflareContext } from '@opennextjs/cloudflare'

interface Env {
  DB: D1Database
  WORKS_BUCKET: R2Bucket
  R2_PUBLIC_URL?: string
  SESSION_SECRET: string
}

function getEnv(): Env {
  return getCloudflareContext().env as unknown as Env
}

/** Returns the D1 database binding */
export function getDB(): D1Database {
  return getEnv().DB
}

/** Returns the R2 bucket binding */
export function getBucket(): R2Bucket {
  return getEnv().WORKS_BUCKET
}

/** Returns the R2 public base URL (without trailing slash) */
export function getR2PublicUrl(): string {
  const url = getEnv().R2_PUBLIC_URL ?? process.env.R2_PUBLIC_URL ?? ''
  return url.endsWith('/') ? url.slice(0, -1) : url
}
