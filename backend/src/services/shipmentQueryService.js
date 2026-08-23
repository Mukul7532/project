export function getShipmentQueryService({ shipmentId }) {
  return {
    shipmentId,
    status: 'available',
    message: 'Shipment query accepted.',
  }
}
