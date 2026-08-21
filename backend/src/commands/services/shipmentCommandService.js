export function moveShipment(command) {
  const requiredFields = ['shipmentId', 'from', 'to']
  const missingFields = requiredFields.filter((field) => !isNonEmptyString(command?.[field]))

  if (missingFields.length > 0) {
    const error = new Error(`Missing required fields: ${missingFields.join(', ')}`)
    error.statusCode = 400
    throw error
  }

  return {
    status: 'accepted',
    message: 'Shipment move command received by the command layer.',
    command: {
      shipmentId: command.shipmentId,
      from: command.from,
      to: command.to,
    },
  }
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0
}