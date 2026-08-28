import { useState } from "react";
import { fetchShipment } from "../api";
import "./Timeline.css";

const EVENT_LABELS = {
  CONTAINER_CREATED: "Container Created",
  CONTAINER_LOADED: "Container Loaded",
  CONTAINER_REPLACED: "Container Replaced",
  SHIPMENT_MOVED: "Shipment Moved",
  ARRIVED_AT_PORT: "Arrived at Port",
};

function formatTimestamp(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function describePayload(eventType, payload = {}) {
  switch (eventType) {
    case "CONTAINER_CREATED":
    case "CONTAINER_LOADED":
    case "CONTAINER_REPLACED":
      return `Container ${payload.containerId ?? "—"}${payload.location ? ` at ${payload.location}` : ""}${payload.weight ? ` · ${payload.weight}kg` : ""}`;
    case "SHIPMENT_MOVED":
      return payload.location ? `Moved to ${payload.location}` : "Shipment moved";
    case "ARRIVED_AT_PORT":
      return payload.portId ? `Arrived at ${payload.portId}` : "Arrived at port";
    default:
      return JSON.stringify(payload);
  }
}

export default function Timeline() {
  const [shipmentId, setShipmentId] = useState("");
  const [searchedId, setSearchedId] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    const trimmed = shipmentId.trim();
    if (!trimmed) return;

    setLoading(true);
    setError(null);
    setResult(null);
const { data, error: fetchError } = await fetchShipment(trimmed);
setSearchedId(trimmed);

if (data) {
  setResult(data);
}
if (fetchError) {
  setError(fetchError);
}
setLoading(false);
  };

  const projection = result?.data;
  const events = result?.events || [];

  return (
    <div>
      <h1>Shipment Timeline</h1>
      <p className="page-subtitle">
        Look up a shipment to see its full event history and reconstructed current state.
      </p>

      <form className="timeline-search-wrap" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Enter shipment ID, e.g. SHIP-1001"
          value={shipmentId}
          onChange={(e) => setShipmentId(e.target.value)}
          className="timeline-search-input"
          aria-label="Shipment ID"
        />
        <button type="submit" className="timeline-search-btn" disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {error && (
        <div className="data-notice">
          {error}
          {searchedId && (
            <span className="notice-sub"> — no data found for "{searchedId}"</span>
          )}
        </div>
      )}

      {projection && (
        <div className="reconstruction-card">
          <div className="reconstruction-header">
            <h2>Reconstructed State</h2>
            <span className="reconstruction-badge">✓ Verified from {events.length} event{events.length !== 1 ? "s" : ""}</span>
          </div>
          <div className="reconstruction-grid">
            <div className="reconstruction-field">
              <span className="field-label">Shipment ID</span>
              <span className="field-value">{projection.shipmentId}</span>
            </div>
            <div className="reconstruction-field">
              <span className="field-label">Status</span>
              <span className="field-value status-pill">{projection.status}</span>
            </div>
            <div className="reconstruction-field">
              <span className="field-label">Location</span>
              <span className="field-value">{projection.location ?? "—"}</span>
            </div>
            <div className="reconstruction-field">
              <span className="field-label">Version</span>
              <span className="field-value">v{projection.version}</span>
            </div>
            <div className="reconstruction-field">
              <span className="field-label">Last Updated</span>
              <span className="field-value">{formatTimestamp(projection.lastUpdated)}</span>
            </div>
            <div className="reconstruction-field">
              <span className="field-label">Containers</span>
              <span className="field-value">{projection.containers?.length ?? 0}</span>
            </div>
          </div>

          {projection.containers?.length > 0 && (
            <div className="containers-list">
              {projection.containers.map((c) => (
                <div className="container-chip" key={c.containerId}>
                  <strong>{c.containerId}</strong>
                  {c.location && <span> · {c.location}</span>}
                  {c.weight && <span> · {c.weight}kg</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {events.length > 0 && (
        <div className="timeline-card">
          <h2>Event Timeline</h2>
          <div className="timeline-track">
            {events.map((event, idx) => (
              <div className="timeline-item" key={`${event.aggregateId}-${event.version}`}>
                <div className="timeline-marker">
                  <span className="timeline-dot" />
                  {idx < events.length - 1 && <span className="timeline-line" />}
                </div>
                <div className="timeline-content">
                  <div className="timeline-content-header">
                    <span className="timeline-event-type">
                      {EVENT_LABELS[event.eventType] || event.eventType}
                    </span>
                    <span className="timeline-version">v{event.version}</span>
                  </div>
                  <p className="timeline-description">
                    {describePayload(event.eventType, event.payload)}
                  </p>
                  <span className="timeline-timestamp">{formatTimestamp(event.timestamp)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}