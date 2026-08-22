import { Router } from 'express'
import { getShipmentQuery } from '../controllers/shipmentQueryController.js'
import { validateRequest } from '../middleware/validateRequest.js'
import { validateShipmentRouteParams } from '../validators/shipmentValidation.js'

const shipmentQueryRoutes = Router()

shipmentQueryRoutes.get('/shipment/:id', validateRequest(validateShipmentRouteParams, 'params'), getShipmentQuery)

export default shipmentQueryRoutes
