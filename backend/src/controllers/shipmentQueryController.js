import { successResponse } from '../utils/response.js'
import { getShipmentQueryService } from '../services/shipmentQueryService.js'

export async function getShipmentQuery(request, response, next) {
  try {
    const result = await getShipmentQueryService(request.validatedShipment)
    response.status(200).json(successResponse(result))
  } catch (error) {
    next(error)
  }
}
