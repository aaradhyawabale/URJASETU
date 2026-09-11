# UrjaSetu — MongoDB Atlas & Database Setup Guide

## Overview

UrjaSetu uses **MongoDB Atlas** (or local MongoDB) via **Mongoose** as its primary persistent database layer for storing municipal geospatial entity data:
1. `Town`: Master city records (Nashik, Maharashtra, India).
2. `CandidateSite`: High-potential solar-EV parcel candidates (`NASHIK-SITE-01` to `04`).
3. `Proposal`: Municipal project proposals carrying parcel geometry, suitability scores, infrastructure types, and AI review summaries.

---

## 1. Environment Configuration

To connect UrjaSetu to your MongoDB Atlas cluster:

1. Create a file named `.env` in the root project directory (or configure environment variables in your deployment platform).
2. Set the `MONGODB_URI` connection string:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/urjasetu?retryWrites=true&w=majority
PORT=5001
CORS_ORIGIN=http://localhost:3000
GEMINI_API_KEY=your_gemini_api_key_here
```

> ⚠️ **Security Warning**: Never commit real database credentials or URI secrets to Git. Always keep them in uncommitted `.env` files or deployment environment settings.

---

## 2. Automatic Resilience & Fallback Mechanism

UrjaSetu is engineered with **zero-downtime fallback resilience**:
- **If `MONGODB_URI` is provided and reachable**: The backend connects to MongoDB Atlas, synchronizes the Nashik seed datasets, and persists all CRUD operations directly to MongoDB.
- **If `MONGODB_URI` is missing or MongoDB is offline**: The backend gracefully logs a warning, switches automatically to an in-memory seed data store, and continues serving full API responses without crashing or breaking the frontend UI.

---

## 3. Database Health Endpoint

You can inspect the live database connection status by querying the health endpoint:

```bash
GET http://localhost:5001/api/health
```

### Example Response (Connected):
```json
{
  "status": "ok",
  "service": "urjasetu-api",
  "version": "1.0.0",
  "timestamp": "2026-09-11T11:20:00.000Z",
  "demoCity": "Nashik, Maharashtra, India",
  "database": "connected",
  "databaseConnected": true,
  "databaseHost": "cluster0.mongodb.net"
}
```

### Example Response (Offline / Fallback):
```json
{
  "status": "ok",
  "service": "urjasetu-api",
  "version": "1.0.0",
  "timestamp": "2026-09-11T11:20:00.000Z",
  "demoCity": "Nashik, Maharashtra, India",
  "database": "disconnected (demo fallback active)",
  "databaseConnected": false
}
```

---

## 4. Schemas & Models

The backend defines 3 core Mongoose models in `backend/src/models/`:

### `Town` (`backend/src/models/Town.ts`)
- `name`: string (e.g. "Nashik")
- `state`: string (e.g. "Maharashtra")
- `country`: string (e.g. "India")
- `centerLat`: number (e.g. `19.9975`)
- `centerLon`: number (e.g. `73.7898`)
- `bounds`: GeoJSON polygon bounding box

### `Site` (`backend/src/models/Site.ts`)
- `id` / `code`: string (e.g. `NASHIK-SITE-01`)
- `name`: string
- `cityName`, `wardName`, `zoneName`: strings
- `opportunityScore`: number (0-100)
- `status`: `'RECOMMENDED' | 'UNDER_REVIEW' | 'SCREENING' | 'DISQUALIFIED'`
- `latitude`, `longitude`, `areaSqm`: numbers
- `metrics`: `{ solarSuitability, evDemandProxy, roadAccessibility, floodRisk, landConflict }`

### `Proposal` (`backend/src/models/Proposal.ts`)
- `id`: string (`prop-...`)
- `title`: string
- `siteId`, `siteCode`, `cityName`: strings
- `opportunityScore`, `estimatedAreaSqm`: numbers
- `infrastructureType`: string (`SOLAR_EV_CHARGING_HUB`)
- `status`: `'DRAFT' | 'READY_FOR_REVIEW' | 'APPROVED' | 'ARCHIVED'`
- `plotGeometry`: Optional GeoJSON polygon object (user drawn plots)
- `aiSummary`: string
- `author`: string

---

## 5. Seed Synchronization

When the server boots with an active MongoDB connection, `seedDatabase()` (`backend/src/seed/seedRunner.ts`) runs automatically using `upsert`. This ensures that `Nashik` town records, candidate sites (`NASHIK-SITE-01` through `04`), and initial proposals are populated deterministically without creating duplicate records.
