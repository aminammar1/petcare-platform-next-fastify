// Build an allowlist of origins from environment variables, supporting:
// - Comma-separated list in ALLOW_ORIGINS / ALLOWED_ORIGINS / CORS_ORIGINS / FRONTEND_URL
// - Wildcard domain suffix entries like ".vercel.app" or "*.vercel.app" (matches any subdomain)
// - Sensible dev defaults (localhost)

const collectFromEnv = () => {
  const raw = [
    process.env.ALLOW_ORIGINS,
    process.env.ALLOWED_ORIGINS,
    process.env.CORS_ORIGINS,
    process.env.FRONTEND_URL,
  ]
    .filter(Boolean)
    .join(',')

  const parts = raw
    .split(',')
    .map((s) => s && s.trim())
    .filter(Boolean)

  // Dev defaults
  const isProd = process.env.NODE_ENV === 'production'
  if (!isProd) {
    parts.push('http://localhost:3000', 'http://127.0.0.1:3000')
  }

  // Deduplicate while preserving order
  const seen = new Set()
  const unique = []
  for (const p of parts) {
    if (!seen.has(p)) {
      seen.add(p)
      unique.push(p)
    }
  }
  return unique
}

const allowedOrigins = collectFromEnv()

// Precompute suffix matchers for wildcard entries like "*.vercel.app" or ".vercel.app"
const wildcardSuffixes = allowedOrigins
  .filter((v) => v.startsWith('*.') || v.startsWith('.'))
  .map((v) => v.replace(/^\*\./, '.')) // normalize to leading dot

// Exact origins are full origin strings (protocol + host[:port]) without wildcard
const exactOrigins = allowedOrigins.filter(
  (v) => !(v.startsWith('*.') || v.startsWith('.'))
)

export const isAllowedOrigin = (origin) => {
  // Allow non-browser or same-origin requests where origin may be undefined
  if (!origin) return true
  try {
    const url = new URL(origin)
    const host = url.hostname
    const normalized = `${url.protocol}//${url.host}`

    if (exactOrigins.includes(origin) || exactOrigins.includes(normalized)) {
      return true
    }

    // Match suffixes (e.g., origin host ends with ".vercel.app")
    if (
      wildcardSuffixes.some((suffix) => {
        const suf = suffix.startsWith('.') ? suffix.slice(1) : suffix
        return host === suf || host.endsWith(`.${suf}`)
      })
    ) {
      return true
    }

    return false
  } catch {
    // If origin isn't a valid URL, fallback to exact string match
    return exactOrigins.includes(origin)
  }
}

export default allowedOrigins
