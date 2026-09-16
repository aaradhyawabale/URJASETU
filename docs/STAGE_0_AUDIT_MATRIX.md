# Stage 0: Full Health Check & Failure Reproduction Matrix

## Executive Summary
A comprehensive audit of the **UrjaSetu** GIS + AI renewable energy and EV infrastructure planning application was conducted across all routes, API endpoints, state persistence mechanisms, 2D/3D visual rendering components, and test suites.

The audit revealed that while backend APIs, candidate GIS scoring, 2D geodesic calculations, and AI proposal review fallbacks function, **the 3D planning workspace is currently a CSS/SVG pseudo-3D mock rather than a real Three.js / WebGL scene**. Furthermore, **Three.js and React Three Fiber dependencies are missing from `package.json`**, and **state is fragmented between 2D, 3D, and AI proposal screens** instead of consuming a single canonical `PlanningDesign` state.

---

## UrjaSetu Feature Audit & Failure Matrix

| Feature / Subsystem | Works | Partially Works | Broken | Fake / Mock | Root Cause Analysis |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **Backend Express API Server (`:5001`)** | ✅ | | | | Responding on `/api/health`, `/api/v1/sites`, `/api/v1/proposals`, `/api/v1/ai/review`, `/api/v1/gis/*`. |
| **Frontend Vite App (`:3000`)** | ✅ | | | | Serves React UI cleanly; 0 build errors. |
| **Nashik Map Landing & Basemap** | ✅ | | | | Carto Light vector basemap renders Nashik ($19.9975^\circ\text{N}, 73.7898^\circ\text{E}$) with Esri Satellite toggle. Requires deployment-safe fallback tile strategy. |
| **Local Search Engine** | ✅ | | | | Local fuzzy search over 100+ Nashik landmarks & candidate sites with Nominatim fallback and `map.flyTo`. |
| **Screened Available Space Layer** | ✅ | | | | Turf.js negative constraint subtraction layer renders candidate open spaces. |
| **Click-to-Acquire Plot Geometry** | ✅ | | | | Acquires polygon coordinates into 2D designer via query parameters (`?acquired=true&lat=...&lng=...`). |
| **2D Geodesic Designer (`SitePlanningWorkspace.tsx`)** | | ✅ | | | Vincenty geodesic area calculation ($2,450\text{ m}^2$) and component placement palette (`SOLAR_CANOPY`, `EV_CHARGER`, `BESS_CONTAINER`, `TRANSFORMER`) work, but state is lost when navigating to 3D without saving. |
| **3D Site Planner (`ThreeDSitePlanner.tsx`)** | | | ❌ | ❌ **FAKE MOCK** | **CRITICAL BLOCKER**: Currently uses CSS 3D transforms (`rotateX`, `rotateZ`) on static HTML `<div>` cards instead of Three.js / WebGL. `three`, `@react-three/fiber`, and `@react-three/drei` are missing from `package.json`. No WebGL mesh extrusion, no 3D object interaction. |
| **2D $\leftrightarrow$ 3D $\leftrightarrow$ AI State Transfer** | | | ❌ | | State is uncoordinated across screens. 2D uses local React state; 3D re-fetches proposals or falls back to defaults; AI Review reads proposals from API. No unified canonical `PlanningDesign` state object. |
| **Nearby Building Extrusions (<500m)** | | | ❌ | ❌ **MOCK** | Rendered as CSS floating cards instead of 3D extruded geometry in WebGL world coordinates. |
| **"Why Here?" MCDA Explanation Panel** | ✅ | | | | Displays 6 MCDA suitability factors with weights, raw values, scores, and data provenance labels. |
| **AI Proposal Review & Fallback** | ✅ | | | | Gemini 1.5 API review with deterministic fallback. Reads placed component state if provided in request body. |
| **Unit & Integration Test Suites** | ✅ | | | | `geodesicPlotting.test.ts` ($5/5$ pass) and `endToEndIntegration.test.ts` ($8/8$ pass). |

---

## Critical Blockers & Action Plan

1. **Blocker 1: Missing Three.js / React Three Fiber Engine**
   - *Issue*: `package.json` lacks `three`, `@types/three`, `@react-three/fiber`, `@react-three/drei`.
   - *Fix Plan*: Install Three.js & R3F dependencies and replace CSS 3D mockup with a real WebGL Three.js / R3F viewport in Stage 2.

2. **Blocker 2: Fragmented State Management**
   - *Issue*: 2D, 3D, and AI screens operate on disconnected states. Navigating $2\text{D} \rightarrow 3\text{D} \rightarrow 2\text{D}$ resets un-persisted plot and infrastructure modifications.
   - *Fix Plan*: Establish a single canonical `PlanningDesign` state contract stored in shared memory/localStorage and synced across 2D, 3D, and AI proposal screens in Stage 1.

3. **Blocker 3: 3D Scene Local Coordinate System & Building Extrusions**
   - *Issue*: 3D scene lacks proper geospatial-to-local $(X, Y, Z)$ origin transformations for candidate plot and nearby OSM buildings within 500m.
   - *Fix Plan*: Implement local coordinate transformation centered on plot origin $(0,0,0)$ and extrude nearby OSM buildings as true 3D meshes in Stage 3.

4. **Blocker 4: 3D Infrastructure Component Interaction**
   - *Issue*: No 3D interaction (select, move, rotate, scale, delete, duplicate).
   - *Fix Plan*: Connect 3D components to shared state with interactive 3D gizmo/transform controls in Stage 4.
