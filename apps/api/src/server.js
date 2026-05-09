
import dotenv from 'dotenv'
import Fastify from 'fastify'
import cors from '@fastify/cors'

import { repoRoute } from './routes/repo.js'
import { investigateRoute } from './routes/investigate.js'

dotenv.config()

const app = Fastify({
  logger: true
})

await app.register(cors, {
  origin: true
})

app.get('/health', async () => {
  return { ok: true }
})

app.register(repoRoute)
app.register(investigateRoute)

app.listen({
  port: 3001,
  host: '0.0.0.0'
})
