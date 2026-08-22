export function errorHandler(error, _request, response, _next) {
  const candidateStatusCode = error.statusCode || (error.type === 'entity.parse.failed' ? 400 : 500)
  const statusCode = Number.isInteger(candidateStatusCode) && candidateStatusCode >= 400 && candidateStatusCode <= 599
    ? candidateStatusCode
    : 500

  const isParseError = error.type === 'entity.parse.failed'
  const isValidationError = error.type === 'validation_error'
  const isNotFound = error.type === 'not_found'

  const message = statusCode >= 500
    ? 'Internal server error'
    : (error.message || 'Request failed')

  const errorType = isParseError ? 'validation_error' : isValidationError ? 'validation_error' : isNotFound ? 'not_found' : 'internal_error'

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
