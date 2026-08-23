import { Router } from 'express'
import { moveShipmentCommand } from '../controllers/shipmentCommandController.js'
import { validateShipmentMoveBody } from '../middleware/validateRequest.js'

const shipmentCommandRoutes = Router()

shipmentCommandRoutes.post('/shipment/move', validateShipmentMoveBody, moveShipmentCommand)

export default shipmentCommandRoutes
