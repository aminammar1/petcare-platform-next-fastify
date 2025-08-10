import * as usersController from '../controllers/usersController.js'
import verifyJWT from '../middleware/verifyJWT.js'
import { verifyAdmin } from '../middleware/verifyRole.js'
import Roles from '../config/roles.js'

async function userRoutes(fastify) {
  await fastify.register(verifyJWT)
  // Only admins can list all users
  await fastify.register(verifyAdmin)
  fastify.get('/users', usersController.getAllUsers)
}

export default userRoutes
