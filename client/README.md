# AuditTrail — Frontend

React + Vite frontend for the AuditTrail dashboard.

## Tech Stack
- React 18 + Vite
- react-router-dom for routing
- axios for API calls
- recharts for charts

## Getting Started

```bash
npm install
npm run dev
```

Visit `http://localhost:5173`

## Project Structure
## Pages
- `/` — Dashboard (stats, activity chart, recent logs)
- `/logs` — Full log history with search and pagination
- `/timeline` — Shipment event timeline: search by shipment ID to see full event history, a reconstruction check confirming current state, a state-scrubbing slider to rewind time, and a sensor trend chart with event markers
- `/reports` — Available reports list
- `/settings` — Profile and preferences
## Notes
- Dashboard/Logs currently use mock data from `src/data/mockAuditLogs.js`. Once the backend `/api/logs` and `/api/stats` routes are live, `src/api.js` will automatically switch to real data — no other code changes needed.
- Timeline uses mock data from `src/data/mockShipmentEvents.js`, matching the real backend's event schema (`aggregateId`, `eventType`, `payload`, `timestamp`, `version`). Real data comes from `GET /api/queries/shipment/:id`. The client-side reducer in `src/utils/shipmentReducer.js` mirrors the backend's projection logic exactly, so State Scrubbing results match what the server calculates.
- Try shipment ID `SHIP-1001` on the Timeline page to see the sample data.