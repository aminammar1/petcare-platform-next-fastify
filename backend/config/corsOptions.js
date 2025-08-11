import allowedOrigins, { isAllowedOrigin } from './allowedOrigins.js'

const corsOptions = {
  origin: (origin, callback) => {
    if (isAllowedOrigin(origin)) return callback(null, true)
    return callback(new Error('Not allowed by CORS'))
  },
  credentials: true,
  // Optionally expose allowed origins list for preflight caching hints
  // allowedHeaders, exposedHeaders can be customized here if needed
}

export default corsOptions
