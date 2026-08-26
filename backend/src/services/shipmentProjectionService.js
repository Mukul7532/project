import { createValidationError } from '../validators/shipmentValidation.js'

/**
 * applyEvent(state, event) => newState
 *
 * Pure reducer that applies a single event to the shipment read-model state.
 * Keep this function small and deterministic so it is easy to unit-test.
 */
export function applyEvent(state, event) {
  const evt = event || {}
  const type = (evt.eventType || '').toUpperCase()
  const payload = evt.payload || {}

  // Defensive copy of state parts the reducer will mutate
  const next = {
    ...state,
    containers: Array.isArray(state.containers) ? [...state.containers] : [],
  }

  switch (type) {
    case 'CONTAINER_CREATED': {
      const containerId = payload.containerId
      if (!containerId) throw createValidationError('containerId is required in CONTAINER_CREATED', [{ field: 'containerId', message: 'containerId is required' }])
      // Add container if not present
      if (!next.containers.some((c) => c.containerId === containerId)) {
        next.containers.push({ containerId, location: payload.location ?? null, weight: payload.weight ?? null })
      }
      next.status = 'container_created'
      break
    }

    case 'CONTAINER_LOADED': {
      const containerId = payload.containerId
      if (!containerId) throw createValidationError('containerId is required in CONTAINER_LOADED', [{ field: 'containerId', message: 'containerId is required' }])
      const idx = next.containers.findIndex((c) => c.containerId === containerId)
      if (idx === -1) {
        // best-effort: create missing container entry
        next.containers.push({ containerId, location: payload.location ?? null, weight: payload.weight ?? null })
      } else {
        next.containers[idx] = { ...next.containers[idx], weight: payload.weight ?? next.containers[idx].weight, location: payload.location ?? next.containers[idx].location }
      }
      next.status = 'loaded'
      break
    }

    case 'CONTAINER_REPLACED': {
      const containerId = payload.containerId
      if (!containerId) throw createValidationError('containerId is required in CONTAINER_REPLACED', [{ field: 'containerId', message: 'containerId is required' }])
      const idx = next.containers.findIndex((c) => c.containerId === containerId)
      if (idx === -1) {
        next.containers.push({ containerId, location: payload.location ?? null, weight: payload.weight ?? null })
      } else {
        next.containers[idx] = { containerId, location: payload.location ?? null, weight: payload.weight ?? null }
      }
      next.status = 'container_replaced'
      break
    }

    case 'SHIPMENT_MOVED':
      // optional payload.location
      if (payload.location) next.location = payload.location
      next.status = 'moved'
      break

    case 'ARRIVED_AT_PORT':
      if (payload.portId) next.location = payload.portId
      next.status = 'arrived'
      break

    default:
      // Unknown event types are not allowed — validation/domain error
      throw createValidationError(`Unsupported eventType: ${type}`, [{ field: 'eventType', message: `Unsupported eventType: ${type}` }])
  }

  // Update bookkeeping fields from event
  if (typeof evt.version === 'number' && evt.version > (next.version || 0)) {
    next.version = evt.version
  }
  if (evt.timestamp) {
    // keep lastUpdated as the most recent timestamp
    const ts = new Date(evt.timestamp)
    if (!next.lastUpdated || ts.getTime() >= new Date(next.lastUpdated).getTime()) {
      next.lastUpdated = ts
    }
  }

  return next
}

/**
 * buildProjectionFromEvents(events, opts)
 *
 * events: array of event objects (assumed ordered by version asc)
 * returns a projection/read-model object for the shipment
 */
export function buildProjectionFromEvents(events = []) {
  const initial = {
    shipmentId: null,
    status: 'unknown',
    containers: [],
    location: null,
    version: 0,
    lastUpdated: null,
  }

  let state = initial
  for (const ev of events) {
    state = applyEvent(state, ev)
  }

  // Ensure shipmentId comes from last event if missing
  if (!state.shipmentId && events.length > 0) {
    state.shipmentId = events[events.length - 1].aggregateId || null
  }

  return state
}