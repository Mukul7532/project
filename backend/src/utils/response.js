export function successResponse(data, meta = {}) {
  const payload = {
    success: true,
    data,
  }

  if (Object.keys(meta).length > 0) {
    payload.meta = meta
  }

  return payload
}

export function errorResponse(type, message, details) {
  const payload = {
    success: false,
    error: {
      type,
      message,
    },
  }

  if (details !== undefined) {
    payload.error.details = details
  }

  return payload
}

export function validationError(message, details) {
  return errorResponse('validation_error', message, details)
}

export function notFoundError(message) {
  return errorResponse('not_found', message)
}

export function internalError(message = 'Internal server error') {
  return errorResponse('internal_error', message)
}
