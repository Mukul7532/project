import { getShipmentPlaceholder } from '../services/shipmentQueryService.js'

export function getShipment(request, response) {
  const result = getShipmentPlaceholder(request.params.id)
  response.status(200).json(result)
}