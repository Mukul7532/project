import { successResponse } from '../utils/response.js'
import { moveShipmentService } from '../services/shipmentCommandService.js'

export function moveShipmentCommand(request, response) {
  const result = moveShipmentService(request.validatedShipment)

  response.status(200).json(successResponse(result))
}
