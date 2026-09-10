import { validationError } from '../utils/response.js'

export function validateRequest(validator, source = 'body') {
  return (request, _response, next) => {
    try {
      const payload = source === 'params' ? request.params : source === 'query' ? request.query : request.body
      const result = validator(payload)

      request.validatedShipment = result
      next()
    } catch (error) {
      const details = Array.isArray(error.details) ? error.details : undefined
      const message = error.message || 'Request validation failed.'
      next({
        statusCode: 400,
        type: error.type || 'validation_error',
        message,
        details,
      })
    }
  }
}

function validateExpectedVersion(value, fieldName = 'expectedVersion') {
  if (value === undefined || value === null) {
    throw Object.assign(new Error(`${fieldName} is required`), {
      statusCode: 400,
      type: 'validation_error',
      details: [{ field: fieldName, message: `${fieldName} is required` }],
    })
  }

  if (!Number.isInteger(value)) {
    throw Object.assign(new Error(`${fieldName} must be an integer`), {
      statusCode: 400,
      type: 'validation_error',
      details: [{ field: fieldName, message: `${fieldName} must be an integer` }],
    })
  }

  if (value < 0) {
    throw Object.assign(new Error(`${fieldName} must be a non-negative integer`), {
      statusCode: 400,
      type: 'validation_error',
      details: [{ field: fieldName, message: `${fieldName} must be a non-negative integer` }],
    })
  }

  return value
}

export function validateShipmentMoveBody(request, _response, next) {
  return validateRequest((body) => {
    const { shipmentId, expectedVersion } = body ?? {}

    if (typeof shipmentId !== 'string') {
      throw Object.assign(new Error('shipmentId must be a string'), {
        statusCode: 400,
        type: 'validation_error',
        details: [{ field: 'shipmentId', message: 'shipmentId must be a string' }],
      })
    }

    const trimmed = shipmentId.trim()

    if (!trimmed) {
      throw Object.assign(new Error('shipmentId cannot be empty'), {
        statusCode: 400,
        type: 'validation_error',
        details: [{ field: 'shipmentId', message: 'shipmentId cannot be empty' }],
      })
    }

    if (!/^SHIP-\d+$/i.test(trimmed)) {
      throw Object.assign(new Error('shipmentId must match SHIP-1234 format'), {
        statusCode: 400,
        type: 'validation_error',
        details: [{ field: 'shipmentId', message: 'shipmentId must match SHIP-1234 format' }],
      })
    }

    const validatedExpectedVersion = validateExpectedVersion(expectedVersion)

    return { shipmentId: trimmed, expectedVersion: validatedExpectedVersion }
  })(request, _response, next)
}
