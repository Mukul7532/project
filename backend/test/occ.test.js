import test from 'node:test'
import assert from 'node:assert/strict'
import mongoose from 'mongoose'
import { createApp } from '../src/app.js'
import { connectToDatabase, disconnectFromDatabase } from '../src/config/database.js'
import Event from '../src/models/Event.js'
import { eventStoreRepository } from '../src/repositories/eventStoreRepository.js'

const mongoUri = process.env.MONGODB_URI

async function request(app, path, options = {}) {
  const server = app.listen(0)
  await new Promise((resolve) => server.once('listening', resolve))

  const { port } = server.address()
  const response = await fetch(`http://127.0.0.1:${port}${path}`, options)
  const body = await response.text()
  let json = null

  try {
    json = body ? JSON.parse(body) : null
  } catch {
    json = body
  }

  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()))
  })

  return { status: response.status, body: json }
}

test.before(async () => {
  if (!mongoUri) {
    throw new Error('MONGODB_URI is required for OCC tests.')
  }

  await connectToDatabase(mongoUri)
})

test.after(async () => {
  await disconnectFromDatabase()
})

async function resetEventCollection() {
  await mongoose.connection.db.collection('events').deleteMany({})
}

test('getCurrentVersionOfAggregate returns 0 when no events exist', async () => {
  await resetEventCollection()

  const version = await eventStoreRepository.getCurrentVersionOfAggregate('SHIP-OCC-01')

  assert.equal(version, 0)
})

test('getCurrentVersionOfAggregate returns the highest version', async () => {
  await resetEventCollection()

  await eventStoreRepository.appendEvent({
    aggregateId: 'SHIP-OCC-02',
    eventType: 'SHIPMENT_MOVED',
    payload: { shipmentId: 'SHIP-OCC-02' },
    version: 1,
  })

  await eventStoreRepository.appendEvent({
    aggregateId: 'SHIP-OCC-02',
    eventType: 'SHIPMENT_MOVED',
    payload: { shipmentId: 'SHIP-OCC-02' },
    version: 2,
  })

  const version = await eventStoreRepository.getCurrentVersionOfAggregate('SHIP-OCC-02')

  assert.equal(version, 2)
})

test('POST /api/commands/shipment/move rejects missing expectedVersion', async () => {
  await resetEventCollection()

  const app = createApp()
  const result = await request(app, '/api/commands/shipment/move', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ shipmentId: 'SHIP-OCC-03' }),
  })

  assert.equal(result.status, 400)
  assert.equal(result.body.success, false)
  assert.equal(result.body.error.type, 'validation_error')
  assert.ok(result.body.error.message.includes('expectedVersion'))
})

test('POST /api/commands/shipment/move rejects non-integer expectedVersion', async () => {
  await resetEventCollection()

  const app = createApp()
  const result = await request(app, '/api/commands/shipment/move', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ shipmentId: 'SHIP-OCC-04', expectedVersion: 1.5 }),
  })

  assert.equal(result.status, 400)
  assert.equal(result.body.success, false)
  assert.equal(result.body.error.type, 'validation_error')
  assert.ok(result.body.error.message.includes('integer'))
})

test('POST /api/commands/shipment/move rejects negative expectedVersion', async () => {
  await resetEventCollection()

  const app = createApp()
  const result = await request(app, '/api/commands/shipment/move', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ shipmentId: 'SHIP-OCC-05', expectedVersion: -1 }),
  })

  assert.equal(result.status, 400)
  assert.equal(result.body.success, false)
  assert.equal(result.body.error.type, 'validation_error')
  assert.ok(result.body.error.message.includes('non-negative'))
})

test('POST /api/commands/shipment/move accepts valid command with expectedVersion 0 (new aggregate)', async () => {
  await resetEventCollection()

  const app = createApp()
  const result = await request(app, '/api/commands/shipment/move', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ shipmentId: 'SHIP-OCC-06', expectedVersion: 0 }),
  })

  assert.equal(result.status, 200)
  assert.equal(result.body.success, true)
  assert.equal(result.body.data.shipmentId, 'SHIP-OCC-06')
  assert.equal(result.body.data.event.version, 1)
})

test('event version increments correctly after successful command', async () => {
  await resetEventCollection()

  const app = createApp()

  // First command with expectedVersion 0
  const result1 = await request(app, '/api/commands/shipment/move', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ shipmentId: 'SHIP-OCC-07', expectedVersion: 0 }),
  })

  assert.equal(result1.body.data.event.version, 1)

  // Second command with expectedVersion 1
  const result2 = await request(app, '/api/commands/shipment/move', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ shipmentId: 'SHIP-OCC-07', expectedVersion: 1 }),
  })

  assert.equal(result2.body.data.event.version, 2)

  // Third command with expectedVersion 2
  const result3 = await request(app, '/api/commands/shipment/move', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ shipmentId: 'SHIP-OCC-07', expectedVersion: 2 }),
  })

  assert.equal(result3.body.data.event.version, 3)
})

test('POST /api/commands/shipment/move rejects stale expectedVersion with 409 Conflict', async () => {
  await resetEventCollection()

  const app = createApp()

  // First command creates version 1
  await request(app, '/api/commands/shipment/move', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ shipmentId: 'SHIP-OCC-08', expectedVersion: 0 }),
  })

  // Try to use stale expectedVersion 0
  const result = await request(app, '/api/commands/shipment/move', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ shipmentId: 'SHIP-OCC-08', expectedVersion: 0 }),
  })

  assert.equal(result.status, 409)
  assert.equal(result.body.success, false)
  assert.equal(result.body.error.type, 'concurrency_conflict')
  assert.ok(result.body.error.message.includes('version has changed'))
})

