import { eventStoreRepository } from '../repositories/eventStoreRepository.js'

export async function moveShipmentService({ shipmentId }) {
  // Determine next version for this aggregate by reading existing events.
  // This is a simple optimistic approach: read highest version and increment.
  // Note: this requires MongoDB to be reachable for accurate version allocation.
  let nextVersion = 1

  // If repository read fails (DB unavailable), let the error propagate — caller will handle.
  const existingEvents = await eventStoreRepository.getEventsByAggregateId(shipmentId).catch((err) => {
    // Re-throw to keep error semantics; caller/controller should handle/report the failure.
    throw err
  })

  if (Array.isArray(existingEvents) && existingEvents.length > 0) {
    const last = existingEvents[existingEvents.length - 1]
    if (typeof last.version === 'number') {
      nextVersion = last.version + 1
    }
  }

  // Create the domain event to append
  const createdEvent = await eventStoreRepository.appendEvent({
    aggregateId: shipmentId,
    eventType: 'SHIPMENT_MOVED',
    payload: { shipmentId },
    version: nextVersion,
  })

  return {
    shipmentId,
    status: 'accepted',
    message: 'Shipment move command accepted.',
    event: createdEvent,
  }
}
