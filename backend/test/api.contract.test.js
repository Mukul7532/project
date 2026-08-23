import test from 'node:test'
import assert from 'node:assert/strict'
import { createApp } from '../src/app.js'

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

test('GET /api/health returns a success response', async () => {
  const app = createApp()
  const result = await request(app, '/api/health')

  assert.equal(result.status, 200)
  assert.equal(result.body.success, true)
  assert.equal(result.body.data.service, 'audit-trail-api')
})

test('POST /api/commands/shipment/move accepts a valid request', async () => {
  const app = createApp()
  const result = await request(app, '/api/commands/shipment/move', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ shipmentId: 'SHIP-1001' }),
  })

  assert.equal(result.status, 200)
  assert.equal(result.body.success, true)
  assert.equal(result.body.data.shipmentId, 'SHIP-1001')
})

test('POST /api/commands/shipment/move rejects missing shipmentId', async () => {
  const app = createApp()
  const result = await request(app, '/api/commands/shipment/move', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  })

  assert.equal(result.status, 400)
  assert.equal(result.body.success, false)
  assert.equal(result.body.error.type, 'validation_error')
})

test('POST /api/commands/shipment/move rejects invalid field types', async () => {
  const app = createApp()
  const result = await request(app, '/api/commands/shipment/move', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ shipmentId: 42 }),
  })

  assert.equal(result.status, 400)
  assert.equal(result.body.success, false)
})

test('POST /api/commands/shipment/move rejects empty strings', async () => {
  const app = createApp()
  const result = await request(app, '/api/commands/shipment/move', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ shipmentId: '   ' }),
  })

  assert.equal(result.status, 400)
  assert.equal(result.body.success, false)
})

test('GET /api/queries/shipment/:id accepts a valid shipment ID', async () => {
  const app = createApp()
  const result = await request(app, '/api/queries/shipment/SHIP-2002')

  assert.equal(result.status, 200)
  assert.equal(result.body.success, true)
  assert.equal(result.body.data.shipmentId, 'SHIP-2002')
})

test('GET /api/queries/shipment/:id rejects an invalid shipment ID', async () => {
  const app = createApp()
  const result = await request(app, '/api/queries/shipment/invalid id')

  assert.equal(result.status, 400)
  assert.equal(result.body.success, false)
  assert.equal(result.body.error.type, 'validation_error')
})

test('GET /api/queries/shipment/:id rejects a missing shipment ID route', async () => {
  const app = createApp()
  const result = await request(app, '/api/queries/shipment/')

  assert.equal(result.status, 404)
  assert.equal(result.body.success, false)
})

test('unknown routes return 404 with a safe error envelope', async () => {
  const app = createApp()
  const result = await request(app, '/nope')

  assert.equal(result.status, 404)
  assert.equal(result.body.success, false)
  assert.equal(result.body.error.type, 'not_found')
})

test('malformed JSON returns 400 with a validation error envelope', async () => {
  const app = createApp()
  const server = app.listen(0)
  await new Promise((resolve) => server.once('listening', resolve))

  const { port } = server.address()
  const response = await fetch(`http://127.0.0.1:${port}/api/commands/shipment/move`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{bad json',
  })

  const body = await response.json()

  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()))
  })

  assert.equal(response.status, 400)
  assert.equal(body.success, false)
  assert.equal(body.error.type, 'validation_error')
})
