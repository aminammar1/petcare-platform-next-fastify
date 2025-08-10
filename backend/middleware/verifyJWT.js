import fp from 'fastify-plugin'
import jwt from 'jsonwebtoken'

// Standalone preHandler for routes that can't register the plugin
export const requireAuth = async (request, reply) => {
  // Use httpOnly access cookie set on login/refresh
  const token = request.cookies?.access
  if (!token) {
    return reply.code(401).send({ message: 'Unauthorized' })
  }
  const secret = process.env.ACCESS_TOKEN_SECRET
  if (!secret) {
    request.log.error('Missing ACCESS_TOKEN_SECRET')
    return reply.code(500).send({ message: 'Server misconfiguration' })
  }
  try {
    const decoded = jwt.verify(token, secret)
    // Attach full decoded token and convenience fields
    request.user = decoded
    request.userId = decoded.sub
    request.userRole = decoded.role
  } catch {
    return reply.code(401).send({ message: 'Unauthorized' })
  }
}

// Plugin variant to protect all routes within a scope
const plugin = async (fastify) => {
  fastify.decorateRequest('user', null)
  fastify.decorateRequest('userId', null)
  fastify.decorateRequest('userRole', null)
  fastify.addHook('preHandler', requireAuth)
}

export default fp(plugin)
