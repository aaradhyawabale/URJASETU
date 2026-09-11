# UrjaSetu — Municipal Geospatial Intelligence Platform

> **"UrjaSetu tells any Indian town exactly where to put its next solar-EV charging point — and exactly why — in seconds, not months."**

---

## 1. What is UrjaSetu?
**UrjaSetu** is an AI-assisted Geospatial Intelligence and Decision-Support Platform built for Indian Municipal Bodies (Urban Local Bodies - ULBs). It converts fragmented spatial, climate, grid, and demand proxy data into ranked, risk-screened candidate sites for Solar-EV Charging Hubs, then guides urban planners through plot measurement, 3D conceptual planning, AI-assisted proposal review, and final proposal packaging.

- **Primary Demo City:** Nashik, Maharashtra, India
- **Primary Infrastructure Model:** 500kW Solar-EV Charging Hub

---

## 2. Core Workflow Story
```
FIND → SCREEN → MEASURE → VISUALIZE → EXPLAIN → DECIDE
```
1. **FIND:** Municipal Overview & Spatial Basin Topology (`/dashboard`)
2. **SCREEN:** 2D GIS Layer Overlays & Multi-Criteria Ranking (`/sites`, `/sites/ranked`)
3. **MEASURE:** Plot Boundary Polygon Drawing & Turf.js Area Calculation (`/planning/:siteId`)
4. **VISUALIZE:** CesiumJS 3D Conceptual Infrastructure Placement (`/planning/:siteId/3d`)
5. **EXPLAIN:** Gemini AI Technical Proposal Review & Verification Checklist (`/proposals/:id/review`)
6. **DECIDE:** Decision Package Workspace & Municipal Library Archive (`/proposals/:id`, `/proposals`)

---

## 3. Architecture & Tech Stack
- **Frontend:** React 18 + Vite + TypeScript + Tailwind CSS + React Router v6
- **2D GIS & Math:** Leaflet, Leaflet-Geoman, Turf.js client-side polygon area computation
- **3D Visualization:** CesiumJS 3D Conceptual Site Planner
- **Backend API:** Node.js / Express REST API (TypeScript)
- **Database Layer:** MongoDB / PostgreSQL + PostGIS (candidate sites, plots, proposal packages)
- **AI Layer:** Server-side Gemini AI Service Wrapper with deterministic fallback logic

---

## 4. Local Setup & Installation

### Prerequisites
- Node.js v18+ and npm v9+

### Environment Setup
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### Running Frontend (Development)
```bash
# Install dependencies
npm install

# Start Vite dev server
npm run dev
```
The frontend will run on `http://localhost:3000`.

### Running Backend (Development)
```bash
cd backend
npm install
npm run dev
```
The backend API will run on `http://localhost:5000`.

---

## 5. Testing & Verification

### Frontend Build & Type Check
```bash
# Verify TypeScript compilation (0 errors)
./node_modules/.bin/tsc --noEmit

# Production build
npm run build
```

### Backend Type Check & Health API
```bash
cd backend
npm run typecheck
```
Verify Health API at `http://localhost:5000/api/health`:
```json
{
  "status": "ok",
  "service": "urjasetu-api",
  "demoCity": "Nashik, Maharashtra, India"
}
```

---

## 6. Project Structure Overview
```
stitch_urjasetu_geospatial_planning_platform/
├── backend/                  # Node.js / Express REST API (TypeScript)
│   ├── src/
│   │   ├── config/           # Environment configuration
│   │   ├── controllers/      # Site, Proposal, AI, Health controllers
│   │   ├── middleware/       # Error handling & CORS middleware
│   │   ├── routes/           # REST endpoints (/api/v1/sites, /api/v1/proposals, /api/v1/ai)
│   │   ├── seed/             # Nashik seed datasets
│   │   ├── services/         # Scoring engine, Risk screening, Proposal CRUD, AI wrapper
│   │   └── server.ts         # Express server entry point
│   ├── package.json
│   └── tsconfig.json
├── src/                      # React 18 SPA Frontend
│   ├── app/                  # Router setup
│   ├── components/           # AppShell, Sidebar, Header, Status badges
│   ├── data/                 # Nashik demo data
│   ├── pages/                # 9 Screen view components
│   ├── services/api/         # Frontend API client with fallback support
│   └── types/                # Site, Proposal, Metrics interfaces
├── data/
│   ├── demo/                 # Nashik spatial demo seed JSON
│   └── geo/                  # GeoJSON overlays
├── docs/                     # Architecture, Database, API, Data Sources, 3D Assets specs
├── public/                   # Static assets & 3D models (.glb)
├── .env.example
├── .gitignore
├── PROJECT_STRUCTURE.md
├── SCREEN_MAP.md
└── README.md
```
