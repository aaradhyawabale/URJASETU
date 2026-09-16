# UrjaSetu — Stage 1 Audit & Journey Redesign Blueprint

**Repository:** `aaradhyawabale/URJASETU`  
**Target City:** Nashik, Maharashtra, India  
**Date:** 2026-09-16  
**Status:** Approved Architecture Blueprint  

---

## 1. Executive Summary & Journey Blueprint

This blueprint defines the unification of the **UrjaSetu Geospatial Planning Platform** into a single, seamless, demo-ready user journey. Rather than requiring users to manually navigate disconnected screens and complex technical parameters, the application is organized around 7 intuitive, sequential decision steps:

```
[1. WHERE?] ──> [2. WHAT'S NEEDED?] ──> [3. WHERE CAN IT GO?] ──> [4. PLAN IT] ──> [5. SEE IT] ──> [6. WHY HERE?] ──> [7. CREATE PROPOSAL]
```

---

## 2. Before vs. After Screen & Navigation Mapping

| User Journey Step | Previous Screen / Component | Redesigned UX & Architectural Role | Reusability / Modification |
| :--- | :--- | :--- | :--- |
| **1. WHERE?** | `OverviewDashboard.tsx` & `SiteIntelligence.tsx` | Clean Nashik-first Leaflet map landing page with local fuzzy search bar (OSM roads, POIs, land use, NMC divisions) & Nominatim geocoder fallback. | **REWORKED**: Minimal default layers, search fly-to, territory selection. |
| **2. WHAT'S NEEDED?** | Scattered dropdowns in `SitePlanningWorkspace.tsx` | Area-level infrastructure requirement/priority indicator per NMC division (Solar, EV Charging, Solar+EV Hub) with mandatory proxy labels. | **NEW UX**: Aggregated priority metrics surfaced directly on map/territory selection. |
| **3. WHERE CAN IT GO?** | Candidate site markers only | Screened open-space discovery layer computed via Turf.js constraint subtraction (excluding buildings + buffer, roads + setback, river 30m setback). | **NET-NEW LAYER**: Toggleable negative-space polygon layer cached per division. |
| **4. PLAN IT** | `InteractivePlotDrawer.tsx` | Click-to-acquire derived candidate plot polygon loading into an interactive 2D Infrastructure Designer (typed component placement: solar canopy, EV charger, BESS). | **UPGRADED**: Click-to-acquire + multi-component placement designer sharing unified state. |
| **5. SEE IT** | `ThreeDSitePlanner.tsx` | React Three Fiber / Three.js 3D perspective viewport displaying confirmed plot geometry, placed 3D infrastructure components, and real surrounding OSM buildings. | **UPGRADED**: R3F scene with real nearby building extrusions (<500m) & synchronized 2D/3D state. |
| **6. WHY HERE?** | Decomposable score tree in `SiteIntelligence.tsx` | Integrated "Why Here?" explanation panel surfacing MCDA factor breakdown, Copernicus DEM slope, NASA POWER GHI, MSEDCL grid proximity, and provenance disclaimers. | **REWORKED**: Advanced MCDA weights & technical details demoted to optional methodology drawer. |
| **7. CREATE PROPOSAL** | `AIProposalReview.tsx` | Structured Gemini AI / Deterministic Fallback proposal synthesis consuming the exact shared journey state (plot geometry + placed infrastructure components). | **REUSED & CONNECTED**: Rebuilt payload to feed from shared 2D/3D component data model. |

---

## 3. Component Reuse & Architecture Map

### A. Reused As-Is (GIS Foundation & Services)
- `backend/src/services/candidateService.ts`: Candidate site grid generation & hard constraint masks.
- `backend/src/services/elevationService.ts`: Copernicus DEM GLO-30 raster bilinear sampling & 4-neighbor slope calculation.
- `backend/src/services/climateService.ts`: NASA POWER $5.02 \text{ kWh/m}^2/\text{day}$ annual GHI climatology.
- `backend/src/services/gridService.ts`: MSEDCL 33/11kV substation & feeder line proximity calculation.
- `backend/src/services/wardService.ts`: 6 NMC Administrative Divisions spatial point-in-polygon lookup & aggregation.
- `backend/src/services/shadingService.ts`: 3D solar micro-shading screening proxy.
- `backend/src/services/sensitivityService.ts`: 4-scenario MCDA weight calibration matrix.

### B. Upgraded / Reworked (Frontend Components)
- `src/components/layout/AppShell.tsx` & `Sidebar.tsx`: Reorganized navigation commands to follow the linear 7-step user journey.
- `src/gis/components/LeafletMap.tsx`: Enhanced with local search overlay, screened open-space layer toggle, and click-to-acquire handlers.
- `src/gis/components/InteractivePlotDrawer.tsx`: Upgraded to 2D Infrastructure Designer supporting multi-component placement (Solar PV, EV Chargers, BESS).
- `src/pages/ThreeDSitePlanner.tsx`: Extended with Three.js/R3F rendering of real nearby OSM building extrusions, confirmed plot boundary, and 3D placed infrastructure models.
- `src/pages/AIProposalReview.tsx`: Reconnected to consume shared 2D/3D placed component layout and structured GIS context.

