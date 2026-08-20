# Audit Trail API

Day 1 backend foundation for the Audit Trail project.

## Requirements

- Node.js 20 or newer
- MongoDB running locally or a reachable MongoDB deployment

## Setup

```powershell
cd backend
npm install
Copy-Item .env.example .env
```

Update `MONGODB_URI` in `.env` if MongoDB is not running at the example address.

## Run

```powershell
npm start
```

Development mode uses Node's watch mode:

```powershell
npm run dev
```

The server connects to MongoDB before accepting HTTP requests. Startup fails clearly when `MONGODB_URI` is missing or the database cannot be reached.

## API

`GET /api/health`

```json
{
  "status": "ok",
  "service": "audit-trail-api"
}
```

Unknown routes return HTTP 404. Invalid JSON returns HTTP 400. Other errors return a generic HTTP 500 response without stack traces.

CQRS, event sourcing, the event store, projections, authentication, and shipment lifecycle behavior are intentionally outside the Day 1 scope.
