import { createApp } from './app.js'
import { connectToDatabase, disconnectFromDatabase } from './config/database.js'
import { env } from './config/env.js'

const app = createApp()

try {
  await connectToDatabase(env.mongodbUri)

  const server = app.listen(env.port, () => {
    console.log(`Audit Trail API listening on port ${env.port}`)
  })

  async function shutdown(signal) {
    console.log(`${signal} received, shutting down`)
    server.close(async () => {
      await disconnectFromDatabase()
      process.exit(0)
    })
  }

  process.once('SIGINT', () => shutdown('SIGINT'))
  process.once('SIGTERM', () => shutdown('SIGTERM'))
} catch (error) {
  console.error(error.message)
  process.exitCode = 1
}