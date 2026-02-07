import { createHmac, timingSafeEqual } from 'crypto'

const COOKIE_NAME = 'cc_skills_ok'
const MAX_AGE_SECONDS = 3600 // 1 hour

function getSecret(): string {
  return process.env.CC_SKILLS_COOKIE_SECRET || process.env.CC_SKILLS_PAGE_PASSWORD || ''
}

export function createSignedCookie(): { name: string; value: string; options: string } {
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE_SECONDS
  const secret = getSecret()
  const payload = `${exp}`
  const sig = createHmac('sha256', secret).update(payload).digest('hex')
  const value = `${payload}.${sig}`
  const isProd = process.env.NODE_ENV === 'production'
  const options = [
    'HttpOnly',
    'Path=/',
    'SameSite=Lax',
    `Max-Age=${MAX_AGE_SECONDS}`,
    ...(isProd ? ['Secure'] : []),
  ].join('; ')
  return { name: COOKIE_NAME, value, options }
}

export function verifyCookie(cookieHeader: string | null): boolean {
  if (!cookieHeader) return false
  const secret = getSecret()
  if (!secret) return false
  const pairs = cookieHeader.split(';').map((s) => s.trim())
  const found = pairs.find((p) => p.startsWith(`${COOKIE_NAME}=`))
  if (!found) return false
  const value = found.slice(COOKIE_NAME.length + 1).trim()
  const dot = value.indexOf('.')
  if (dot === -1) return false
  const payload = value.slice(0, dot)
  const sig = value.slice(dot + 1)
  const exp = parseInt(payload, 10)
  if (Number.isNaN(exp) || exp <= 0) return false
  if (Date.now() / 1000 > exp) return false // expired
  const expectedSig = createHmac('sha256', secret).update(payload).digest('hex')
  if (expectedSig.length !== sig.length) return false
  try {
    return timingSafeEqual(Buffer.from(expectedSig, 'hex'), Buffer.from(sig, 'hex'))
  } catch {
    return false
  }
}

export function getClearCookieHeader(): string {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`
}
