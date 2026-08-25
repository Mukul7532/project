import test from 'node:test'
import assert from 'node:assert/strict'
import mongoose from 'mongoose'
import Event from '../src/models/Event.js'
import { connectToDatabase, disconnectFromDatabase } from '../src/config/database.js'
import { eventStoreRepository } from '../src/repositories/eventStoreRepository.js'

const mongoUri = process.env.MONGODB_URI
const hasMongoConfiguration = Boolean(mongoUri)

async function ensureDatabase() {
  if (!hasMongoConfiguration) {
    return false
  }

  try {
    await connectToDatabase(mongoUri)
    return true
  } catch {
    return false
  }
}

async function resetEventCollection() {
  if (!hasMongoConfiguration) {
    return
  }

  const { default: Event } = await import('../src/models/Event.js')
  await Event.deleteMany({})
}

test('event store repository exposes only append and read operations', () => {
  const methods = Object.keys(eventStoreRepository).sort()

  assert.deepEqual(methods, ['appendEvent', 'getEventsByAggregateId'])
})

test('existing Event documents cannot be mutated through save()', async () => {
  const event = new Event({
    aggregateId: 'SHIP-SAVE-01',
    eventType: 'CONTAINER_CREATED',
    payload: { containerId: 'CT-SAVE-01' },
    version: 1,
    timestamp: new Date(),
  })

  event.isNew = false

  await assert.rejects(
    () => event.save(),
    /append-only/i,
  )
})

test('replaceOne is blocked for Event documents', async () => {
  await assert.rejects(
    () => Event.replaceOne(
      { aggregateId: 'SHIP-REPLACE-01' },
      {
        aggregateId: 'SHIP-REPLACE-01',
        eventType: 'CONTAINER_REPLACED',
        payload: { containerId: 'CT-REPLACE-01' },
        version: 1,
        timestamp: new Date(),
      },
    ),
    /append-only/i,
  )
})

test('findOneAndReplace is blocked for Event documents', async () => {
  await assert.rejects(
    () => Event.findOneAndReplace(
      { aggregateId: 'SHIP-FIND-REPLACE-01' },
      {
        aggregateId: 'SHIP-FIND-REPLACE-01',
        eventType: 'CONTAINER_REPLACED',
        payload: { containerId: 'CT-FIND-REPLACE-01' },
        version: 1,
        timestamp: new Date(),
      },
    ),
    /append-only/i,
  )
})

test('appendEvent ignores client-supplied timestamps and generates backend timestamps', async () => {
  const originalCreate = Event.create.bind(Event)
  const observed = []

  Event.create = async (eventData) => {
    observed.push(eventData)
    return {
      toObject() {
        return { ...eventData }
      },
    }
  }

  try {
    await eventStoreRepository.appendEvent({
      aggregateId: 'SHIP-TS-01',
      eventType: 'CONTAINER_CREATED',
      payload: { containerId: 'CT-TS-01' },
      version: 1,
      timestamp: new Date('2099-01-01T00:00:00.000Z'),
    })

    assert.equal(observed.length, 1)
    assert.ok(observed[0].timestamp instanceof Date)
    assert.ok(observed[0].timestamp.getTime() > Date.now() - 60_000)
    assert.notEqual(observed[0].timestamp.getTime(), new Date('2099-01-01T00:00:00.000Z').getTime())
  } finally {
    Event.create = originalCreate
  }
})

test('event store repository tests require MongoDB configuration', { skip: !hasMongoConfiguration }, async () => {
  assert.ok(hasMongoConfiguration)
})

test('appendEvent accepts a valid event', { skip: !hasMongoConfiguration }, async () => {
  await ensureDatabase()
  await resetEventCollection()

  const event = await eventStoreRepository.appendEvent({
    aggregateId: 'SHIP-1001',
    eventType: 'CONTAINER_CREATED',
    payload: { containerId: 'CT-1', location: 'Port A' },
    version: 1,
  })

  assert.equal(event.aggregateId, 'SHIP-1001')
  assert.equal(event.eventType, 'CONTAINER_CREATED')
  assert.deepEqual(event.payload, { containerId: 'CT-1', location: 'Port A' })
  assert.equal(event.version, 1)
  assert.ok(event.timestamp instanceof Date)

  await disconnectFromDatabase()
})

