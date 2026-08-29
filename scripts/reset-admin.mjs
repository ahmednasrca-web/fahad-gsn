import { pbkdf2, randomBytes } from 'node:crypto'
import { promisify } from 'node:util'
import { writeFileSync } from 'node:fs'

const pbkdf2Async = promisify(pbkdf2)

async function resetAdmin() {
  const email = 'admin@fahadgsn.com'
  const password = 'admin123456'

  const salt = randomBytes(16)
  const saltHex = salt.toString('hex')
  const derivedKey = await pbkdf2Async(password, salt, 100000, 32, 'sha256')
  const hashHex = derivedKey.toString('hex')
  const passwordHash = `pbkdf2:${saltHex}:${hashHex}`

  const sql = `INSERT OR REPLACE INTO admin_users (id, email, password_hash) VALUES ('1a44b527ea2fb5f91d392d210263cee1', '${email}', '${passwordHash}');\n`
  writeFileSync('d1/seed-admin.sql', sql, 'utf-8')
  console.log('Generated d1/seed-admin.sql with email: admin@fahadgsn.com and password: admin123456')
}

resetAdmin().catch(console.error)
