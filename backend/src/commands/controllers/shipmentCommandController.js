import { moveShipment } from '../services/shipmentCommandService.js'

export function moveShipmentCommand(request, response) {
  const result = moveShipment(request.body)
  response.status(202).json(result)
}