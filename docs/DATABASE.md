# URJASETU — DATABASE SCHEMA SPECIFICATION

## 1. Entities & Collections

### CandidateSite Schema
- `id`: String (e.g. `nashik-site-01`)
- `code`: String (e.g. `NASHIK-SITE-01`)
- `name`: String
- `cityName`: String (`Nashik`)
- `wardName`: String
- `zoneName`: String
- `opportunityScore`: Number (0 - 100)
- `status`: String (`RECOMMENDED` | `UNDER_REVIEW` | `SCREENING` | `DISQUALIFIED`)
- `latitude`: Number (SRID 4326)
- `longitude`: Number (SRID 4326)
- `areaSqm`: Number
- `metrics`:
  - `solarSuitability`: Number (0 - 100)
  - `evDemandProxy`: Number (0 - 100)
  - `roadAccessibility`: Number (0 - 100)
  - `floodRisk`: String (`LOW` | `MEDIUM` | `HIGH`)
  - `landConflict`: String (`NONE` | `MINOR` | `HIGH`)

### Proposal Schema
- `id`: String (e.g. `prop-nashik-01`)
- `title`: String
- `siteId`: String
- `siteCode`: String
- `cityName`: String
- `opportunityScore`: Number
- `estimatedAreaSqm`: Number
- `infrastructureType`: String
- `status`: String (`DRAFT` | `READY_FOR_REVIEW` | `APPROVED` | `ARCHIVED`)
- `aiSummary`: String
- `author`: String
- `createdAt`: String (ISO Date)
- `updatedAt`: String (ISO Date)
