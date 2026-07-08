import crypto from 'crypto'

const TOKEN_TTL_MS = 24 * 60 * 60 * 1000 // 24 hours

function getSecret() {
  const secret = process.env.ADMIN_PASSWORD
  if (!secret) {
    throw new Error('ADMIN_PASSWORD not configured')
  }
  return secret
}

function sign(payload) {
  return crypto.createHmac('sha256', getSecret()).update(payload).digest('hex')
}

// Constant-time string comparison (hashes first so lengths can differ safely)
export function safeEqual(a, b) {
  const hashA = crypto.createHash('sha256').update(String(a)).digest()
  const hashB = crypto.createHash('sha256').update(String(b)).digest()
  return crypto.timingSafeEqual(hashA, hashB)
}

export function createAdminToken() {
  const expiresAt = Date.now() + TOKEN_TTL_MS
  return `${expiresAt}.${sign(String(expiresAt))}`
}

export function verifyAdminToken(token) {
  if (!token || typeof token !== 'string') return false

  const [expiresAt, signature] = token.split('.')
  if (!expiresAt || !signature) return false
  if (Number(expiresAt) < Date.now()) return false

  return safeEqual(sign(expiresAt), signature)
}

// Extracts and verifies the Bearer token from an API request
export function isAuthorizedAdmin(req) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  return verifyAdminToken(token)
}
