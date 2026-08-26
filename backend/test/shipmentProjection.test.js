import test from 'node:test';
import assert from 'node:assert/strict';
import { buildProjectionFromEvents } from '../src/services/shipmentProjectionService.js';

test('buildProjectionFromEvents applies events in order and produces expected projection', () => {
  const now = new Date();

  const events = [
    {
      aggregateId: 'SHIP-2002',
      eventType: 'CONTAINER_CREATED',
      payload: { containerId: 'C1', description: 'Box 1' },
      version: 1,
      timestamp: new Date(now.getTime() + 1),
    },
    {
      aggregateId: 'SHIP-2002',
      eventType: 'CONTAINER_LOADED',
      payload: { containerId: 'C1', loadedBy: 'worker-7' },
      version: 2,
      timestamp: new Date(now.getTime() + 2),
    },
    {
      aggregateId: 'SHIP-2002',
      eventType: 'SHIPMENT_MOVED',
      payload: { location: 'ATLANTIC_OCEAN' },
      version: 3,
      timestamp: new Date(now.getTime() + 3),
    },
    {
      aggregateId: 'SHIP-2002',
      eventType: 'ARRIVED_AT_PORT',
      payload: { portId: 'PORT-EX' },
      version: 4,
      timestamp: new Date(now.getTime() + 4),
    },
  ];

  const projection = buildProjectionFromEvents(events);

  // Basic shape checks
  assert.equal(projection.shipmentId, 'SHIP-2002', 'shipmentId should match aggregateId');
  assert.equal(typeof projection.version, 'number', 'projection.version should be a number');
  assert.equal(projection.version, 4, 'projection.version should equal last event version');
  assert.ok(Array.isArray(projection.containers), 'projection.containers should be an array');

  // Container checks
  const container = projection.containers.find(c => c.containerId === 'C1');
  assert.ok(container, 'container C1 should exist in projection.containers');
  // renderer may record status, etc. at minimum containerId presence is asserted
  assert.equal(container.containerId, 'C1');

  // Location should reflect the last location-affecting event (ARRIVED_AT_PORT -> PORT-EX)
  assert.equal(projection.location, 'PORT-EX', 'projection.location should reflect last location event');

  // lastUpdated is expected to be a Date-like string or Date; allow both
  assert.ok(projection.lastUpdated, 'projection.lastUpdated should be set');
});


test('buildProjectionFromEvents throws (or rejects) on unknown event type', () => {
  const events = [
    {
      aggregateId: 'SHIP-3003',
      eventType: 'UNKNOWN_EVENT_TYPE',
      payload: {},
      version: 1,
      timestamp: new Date(),
    },
  ];

  // The reducer is strict by design: unknown event types should surface an error.
  assert.throws(() => buildProjectionFromEvents(events), Error);
});
