export function errorHandler(error, _request, response, _next) {
  const candidateStatusCode = error.statusCode || (error.type === 'entity.parse.failed' ? 400 : 500)
  const statusCode = Number.isInteger(candidateStatusCode) && candidateStatusCode >= 400 && candidateStatusCode <= 599
    ? candidateStatusCode
    : 500
  const message = statusCode >= 500 ? 'Internal server error' : error.message

  if (statusCode >= 500) {
    console.error(error)
  }

  response.status(statusCode).json({
    status: 'error',
    message,
  })
}
