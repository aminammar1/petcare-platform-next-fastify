async function rootRoute(fastify) {
  fastify.get('/', async () => {
    return 'Hello from my API'
  })
}

export default rootRoute
