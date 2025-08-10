    import fp from 'fastify-plugin'
    import Roles from '../config/roles.js'

    export const requireRole = (required) => {
    const roles = Array.isArray(required) ? required : [required]
    return async (request, reply) => {
        const current = request.userRole || request.user?.role
        if (!current) return reply.code(401).send({ message: 'Unauthorized' })
        if (!roles.includes(current))
        return reply.code(403).send({ message: 'Forbidden' })
    }
    }

    // Plugin to enforce role across a scope
    const rolePlugin = (required) => async (fastify) => {
    fastify.addHook('preHandler', requireRole(required))
    }

    export const verifyAdmin = fp(rolePlugin(Roles.Admin))
    export const verifyVet = fp(rolePlugin(Roles.Vet))
    export const verifyUser = fp(rolePlugin(Roles.User))

    export default fp(async () => {})