test('concurrency conflict does not append an event', async () => {
  await resetEventCollection()

  const app = createApp()

  // First command creates version 1
  await request(app, '/api/commands/shipment/move', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ shipmentId: 'SHIP-OCC-09', expectedVersion: 0 }),
  })

  // Get current event count
  let events = await eventStoreRepository.getEventsByAggregateId('SHIP-OCC-09')
  const initialCount = events.length
  assert.equal(initialCount, 1)

  // Try to use stale expectedVersion
  await request(app, '/api/commands/shipment/move', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ shipmentId: 'SHIP-OCC-09', expectedVersion: 0 }),
  })

  // Check event count again — should not have increased
  events = await eventStoreRepository.getEventsByAggregateId('SHIP-OCC-09')
  assert.equal(events.length, initialCount)
})

test('concurrency conflict does not change aggregate version', async () => {
  await resetEventCollection()

  const app = createApp()

  // First command creates version 1
  await request(app, '/api/commands/shipment/move', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ shipmentId: 'SHIP-OCC-10', expectedVersion: 0 }),
  })

  // Get current version
  let version = await eventStoreRepository.getCurrentVersionOfAggregate('SHIP-OCC-10')
  assert.equal(version, 1)

  // Try to use stale expectedVersion
  await request(app, '/api/commands/shipment/move', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ shipmentId: 'SHIP-OCC-10', expectedVersion: 0 }),
  })

  // Check version again — should not have changed
  version = await eventStoreRepository.getCurrentVersionOfAggregate('SHIP-OCC-10')
  assert.equal(version, 1)
})

test('existing events remain immutable after concurrency conflict', async () => {
  await resetEventCollection()

  const app = createApp()

  // First command creates version 1
  const result1 = await request(app, '/api/commands/shipment/move', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ shipmentId: 'SHIP-OCC-11', expectedVersion: 0 }),
  })

  const originalEvent = result1.body.data.event

  // Try to use stale expectedVersion
  await request(app, '/api/commands/shipment/move', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ shipmentId: 'SHIP-OCC-11', expectedVersion: 0 }),
  })

  // Fetch the event directly and verify it hasn't changed
  const events = await eventStoreRepository.getEventsByAggregateId('SHIP-OCC-11')
  const storedEvent = events[0]

  assert.equal(storedEvent.version, originalEvent.version)
  assert.equal(storedEvent.eventType, originalEvent.eventType)
  assert.deepEqual(storedEvent.payload, originalEvent.payload)
})

test('two concurrent commands targeting the same version cannot both succeed', async () => {
  await resetEventCollection()

  const app = createApp()

  // First command creates version 1
  await request(app, '/api/commands/shipment/move', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ shipmentId: 'SHIP-OCC-12', expectedVersion: 0 }),
  })

  // Simulate two concurrent commands targeting the same nextVersion (2)
  // Both will have expectedVersion = 1 and should produce version = 2
  const promise1 = request(app, '/api/commands/shipment/move', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ shipmentId: 'SHIP-OCC-12', expectedVersion: 1 }),
  })

  const promise2 = request(app, '/api/commands/shipment/move', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ shipmentId: 'SHIP-OCC-12', expectedVersion: 1 }),
  })

  const [result1, result2] = await Promise.all([promise1, promise2])

  // One should succeed (200), one should fail (409)
  const statuses = [result1.status, result2.status].sort()
  assert.deepEqual(statuses, [200, 409])

  // Verify only one event with version 2 was created
  const events = await eventStoreRepository.getEventsByAggregateId('SHIP-OCC-12')
  const version2Events = events.filter((e) => e.version === 2)
  assert.equal(version2Events.length, 1)

  // Verify current version is 2, not higher
  const currentVersion = await eventStoreRepository.getCurrentVersionOfAggregate('SHIP-OCC-12')
  assert.equal(currentVersion, 2)
})

test('OCC does not interfere with different aggregates', async () => {
  await resetEventCollection()

  const app = createApp()

  // Create two separate aggregates
  const result1 = await request(app, '/api/commands/shipment/move', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ shipmentId: 'SHIP-OCC-13A', expectedVersion: 0 }),
  })

  const result2 = await request(app, '/api/commands/shipment/move', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ shipmentId: 'SHIP-OCC-13B', expectedVersion: 0 }),
  })

  // Both should succeed
  assert.equal(result1.status, 200)
  assert.equal(result2.status, 200)

  // Each should have version 1
  assert.equal(result1.body.data.event.version, 1)
  assert.equal(result2.body.data.event.version, 1)

  // They should be independent
  const version1 = await eventStoreRepository.getCurrentVersionOfAggregate('SHIP-OCC-13A')
  const version2 = await eventStoreRepository.getCurrentVersionOfAggregate('SHIP-OCC-13B')
  assert.equal(version1, 1)
  assert.equal(version2, 1)
})

test('appendEvent rejects duplicate aggregateId+version (atomic safety)', async () => {
  await resetEventCollection()

  // Manually create an event
  await eventStoreRepository.appendEvent({
    aggregateId: 'SHIP-OCC-14',
    eventType: 'SHIPMENT_MOVED',
    payload: { shipmentId: 'SHIP-OCC-14' },
    version: 1,
  })

  // Try to append another event with the same version
  await assert.rejects(
    () => eventStoreRepository.appendEvent({
      aggregateId: 'SHIP-OCC-14',
      eventType: 'SHIPMENT_MOVED',
      payload: { shipmentId: 'SHIP-OCC-14' },
      version: 1,
    }),
    /Duplicate aggregateId and version combination detected/i,
  )
})
