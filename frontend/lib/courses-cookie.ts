import { createHmac, timingSafeEqual } from 'crypto'

const COURSES_COOKIE_NAME = 'courses_session'
const MAX_AGE_SECONDS = 60 * 60 // 1 hour

type CoursesSessionPayload = {
  exp: number
  userId: string
  email: string
  accessToken: string
}

function getSecret(): string {
  return process.env.COURSES_COOKIE_SECRET || ''
}

function toBase64Url(input: string): string {
  return Buffer.from(input, 'utf8').toString('base64url')
}

function fromBase64Url(input: string): string {
  return Buffer.from(input, 'base64url').toString('utf8')
}

function sign(data: string, secret: string): string {
  return createHmac('sha256', secret).update(data).digest('hex')
}

export function createCoursesSessionCookie(userId: string, email: string, accessToken: string): { name: string; value: string; options: string } {
  const secret = getSecret()
  if (!secret) {
    throw new Error('COURSES_COOKIE_SECRET is missing')
  }

  const payload: CoursesSessionPayload = {
    exp: Math.floor(Date.now() / 1000) + MAX_AGE_SECONDS,
    userId,
    email,
    accessToken,
  }
  const encodedPayload = toBase64Url(JSON.stringify(payload))
  const signature = sign(encodedPayload, secret)
  const value = `${encodedPayload}.${signature}`
  const isProd = process.env.NODE_ENV === 'production'

  const options = [
    'HttpOnly',
    'Path=/',
    'SameSite=Lax',
    `Max-Age=${MAX_AGE_SECONDS}`,
    ...(isProd ? ['Secure'] : []),
  ].join('; ')

  return { name: COURSES_COOKIE_NAME, value, options }
}

export function verifyCoursesSessionCookie(cookieHeader: string | null): CoursesSessionPayload | null {
  if (!cookieHeader) return null
  const secret = getSecret()
  if (!secret) return null

  const pairs = cookieHeader.split(';').map((v) => v.trim())
  const found = pairs.find((v) => v.startsWith(`${COURSES_COOKIE_NAME}=`))
  if (!found) return null

  const raw = found.slice(COURSES_COOKIE_NAME.length + 1)
  const dot = raw.indexOf('.')
  if (dot === -1) return null

  const encodedPayload = raw.slice(0, dot)
  const sig = raw.slice(dot + 1)
  const expectedSig = sign(encodedPayload, secret)

  if (expectedSig.length !== sig.length) return null
  try {
    if (!timingSafeEqual(Buffer.from(expectedSig, 'hex'), Buffer.from(sig, 'hex'))) {
      return null
    }
  } catch {
    return null
  }

  try {
    const parsed = JSON.parse(fromBase64Url(encodedPayload)) as CoursesSessionPayload
    if (!parsed?.exp || !parsed?.userId || !parsed?.email || !parsed?.accessToken) return null
    if (Date.now() / 1000 > parsed.exp) return null
    return parsed
  } catch {
    return null
  }
}

export function clearCoursesSessionCookieHeader(): string {
  return `${COURSES_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`
}

