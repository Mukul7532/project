import { successResponse } from '../utils/response.js'

export function getHealth(_request, response) {
  response.status(200).json(successResponse({
    service: 'audit-trail-api',
    status: 'ok',
  }))
}
