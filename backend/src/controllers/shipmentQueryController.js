import { successResponse } from '../utils/response.js'
import { getShipmentQueryService } from '../services/shipmentQueryService.js'

export function getShipmentQuery(request, response) {
  const result = getShipmentQueryService(request.validatedShipment)

  response.status(200).json(successResponse(result))
}
