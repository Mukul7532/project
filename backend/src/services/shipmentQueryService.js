import { eventStoreRepository } from '../repositories/eventStoreRepository.js'
import { buildProjectionFromEvents } from './shipmentProjectionService.js'

export async function getShipmentQueryService({ shipmentId }) {
  // Read events for the aggregate and construct a full projection by replay
  // If DB is unavailable this will throw and the controller/test will surface the error.
  const events = await eventStoreRepository.getEventsByAggregateId(shipmentId)

  // events are expected to be ordered by version asc by the repository
  const projection = buildProjectionFromEvents(events)

  return {
    shipmentId,
    message: 'Shipment query accepted.',
    data: projection,
    events,
  }
}