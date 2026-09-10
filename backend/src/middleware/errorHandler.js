export function errorHandler(error, _request, response, _next) {
  const candidateStatusCode = error.statusCode || (error.type === 'entity.parse.failed' ? 400 : 500)
  const statusCode = Number.isInteger(candidateStatusCode) && candidateStatusCode >= 400 && candidateStatusCode <= 599
    ? candidateStatusCode
    : 500

  const isParseError = error.type === 'entity.parse.failed'
  const isValidationError = error.type === 'validation_error'
  const isNotFound = error.type === 'not_found'
  const isConcurrencyConflict = error.type === 'concurrency_conflict'

  const message = statusCode >= 500
    ? 'Internal server error'
    : (error.message || 'Request failed')

  let errorType = 'internal_error'
  if (isParseError) {
    errorType = 'validation_error'
  } else if (isValidationError) {
    errorType = 'validation_error'
  } else if (isNotFound) {
    errorType = 'not_found'
  } else if (isConcurrencyConflict) {
    errorType = 'concurrency_conflict'
  }

  if (statusCode >= 500) {
    console.error(error)
  }

  const payload = {
    success: false,
    error: {
      type: errorType,
      message,
    },
  }

  if (Array.isArray(error.details) && error.details.length > 0) {
    payload.error.details = error.details
  }

  response.status(statusCode).json(payload)
}
