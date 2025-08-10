import { getOrCreateChatRoom } from '../controllers/chatController.js'

async function chatRoutes(fastify) {
  fastify.get('/api/load-messages', async (req, reply) => {
    const { room } = req.query
    try {
      const chat = await getOrCreateChatRoom(room)
      return reply.send({ success: true, messages: chat.messages })
    } catch (error) {
      return reply.send({ success: false, error: error.message })
    }
  })
}

export default chatRoutes
