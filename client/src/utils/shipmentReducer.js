export function applyEvent(state, event) {
  const evt = event || {};
  const type = (evt.eventType || "").toUpperCase();
  const payload = evt.payload || {};

  const next = {
    ...state,
    containers: Array.isArray(state.containers) ? [...state.containers] : [],
  };

  switch (type) {
    case "CONTAINER_CREATED": {
      const containerId = payload.containerId;
      if (containerId && !next.containers.some((c) => c.containerId === containerId)) {
        next.containers.push({ containerId, location: payload.location ?? null, weight: payload.weight ?? null });
      }
      next.status = "container_created";
      break;
    }
    case "CONTAINER_LOADED": {
      const containerId = payload.containerId;
      const idx = next.containers.findIndex((c) => c.containerId === containerId);
      if (idx === -1) {
        next.containers.push({ containerId, location: payload.location ?? null, weight: payload.weight ?? null });
      } else {
        next.containers[idx] = {
          ...next.containers[idx],
          weight: payload.weight ?? next.containers[idx].weight,
          location: payload.location ?? next.containers[idx].location,
        };
      }
      next.status = "loaded";
      break;
    }
    case "CONTAINER_REPLACED": {
      const containerId = payload.containerId;
      const idx = next.containers.findIndex((c) => c.containerId === containerId);
      if (idx === -1) {
        next.containers.push({ containerId, location: payload.location ?? null, weight: payload.weight ?? null });
      } else {
        next.containers[idx] = { containerId, location: payload.location ?? null, weight: payload.weight ?? null };
      }
      next.status = "container_replaced";
      break;
    }
    case "SHIPMENT_MOVED":
      if (payload.location) next.location = payload.location;
      next.status = "moved";
      break;
    case "ARRIVED_AT_PORT":
      if (payload.portId) next.location = payload.portId;
      next.status = "arrived";
      break;
    default:
      break;
  }

  if (typeof evt.version === "number" && evt.version > (next.version || 0)) {
    next.version = evt.version;
  }
  if (evt.timestamp) {
    const ts = new Date(evt.timestamp);
    if (!next.lastUpdated || ts.getTime() >= new Date(next.lastUpdated).getTime()) {
      next.lastUpdated = ts;
    }
  }

  return next;
}

export function buildProjectionFromEvents(events = []) {
  const initial = {
    shipmentId: null,
    status: "unknown",
    containers: [],
    location: null,
    version: 0,
    lastUpdated: null,
  };

  let state = initial;
  for (const ev of events) {
    state = applyEvent(state, ev);
  }

  if (!state.shipmentId && events.length > 0) {
    state.shipmentId = events[events.length - 1].aggregateId || null;
  }

  return state;
}