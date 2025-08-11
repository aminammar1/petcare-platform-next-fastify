import Fastify from 'fastify'
import fastifyCookie from '@fastify/cookie'
import fastifyCors from '@fastify/cors'
import dotenv from 'dotenv'
import corsOptions from './config/corsOptions.js'
import allowedOrigins from './config/allowedOrigins.js'
import { connectDB } from './config/dbConn.js'
import fastifyIO from 'fastify-socket.io'
import {
  getOrCreateChatRoom,
  addMessageToRoom,
} from './controllers/chatController.js'
import rootRoute from './routes/root.js'
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import chatRoutes from './routes/chatRoutes.js'

dotenv.config()

const isDev = process.env.NODE_ENV !== 'production'
const fastify = Fastify({
  logger: isDev
    ? {
        level: 'debug',
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
            singleLine: false,
            ignore: 'pid,hostname',
          },
        },
      }
    : true,
  disableRequestLogging: false,
  requestIdHeader: 'x-request-id',
})

await fastify.register(fastifyCookie, {
  secret: process.env.COOKIE_SECRET || 'secret',
})

await fastify.register(fastifyCors, corsOptions)

await fastify.register(fastifyIO, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
})

await fastify.register(rootRoute)
await fastify.register(authRoutes)
await fastify.register(userRoutes)
await fastify.register(chatRoutes)

try {
  await connectDB()

  fastify.io.on('connection', (socket) => {
    socket.on('join', async (room) => {
      if (!room) return

      socket.join(room)
      try {
        const chat = await getOrCreateChatRoom(room)
        socket.emit('messages', chat.messages || [])
      } catch (error) {
        socket.emit('error', 'Failed to load messages')
      }
    })

    socket.on('message', async ({ room, username, message }) => {
      if (!room || !message) return

      try {
        await addMessageToRoom(room, username || 'anonymous', message)
        fastify.io.to(room).emit('message', {
          username: username || 'anonymous',
          message,
          timestamp: new Date(),
        })
      } catch (error) {
        socket.emit('error', 'Failed to send message')
      }
    })
  })

  const port = Number(process.env.PORT) || 5000
  const host = process.env.HOST || '0.0.0.0'

  await fastify.listen({ port, host })
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}
