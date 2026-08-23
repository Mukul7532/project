import express from 'express'
import helmet from 'helmet'
import healthRouter from './routes/healthRoutes.js'
import shipmentCommandRoutes from './routes/shipmentCommandRoutes.js'
import shipmentQueryRoutes from './routes/shipmentQueryRoutes.js'
import { notFound } from './middleware/notFound.js'
import { errorHandler } from './middleware/errorHandler.js'

export function createApp() {
  const app = express()

  app.disable('x-powered-by')
  app.use(helmet())
  app.use(express.json())

  app.use('/api/health', healthRouter)
  app.use('/api/commands', shipmentCommandRoutes)
  app.use('/api/queries', shipmentQueryRoutes)

  app.use(notFound)
  app.use(errorHandler)

  return app
}
