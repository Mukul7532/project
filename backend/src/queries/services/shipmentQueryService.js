export function getShipmentPlaceholder(shipmentId) {
  if (!isValidShipmentId(shipmentId)) {
    const error = new Error('Shipment ID must contain only letters, numbers, hyphens, or underscores.')
    error.statusCode = 400
    throw error
  }

  return {
    status: 'not_implemented',
    message: 'Shipment query layer established; shipment state is not available yet.',
    shipmentId,
  }
}

function isValidShipmentId(shipmentId) {
  return typeof shipmentId === 'string' && /^[a-zA-Z0-9_-]{1,100}$/.test(shipmentId)
}