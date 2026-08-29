// Sample shipment event data, matching the real backend's event schema.
// Used as a fallback when the live backend/database isn't reachable.

export const mockShipmentEvents = [
  {
    aggregateId: "SHIP-1001",
    eventType: "CONTAINER_CREATED",
    payload: { containerId: "CNT-1", location: "Warehouse A", weight: 1200 },
    timestamp: "2026-08-18T09:00:00Z",
    version: 1,
  },
  {
    aggregateId: "SHIP-1001",
    eventType: "CONTAINER_LOADED",
    payload: { containerId: "CNT-1", location: "Warehouse A", weight: 1250 },
    timestamp: "2026-08-19T14:30:00Z",
    version: 2,
  },
  {
    aggregateId: "SHIP-1001",
    eventType: "SHIPMENT_MOVED",
    payload: { location: "Port A" },
    timestamp: "2026-08-20T10:15:00Z",
    version: 3,
  },
  {
    aggregateId: "SHIP-1001",
    eventType: "ARRIVED_AT_PORT",
    payload: { portId: "Port A" },
    timestamp: "2026-08-21T07:45:00Z",
    version: 4,
  },
];

export const mockShipmentProjection = {
  shipmentId: "SHIP-1001",
  status: "arrived",
  containers: [{ containerId: "CNT-1", location: "Port A", weight: 1250 }],
  location: "Port A",
  version: 4,
  lastUpdated: "2026-08-21T07:45:00Z",
};
export const mockSensorReadings = [
  { timestamp: "2026-08-18T09:00:00Z", temperature: 4.2 },
  { timestamp: "2026-08-18T18:00:00Z", temperature: 4.5 },
  { timestamp: "2026-08-19T09:00:00Z", temperature: 4.9 },
  { timestamp: "2026-08-19T14:30:00Z", temperature: 5.1 },
  { timestamp: "2026-08-20T02:00:00Z", temperature: 6.0 },
  { timestamp: "2026-08-20T10:15:00Z", temperature: 6.8 },
  { timestamp: "2026-08-20T20:00:00Z", temperature: 7.4 },
  { timestamp: "2026-08-21T04:00:00Z", temperature: 6.5 },
  { timestamp: "2026-08-21T07:45:00Z", temperature: 5.9 },
];