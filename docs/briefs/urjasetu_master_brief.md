from pathlib import Path

content = """# URJASETU — MASTER BRIEF

## AI-Assisted Geospatial Intelligence & Decision-Support Platform for Climate-Smart Infrastructure

**Document status:** Master Source of Truth for Prototype Development

**Project:** UrjaSetu

**Hackathon:** PCCOE International Grand Challenge 2026

**Theme:** AI for Climate Change

**Primary demo town:** Kopargaon

**Prototype frontend:** Google Stitch

**Implementation / backend / integration:** Antigravity

**Engineering prompts:** Claude, using prompts supplied separately

**Core story:** FIND → SCREEN → MEASURE → VISUALIZE → EXPLAIN → DECIDE

---

# 1. DOCUMENT PURPOSE

This is the consolidated master brief for UrjaSetu. It merges the established UrjaSetu core concept with the 3D Site Planning + AI Proposal layer and the latest problem statement, proposed solution, objectives, features, architecture, user workflow and prototype requirements.

Use this document as the **single source of truth** for Claude and Antigravity.

The prototype should feel like a real municipal planning product, not a generic AI dashboard.

---

# 2. PROJECT IDENTITY

## Product Name

**UrjaSetu**

## One-Line Description

> UrjaSetu is an AI-assisted Geospatial Intelligence and Decision-Support Platform that identifies, screens, ranks, measures, visualizes and explains climate-smart infrastructure locations.

## 10-Second Pitch

> **“UrjaSetu tells any Indian town exactly where to put its next solar-EV charging point — and exactly why — in seconds, not months.”**

## Core Question

> **Where should we build the next Solar-EV Charging Hub — and why?**

## Product Story

> **FIND → SCREEN → MEASURE → VISUALIZE → EXPLAIN → DECIDE**

## Core Product Identity

The primary identity of UrjaSetu is **Solar-EV Charging Hub site selection**.

---

# 3. FINAL PROBLEM STATEMENT

Rapid urban growth in Indian cities and towns is increasing pressure on **energy infrastructure, transportation, land use and climate resilience**. At the same time, cities need to accelerate renewable energy adoption and expand EV infrastructure to support the transition toward a lower-carbon future.

However, important planning decisions — such as **where to install solar-powered infrastructure, where EV charging is most useful, and which locations should be avoided because of climate risk** — are often made using fragmented datasets and separate planning processes.

Satellite imagery, GIS data, road networks, population/activity information, elevation and climate data may be available, but they are rarely brought together into one simple decision-making workflow. Existing tools often visualize data or solve individual planning problems, leaving planners to manually compare locations and justify their choices.

This creates a critical gap:

> **A high-potential location is not necessarily a suitable location.**

A site may have strong solar potential and accessibility but still face **flood/drainage risk, land-use conflicts or insufficient usable space**.

## Key Question

> **Where should we build the next Solar-EV Charging Hub — and why?**

UrjaSetu addresses this challenge by combining **climate-aware geospatial analysis, site opportunity scoring, risk screening, land planning, 3D visualization and AI-assisted explanation** into one reusable decision-support workflow for Indian towns.

---

# 4. EXISTING SOLUTION GAP

Existing solutions commonly solve only one part of the planning problem.

### TERI Rooftop Solar Web-GIS

Estimates rooftop solar potential but is focused on rooftop solar and city-specific deployment.

### Enterprise GIS Platforms

Platforms such as Esri/GMIS/IGiS provide powerful GIS capabilities but can be expensive, complex and specialist-oriented for smaller municipal teams.

### Academic EV Charging Site-Selection Studies

GIS + AHP/TOPSIS and similar approaches exist, but many are one-city research studies rather than reusable software workflows for non-GIS officers.

### Flood-Risk Platforms

Commercial and research flood-risk tools address climate risk, but they do not provide an integrated Solar-EV infrastructure site-selection workflow for smaller towns.

## Concrete Gap

> Existing tools often solve one slice — **solar OR EV OR flood** — for one city or as a specialist/academic solution. There is a gap for an accessible, reusable workflow that combines **solar suitability + EV demand proxy + road accessibility + flood/drainage screening + land/conflict screening** into one ranked and explainable shortlist.

---

# 5. FINAL PROPOSED SOLUTION

**UrjaSetu** is an **AI-assisted Geospatial Intelligence and Decision-Support Platform** designed to help Indian towns make climate-smart infrastructure decisions.

It integrates accessible geospatial and environmental information such as:

- Roads

- Buildings

- Land-use information

- Satellite-derived information

- Elevation

- Rainfall/climate information

- Population/activity proxies

- Points of interest

It analyses candidate locations across:

- Solar Suitability

- EV Demand Proxy

- Road Accessibility

- Opportunity Score

- Flood / Drainage Risk

- Land-use & Infrastructure Conflicts

- Available Plot Area

Instead of only displaying datasets on a map, UrjaSetu converts them into a **ranked and explainable shortlist of potential sites**.

A planner can then:

1. Select a recommended location

2. Draw the usable plot boundary

3. Estimate plot area

4. Choose a Solar-EV Charging Hub

5. Visualize the concept in 3D

6. Ask the AI Planning Assistant to explain/review the proposal

7. Save it as a decision-ready proposal

## Core Transformation

> **Fragmented spatial data → site intelligence → ranked location → measurable plot → 3D concept → AI explanation → proposal**

---

# 6. OBJECTIVES

## 01 — IDENTIFY OPPORTUNITY

Find locations with strong solar suitability, EV demand potential and road accessibility.

## 02 — SCREEN RISK & CONFLICTS

Check flood/drainage risk and identify obvious land-use or infrastructure conflicts before recommending a site.

## 03 — TURN A SITE INTO A PROPOSAL

Allow planners to select a site, draw the usable plot, estimate its area and visualize a Solar-EV Charging Hub in 3D.

## 04 — EXPLAIN & JUSTIFY THE DECISION

Show why a location is recommended and use AI to assist with proposal evaluation and planning considerations.

---

# 7. KEY GOALS

### 01 — Climate-Smart Site Selection

Rank locations using solar suitability, EV demand, accessibility and climate risk.

### 02 — From Map to Proposal

Select a site, measure the plot and visualize a Solar-EV Charging Hub in 3D.

### 03 — Explainable Planning

Use AI to explain recommendations and highlight factors to verify.

---

# 8. TARGET USERS

## Primary

**Municipal / ULB Officers** — Site selection and climate-smart planning.

## Secondary

**Urban Planners** — Compare and prioritize suitable locations.

**Renewable & EV Agencies** — Plan clean-energy and charging infrastructure.

**Infrastructure Developers** — Identify promising Solar-EV locations for further evaluation.

The MVP should be designed primarily around the municipal/ULB workflow.

---

# 9. UNIQUE FEATURES / INNOVATION

## 1. Beyond Visualization — Maps → Decisions

Ranks sites and explains why they are recommended or rejected.

## 2. Unified Analysis — One Platform, Multiple Factors

Solar + EV demand + roads + land + climate risk.

## 3. Risk-Aware Selection — Potential ≠ Suitability

Screens flood/drainage and infrastructure/land-use conflicts before recommendation.

## 4. 2D → 3D Planning — Plan Before You Build

Select site → draw plot → estimate area → visualize Solar-EV Hub in 3D.

## 5. Explainable AI — AI That Explains

Explains why a site is suitable and what should be verified.

## 6. Decision-Ready Proposal — Analysis → Action

Combines score + risk + plot + 3D + AI into a saved proposal.

## Core Differentiation

> **GIS provides the evidence → AI explains the decision → 3D visualizes the concept.**

---

# 10. END-TO-END WORKFLOW

## Main Flow

> **FIND → SCREEN → MEASURE → VISUALIZE → EXPLAIN → DECIDE**

## Detailed Flow

> Opportunity Scoring

> ↓

> Risk / Conflict Screening

> ↓

> Ranked Site

> ↓

> Select Location

> ↓

> Draw Plot

> ↓

> Calculate Area

> ↓

> Choose Infrastructure

> ↓

> 3D Placement

> ↓

> AI Proposal Review

> ↓

> Save Proposal

## Critical Integration Rule

The 3D and AI layer is **not a random add-on**.

It must start from a site identified by the core UrjaSetu geospatial engine:

> **Recommended Site → Plan This Site → Measure → Visualize → Explain → Save Proposal**

---

# 11. SYSTEM ARCHITECTURE

```text

DATA SOURCES

      ↓

DATA PREPARATION

      ↓

SITE INTELLIGENCE ENGINE

      ↓

RISK & CONFLICT SCREENING

      ↓

RANKED CANDIDATE SITES

      ↓

2D SITE PLANNING WORKSPACE

      ↓

PLOT MEASUREMENT

      ↓

3D SITE VISUALIZATION

      ↓

AI PLANNING ASSISTANT

      ↓

DECISION-READY PROPOSAL

```

---

# 12. DATA SOURCES

## OpenStreetMap

Potential information:

- Roads

- Streets

- Buildings

- Rivers/water features

- Schools

- Hospitals

- POIs

- Land-use information where available

OSM is a geographic data source, not merely a visual basemap.

## Bhuvan / Satellite-Derived Information

Can support land/surface/environmental context.

## Open DEM

Used for:

- Elevation

- Slope/topographic context

- Drainage/flood screening proxies

## Rainfall / Climate Data

Used for climate-risk screening and rainfall-related indicators.

## Population / Activity Proxies

Potential signals:

- Population density

- POI density

- Road activity proxy

- Commercial/activity clusters

## Data Honesty Rule

If real data is unavailable, use clearly labelled **estimated, proxy, simulated or demo values**.

Never present simulated values as official municipal data.

---

# 13. SITE INTELLIGENCE ENGINE

The engine evaluates candidate locations.

## Core Metrics

### Solar Suitability

Relative suitability for solar infrastructure based on available solar/environmental information.

### EV Demand Proxy

Estimated potential charging demand using available activity-related proxies.

### Road Accessibility

Relative accessibility from nearby roads.

### Opportunity Score

Overall decision-support indicator combining positive factors and risk penalties.

The score is **not a certified engineering score**.

---

# 14. OPPORTUNITY SCORING

A transparent conceptual model:

```text

Opportunity Score =

    Solar Suitability × W1

  + EV Demand Proxy × W2

  + Road Accessibility × W3

  + Land Suitability × W4

  - Risk Penalty × W5

```

Weights should be configurable.

For the MVP, prefer a simple deterministic scoring model over an opaque ML model unless a real trained model is available.

Example:

```text

Solar Suitability       91

EV Demand Proxy         82

Road Accessibility      88

Land Suitability        80

Risk Penalty             8

--------------------------------

Opportunity Score       84/100

```

The UI should expose component values so the score is explainable.

---

# 15. RISK & CONFLICT SCREENING

## Purpose

Prevent high opportunity from being treated as automatic suitability.

## Flood / Drainage Risk

Use available elevation, drainage proximity and rainfall-related proxies.

## Land-Use Conflict

Flag obvious conflicts such as:

- Water bodies

- Protected/obvious exclusion areas

- Incompatible land-use categories where data exists

## Infrastructure Conflict

Flag obvious conflicts with:

- Major infrastructure

- Existing structures

- Road geometry

- Other represented restricted areas

## Candidate Status

Use clear states such as:

- Recommended

- Review Required

- Risk Flagged

- Rejected

---

# 16. RANKED SITE RESULTS

Each candidate site should expose approximately:

```text

SITE #01

Opportunity Score     84/100

Solar Suitability     91

EV Demand Proxy       82

Road Access            88

Flood Risk             Low

Conflict Status        Clear

[ VIEW SITE ]

[ PLAN THIS SITE ]

```

The interface should make the ranking understandable.

---

# 17. 2D GIS MAP

## Recommended Technology

- Leaflet or MapLibre

- Turf.js

- Optional Leaflet-Geoman / Leaflet Draw

## Responsibilities

- Base map

- Candidate locations

- Opportunity visualization

- Risk overlays

- Conflict overlays

- Location selection

- Plot drawing

- Site planning

## Example Layers

```text

[✓] Candidate Sites

[✓] Opportunity Score

[ ] Flood / Drainage Risk

[ ] Roads

[ ] Buildings

[ ] Land Use

[ ] Solar Suitability

```

The 2D map is the primary spatial interaction surface.

---

# 18. LOCATION SELECTION

When a recommended site is selected:

```text

2D Map

   ↓

Selected Lat/Lon

   ↓

Site Planning Workspace

```

Coordinates must pass automatically into the planning layer.

No manual coordinate re-entry.

Example:

```json
{
  "siteId": "SITE-01",

  "latitude": 19.88,

  "longitude": 74.48,

  "opportunityScore": 84
}
```

Demo coordinates can be adjusted to the final Kopargaon dataset.

---

# 19. PLOT DRAWING

After selecting a site, the planner enters the Site Planning Workspace.

The planner draws the usable plot boundary directly on the map.

Recommended:

- Leaflet-Geoman

- or Leaflet Draw

Flow:

```text

Select Site

    ↓

Draw Polygon

    ↓

GeoJSON Polygon

    ↓

Calculate Area

    ↓

Display Estimated Area

```

Example:

> **Estimated Plot Area: 2,450 m²**

Required wording:

> **Estimated available plot area based on the drawn boundary**

Do not call it cadastral, legal, survey-grade or authoritative land area unless authoritative data exists.

---

# 20. AREA CALCULATION

Use Turf.js `turf.area()`.

```text

Draw Polygon

    ↓

GeoJSON Polygon

    ↓

Turf.js turf.area()

    ↓

Area in m²

    ↓

Display in UI

```

Area should update whenever the polygon is edited.

Optional conversion:

```text

Estimated Plot Area

2,450 m²

≈ 0.61 acres

```

Only show conversions if implemented correctly.

---

# 21. INFRASTRUCTURE SELECTION

Primary MVP option:

> **Solar-EV Charging Hub**

Optional demo choices may exist, but they must not dilute the core story.

Example:

```text

Infrastructure Type

● Solar-EV Charging Hub

○ Solar Canopy

○ EV Charging Station

```

The Solar-EV Charging Hub remains the dominant concept.

---

# 22. 3D SITE PLANNING

## Purpose

Answer:

> **“What could we build here?”**

## Technology

**CesiumJS**

## Flow

```text

2D Selected Location

        ↓

Latitude / Longitude

        ↓

CesiumJS

        ↓

3D Geographic Context

        ↓

Place Infrastructure Model

```

Core principle:

> **2D tells us WHERE. 3D shows us WHAT it could look like.**

This is conceptual site planning, not CAD.

---

# 23. 3D MODELING

Use lightweight `.glb` models.

Possible assets:

- Solar canopy

- EV charging units

- Small charging hub

- Parking/vehicle markers

- Basic site structures

Possible sources include Sketchfab, Poly Pizza, Kenney Assets, CGTrader or self-created Blender assets, subject to licensing.

Do not build a large 3D asset library for the MVP.

One or two strong relevant models are enough.

---

# 24. 3D INTERACTIONS

Support:

- Move

- Rotate

- Resize / scale

- Delete

Optional:

- Duplicate

Do not present this as:

- CAD

- Construction design

- Engineering approval

- Survey-grade planning

---

# 25. 3D DEMO STORY

```text

84/100

   ↓

Draw Plot

   ↓

2,450 m²

   ↓

Place Solar-EV Hub

   ↓

3D Context

   ↓

AI: Suitable

   ↓

Save Proposal

```

This should be one of the strongest demo moments.

---

# 26. AI PLANNING ASSISTANT

The AI is an **explanation and planning assistant**, not the source of geographic truth.

## Responsibility Split

> **GIS provides spatial truth/evidence.**

> **AI explains and assists with planning decisions.**

The AI receives structured metrics from the GIS/decision engine.

Example input:

```json
{
  "site": "SITE-01",

  "opportunityScore": 84,

  "solarSuitability": 91,

  "evDemandProxy": 82,

  "roadAccessibility": 88,

  "floodRisk": "Low",

  "conflictStatus": "Clear",

  "estimatedPlotAreaM2": 2450,

  "infrastructure": "Solar EV Charging Hub"
}
```

The AI should explain only the supplied evidence.

---

# 27. AI OUTPUT EXAMPLE

> **Site assessment: Suitable for further planning**

>

> This site combines strong solar suitability, good road accessibility and a high activity-based EV demand proxy. The screened flood risk is low and no major mapped conflicts were identified in the current analysis.

>

> Before implementation, verify grid capacity, land ownership, zoning, drainage conditions and site-level engineering feasibility.

---

# 28. AI GUARDRAILS

The AI must:

1. Use supplied structured site metrics for geographic claims.

2. Distinguish estimates/proxies from authoritative facts.

3. Avoid fabricated coordinates, distances, land ownership, zoning or infrastructure capacity.

4. Avoid claiming engineering/legal approval.

5. Avoid presenting simulated values as real measurements.

6. Recommend verification where necessary.

7. Explain the score using component metrics.

8. Remain advisory.

Preferred language:

- “The current screening indicates…”

- “Based on the available proxy data…”

- “This site appears suitable for further evaluation…”

- “Verify grid capacity and land ownership before implementation.”

Avoid unsupported claims such as exact generation, exact carbon savings, grid capacity or legal approval.

---

# 29. PROPOSAL WORKSPACE

A proposal combines:

## Site Information

- Site ID

- Location

- Opportunity Score

- Component scores

## Risk Information

- Flood/drainage status

- Conflict status

- Warnings

## Plot Information

- Drawn polygon

- Estimated area

## Infrastructure

- Solar-EV Charging Hub

- Model placement information

## 3D View

- Conceptual infrastructure visualization

## AI Review

- Why suitable

- Key strengths

- Verification checklist

- Planning considerations

Primary CTA:

> **Save Proposal**

---

# 30. DECISION-READY PROPOSAL

Example:

```text

URJASETU SITE PROPOSAL

Site: SITE-01

Opportunity Score: 84/100

Solar Suitability: 91

EV Demand Proxy: 82

Road Accessibility: 88

Flood Risk: Low

Conflict Status: Clear

Estimated Plot Area: 2,450 m²

Infrastructure:

Solar-EV Charging Hub

AI Assessment:

Suitable for further planning

Verification:

• Grid capacity

• Land ownership

• Zoning

• Drainage

• Engineering feasibility

```

---

# 31. CORE UI / FRONTEND SCREENS

Google Stitch should create the polished frontend UI.

## Screen 1 — Landing / Overview

- UrjaSetu introduction

- Selected town

- Workflow

- Start CTA

CTA:

> **Explore Sites**

## Screen 2 — Planning Dashboard

- Top navigation

- Town selector

- Map

- Layer controls

- Opportunity/risk legend

- Candidate list

- Score cards

Navigation:

```text

Overview

Site Intelligence

Risk & Conflicts

Plan Site

Proposals

```

## Screen 3 — Site Intelligence

- Map

- Candidate locations

- Opportunity score

- Solar suitability

- EV demand proxy

- Road accessibility

CTA:

> **View Site**

## Screen 4 — Risk & Conflict

- Flood/drainage overlay

- Land-use conflict indicators

- Infrastructure conflicts

- Site status

CTA:

> **Plan This Site**

## Screen 5 — Site Planning Workspace

- Selected location

- Draw polygon tool

- Estimated plot area

- Infrastructure selection

- Site metrics

CTA:

> **Plan in 3D**

## Screen 6 — 3D Site Planner

- 3D geographic context

- Infrastructure model

- Selected plot

- Move/rotate/scale controls

- Proposal summary

CTA:

> **Review with AI**

## Screen 7 — AI Proposal Review

- Site suitability explanation

- Score explanation

- Strengths

- Risks

- Verification checklist

CTA:

> **Save Proposal**

## Screen 8 — Saved Proposal

- Proposal summary

- Site details

- Plot area

- 3D concept preview if implemented

- AI review

- Export/print option if implemented

---

# 32. FRONTEND DESIGN LANGUAGE

The visual identity should communicate:

> **Geospatial intelligence + infrastructure planning + clean energy**

Use:

- Premium dark background

- Dark gray panels

- One primary energy accent

- High contrast

- Large typography

- Strong map visuals

- Clean GIS overlays

- Subtle glass/technical cards

- Consistent icons

- Minimal unnecessary decoration

Avoid:

- Generic AI startup visuals

- Excessive gradients

- Cartoonish illustrations

- Generic chatbot-first design

- Overloaded dashboards

- Random 3D visuals disconnected from the map

---

# 33. FRONTEND TECHNOLOGY

Google Stitch:

- React

- TypeScript

- Leaflet or MapLibre

- CesiumJS

- Turf.js

- Component-based UI

- Responsive desktop-first planning interface

Stitch-generated UI must remain modular and easy to connect to APIs.

The map and planning workflow should remain visually dominant.

---

# 34. BACKEND / ENGINEERING RESPONSIBILITY

Antigravity handles the implementation beyond the Stitch-generated UI:

- Backend/API

- Geospatial processing

- Scoring engine

- Risk/conflict logic

- Site ranking

- Plot-area integration

- Proposal persistence

- 3D integration

- AI integration

- Frontend/backend integration

- Validation

- Testing

- Deployment preparation

---

# 35. POSSIBLE BACKEND STACK

Use whichever option is fastest and most reliable:

### Option A

- Node.js

- Express

- TypeScript

- SQLite/PostgreSQL

### Option B

- FastAPI

- Python

- GeoPandas

- SQLite/PostGIS

For the hackathon MVP, prefer simplicity and reliability over unnecessary infrastructure.

---

# 36. GEOSPATIAL LIBRARIES

Possible tools:

- Leaflet / MapLibre — 2D map

- Turf.js — spatial calculations

- GeoPandas — geospatial processing

- Shapely — geometry processing

- Rasterio — raster processing if needed

- CesiumJS — 3D geographic visualization

Do not add unnecessary dependencies.

---

# 37. DATA MODELS

## Candidate Site

```json
{
  "id": "SITE-01",

  "name": "Candidate Site 01",

  "latitude": 0,

  "longitude": 0,

  "solarSuitability": 91,

  "evDemandProxy": 82,

  "roadAccessibility": 88,

  "landSuitability": 80,

  "floodRisk": "Low",

  "conflictStatus": "Clear",

  "opportunityScore": 84
}
```

## Site Polygon

```json
{
  "siteId": "SITE-01",

  "geometry": {
    "type": "Polygon",

    "coordinates": []
  },

  "estimatedAreaM2": 2450
}
```

## Proposal

```json
{
  "id": "PROP-001",

  "siteId": "SITE-01",

  "infrastructureType": "Solar EV Charging Hub",

  "estimatedPlotAreaM2": 2450,

  "siteScore": 84,

  "riskStatus": "Low",

  "conflictStatus": "Clear",

  "aiAssessment": "...",

  "modelPlacement": {},

  "createdAt": "..."
}
```

---

# 38. SUGGESTED API DESIGN

```text

GET    /api/sites

GET    /api/sites/:id

GET    /api/sites/:id/analysis

GET    /api/sites/:id/risk

POST   /api/sites/:id/plot

POST   /api/proposals

GET    /api/proposals

GET    /api/proposals/:id

POST   /api/ai/site-review

```

Exact routes may be adapted if a better architecture is selected.

Core scoring, risk evaluation and proposal persistence should be centralized rather than duplicated in the frontend.

---

# 39. AI API

Suggested endpoint:

```http

POST /api/ai/site-review

```

Request:

```json
{
  "siteMetrics": {
    "opportunityScore": 84,

    "solarSuitability": 91,

    "evDemandProxy": 82,

    "roadAccessibility": 88,

    "floodRisk": "Low",

    "conflictStatus": "Clear",

    "estimatedPlotAreaM2": 2450
  },

  "infrastructureType": "Solar EV Charging Hub"
}
```

Response:

```json
{
  "assessment": "Suitable for further planning",

  "reasoning": [
    "Strong solar suitability",

    "Good road accessibility",

    "High activity-based EV demand proxy"
  ],

  "verification": [
    "Grid capacity",

    "Land ownership",

    "Zoning",

    "Drainage",

    "Engineering feasibility"
  ]
}
```

---

# 40. MVP SCOPE

## Must Have

### Map

- Kopargaon demo area

- 2D map

- Candidate locations

### Site Intelligence

- Solar score

- EV demand proxy

- Road accessibility

- Opportunity score

- Ranked sites

### Risk

- Flood/drainage indicator

- Conflict indicator

### Site Selection

- Select recommended site

- Automatic coordinate transfer

### Plot Planning

- Draw polygon

- Calculate estimated area

### 3D

- CesiumJS

- Selected site location

- Conceptual Solar-EV Hub model

- Basic manipulation

### AI

- Explain supplied site metrics

- Verification checklist

### Proposal

- Save proposal

- Display proposal summary

---

# 41. NICE-TO-HAVE

Only after MVP stability:

- Multiple infrastructure model options

- Better 3D models

- Proposal PDF/export

- Advanced map layers

- Search

- Site comparison

- Proposal history

- Additional towns

- More detailed risk layers

- Model placement presets

---

# 42. OUT OF SCOPE FOR MVP

Do not spend hackathon time building:

- Full digital twin

- Full CAD system

- Survey-grade land measurement

- Legal cadastral verification

- Real-time traffic prediction

- Exact EV demand forecasting

- Exact solar generation forecasting

- Full engineering design

- Grid capacity certification

- Automated legal/zoning approval

- Large 3D asset marketplace

- Complex ML training without reliable data

- Nationwide production-grade GIS infrastructure

---

# 43. ANTI-OVERCLAIMING RULES

Never imply capabilities that have not been implemented.

Do not claim:

- Exact energy generation

- Exact carbon savings

- Exact EV charging demand

- Legal land ownership

- Legal zoning approval

- Engineering approval

- Survey-grade area

- Guaranteed flood safety

- Guaranteed grid capacity

- Guaranteed ROI

Use:

- Estimated

- Proxy

- Screening

- Indicative

- Simulated

- Conceptual

- Further verification required

---

# 44. DEMO DATA STRATEGY

The hackathon demo should be reliable.

If live external data is difficult to obtain, use a controlled demo dataset labelled:

> **Demo / estimated analysis**

The dataset should contain:

- Several candidate sites

- Different opportunity scores

- Different solar scores

- Different EV demand proxies

- Different accessibility scores

- Different risk levels

- At least one rejected/risk-flagged location

- At least one clearly recommended site

This proves UrjaSetu does not blindly recommend every location.

---

# 45. IDEAL DEMO SCENARIO

Use **Kopargaon** as the demonstration town.

1. Open UrjaSetu.

2. Select Kopargaon.

3. Show the 2D map.

4. Turn on opportunity/risk layers.

5. Show ranked candidate sites.

6. Open Site #1.

7. Show its component metrics and **84/100** example score.

8. Click **Plan This Site**.

9. Draw a usable plot.

10. Show **Estimated Plot Area: 2,450 m²**.

11. Choose **Solar-EV Charging Hub**.

12. Open 3D.

13. Place/adjust the conceptual hub.

14. Click **Review with AI**.

15. Show AI explanation and verification checklist.

16. Click **Save Proposal**.

Final demo message:

> **“We don't just show the location. We turn the location into a decision-ready proposal.”**

---

# 46. DEMO FAILURE STRATEGY

The prototype should not depend entirely on live external APIs.

Recommended fallback:

```text

Primary:

Real/open geospatial data

Fallback:

Preprocessed demo dataset

AI fallback:

Deterministic explanation template if external AI API fails

```

The user should still be able to complete:

> **FIND → SCREEN → MEASURE → VISUALIZE → EXPLAIN → DECIDE**

even if an external service fails.

---

# 47. TESTING REQUIREMENTS

## Map

- Loads correctly

- Candidate sites render

- Layer toggles work

## Scoring

- Scores are deterministic

- Ranking is correct

- Component scores match displayed values

## Risk

- Statuses display correctly

- Risk-flagged sites are not accidentally recommended

## Plot

- Polygon draws

- Polygon edits

- Area recalculates correctly

## 3D

- Correct site opens

- Model loads

- Placement works

- Controls do not break the map

## AI

- Correct metrics are sent

- AI does not invent geographic facts

- Verification checklist appears

## Proposal

- Saves successfully

- Can be reopened

- Site/plot/AI data remains consistent

## UI

- Desktop demo is stable

- Important panels do not overlap

---

# 48. PERFORMANCE

Prioritize reliability.

Avoid:

- Huge browser datasets

- Hundreds of heavy 3D models

- Excessive animations

- Unnecessary real-time processing

- Repeated AI calls

Prefer:

- Preprocessed candidate data

- Lightweight GeoJSON

- Lightweight GLB assets

- Lazy-loaded 3D viewer

- Cached demo analysis

- Deterministic scoring

---

# 49. SECURITY

API keys must never be hardcoded in frontend source.

Use environment variables for:

- AI keys

- Backend URLs

- Database configuration

- Secrets

Never expose private keys in:

- React source

- GitHub

- Client-side code

---

# 50. PROJECT STRUCTURE

Conceptual structure:

```text

urjasetu/

│

├── frontend/

│   ├── components/

│   │   ├── map/

│   │   ├── site/

│   │   ├── risk/

│   │   ├── planning/

│   │   ├── threeD/

│   │   ├── ai/

│   │   └── proposals/

│   ├── pages/

│   ├── services/

│   ├── types/

│   └── data/

│

├── backend/

│   ├── routes/

│   ├── controllers/

│   ├── services/

│   ├── scoring/

│   ├── geospatial/

│   ├── ai/

│   ├── models/

│   └── data/

│

├── assets/

│   └── models/

│

└── README.md

```

Adapt to the final framework.

---

# 51. IMPLEMENTATION PRIORITY

## Phase 1 — Foundation

Project setup, frontend shell, backend and environment configuration.

## Phase 2 — 2D Map

Map, candidate sites, site cards and layer controls.

## Phase 3 — Site Intelligence

Metrics, scoring, ranking and site detail.

## Phase 4 — Risk

Flood/drainage, conflict status and filtering.

## Phase 5 — Site Planning

Location selection, polygon drawing and Turf area calculation.

## Phase 6 — 3D

CesiumJS, coordinate transfer, GLB model and placement controls.

## Phase 7 — AI

Structured metrics, AI review and guardrails.

## Phase 8 — Proposal

Save, list and view.

## Phase 9 — Polish

UX, animations, loading/error states and demo reliability.

---

# 52. GOOGLE STITCH RESPONSIBILITY

Google Stitch focuses on polished frontend/UI generation:

- Layout

- Navigation

- Cards

- Dashboard

- Map workspace shell

- Site cards

- Risk cards

- Planning panel

- AI review panel

- Proposal page

- Responsive styling

The result must remain modular and connectable to real APIs.

Do not let Stitch turn UrjaSetu into a generic dashboard.

---

# 53. ANTIGRAVITY RESPONSIBILITY

Antigravity handles:

- Project inspection

- Architecture

- Backend

- Data preparation

- Scoring

- Risk engine

- API routes

- Database

- Map integration

- Turf.js

- CesiumJS

- GLB loading

- AI integration

- Proposal persistence

- Testing

- Bug fixing

- Deployment

Make the smallest reliable implementation that demonstrates the full workflow.

---

# 54. CLAUDE PROMPTING RULE

Claude prompts will be supplied separately.

Each prompt should:

- Reference this Master Brief as the source of truth

- State the exact task

- State files/modules to inspect

- State constraints

- Require testing

- Require no unrelated refactoring

- Preserve the UrjaSetu product story

- Avoid overclaiming

- Return implementation status and changed files

Claude must not independently redefine the product.

---

# 55. CRITICAL PRODUCT RULES

### Rule 1

Do not turn UrjaSetu into a generic AI chatbot.

### Rule 2

Do not turn UrjaSetu into only a map visualization.

### Rule 3

Do not treat 3D as a disconnected visual gimmick.

### Rule 4

Do not let AI generate geographic facts.

### Rule 5

Do not replace the Solar-EV site-selection story with a broad smart-city platform.

### Rule 6

Do not add large features before the core end-to-end flow works.

### Rule 7

Selected site must flow automatically from 2D → planning → 3D → AI → proposal.

### Rule 8

The proposal must use the same site and plot selected by the user.

### Rule 9

Estimated/proxy/simulated values must be labelled appropriately.

### Rule 10

Hackathon demo reliability is more important than feature count.

---

# 56. CORE UX COPY

### Main CTA

> **Explore Sites**

### Site CTA

> **View Site**

### Planning CTA

> **Plan This Site**

### 3D CTA

> **Plan in 3D**

### AI CTA

> **Review with AI**

### Save CTA

> **Save Proposal**

### Key Metric

> **Opportunity Score**

### Plot Metric

> **Estimated Plot Area**

### Risk Language

> **Screened Flood Risk**

### AI Status

> **Suitable for Further Planning**

---

# 57. IMPORTANT TERMINOLOGY

Use:

- Solar Suitability

- EV Demand Proxy

- Road Accessibility

- Opportunity Score

- Flood / Drainage Risk

- Risk Screening

- Conflict Screening

- Estimated Plot Area

- Solar-EV Charging Hub

- Conceptual 3D Planning

- AI Planning Assistant

- Proposal Review

- Decision Support

Avoid vague or unsupported terms such as:

- AI score

- Smart score

- Future predictor

- Digital twin

- Autonomous planner

- Guaranteed suitability

---

# 58. HACKATHON VALUE PROPOSITION

### Climate

Screens climate-related flood/drainage risk.

### Clean Energy

Prioritizes solar-suitable infrastructure.

### Clean Mobility

Supports EV charging infrastructure planning.

### Better Land Use

Screens plot suitability and conflicts.

### Better Decisions

Combines multiple evidence layers into one workflow.

### Explainable AI

Uses AI to communicate evidence rather than replacing it.

---

# 59. EXPECTED OUTCOME

UrjaSetu should demonstrate that a municipal planner can move from fragmented spatial information to a structured planning proposal through one workflow.

Expected prototype outcome:

> **A ranked site shortlist + risk screening + measurable plot + conceptual 3D Solar-EV Hub + AI explanation + saved proposal**

The project should demonstrate faster and more transparent early-stage site evaluation.

Do not claim a specific percentage improvement unless measured.

---

# 60. FINAL CONCLUSION

UrjaSetu converts geospatial and climate information into actionable infrastructure planning.

Instead of asking planners to inspect multiple maps and manually compare locations, it creates a connected workflow:

> **FIND → SCREEN → MEASURE → VISUALIZE → EXPLAIN → DECIDE**

Its central idea is:

> **A high-potential location is not necessarily a suitable location.**

UrjaSetu combines:

- Geospatial evidence

- Multi-factor opportunity scoring

- Climate-risk screening

- Plot measurement

- 3D conceptual planning

- Explainable AI

to help Indian towns identify promising Solar-EV Charging Hub locations and turn them into **decision-ready proposals**.

---

# 61. FINAL SOURCE-OF-TRUTH SUMMARY

If an implementation idea conflicts with this brief, preserve these priorities:

```text

1. Solar-EV Charging Hub site selection

2. GIS-based evidence

3. Opportunity scoring

4. Risk/conflict screening

5. Site selection

6. Plot measurement

7. 3D conceptual planning

8. Explainable AI

9. Saved proposal

10. Hackathon demo reliability

```

## Final Product Story

```text

FRAGMENTED DATA

      ↓

URJASETU

      ↓

SITE INTELLIGENCE

      ↓

RISK SCREENING

      ↓

RANKED SITE

      ↓

SELECT SITE

      ↓

DRAW PLOT

      ↓

ESTIMATE AREA

      ↓

PLAN IN 3D

      ↓

AI EXPLANATION

      ↓

SAVE PROPOSAL

```

## Final Positioning

> **UrjaSetu — From Geospatial Evidence to Climate-Smart Infrastructure Decisions.**

"""

out = Path("/mnt/data/URJASETU_MASTER_BRIEF.md")

out.write_text(content, encoding="utf-8")

print(out)