test('appendEvent rejects a missing aggregateId', { skip: !hasMongoConfiguration }, async () => {
  await ensureDatabase()
  await resetEventCollection()

  await assert.rejects(
    () => eventStoreRepository.appendEvent({
      eventType: 'CONTAINER_CREATED',
      payload: { containerId: 'CT-1' },
      version: 1,
    }),
    /aggregateId/i,
  )

  await disconnectFromDatabase()
})

test('appendEvent rejects a missing eventType', { skip: !hasMongoConfiguration }, async () => {
  await ensureDatabase()
  await resetEventCollection()

  await assert.rejects(
    () => eventStoreRepository.appendEvent({
      aggregateId: 'SHIP-1001',
      payload: { containerId: 'CT-1' },
      version: 1,
    }),
    /eventType/i,
  )

  await disconnectFromDatabase()
})

test('appendEvent rejects a missing payload', { skip: !hasMongoConfiguration }, async () => {
  await ensureDatabase()
  await resetEventCollection()

  await assert.rejects(
    () => eventStoreRepository.appendEvent({
      aggregateId: 'SHIP-1001',
      eventType: 'CONTAINER_CREATED',
      version: 1,
    }),
    /payload/i,
  )

  await disconnectFromDatabase()
})

test('appendEvent rejects an invalid version', { skip: !hasMongoConfiguration }, async () => {
  await ensureDatabase()
  await resetEventCollection()

  await assert.rejects(
    () => eventStoreRepository.appendEvent({
      aggregateId: 'SHIP-1001',
      eventType: 'CONTAINER_CREATED',
      payload: { containerId: 'CT-1' },
      version: 0,
    }),
    /version/i,
  )

  await disconnectFromDatabase()
})

test('appendEvent rejects a non-positive version', { skip: !hasMongoConfiguration }, async () => {
  await ensureDatabase()
  await resetEventCollection()

  await assert.rejects(
    () => eventStoreRepository.appendEvent({
      aggregateId: 'SHIP-1001',
      eventType: 'CONTAINER_CREATED',
      payload: { containerId: 'CT-1' },
      version: -1,
    }),
    /positive/i,
  )

  await disconnectFromDatabase()
})

test('getEventsByAggregateId returns events in version order', { skip: !hasMongoConfiguration }, async () => {
  await ensureDatabase()
  await resetEventCollection()

  await eventStoreRepository.appendEvent({
    aggregateId: 'SHIP-2002',
    eventType: 'CONTAINER_CREATED',
    payload: { containerId: 'CT-2' },
    version: 2,
  })

  await eventStoreRepository.appendEvent({
    aggregateId: 'SHIP-2002',
    eventType: 'CONTAINER_LOADED',
    payload: { containerId: 'CT-2', weight: 120 },
    version: 1,
  })

  const events = await eventStoreRepository.getEventsByAggregateId('SHIP-2002')

  assert.deepEqual(events.map((event) => event.version), [1, 2])
  assert.equal(events[0].eventType, 'CONTAINER_LOADED')
  assert.equal(events[1].eventType, 'CONTAINER_CREATED')

  await disconnectFromDatabase()
})

test('appendEvent rejects duplicate aggregateId and version pairs', { skip: !hasMongoConfiguration }, async () => {
  await ensureDatabase()
  await resetEventCollection()

  await eventStoreRepository.appendEvent({
    aggregateId: 'SHIP-3003',
    eventType: 'CONTAINER_CREATED',
    payload: { containerId: 'CT-3' },
    version: 1,
  })

  await assert.rejects(
    () => eventStoreRepository.appendEvent({
      aggregateId: 'SHIP-3003',
      eventType: 'ARRIVED_AT_PORT',
      payload: { portId: 'P-1' },
      version: 1,
    }),
    /duplicate|version/i,
  )

  await disconnectFromDatabase()
})
