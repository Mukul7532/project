export function createValidationError(message, details = []) {
  const error = new Error(message)
  error.statusCode = 400
  error.type = 'validation_error'

  if (details.length > 0) {
    error.details = details
  }

  return error
}

const SHIPMENT_ID_PATTERN = /^SHIP-\d+$/i

export function validateShipmentId(value, fieldName = 'shipmentId') {
  if (value === undefined || value === null) {
    throw createValidationError(`${fieldName} is required`, [{ field: fieldName, message: `${fieldName} is required` }])
  }

  if (typeof value !== 'string') {
    throw createValidationError(`${fieldName} must be a string`, [{ field: fieldName, message: `${fieldName} must be a string` }])
  }

  const trimmedValue = value.trim()

  if (!trimmedValue) {
    throw createValidationError(`${fieldName} cannot be empty`, [{ field: fieldName, message: `${fieldName} cannot be empty` }])
  }

  if (!SHIPMENT_ID_PATTERN.test(trimmedValue)) {
    throw createValidationError(`${fieldName} must match SHIP-1234 format`, [{ field: fieldName, message: `${fieldName} must match SHIP-1234 format` }])
  }

  return trimmedValue
}

export function validateShipmentMoveRequest(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw createValidationError('Request body must be a JSON object', [{ field: 'body', message: 'Request body must be a JSON object' }])
  }

  const shipmentId = validateShipmentId(body.shipmentId, 'shipmentId')

  return { shipmentId }
}

export function validateShipmentRouteParams(params = {}) {
  const rawId = params.id ?? params.shipmentId
  const shipmentId = validateShipmentId(rawId, 'id')

  return { shipmentId }
}
