import { successResponse } from '../utils/response.js'
import { moveShipmentService } from '../services/shipmentCommandService.js'

export async function moveShipmentCommand(request, response, next) {
  try {
    const result = await moveShipmentService(request.validatedShipment)
    response.status(200).json(successResponse(result))
  } catch (err) {
    next(err)
  }
}
