#!/usr/bin/env node
/**
 * Fahad Gsn — Admin User Seeder
 *
 * Usage:
 *   node scripts/seed-admin.mjs
 *
 * Then run the generated SQL:
 *   npx wrangler d1 execute fahad-gsn-db --local --file=d1/seed-admin.sql
 *   npx wrangler d1 execute fahad-gsn-db --remote --file=d1/seed-admin.sql
 */

import { pbkdf2 } from 'node:crypto'
import { promisify } from 'node:util'
import { writeFileSync } from 'node:fs'
import { randomBytes } from 'node:crypto'
import readline from 'node:readline'

const pbkdf2Async = promisify(pbkdf2)

function generateId() {
  return randomBytes(16).toString('hex')
}

async function main() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
  const question = (q) => new Promise((resolve) => rl.question(q, resolve))

  console.log('\n=== Fahad Gsn — Admin User Setup ===\n')

  const email = (await question('Admin email: ')).trim()
  const password = (await question('Admin password (min 8 chars): ')).trim()
  rl.close()

  if (!email.includes('@')) {
    console.error('❌ Invalid email')
    process.exit(1)
  }
  if (password.length < 8) {
    console.error('❌ Password must be at least 8 characters')
    process.exit(1)
  }

  console.log('\n🔐 Hashing password using PBKDF2-SHA256 (100,000 iterations)...')

  const salt = randomBytes(16)
  const saltHex = salt.toString('hex')
  const derivedKey = await pbkdf2Async(password, salt, 100000, 32, 'sha256')
  const hashHex = derivedKey.toString('hex')

  // Format: pbkdf2:<salt_hex>:<hash_hex>
  const passwordHash = `pbkdf2:${saltHex}:${hashHex}`
  const id = generateId()

  const sql = `-- Fahad Gsn admin user
-- Generated: ${new Date().toISOString()}
INSERT OR REPLACE INTO admin_users (id, email, password_hash) VALUES ('${id}', '${email}', '${passwordHash}');
`

  writeFileSync('d1/seed-admin.sql', sql, 'utf-8')

  console.log('\n✅ Generated: d1/seed-admin.sql')
  console.log('\n📋 Next steps:')
  console.log('  Local:      npx wrangler d1 execute fahad-gsn-db --local --file=d1/seed-admin.sql')
  console.log('  Production: npx wrangler d1 execute fahad-gsn-db --remote --file=d1/seed-admin.sql')
  console.log('\n⚠️  Add d1/seed-admin.sql to .gitignore (contains hashed credentials)\n')
}

main().catch(console.error)
