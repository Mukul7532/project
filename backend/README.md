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



### Using MongoDB Atlas (cloud) instead of a local database

If you don't have MongoDB installed locally, you can use a free MongoDB Atlas
cluster instead:

1. Create a free account and an M0 (free tier) cluster at
   [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register).
2. Under **Database Access**, create a database user with a username and
   password.
3. Under **Network Access**, add your current public IP address (or, for
   local development convenience, allow access from anywhere via
   `0.0.0.0/0`).
4. Under **Connect > Drivers**, copy the connection string. It looks like:
5. Paste that value into `MONGODB_URI` in your local `.env` file.

**Troubleshooting:** if the server logs a connection timeout or
`ETIMEDOUT`/`ECONNREFUSED` error against an Atlas cluster, the most common
cause is that your current machine's public IP address is not on the
cluster's Network Access allow list. Add it (or your teammate's IP, if
they're the one seeing the error) under **Network Access** in the Atlas
dashboard, then retry.

Each teammate connecting to a shared Atlas cluster needs their own IP address
whitelisted (or the cluster needs to allow access from anywhere) — this is
per-cluster configuration in Atlas, not something in this repository's code.

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
