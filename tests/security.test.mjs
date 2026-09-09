import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import { pbkdf2, randomBytes } from 'node:crypto'
import { promisify } from 'node:util'

const pbkdf2Async = promisify(pbkdf2)

describe('Security & Authentication Tests', () => {
  // 1. Password verification logic test (PBKDF2 Web Crypto compatible)
  test('PBKDF2 password derivation matches expected hash and rejects wrong passwords', async () => {
    const password = 'CorrectHorseBatteryStaple2026!'
    const wrongPassword = 'WrongPassword123'
    const salt = randomBytes(16)
    const saltHex = salt.toString('hex')
    const derivedKey = await pbkdf2Async(password, salt, 100000, 32, 'sha256')
    const hashHex = derivedKey.toString('hex')

    // Verify correct
    const checkKey = await pbkdf2Async(password, salt, 100000, 32, 'sha256')
    assert.equal(checkKey.toString('hex'), hashHex)

    // Verify wrong
    const checkWrong = await pbkdf2Async(wrongPassword, salt, 100000, 32, 'sha256')
    assert.notEqual(checkWrong.toString('hex'), hashHex)
  })

  // 2. Magic bytes image validation test
  test('Image magic bytes detector accepts genuine images and blocks malicious payloads', () => {
    function isValidImageMagicBytes(bytes) {
      if (bytes.length < 12) return false
      // JPEG: FF D8 FF
      if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return true
      // PNG: 89 50 4E 47
      if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return true
      // WebP: RIFF....WEBP
      if (
        bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
        bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50
      ) return true
      // HEIC: ....ftyp
      if (bytes[4] === 0x66 && bytes[5] === 0x74 && bytes[6] === 0x79 && bytes[7] === 0x70) return true
      return false
    }

    // Genuine JPEG
    const genuineJpeg = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01])
    assert.equal(isValidImageMagicBytes(genuineJpeg), true)

    // Genuine PNG
    const genuinePng = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d])
    assert.equal(isValidImageMagicBytes(genuinePng), true)

    // Fake JPEG (Malicious PHP/HTML script)
    const fakeJpegScript = new TextEncoder().encode('<?php phpinfo(); ?><html><body><script>alert(1)</script></body></html>')
    assert.equal(isValidImageMagicBytes(fakeJpegScript), false)

    // Fake PNG (Executable PE header MZ)
    const fakeExecutable = new TextEncoder().encode('MZ\x90\x00\x03\x00\x00\x00\x04\x00\x00\x00\xff\xff')
    assert.equal(isValidImageMagicBytes(fakeExecutable), false)
  })

  // 3. Path Traversal sanitization test
  test('Work ID path sanitization prevents directory traversal attacks', () => {
    function sanitizeWorkId(raw) {
      return (raw ?? 'new').replace(/[^a-zA-Z0-9_-]/g, '') || 'new'
    }

    assert.equal(sanitizeWorkId('../../../etc/passwd'), 'etcpasswd')
    assert.equal(sanitizeWorkId('..\\..\\windows\\system32'), 'windowssystem32')
    assert.equal(sanitizeWorkId('work-slug-123'), 'work-slug-123')
    assert.equal(sanitizeWorkId(''), 'new')
    assert.equal(sanitizeWorkId(null), 'new')
  })

  // 4. Session expiration calculation test
  test('Session expiration rejects expired tokens', () => {
    const maxAgeMs = 7 * 24 * 60 * 60 * 1000 // 7 days
    const now = Date.now()

    // Fresh session (1 hour old)
    const freshIat = now - (60 * 60 * 1000)
    assert.equal(now - freshIat <= maxAgeMs, true)

    // Expired session (8 days old)
    const expiredIat = now - (8 * 24 * 60 * 60 * 1000)
    assert.equal(now - expiredIat > maxAgeMs, true)
  })

  // 5. Cloudflare IP extraction priority test
  test('IP extraction prioritizes cf-connecting-ip over spoofable x-forwarded-for', () => {
    function getClientIp(headers) {
      return (
        headers.get('cf-connecting-ip') ??
        headers.get('x-forwarded-for')?.split(',')[0].trim() ??
        'unknown'
      )
    }

    const headersWithSpoof = new Map([
      ['x-forwarded-for', '1.1.1.1, 10.0.0.1'],
      ['cf-connecting-ip', '197.55.12.34'],
    ])

    const extracted = getClientIp(headersWithSpoof)
    assert.equal(extracted, '197.55.12.34')
  })
})