### C. Net-New Subsystems
1. **Local Fuzzy Search Engine (`searchService.ts`)**: Built over pre-indexed OSM roads, POIs, land use, and NMC divisions with Nominatim fallback.
2. **Constraint Subtraction Layer (`screenedSpaceService.ts`)**: Precomputes negative-space polygons per NMC division using Turf.js difference operations.
3. **Click-to-Acquire Point-in-Polygon Engine**: Evaluates clicked coordinate inside screened space and generates a derived candidate plot polygon.
4. **Unified Component State Contract (`IJourneyState`)**: Shared state container linking 2D designer, 3D viewport, and AI proposal review.

---

## 4. Shared Data Contract (`IJourneyState`)

```typescript
export interface IPlacedComponent {
  id: string;
  type: 'SOLAR_CANOPY' | 'EV_CHARGER' | 'CHARGING_BAY' | 'BESS_CONTAINER' | 'TRANSFORMER';
  name: string;
  xMeters: number; // Offset from plot center
  yMeters: number;
  widthMeters?: number;
  lengthMeters?: number;
  rotationDegrees: number;
  specs: Record<string, number | string>;
}

export interface IJourneyState {
  // Step 1: WHERE?
  selectedLocation: {
    name: string;
    latitude: number;
    longitude: number;
    divisionId?: string;
    divisionName?: string;
  } | null;

  // Step 2: WHAT'S NEEDED?
  targetInfrastructureType: 'SOLAR_EV_CHARGING_HUB' | 'STANDALONE_EV_STATION' | 'ROOFTOP_SOLAR_ONLY' | 'BATTERY_STORAGE_SYSTEM';
  areaPriorityScore: number; // 0 - 100 aggregated proxy

  // Step 3: WHERE CAN IT GO?
  screenedSpacePolygon: number[][][] | null; // GeoJSON ring

  // Step 4: PLAN IT (2D Designer)
  confirmedPlotGeometry: {
    type: 'Polygon';
    coordinates: number[][][]; // WGS84 GeoJSON [lng, lat]
  } | null;
  plotAreaSqm: number;
  placedComponents: IPlacedComponent[];

  // Step 5: SEE IT (3D Viewport)
  cameraState: {
    headingRotation: number;
    pitchAngle: number;
    zoomScale: number;
    solarElevationAngle: number;
  };

  // Step 6: WHY HERE? (Explanation Metrics)
  mcdaOpportunityScore: number;
  gisFactors: Record<string, any>;
  gridProximity: Record<string, any>;
  provenanceClassifications: Record<string, string>;

  // Step 7: CREATE PROPOSAL
  savedProposalId?: string;
  aiReviewResponse?: any;
}
```

---

## 5. Non-Negotiable Data Honesty & Provenance Rules

Every screen in the updated user journey strictly adheres to verified provenance labels:
- **Solar Resource Baseline**: `OPEN (NASA POWER 50km Climatology)` — regional climatology, not plot-level irradiance.
- **Terrain Elevation & Slope**: `DERIVED (Copernicus DEM 30m GLO-30 DSM)` — coarse grid raster, not LiDAR.
- **Waterway Flood Setback**: `CONSERVATIVE_PROJECT_SCREENING_BUFFER` — 30m riverbed screening, not official statutory flood map.
- **Administrative Extents**: `DERIVED_NMC_ADMINISTRATIVE_ZONES` — digitized NMC division boundaries.
- **Grid Infrastructure**: `DERIVED_GRID_INFRASTRUCTURE_PROXY` — spatial feeder corridors, not SCADA transformer load logs.
- **Auto-Derived Plot Geometry**: `DERIVED_CANDIDATE_PLOT_GEOMETRY` — suitability-screened area, not cadastral title deed boundary.
- **Statutory Zoning**: `UNVERIFIED_STATUTORY_ZONING` — OSM land cover proxy, not MRTP Act 1966 DP clearance.
- **Capacity & Capex Figures**: `PLANNING_HEURISTIC` / `PROJECT_MODELING_ASSUMPTION` — preliminary urban planning benchmarks.

---

## 6. Stage-by-Stage Implementation Roadmap

- **Stage 1 (Current)**: Audit & Journey Redesign Blueprint (Completed & Committed).
- **Stage 2**: Nashik-First Map Landing Experience (Clean default map, search bar, problem picker, secondary layers toggle).
- **Stage 3**: Search-Driven Navigation (Local fuzzy search index + Nominatim fallback + territory fly-to).
- **Stage 4**: Requirement / Priority Visualization (NMC division level aggregated requirement indicator).
- **Stage 5**: Screened Open-Space Discovery Layer (Turf.js constraint subtraction polygon layer).
- **Stage 6**: Click-to-Acquire Derived Plot Geometry (Screened space point-in-polygon lookup & 2D editor loading).
- **Stage 7**: 2D Infrastructure Designer Upgrade (Typed component placement: solar, EV ports, BESS).
- **Stage 8**: 3D Scene Upgrade (Three.js/R3F viewport with real nearby OSM building extrusions & shared 2D/3D component state).
- **Stage 9**: 3D Infrastructure Assets (Procedural primitives baseline + verified CC0 models).
- **Stage 10**: Surrounding Context Enhancements (Aerial basemap toggle & context indicators).
- **Stage 11**: "Why Here?" Explanation Panel & AI Proposal Reconnection (Surfacing MCDA factors & AI proposal synthesis).
- **Stage 12**: Full Journey Integration Test, Visual QA, and Performance Pass.
