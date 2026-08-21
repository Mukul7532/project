import { Router } from 'express'
import { getShipment } from '../controllers/shipmentQueryController.js'

const queryRouter = Router()

queryRouter.get('/shipment/:id', getShipment)

export default queryRouter