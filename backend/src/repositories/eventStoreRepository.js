import Event from '../models/Event.js'

function normalizeAggregateId(aggregateId) {
  if (typeof aggregateId !== 'string') {
    throw Object.assign(new Error('aggregateId must be a non-empty string'), {
      statusCode: 400,
      type: 'validation_error',
      details: [{ field: 'aggregateId', message: 'aggregateId must be a non-empty string' }],
    })
  }

  const trimmedAggregateId = aggregateId.trim()

  if (!trimmedAggregateId) {
    throw Object.assign(new Error('aggregateId is required'), {
      statusCode: 400,
      type: 'validation_error',
      details: [{ field: 'aggregateId', message: 'aggregateId is required' }],
    })
  }

  return trimmedAggregateId
}

function normalizeEventType(eventType) {
  if (typeof eventType !== 'string') {
    throw Object.assign(new Error('eventType must be a non-empty string'), {
      statusCode: 400,
      type: 'validation_error',
      details: [{ field: 'eventType', message: 'eventType must be a non-empty string' }],
    })
  }

  const trimmedEventType = eventType.trim()

  if (!trimmedEventType) {
    throw Object.assign(new Error('eventType is required'), {
      statusCode: 400,
      type: 'validation_error',
      details: [{ field: 'eventType', message: 'eventType is required' }],
    })
  }

  return trimmedEventType
}

function normalizePayload(payload) {
  if (payload === undefined || payload === null) {
    throw Object.assign(new Error('payload is required'), {
      statusCode: 400,
      type: 'validation_error',
      details: [{ field: 'payload', message: 'payload is required' }],
    })
  }

  if (typeof payload !== 'object' || Array.isArray(payload)) {
    throw Object.assign(new Error('payload must be a JSON object'), {
      statusCode: 400,
      type: 'validation_error',
      details: [{ field: 'payload', message: 'payload must be a JSON object' }],
    })
  }

  return payload
}

function normalizeVersion(version) {
  if (!Number.isInteger(version) || version <= 0) {
    throw Object.assign(new Error('version must be a positive integer'), {
      statusCode: 400,
      type: 'validation_error',
      details: [{ field: 'version', message: 'version must be a positive integer' }],
    })
  }

  return version
}

export const eventStoreRepository = {
  async appendEvent(eventData) {
    const aggregateId = normalizeAggregateId(eventData?.aggregateId)
    const eventType = normalizeEventType(eventData?.eventType)
    const payload = normalizePayload(eventData?.payload)
    const version = normalizeVersion(eventData?.version)

    try {
      const createdEvent = await Event.create({
        aggregateId,
        eventType,
        payload,
        version,
        timestamp: new Date(),
      })

      return createdEvent.toObject()
    } catch (error) {
      if (error?.code === 11000) {
        throw Object.assign(new Error('Duplicate aggregateId and version combination detected'), {
          statusCode: 409,
          type: 'validation_error',
          details: [{ field: 'aggregateId+version', message: 'Duplicate aggregateId and version combination detected' }],
        })
      }

      if (error?.name === 'ValidationError') {
        const details = Object.entries(error.errors || {}).map(([field, validationError]) => ({
          field,
          message: validationError.message,
        }))

        throw Object.assign(new Error(error.message), {
          statusCode: 400,
          type: 'validation_error',
          details,
        })
      }

      throw error
    }
  },

  async getEventsByAggregateId(aggregateId) {
    const normalizedAggregateId = normalizeAggregateId(aggregateId)

    const events = await Event.find({ aggregateId: normalizedAggregateId }).sort({ version: 1 }).lean()

    return events
  },
}

export default eventStoreRepository
