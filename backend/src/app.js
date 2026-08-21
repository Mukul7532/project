import express from 'express'
import helmet from 'helmet'
import commandRouter from './commands/routes/commandRoutes.js'
import queryRouter from './queries/routes/queryRoutes.js'
import healthRouter from './routes/healthRoutes.js'
import { notFound } from './middleware/notFound.js'
import { errorHandler } from './middleware/errorHandler.js'

export function createApp() {
  const app = express()

  app.disable('x-powered-by')
  app.use(helmet())
  app.use(express.json())

  app.use('/api/health', healthRouter)
  app.use('/api/commands', commandRouter)
  app.use('/api/queries', queryRouter)

  app.use(notFound)
  app.use(errorHandler)

  return app
}
