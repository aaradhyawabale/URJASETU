# URJASETU — SYSTEM ARCHITECTURE DOCUMENTATION

## 1. Architectural Philosophy
UrjaSetu is a single modular application platform with clearly separated layers:
- **Frontend SPA:** React 18 + Vite + TypeScript rendering 2D Leaflet map, Turf.js live area calculation, CesiumJS 3D conceptual workspace, and proposal review workflows.
- **Backend API:** Node.js / Express REST service owning scoring, risk screening, proposal storage, and Gemini AI wrapper.
- **Database Layer:** MongoDB / PostgreSQL spatial models storing candidate sites, plots, and proposal packages.

---

## 2. Core Workflow Data Flow

```
FIND (Overview Dashboard / 2D GIS Map)
  ↓
SCREEN (Multi-Criteria Opportunity Scoring & Flood/Land Risk Screening)
  ↓
MEASURE (Turf.js Client-Side Boundary Polygon Area Calculation)
  ↓
VISUALIZE (CesiumJS 3D Conceptual Model Placement)
  ↓
EXPLAIN (AI Technical Proposal Review Synthesis)
  ↓
DECIDE (Decision Package Proposal Workspace & Library Archive)
```
