# URJASETU — API ENDPOINTS SPECIFICATION

## Base URL
`/api/v1`

---

## Health Endpoint
`GET /api/health`
- **Response:** `{ "status": "ok", "service": "urjasetu-api", "demoCity": "Nashik, Maharashtra, India" }`

---

## Sites Endpoints
- `GET /api/v1/sites` — List all candidate sites (supports `?status=` and `?town=`)
- `GET /api/v1/sites/ranked` — List candidate sites sorted by Opportunity Score (descending)
- `GET /api/v1/sites/:siteId` — Get candidate site details by ID or code
- `GET /api/v1/sites/:siteId/scores` — Get deterministic opportunity score breakdown
- `GET /api/v1/sites/:siteId/risk` — Get risk and conflict screening assessment

---

## Proposals Endpoints
- `GET /api/v1/proposals` — List saved proposals
- `GET /api/v1/proposals/:id` — Get proposal by ID
- `POST /api/v1/proposals` — Create a new proposal package
- `PUT /api/v1/proposals/:id` — Update existing proposal
- `DELETE /api/v1/proposals/:id` — Delete proposal

---

## AI Review Endpoint
- `POST /api/v1/ai/review` — Generate AI proposal review explanation based on structured GIS metrics
