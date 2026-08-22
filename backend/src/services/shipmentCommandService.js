export function moveShipmentService({ shipmentId }) {
  return {
    shipmentId,
    status: 'accepted',
    message: 'Shipment move command accepted.',
  }
}
