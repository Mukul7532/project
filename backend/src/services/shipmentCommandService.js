import { eventStoreRepository } from '../repositories/eventStoreRepository.js'

export async function moveShipmentService({ shipmentId, expectedVersion }) {
  // Get the current version of the aggregate from the event store
  const currentVersion = await eventStoreRepository.getCurrentVersionOfAggregate(shipmentId)

  // Check for optimistic concurrency conflict:
  // If the client's expectedVersion doesn't match the current version,
  // reject the command with a 409 Conflict response.
  if (expectedVersion !== currentVersion) {
    throw Object.assign(
      new Error('Shipment version has changed. Reload and try again.'),
      {
        statusCode: 409,
        type: 'concurrency_conflict',
        details: [
          {
            field: 'expectedVersion',
            message: 'Shipment version has changed. Reload and try again.',
          },
        ],
      },
    )
  }

  // The expectedVersion matches the current version; compute the next version.
  const nextVersion = expectedVersion + 1

  // Create the domain event to append.
  // The MongoDB unique index on (aggregateId, version) ensures that
  // if two concurrent commands both reach this point with the same expectedVersion,
  // only one will successfully append with nextVersion; the other will fail with a duplicate key error,
  // which is then caught by appendEvent and transformed into a 409 Conflict.
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
