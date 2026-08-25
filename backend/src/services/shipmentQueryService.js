import { eventStoreRepository } from '../repositories/eventStoreRepository.js'

export async function getShipmentQueryService({ shipmentId }) {
  // Read events for the aggregate and construct a minimal read model / projection.
  // If DB is unavailable this will throw and the controller/test will surface the error.
  const events = await eventStoreRepository.getEventsByAggregateId(shipmentId)

  // Minimal projection: decide status based on last event type (example mapping).
  let status = 'unknown'
  if (events && events.length > 0) {
    const last = events[events.length - 1]
    // Map eventType to a readable status; extend as needed for Day 5 domain rules.
    switch (last.eventType) {
      case 'CONTAINER_CREATED':
      case 'SHIPMENT_CREATED':
        status = 'created'
        break
      case 'CONTAINER_LOADED':
      case 'SHIPMENT_MOVED':
        status = 'moved'
        break
      default:
        status = 'updated'
    }
  }

  return {
    shipmentId,
    status,
    message: 'Shipment query accepted.',
    events,
  }
}