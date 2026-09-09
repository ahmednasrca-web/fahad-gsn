// Fahad Gsn — Session management using Web Crypto API
// Works in Edge Runtime + Node.js

export interface SessionPayload {
  adminId: string
  iat: number
}

const encoder = new TextEncoder()

function getSecret(): string {
  const s = process.env.SESSION_SECRET
  if (s) return s
  if (process.env.NODE_ENV === 'development') {
    return 'fahad-gsn-dev-hmac-secret-key-32-chars-min'
  }
  throw new Error('SESSION_SECRET environment variable is not configured')
}

async function getKey(secret: string): Promise<CryptoKey> {
  return globalThis.crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  )
}

function toBase64url(buffer: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

function fromBase64url(str: string): ArrayBuffer {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4)
  const binary = atob(padded)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes.buffer
}

export async function signSession(
  payload: Omit<SessionPayload, 'iat'>,
): Promise<string> {
  const data: SessionPayload = { ...payload, iat: Date.now() }
  const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(data))))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
  const key = await getKey(getSecret())
  const sig = await globalThis.crypto.subtle.sign('HMAC', key, encoder.encode(encoded))
  return `${encoded}.${toBase64url(sig)}`
}

export const SESSION_COOKIE = 'fahad_gsn_admin'
export const SESSION_MAX_AGE = 7 * 24 * 60 * 60 // 7 days in seconds

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const dotIndex = token.lastIndexOf('.')
    if (dotIndex === -1) return null
    const encoded = token.slice(0, dotIndex)
    const sig = token.slice(dotIndex + 1)
    const key = await getKey(getSecret())
    const valid = await globalThis.crypto.subtle.verify(
      'HMAC',
      key,
      fromBase64url(sig),
      encoder.encode(encoded),
    )
    if (!valid) return null
    const json = decodeURIComponent(escape(atob(encoded.replace(/-/g, '+').replace(/_/g, '/'))))
    const payload = JSON.parse(json) as SessionPayload

    // Server-side expiration check against iat
    if (!payload.iat || typeof payload.iat !== 'number') return null
    if (Date.now() - payload.iat > SESSION_MAX_AGE * 1000) {
      return null
    }

    return payload
  } catch {
    return null
  }
}

/**
 * Server-side helper to verify admin session from incoming cookies.
 */
export async function requireAdmin(): Promise<SessionPayload | null> {
  const { cookies } = await import('next/headers')
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  return token ? await verifySession(token) : null
}
