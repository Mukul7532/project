import { Router } from 'express'
import { moveShipmentCommand } from '../controllers/shipmentCommandController.js'

const commandRouter = Router()

commandRouter.post('/shipment/move', moveShipmentCommand)

export default commandRouter