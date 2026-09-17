# URJASETU — PRODUCT REQUIREMENTS DOCUMENT (PRD)

**Document Type:** Product Requirements Document (Implementation-Ready)
**Document Status:** DRAFT v1.0 — Derived from URJASETU_MASTER_BRIEF.md (Final Source of Truth)
**Project:** UrjaSetu
**Hackathon:** PCCOE International Grand Challenge 2026
**Theme:** AI for Climate Change
**Primary Demo Town:** Kopargaon
**Prepared By:** Product Management / Product Architecture
**Next Document:** UrjaSetu TRD (Technical Requirements Document) — NOT included here

---

## DOCUMENT STATUS

This PRD translates the UrjaSetu Master Brief into precise, testable product requirements for a hackathon-grade prototype. It does not redefine the product, broaden it into a generic smart-city platform, or remove the Solar-EV Charging Hub site-selection core. Where the Master Brief and older reference documents disagree, this PRD follows the Master Brief exclusively. This document contains no implementation code and no TRD content.

---

## PRODUCT SUMMARY

UrjaSetu is an AI-assisted Geospatial Intelligence and Decision-Support Platform that helps Indian towns identify, screen, rank, measure, visualize, and explain the best locations for a Solar-EV Charging Hub. It answers one central question — **"Where should we build the next Solar-EV Charging Hub — and why?"** — by combining GIS-based site intelligence, transparent opportunity scoring, climate and land-use risk screening, on-map plot measurement, conceptual 3D visualization, and an explainable AI assistant into a single connected workflow that ends in a saved, decision-ready proposal.

Core story: **FIND → SCREEN → MEASURE → VISUALIZE → EXPLAIN → DECIDE**

---

## TABLE OF CONTENTS

1. Product Overview
2. Problem Definition
3. Target Users
4. Product Goals
5. Non-Goals
6. End-to-End User Journey
7. Functional Requirements
8. Site Intelligence Requirements
9. Opportunity Scoring Requirements
10. Risk & Conflict Requirements
11. 2D Map Requirements
12. Site Planning Requirements
13. Plot Measurement Requirements
14. 3D Planning Requirements
15. AI Planning Assistant Requirements
16. Proposal Requirements
17. UI / Screen Requirements
18. UX Requirements
19. Data Requirements
20. Demo Data Requirements
21. Demo Scenario
22. MVP vs Nice-to-Have vs Out of Scope
23. Non-Functional Product Requirements
24. Acceptance Criteria
25. Product Risks
26. Demo Fallback Strategy
27. Traceability Matrix
28. PRD Completeness Check

---

## 1. PRODUCT OVERVIEW

**Product Name:** UrjaSetu

**Product Purpose:** To give municipal and urban planning teams in Indian towns a single, reusable workflow that turns fragmented spatial and climate data into a ranked, risk-screened, and explainable shortlist of Solar-EV Charging Hub sites — and to carry a selected site all the way through to a decision-ready proposal.

**Product Vision:** A future where any Indian town, regardless of GIS specialist staffing, can make climate-smart infrastructure siting decisions in minutes using transparent evidence and AI-assisted explanation, rather than months of manual, fragmented map comparison.

**Core Problem:** Planning decisions for solar and EV infrastructure are made using fragmented datasets and separate processes; a high-potential location is not automatically a suitable one, since flood risk, land-use conflicts, or insufficient usable space may disqualify it.

**Core User:** Municipal / ULB (Urban Local Body) Officer.

**Core Use Case:** Identify where to build the next Solar-EV Charging Hub in a given town, screen the candidate for climate and land-use risk, measure the usable plot, visualize the concept in 3D, obtain an AI-generated explanation of suitability, and save the result as a proposal.

**Product Positioning:** UrjaSetu — From Geospatial Evidence to Climate-Smart Infrastructure Decisions. It is positioned as an accessible, explainable, reusable decision-support workflow — not an enterprise GIS suite, not a generic chatbot, and not a smart-city platform.

**Value Proposition:** UrjaSetu unifies solar suitability, EV demand proxy, road accessibility, and climate/land-use risk screening into one ranked, explainable shortlist, then carries the chosen site through measurement, 3D concept visualization, and AI-assisted justification into a proposal — collapsing a multi-tool, multi-week process into a single guided session.

**10-Second Pitch:** "UrjaSetu tells any Indian town exactly where to put its next solar-EV charging point — and exactly why — in seconds, not months."

**Core Product Story:** Fragmented spatial data → Site Intelligence → Risk Screening → Ranked Site → Site Selection → Plot Measurement → 3D Conceptual Planning → AI Explanation → Saved Proposal.

---

## 2. PROBLEM DEFINITION

Rapid urban growth in Indian towns is increasing pressure on energy infrastructure, transportation, land use, and climate resilience, while towns simultaneously need to accelerate renewable energy adoption and EV infrastructure expansion.

**Why current planning is difficult:** Decisions about where to install solar infrastructure, where EV charging is most useful, and which locations to avoid due to climate risk are made using fragmented datasets and separate planning processes, without a single workflow that brings the evidence together.

**Fragmented data problem:** Satellite imagery, GIS data, road networks, population/activity information, elevation, and climate data may exist, but they are rarely combined into one decision workflow — leaving planners to manually cross-reference multiple tools and justify choices without a unified evidence trail.

**Solar opportunity:** Towns need to identify where solar-based infrastructure is most viable, using available solar/environmental information, but lack a simple way to compare locations on this basis.

**EV infrastructure need:** Expanding EV charging requires estimating where demand is likely to be highest, using activity-related proxies, since exact demand data is rarely available at this scale.

**Climate / flood risk:** Sites must be screened for flood/drainage risk using elevation, drainage proximity, and rainfall-related proxies before being considered viable, or climate resilience is compromised.

**Land-use conflicts:** Sites may overlap with water bodies, protected/exclusion areas, or incompatible land-use categories, and these conflicts are often discovered late without systematic screening.

**Why high potential does not equal suitability:** A location can have strong solar potential and accessibility while still facing flood/drainage risk, land-use conflicts, or insufficient usable space — the central insight the product is built around.

**Existing solution gap:** Tools such as TERI Rooftop Solar Web-GIS, enterprise GIS platforms (Esri/GMIS/IGiS), academic EV-siting studies (GIS + AHP/TOPSIS), and flood-risk platforms each solve one slice of the problem — solar, or EV, or flood — for one city, or as a specialist/academic solution. No accessible, reusable workflow combines solar suitability + EV demand proxy + road accessibility + flood/drainage screening + land/conflict screening into one ranked, explainable shortlist for smaller towns.

---

## 3. TARGET USERS

### Primary: Municipal / ULB Officers
- **Goals:** Identify and justify a defensible Solar-EV Charging Hub site quickly; avoid recommending a site that later fails due to flood or land-use conflict.
- **Needs:** A single workflow that ranks candidate sites, explains the ranking, screens for risk, and produces a shareable proposal.
- **Pain Points:** No GIS specialist background; fragmented data sources; difficulty justifying decisions to stakeholders; time pressure.
- **What they need from UrjaSetu:** A guided, map-first workflow that requires no GIS expertise, with transparent scores and plain-language AI explanation.
- **Features used:** All modules — Town Selection, 2D Map, Site Intelligence, Risk Screening, Plot Drawing, 3D Planning, AI Assistant, Proposal.

### Secondary: Urban Planners
- **Goals:** Compare and prioritize multiple suitable locations across a town.
- **Needs:** Side-by-side visibility of ranked sites and component scores.
- **Pain Points:** Manually comparing maps and datasets from different sources.
- **What they need from UrjaSetu:** Ranked Candidate Sites view and Site Intelligence detail.
- **Features used:** 2D Map, Site Intelligence, Ranked Sites, Risk & Conflict screens.

### Secondary: Renewable & EV Agencies
- **Goals:** Plan clean-energy and EV charging infrastructure aligned to real demand proxies.
- **Needs:** Confidence that a site is not just solar-favorable but also road-accessible and demand-relevant.
- **Pain Points:** Lack of unified solar + EV + accessibility view.
- **What they need from UrjaSetu:** Opportunity Score breakdown and component metrics.
- **Features used:** Site Intelligence, Opportunity Scoring, Proposal.

### Secondary: Infrastructure Developers
- **Goals:** Identify promising locations for further, more detailed evaluation.
- **Needs:** A defensible starting shortlist rather than a final engineering-grade answer.
- **Pain Points:** Too much unfiltered raw geospatial data with no prioritization.
- **What they need from UrjaSetu:** Ranked Candidate Sites and Saved Proposal export.
- **Features used:** Site Intelligence, Ranked Sites, Saved Proposal Viewing.

**MVP Focus:** The MVP experience is built primarily around the Municipal/ULB Officer workflow; other personas are served by the same screens without dedicated variants.

---

## 4. PRODUCT GOALS

| Goal ID | Goal | Derived From |
|---|---|---|
| PRD-G-01 | **Identify Opportunity** — Surface locations with strong solar suitability, EV demand potential, and road accessibility. | Master Brief Objective 01 |
| PRD-G-02 | **Screen Risk & Conflicts** — Check flood/drainage risk and flag obvious land-use/infrastructure conflicts before recommending a site. | Master Brief Objective 02 |
| PRD-G-03 | **Turn a Site into a Proposal** — Let planners select a site, draw the usable plot, estimate its area, and visualize a Solar-EV Charging Hub in 3D. | Master Brief Objective 03 |
| PRD-G-04 | **Explain & Justify the Decision** — Show why a location is recommended and use AI to assist with proposal evaluation and planning considerations. | Master Brief Objective 04 |

**Key Product Goals (Master Brief Section 7):**
- **Climate-Smart Site Selection** — Rank locations using solar suitability, EV demand, accessibility, and climate risk.
- **From Map to Proposal** — Select a site, measure the plot, and visualize a Solar-EV Charging Hub in 3D.
- **Explainable Planning** — Use AI to explain recommendations and highlight factors to verify.

---

## 5. NON-GOALS

UrjaSetu's MVP explicitly will NOT:

- PRD-NG-01: Provide a full digital twin of the town.
- PRD-NG-02: Provide CAD-grade design tools.
- PRD-NG-03: Provide survey-grade land measurement.
- PRD-NG-04: Provide legal cadastral verification of land.
- PRD-NG-05: Provide exact EV demand forecasting.
- PRD-NG-06: Provide exact solar generation forecasting.
- PRD-NG-07: Provide engineering design or structural planning.
- PRD-NG-08: Certify grid capacity.
- PRD-NG-09: Provide legal/zoning approval or automate regulatory sign-off.
- PRD-NG-10: Guarantee flood safety.
- PRD-NG-11: Guarantee ROI or financial returns.
- PRD-NG-12: Build unnecessary nationwide, production-grade GIS infrastructure.
- PRD-NG-13: Become a generic AI chatbot or a generic smart-city dashboard covering unrelated municipal domains.

These boundaries exist to protect scope and demo reliability; any feature not traceable to the Master Brief is out of scope by default.

---

## 6. END-TO-END USER JOURNEY

**Main Flow:** FIND → SCREEN → MEASURE → VISUALIZE → EXPLAIN → DECIDE

**Detailed Flow:** Opportunity Scoring → Risk/Conflict Screening → Ranked Site → Select Location → Draw Plot → Calculate Area → Choose Infrastructure → 3D Placement → AI Proposal Review → Save Proposal

| Stage | User Action | System Response | Information Displayed | Next Action | Success Condition |
|---|---|---|---|---|---|
| 1. FIND | Select a town (e.g., Kopargaon) and open the map | Loads candidate sites and base map layers | Base map, candidate site markers | Explore / open layers | Map and candidate sites render without error |
| 2. SCREEN | View a candidate site's risk/conflict status | System displays computed risk and conflict status | Flood/drainage risk, conflict status, candidate status label | Open Site Intelligence detail | Risk/conflict status is visible before any recommendation is acted on |
| 3. Ranked Site | Browse the ranked candidate list | System displays sites ordered by Opportunity Score | Opportunity Score, component scores, risk, conflict status per site | Select a site to view/plan | List is sorted and every score is traceable to components |
| 4. Select Location | Click "View Site" then "Plan This Site" | System carries the selected site's coordinates into the planning workspace automatically | Site ID, lat/lon, opportunity score | Enter Site Planning Workspace | No manual coordinate re-entry occurs |
| 5. MEASURE (Draw Plot) | Draw a polygon boundary on the map | System converts the drawing to GeoJSON | Drawn polygon outline | Confirm boundary | Polygon is valid, closed geometry |
| 6. MEASURE (Calculate Area) | System (automatic) computes area from polygon | Turf.js-based area calculation runs | "Estimated Plot Area: X m²" with required disclaimer wording | Choose infrastructure | Area updates whenever the polygon is edited |
| 7. Choose Infrastructure | Select "Solar-EV Charging Hub" (default) | System confirms selection | Infrastructure type options | Enter 3D planner | Selection is stored with the site/plot |
| 8. VISUALIZE (3D Placement) | Open 3D planner; move/rotate/scale the model | CesiumJS renders geographic context at the selected coordinates with the model placed | 3D scene, plot outline, model controls | Review with AI | Model is placed within or near the plot; controls respond |
| 9. EXPLAIN (AI Proposal Review) | Click "Review with AI" | AI receives structured site metrics and returns an explanation | Assessment, reasoning, verification checklist | Save proposal | AI output only references supplied metrics, includes verification checklist |
| 10. DECIDE (Save Proposal) | Click "Save Proposal" | System persists proposal record referencing the same site and plot | Proposal ID, timestamp, full summary | View saved proposal | Proposal is retrievable and matches the session's site/plot/AI output |

---

## 7. FUNCTIONAL REQUIREMENTS

Each module below lists Purpose, User Action, System Behavior, Inputs, Outputs, Validation, Error/Empty States, and Acceptance Criteria. Requirement IDs use the `PRD-FR-###` scheme; priorities use P0 (critical for demo), P1 (important), P2 (nice-to-have).

### A. Town / Area Selection — PRD-FR-001 (P0)
- **Purpose:** Let the user choose the town whose data will populate the workflow.
- **User Action:** Select a town from a list/dropdown (Kopargaon is default and primary).
- **System Behavior:** Loads the town's map extent and associated candidate site dataset.
- **Inputs:** Town identifier.
- **Outputs:** Map centered on town; candidate sites loaded.
- **Validation:** Only pre-configured towns are selectable in MVP.
- **Error/Empty States:** If a town has no dataset, show "No site data available for this town yet" rather than a blank map.
- **Acceptance Criteria:** Selecting Kopargaon loads the map and candidate sites within demo-acceptable load time (see Section 23).

### B. 2D GIS Map — PRD-FR-002 (P0)
- **Purpose:** Serve as the primary spatial interaction surface for the whole workflow.
- **User Action:** Pan, zoom, toggle layers, click markers.
- **System Behavior:** Renders base map, candidate markers, and optional overlays (roads, buildings, land use, risk, solar suitability) per Section 11.
- **Inputs:** Town dataset, layer toggle state.
- **Outputs:** Rendered map with selectable layers.
- **Validation:** Layer toggles only appear for layers with available data.
- **Error/Empty States:** If an overlay fails to load, show "Layer unavailable" for that layer only; the rest of the map remains usable.
- **Acceptance Criteria:** Map remains interactive with at least the Candidate Sites and Opportunity Score layers on by default.

### C. Site Intelligence — PRD-FR-003 (P0)
- **Purpose:** Present the evaluated metrics for a candidate site.
- **User Action:** Click "View Site" on a candidate.
- **System Behavior:** Displays Solar Suitability, EV Demand Proxy, Road Accessibility, Land Suitability, Opportunity Score, Flood/Drainage Risk, Conflict Status.
- **Inputs:** Site ID.
- **Outputs:** Site Intelligence panel/screen.
- **Validation:** All displayed metrics must have a data-source label (measured/derived, proxy, estimated, or simulated/demo).
- **Error/Empty States:** Missing metric shows "Not available" rather than a fabricated value.
- **Acceptance Criteria:** Every metric shown is traceable to a labeled data source (Section 8).

### D. Opportunity Scoring — PRD-FR-004 (P0)
- **Purpose:** Combine component metrics into one explainable ranking score.
- **User Action:** View a site's Opportunity Score and its breakdown.
- **System Behavior:** Computes score deterministically per Section 9 formula and displays component contributions.
- **Inputs:** Solar Suitability, EV Demand Proxy, Road Accessibility, Land Suitability, Risk Penalty, configurable weights.
- **Outputs:** Opportunity Score (0–100) plus component breakdown.
- **Validation:** Score must recompute consistently for identical inputs.
- **Error/Empty States:** If a component is missing, score calculation excludes it and flags "partial score — missing component: X."
- **Acceptance Criteria:** Component values sum/relate to the final score in a way visible and explainable in the UI.

### E. Ranked Candidate Sites — PRD-FR-005 (P0)
- **Purpose:** Present all candidate sites ordered by Opportunity Score.
- **User Action:** Browse the list/map together.
- **System Behavior:** Sorts sites descending by Opportunity Score; shows risk/conflict badges inline.
- **Inputs:** All candidate site records for the selected town.
- **Outputs:** Ranked list with per-site summary card (score, components, risk, conflict, CTAs).
- **Validation:** List always reflects current computed scores; no manual reordering.
- **Error/Empty States:** If fewer than 2 sites exist, show whatever is available rather than blocking.
- **Acceptance Criteria:** At least one site is clearly top-ranked and at least one is clearly lower-ranked/flagged, per the demo dataset (Section 20).

### F. Risk & Conflict Screening — PRD-FR-006 (P0)
- **Purpose:** Prevent high opportunity from being treated as automatic suitability.
- **User Action:** View a site's risk/conflict status.
- **System Behavior:** Computes/display Flood/Drainage Risk and Conflict Status; assigns candidate status (Recommended, Review Required, Risk Flagged, Rejected).
- **Inputs:** Elevation/drainage/rainfall proxies, land-use/infrastructure conflict data.
- **Outputs:** Risk level, conflict status, overall candidate status label.
- **Validation:** A site with high opportunity score but a detected risk/conflict must not display as "Recommended."
- **Error/Empty States:** If risk data is unavailable for a site, label it "Risk data unavailable" rather than defaulting to "Low."
- **Acceptance Criteria:** At least one candidate in the demo dataset is Risk Flagged or Rejected despite a non-trivial opportunity score.

### G. Site Selection — PRD-FR-007 (P0)
- **Purpose:** Move a chosen site's coordinates into the planning workspace without manual re-entry.
- **User Action:** Click "Plan This Site."
- **System Behavior:** Passes site ID, latitude, longitude, and opportunity score automatically into the Site Planning Workspace.
- **Inputs:** Selected site record.
- **Outputs:** Pre-populated planning workspace context.
- **Validation:** Coordinates in the workspace must exactly match the selected site's coordinates.
- **Error/Empty States:** If coordinate transfer fails, block progression and show "Unable to load site for planning — please retry."
- **Acceptance Criteria:** Zero manual coordinate entry required at any point in the transition (Rule 7 / Master Brief).

### H. Plot Drawing — PRD-FR-008 (P0)
- **Purpose:** Let the user define the usable plot boundary at the selected site.
- **User Action:** Draw and edit a polygon on the map.
- **System Behavior:** Captures polygon as GeoJSON; allows edit/redraw.
- **Inputs:** User-drawn vertices.
- **Outputs:** GeoJSON polygon geometry.
- **Validation:** Polygon must be closed and non-self-intersecting.
- **Error/Empty States:** Invalid polygon shows "Please draw a valid closed boundary."
- **Acceptance Criteria:** User can draw, edit, and redraw the polygon before proceeding.

### I. Plot Area Calculation — PRD-FR-009 (P0)
- **Purpose:** Convert the drawn polygon into an area estimate.
- **User Action:** None beyond drawing/editing (automatic).
- **System Behavior:** Calculates area via Turf.js `turf.area()`; updates on every edit.
- **Inputs:** GeoJSON polygon.
- **Outputs:** Area in m² (optionally acres), displayed with required wording: "Estimated available plot area based on the drawn boundary."
- **Validation:** Must never be labeled cadastral, legal, authoritative, or survey-grade.
- **Error/Empty States:** No polygon drawn yet → "Draw a boundary to see the estimated area."
- **Acceptance Criteria:** Editing the polygon updates the displayed area without a page reload.

### J. Infrastructure Selection — PRD-FR-010 (P0)
- **Purpose:** Let the user confirm the infrastructure type to be modeled.
- **User Action:** Select "Solar-EV Charging Hub" (default/primary) or another demo option if available.
- **System Behavior:** Stores the selection for the 3D and proposal stages.
- **Inputs:** User selection.
- **Outputs:** Chosen infrastructure type.
- **Validation:** Solar-EV Charging Hub must remain the default and dominant option.
- **Error/Empty States:** None (default pre-selected).
- **Acceptance Criteria:** Selection persists through to 3D and proposal without re-entry.

### K. 3D Site Planning — PRD-FR-011 (P0)
- **Purpose:** Provide geographic 3D context for the selected site.
- **User Action:** Open "Plan in 3D."
- **System Behavior:** Loads CesiumJS scene centered at the site's coordinates, with the drawn plot represented.
- **Inputs:** Site coordinates, plot geometry.
- **Outputs:** Rendered 3D scene.
- **Validation:** Coordinates must match the 2D-selected site exactly.
- **Error/Empty States:** If 3D fails to load, fall back per Section 26 and still allow proposal completion.
- **Acceptance Criteria:** 3D scene opens centered on the correct location without manual coordinate entry.

### L. 3D Model Placement — PRD-FR-012 (P0)
- **Purpose:** Let the user place and adjust a conceptual infrastructure model.
- **User Action:** Move, rotate, scale, delete (optionally duplicate) the GLB model.
- **System Behavior:** Updates model transform in the scene and stores placement data.
- **Inputs:** GLB model asset, user manipulation input.
- **Outputs:** Model placement data (position, rotation, scale).
- **Validation:** Model interactions must not be presented as CAD or engineering design.
- **Error/Empty States:** If the model fails to load, show a placeholder marker and note "3D model unavailable — conceptual placement only."
- **Acceptance Criteria:** At least move, rotate, scale, and delete work reliably in the demo scene.

### M. AI Planning Assistant — PRD-FR-013 (P0)
- **Purpose:** Explain the site's suitability using only supplied structured metrics.
- **User Action:** Click "Review with AI."
- **System Behavior:** Sends structured site metrics to the AI; receives assessment, reasoning, and verification checklist.
- **Inputs:** Opportunity score, component scores, risk/conflict status, estimated plot area, infrastructure type.
- **Outputs:** Assessment text, reasoning bullets, verification checklist.
- **Validation:** AI must not introduce coordinates, ownership, zoning, grid capacity, exact demand/generation figures, or approvals not present in the input.
- **Error/Empty States:** If AI call fails, show a template-based fallback explanation built directly from the metrics (Section 26).
- **Acceptance Criteria:** AI output uses only advisory language (e.g., "Based on the available proxy data…") and includes a non-empty verification checklist.

### N. AI Proposal Review — PRD-FR-014 (P0)
- **Purpose:** Let the user review the AI's assessment before saving.
- **User Action:** Read assessment, reasoning, and verification checklist; proceed to save.
- **System Behavior:** Displays the AI output alongside the site/plot/3D summary.
- **Inputs:** AI response, site/plot/3D context.
- **Outputs:** Combined review screen.
- **Validation:** Review screen must show the same site/plot data used in prior steps (no drift).
- **Error/Empty States:** If AI output is unavailable, show the fallback text plus a note that AI explanation could not be generated live.
- **Acceptance Criteria:** User can proceed to Save Proposal directly from this screen.

### O. Proposal Creation — PRD-FR-015 (P0)
- **Purpose:** Assemble all workflow data into a single proposal record.
- **User Action:** Click "Save Proposal."
- **System Behavior:** Compiles site info, scores, risk/conflict, plot geometry/area, infrastructure, 3D placement, AI assessment, verification checklist, and timestamp/ID.
- **Inputs:** All prior-stage data for the current session.
- **Outputs:** Proposal object.
- **Validation:** Proposal must reference the same site and plot the user actually selected/drew.
- **Error/Empty States:** If any required field is missing, block save and indicate which stage needs completion.
- **Acceptance Criteria:** A successfully saved proposal contains every field listed in Section 16.

### P. Proposal Saving — PRD-FR-016 (P0)
- **Purpose:** Persist the proposal so it can be retrieved later.
- **User Action:** Confirm save.
- **System Behavior:** Writes the proposal record to storage and returns a Proposal ID.
- **Inputs:** Proposal object.
- **Outputs:** Persisted record, Proposal ID, timestamp.
- **Validation:** Proposal ID must be unique.
- **Error/Empty States:** Save failure shows "Could not save proposal — please retry" without losing the user's in-progress data.
- **Acceptance Criteria:** Saved proposal is retrievable in the Saved Proposal Viewing screen immediately after save.

### Q. Saved Proposal Viewing — PRD-FR-017 (P1)
- **Purpose:** Let the user revisit a saved proposal.
- **User Action:** Open the Proposals list and select a proposal.
- **System Behavior:** Displays the full saved proposal summary.
- **Inputs:** Proposal ID.
- **Outputs:** Read-only proposal detail view.
- **Validation:** Displayed data must match what was saved (no recomputation drift).
- **Error/Empty States:** No proposals yet → "No proposals saved yet — plan a site to create one."
- **Acceptance Criteria:** Proposal detail matches the data saved at creation time.

---

## 8. SITE INTELLIGENCE REQUIREMENTS

For each candidate site, the following must be displayed, each tagged with a data-source label:

| Metric | Definition | Data-Source Label |
|---|---|---|
| Solar Suitability | Relative suitability for solar infrastructure based on available solar/environmental information | Proxy / Estimated |
| EV Demand Proxy | Estimated potential charging demand using activity-related proxies | Proxy |
| Road Accessibility | Relative accessibility from nearby roads | Derived (from OSM road network) |
| Land Suitability | Suitability of land based on available land-use information | Derived / Proxy where data is incomplete |
| Opportunity Score | Overall decision-support indicator combining the above and a risk penalty | Derived (computed) |
| Flood/Drainage Risk | Risk level from elevation, drainage proximity, and rainfall-related proxies | Proxy / Estimated |
| Conflict Status | Presence of land-use or infrastructure conflicts | Derived (rule-based) or Simulated/Demo where source data is unavailable |

**Requirement PRD-SI-001 (P0):** Every metric on every screen must show, on hover or inline, whether it is measured/derived, proxy, estimated, or simulated/demo data — no metric may be presented as authoritative without a real data source.

**Requirement PRD-SI-002 (P0):** The Opportunity Score must never be displayed without its component breakdown available within one click.

---

## 9. OPPORTUNITY SCORING REQUIREMENTS

**Formula (deterministic, explainable):**

```
Opportunity Score =
    Solar Suitability × W1
  + EV Demand Proxy × W2
  + Road Accessibility × W3
  + Land Suitability × W4
  - Risk Penalty × W5
```

- **PRD-OS-001 (P0):** Weights (W1–W5) must be configurable, not hard-coded as immutable constants, even if the MVP ships with fixed defaults.
- **PRD-OS-002 (P0):** Score range is 0–100.
- **PRD-OS-003 (P0):** Ranking behavior: candidate list sorts strictly by descending Opportunity Score.
- **PRD-OS-004 (P0):** Risk Penalty must be capable of reducing an otherwise high score, and the UI must show the penalty amount separately from the positive components.
- **PRD-OS-005 (P0):** Explainability: the UI must expose each component value (Solar Suitability, EV Demand Proxy, Road Accessibility, Land Suitability, Risk Penalty) alongside the final score, per the Master Brief example (91 / 82 / 88 / 80 / −8 → 84).
- **PRD-OS-006 (P1):** The scoring model must remain a simple deterministic model for the MVP; an opaque ML model must not replace it unless a real trained model with validated data is available — this is a hard constraint from the Master Brief, not an implementation suggestion.

---

## 10. RISK & CONFLICT REQUIREMENTS

**PRD-RC-001 (P0) Flood/Drainage Screening:** Use elevation, drainage proximity, and rainfall-related proxies to assign a Flood/Drainage Risk level (e.g., Low/Medium/High).

**PRD-RC-002 (P0) Land-Use Conflict Screening:** Flag obvious conflicts such as overlap with water bodies, protected/exclusion areas, or incompatible land-use categories where data exists.

**PRD-RC-003 (P0) Infrastructure Conflict Screening:** Flag obvious conflicts with major infrastructure, existing structures, road geometry, or other represented restricted areas.

**PRD-RC-004 (P0) Candidate Status:** Every site must resolve to exactly one of: **Recommended**, **Review Required**, **Risk Flagged**, **Rejected**.

**PRD-RC-005 (P0) Risk Overrides Opportunity:** A high Opportunity Score must never, by itself, produce a "Recommended" status if flood risk is High or a conflict is detected — risk/conflict screening logic takes precedence over raw score in determining the displayed candidate status. This is the product's central "potential ≠ suitability" rule and must be demonstrably enforced.

---

## 11. 2D MAP REQUIREMENTS

- **PRD-MAP-001 (P0) Base Map:** Standard web base map (Leaflet or MapLibre per Master Brief) covering the selected town.
- **PRD-MAP-002 (P0) Candidate Markers:** All candidate sites shown as distinct, clickable markers.
- **PRD-MAP-003 (P0) Opportunity Visualization:** Visual encoding (e.g., color/size) reflecting Opportunity Score.
- **PRD-MAP-004 (P0) Risk Overlays:** Toggleable Flood/Drainage Risk overlay.
- **PRD-MAP-005 (P1) Conflict Overlays:** Toggleable conflict/exclusion overlay.
- **PRD-MAP-006 (P1) Roads:** Toggleable road network layer (OSM-derived).
- **PRD-MAP-007 (P2) Buildings:** Toggleable building footprint layer where data exists.
- **PRD-MAP-008 (P2) Land Use:** Toggleable land-use layer where data exists.
- **PRD-MAP-009 (P0) Layer Controls:** A visible, simple layer toggle panel; default-on layers are Candidate Sites and Opportunity Score, per the Master Brief example layer list.
- **PRD-MAP-010 (P0) Site Selection:** Clicking a candidate marker opens its Site Intelligence detail.
- **PRD-MAP-011 (P0) Plot Drawing:** The same map surface (or a linked planning view) supports polygon drawing for the selected site.

No map layer beyond those listed in the Master Brief may be added to the MVP unless explicitly marked optional/nice-to-have.

---

## 12. SITE PLANNING REQUIREMENTS

**Workflow (fixed order):** Recommended Site → Plan This Site → Draw Plot → Calculate Estimated Plot Area → Choose Solar-EV Charging Hub → Plan in 3D

- **PRD-SP-001 (P0):** Selected coordinates must flow automatically from the ranked site list into the planning workspace and then into the 3D planner — no manual coordinate re-entry anywhere in this chain (Master Brief Rule 7).
- **PRD-SP-002 (P0):** Each step's output becomes the next step's input (site → plot → infrastructure choice → 3D → AI → proposal) with no data re-entry.
- **PRD-SP-003 (P0):** The user must be able to identify, at every step, which site is currently being planned (persistent site ID/label in the UI).

---

## 13. PLOT MEASUREMENT REQUIREMENTS

- **PRD-PM-001 (P0) Polygon Drawing:** User can draw a polygon boundary directly on the map at the selected site.
- **PRD-PM-002 (P0) Polygon Editing:** User can move vertices, add/remove points, and redraw.
- **PRD-PM-003 (P0) GeoJSON Representation:** The drawn boundary is stored/transmitted as a GeoJSON polygon.
- **PRD-PM-004 (P0) Area Calculation:** Area is computed via Turf.js `turf.area()` (or equivalent) in m².
- **PRD-PM-005 (P0) Area Display:** Displayed with the exact required wording: **"Estimated available plot area based on the drawn boundary."**
- **PRD-PM-006 (P0) Area Update on Edit:** Displayed area recalculates immediately whenever the polygon is edited.
- **PRD-PM-007 (P1) Optional Unit Conversion:** May additionally show an acres conversion, but only if implemented and verified correct — never shown as a guess.
- **PRD-PM-008 (P0) Terminology Constraint:** The measurement must never be described as cadastral, legal, authoritative, or survey-grade anywhere in the UI or generated proposal text.

---

## 14. 3D PLANNING REQUIREMENTS

- **PRD-3D-001 (P0) Technology:** CesiumJS-based 3D geographic context.
- **PRD-3D-002 (P0) Coordinate Continuity:** The 3D scene must center on the same latitude/longitude selected in 2D — no re-entry.
- **PRD-3D-003 (P0) Plot Representation:** The drawn plot boundary is represented in the 3D scene (e.g., as an outline/footprint).
- **PRD-3D-004 (P0) Solar-EV Charging Hub Model:** A lightweight `.glb` model represents the chosen infrastructure.
- **PRD-3D-005 (P0) Model Manipulation:** Support Move, Rotate, Scale, Delete.
- **PRD-3D-006 (P1) Optional Duplicate:** Support duplicating the placed model.
- **PRD-3D-007 (P0) Conceptual Framing:** All 3D UI copy and AI-generated text must describe this as conceptual site planning — never CAD, construction design, engineering approval, or survey-grade planning.
- **PRD-3D-008 (P2) Asset Scope:** One or two strong, relevant `.glb` models are sufficient; no large 3D asset library is required or desired for MVP.

---

## 15. AI PLANNING ASSISTANT REQUIREMENTS

**Responsibility split:** GIS provides spatial truth/evidence. AI explains and assists with planning decisions. The AI is never the source of geographic fact.

- **PRD-AI-001 (P0) Input Data:** The AI receives only structured metrics already computed by the system: site ID, opportunity score, component scores (solar suitability, EV demand proxy, road accessibility), flood risk, conflict status, estimated plot area, and infrastructure type.
- **PRD-AI-002 (P0) AI Responsibilities:** Explain why the supplied metrics indicate suitability or non-suitability; surface strengths; surface a verification checklist; remain advisory.
- **PRD-AI-003 (P0) AI Output:** A structured response containing (a) an assessment label (e.g., "Suitable for further planning"), (b) reasoning bullets referencing only supplied metrics, and (c) a verification checklist (e.g., grid capacity, land ownership, zoning, drainage, engineering feasibility).
- **PRD-AI-004 (P0) Explanation Format:** Plain-language, non-technical prose plus a bulleted checklist — no dense jargon.
- **PRD-AI-005 (P0) Verification Checklist:** Must always be present and non-empty in any successful AI response.
- **PRD-AI-006 (P0) Failure Behavior:** If the AI call fails or times out, the system falls back to a deterministic, template-generated explanation built directly from the structured metrics (see Section 26), so the demo flow is never blocked.
- **PRD-AI-007 (P0) Hallucination Prevention:** The AI must not introduce coordinates, land ownership, zoning, grid capacity, exact EV demand or solar generation numbers, or claims of engineering/legal approval that were not part of the input.
- **PRD-AI-008 (P0) Unsupported-Claim Prevention:** The AI must not present estimated/proxy/simulated data as if it were an authoritative measurement.
- **PRD-AI-009 (P0) Required Language Patterns:** Output must favor advisory phrasing such as "Based on the available proxy data…", "The current screening indicates…", "Suitable for further evaluation…", and explicit verification prompts (e.g., "Verify grid capacity and land ownership before implementation.").
- **PRD-AI-010 (P0) Forbidden Terms:** The AI (and the product UI generally) must avoid vague/unsupported terms such as "AI score," "smart score," "future predictor," "digital twin," "autonomous planner," or "guaranteed suitability."

---

## 16. PROPOSAL REQUIREMENTS

A saved, decision-ready proposal must include:

- **PRD-PR-001 (P0)** Site information: Site ID, location (lat/lon), Opportunity Score, component scores.
- **PRD-PR-002 (P0)** Risk information: Flood/drainage status, conflict status, any warnings.
- **PRD-PR-003 (P0)** Plot geometry: the drawn GeoJSON polygon.
- **PRD-PR-004 (P0)** Estimated area: value plus the required disclaimer wording.
- **PRD-PR-005 (P0)** Infrastructure type: e.g., Solar-EV Charging Hub.
- **PRD-PR-006 (P0)** 3D placement information: model position/rotation/scale data.
- **PRD-PR-007 (P0)** AI assessment: assessment label, reasoning, verification checklist.
- **PRD-PR-008 (P0)** Verification checklist: shown distinctly even if duplicated from the AI response.
- **PRD-PR-009 (P0)** Timestamp and unique Proposal ID.
- **PRD-PR-010 (P0)** Site/Plot Consistency Rule: the proposal must reference the exact same site and exact same drawn plot the user selected and measured in this session — no substitution or recomputation with different geometry.

---

## 17. UI / SCREEN REQUIREMENTS

### Screen 1 — Landing / Overview
- **Purpose:** Introduce UrjaSetu and start the workflow.
- **Layout:** Hero introduction, selected town indicator, workflow summary (FIND→…→DECIDE), primary CTA.
- **Main Components:** Product intro, workflow diagram, town selector.
- **Information Shown:** Product name, one-line description, workflow stages.
- **Primary CTA:** "Explore Sites."
- **Secondary Actions:** Change town.
- **Navigation:** Leads to Planning Dashboard.
- **Empty State:** No town selected yet → prompt to choose one.
- **Loading State:** Skeleton for town data.
- **Error State:** "Could not load towns — please retry."

### Screen 2 — Planning Dashboard
- **Purpose:** Central hub combining map, layers, and ranked candidates.
- **Layout:** Top navigation (Overview / Site Intelligence / Risk & Conflicts / Plan Site / Proposals), town selector, map, layer controls, legend, candidate list/score cards.
- **Main Components:** Map, layer toggle panel, ranked site cards.
- **Information Shown:** Candidate sites with Opportunity Score, risk badge.
- **Primary CTA:** "View Site."
- **Secondary Actions:** Toggle layers, change town.
- **Navigation:** To Site Intelligence, Risk & Conflict, Proposals.
- **Empty State:** "No candidate sites for this town yet."
- **Loading State:** Map/data skeleton.
- **Error State:** "Map data failed to load — showing cached results" (if fallback exists) or explicit failure message.

### Screen 3 — Site Intelligence
- **Purpose:** Show detailed metrics for one candidate site.
- **Layout:** Map inset + metric panel (Opportunity Score, Solar Suitability, EV Demand Proxy, Road Accessibility).
- **Main Components:** Score breakdown, data-source labels.
- **Information Shown:** All Section 8 metrics.
- **Primary CTA:** "View Site" (entry) leading onward to Risk & Conflict / Plan This Site.
- **Secondary Actions:** Back to Ranked List.
- **Navigation:** To Risk & Conflict screen.
- **Empty State:** Missing metric shown as "Not available."
- **Loading/Error States:** Standard skeleton / retry message.

### Screen 4 — Risk & Conflict
- **Purpose:** Show flood/drainage and conflict screening for the site.
- **Layout:** Overlay map + status panel.
- **Main Components:** Flood/drainage overlay, land-use conflict indicators, infrastructure conflicts, candidate status badge.
- **Information Shown:** Risk level, conflict status, overall candidate status.
- **Primary CTA:** "Plan This Site."
- **Secondary Actions:** Back to Site Intelligence.
- **Navigation:** To Site Planning Workspace.
- **Empty/Error States:** "Risk data unavailable for this site."

### Screen 5 — Site Planning Workspace
- **Purpose:** Draw the plot and select infrastructure.
- **Layout:** Map with drawing tools + side panel (site metrics, area readout, infrastructure options).
- **Main Components:** Selected location marker, draw-polygon tool, estimated plot area, infrastructure radio selection.
- **Information Shown:** Site metrics carried over, live area calculation.
- **Primary CTA:** "Plan in 3D."
- **Secondary Actions:** Redraw/edit polygon, change infrastructure choice.
- **Navigation:** To 3D Site Planner.
- **Empty State:** "Draw a boundary to see the estimated area."
- **Error State:** "Please draw a valid closed boundary."

### Screen 6 — 3D Site Planner
- **Purpose:** Visualize the conceptual Solar-EV Hub at the site.
- **Layout:** Full 3D viewport + control panel (move/rotate/scale/delete) + proposal summary sidebar.
- **Main Components:** CesiumJS scene, GLB model, plot outline, transform controls.
- **Information Shown:** Site + plot summary, 3D scene.
- **Primary CTA:** "Review with AI."
- **Secondary Actions:** Adjust model, duplicate (optional), delete.
- **Navigation:** To AI Proposal Review.
- **Empty/Error State:** "3D model unavailable — conceptual placement only" fallback marker.

### Screen 7 — AI Proposal Review
- **Purpose:** Present the AI's explanation before saving.
- **Layout:** Summary panel + AI assessment panel (reasoning, verification checklist).
- **Main Components:** Assessment label, reasoning bullets, verification checklist.
- **Information Shown:** Full compiled proposal preview.
- **Primary CTA:** "Save Proposal."
- **Secondary Actions:** Back to 3D planner to adjust.
- **Navigation:** To Saved Proposal.
- **Empty/Error State:** Fallback template explanation with a note that live AI explanation failed.

### Screen 8 — Saved Proposal
- **Purpose:** Show the final decision-ready record.
- **Layout:** Full proposal summary (site, scores, risk, plot, infrastructure, 3D preview if implemented, AI review).
- **Main Components:** Proposal ID/timestamp, all Section 16 fields.
- **Information Shown:** Complete proposal.
- **Primary CTA:** None mandatory (view-only); optional Export/Print if implemented.
- **Secondary Actions:** Return to Planning Dashboard, view other proposals.
- **Navigation:** To Proposals list.
- **Empty/Error State:** "No proposals saved yet — plan a site to create one."

No CSS or implementation code is specified here; these are structural/content requirements only.

---

## 18. UX REQUIREMENTS

- **PRD-UX-001 (P0):** Clear information hierarchy — Opportunity Score and candidate status must always be the most visually prominent elements on any site-related screen.
- **PRD-UX-002 (P0):** Minimal cognitive load — no more than one primary CTA visible per screen.
- **PRD-UX-003 (P0):** Map-first workflow — the map (2D or 3D) must remain visually dominant, not secondary to text panels.
- **PRD-UX-004 (P0):** Consistent CTAs — use the exact Master Brief CTA copy (Explore Sites, View Site, Plan This Site, Plan in 3D, Review with AI, Save Proposal) verbatim across the product.
- **PRD-UX-005 (P0):** Explainable scores — every score must be one click away from its component breakdown.
- **PRD-UX-006 (P0):** Clear risk indicators — risk/conflict status must use unambiguous, non-color-only indicators (icon + label), since color alone should not carry meaning.
- **PRD-UX-007 (P0):** No misleading certainty — proxy, estimated, or simulated values must never be visually styled identically to verified/authoritative data.
- **PRD-UX-008 (P0):** Smooth transitions — the 2D → 3D → AI → Proposal handoff must feel like one continuous workflow, not four disconnected tools.
- **PRD-UX-009 (P1):** Visual tone should read as a professional municipal planning tool (per Master Brief design language: dark premium background, one accent color, clean GIS overlays) rather than a generic AI dashboard or chatbot-first design.

---

## 19. DATA REQUIREMENTS

| Data Category | Product-Level Requirement | Real vs Demo |
|---|---|---|
| Candidate sites | ID, name, coordinates, all Site Intelligence metrics, risk/conflict status, opportunity score | Real where available (e.g., OSM-derived); otherwise clearly labeled demo/simulated |
| Site metrics | Solar suitability, EV demand proxy, road accessibility, land suitability | Proxy/estimated, clearly labeled |
| Risk information | Flood/drainage risk level and basis | Proxy/estimated (elevation, drainage, rainfall proxies) |
| Conflict information | Land-use and infrastructure conflict flags | Derived from available OSM/land-use data or simulated/demo where unavailable |
| Plot geometry | User-drawn GeoJSON polygon and computed area | Real (user-generated), but area is an estimate, not survey-grade |
| Infrastructure selection | Selected infrastructure type | Real (user choice) |
| 3D placement | Model position, rotation, scale | Real (user-generated), conceptual only |
| AI review | Structured input metrics and AI output text | Real system-computed inputs; AI output generated live or via fallback template |
| Saved proposals | Full compiled record per Section 16 | Real (system-generated and persisted) |

**PRD-DATA-001 (P0):** Every data field surfaced in the UI or in an AI prompt must be traceable to one of: real/open data, derived/computed data, proxy data, estimated data, or simulated/demo data — and must be labeled accordingly wherever ambiguity is possible.

**PRD-DATA-002 (P0):** Simulated values must never be presented as official municipal data (Master Brief Data Honesty Rule).

---

## 20. DEMO DATA REQUIREMENTS

The minimum demo dataset for Kopargaon must include:

- **PRD-DEMO-001 (P0):** At least 4–6 candidate sites.
- **PRD-DEMO-002 (P0):** Sites with materially different Opportunity Scores (not all clustered near the same value).
- **PRD-DEMO-003 (P0):** Sites with different Solar Suitability values.
- **PRD-DEMO-004 (P0):** Sites with different EV Demand Proxy values.
- **PRD-DEMO-005 (P0):** Sites with different Road Accessibility values.
- **PRD-DEMO-006 (P0):** Sites with different risk levels (not all "Low").
- **PRD-DEMO-007 (P0):** At least one Risk Flagged or Rejected site (to prove the system does not recommend every location).
- **PRD-DEMO-008 (P0):** At least one clearly Recommended site with a strong Opportunity Score (e.g., the 84/100 example site used in the demo script).

This dataset is what makes the "potential ≠ suitability" story demonstrable rather than asserted.

---

## 21. DEMO SCENARIO

The ideal hackathon demo sequence:

1. Open UrjaSetu.
2. Select Kopargaon.
3. View the map.
4. Show map layers (candidate sites, opportunity score, and at least one risk overlay).
5. Show the ranked sites list.
6. Open Site #1 (Site Intelligence).
7. Show the 84/100 example Opportunity Score and its component breakdown.
8. Click "Plan This Site."
9. Draw the plot boundary.
10. Show the ~2,450 m² estimated area with required disclaimer wording.
11. Select "Solar-EV Charging Hub."
12. Open the 3D planner.
13. Place/adjust the hub model.
14. Click "Review with AI" and show the AI's explanation and verification checklist.
15. Click "Save Proposal."

**Closing demo message:** "We don't just show the location. We turn the location into a decision-ready proposal."

**PRD-DEMO-SCEN-001 (P0):** This exact sequence must be executable end-to-end without any manual data re-entry, broken transitions, or console-visible errors.

---

## 22. MVP vs NICE-TO-HAVE vs OUT OF SCOPE

### MUST HAVE (P0)
- Kopargaon demo area, 2D map, candidate locations
- Solar score, EV demand proxy, road accessibility, opportunity score, ranked sites
- Flood/drainage indicator, conflict indicator, candidate status
- Site selection with automatic coordinate transfer
- Plot drawing and estimated area calculation
- 3D planner (CesiumJS) with conceptual Solar-EV Hub model and basic manipulation
- AI explanation of supplied site metrics with verification checklist
- Save and display proposal summary

### NICE TO HAVE (P1/P2)
- Multiple infrastructure model options
- Higher-fidelity 3D models
- Proposal PDF/export
- Advanced map layers (buildings, land use in full detail)
- Search functionality
- Side-by-side site comparison
- Proposal history/list management beyond basic viewing
- Additional towns beyond Kopargaon
- More detailed/granular risk layers
- 3D model placement presets

### OUT OF SCOPE (Explicitly Excluded)
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

## 23. NON-FUNCTIONAL PRODUCT REQUIREMENTS

- **PRD-NFR-001 (P0) Performance:** Core screens (map, ranked list, site detail) must load and become interactive within a demo-acceptable time (target: a few seconds on a standard connection); no operation in the FIND→DECIDE flow should visibly stall without a loading indicator.
- **PRD-NFR-002 (P0) Reliability:** The end-to-end demo flow (Section 21) must be repeatable without manual data resets between runs.
- **PRD-NFR-003 (P0) Usability:** A first-time user unfamiliar with GIS tools must be able to complete the FIND→DECIDE flow using only on-screen CTAs.
- **PRD-NFR-004 (P1) Responsiveness:** The interface should be usable on a standard laptop/desktop screen; the Master Brief specifies a desktop-first planning interface, so mobile optimization is not required for MVP.
- **PRD-NFR-005 (P0) Data Consistency:** Data shown in Site Intelligence, Risk & Conflict, Site Planning, 3D, AI Review, and Saved Proposal for a given site/session must always match — no silent recomputation with different values mid-flow.
- **PRD-NFR-006 (P0) Error Handling:** Every module must have a defined empty/error state (see Section 7) so no screen ever shows a blank or broken view without explanation.
- **PRD-NFR-007 (P0) Security:** Any AI API key or third-party credential must never be exposed in client-side code or logs.
- **PRD-NFR-008 (P1) Maintainability:** Core scoring, risk evaluation, and proposal logic should be centralized (not duplicated across frontend/backend) to keep the prototype coherent under time pressure.
- **PRD-NFR-009 (P0) Demo-Reliability Priority:** Where a tradeoff exists between adding a feature and ensuring the core flow works flawlessly, reliability of the FIND→DECIDE flow takes precedence (Master Brief Rule 10).

---

## 24. ACCEPTANCE CRITERIA

**Top-Level Acceptance Criterion (Critical):**
> A user must be able to complete FIND → SCREEN → MEASURE → VISUALIZE → EXPLAIN → DECIDE for at least one Kopargaon candidate site without manually moving data between modules (no re-typed coordinates, no re-selected site identity, no re-entered infrastructure choice).

**Module-Level Acceptance Criteria:**
- **AC-01:** Selecting Kopargaon loads a non-empty, ranked candidate site list.
- **AC-02:** At least one site displays "Recommended" and at least one displays "Risk Flagged" or "Rejected," proving risk overrides raw opportunity where applicable.
- **AC-03:** Opening a site's Site Intelligence view shows all component metrics with data-source labels.
- **AC-04:** Clicking "Plan This Site" carries the exact selected coordinates into the planning workspace with zero manual re-entry.
- **AC-05:** Drawing a polygon produces a live-updating "Estimated available plot area based on the drawn boundary" value.
- **AC-06:** Opening the 3D planner centers the scene on the same coordinates as the 2D selection, with the plot represented.
- **AC-07:** The GLB model can be moved, rotated, scaled, and deleted in the 3D scene.
- **AC-08:** "Review with AI" returns an assessment, reasoning, and a non-empty verification checklist referencing only supplied metrics.
- **AC-09:** If the AI call fails, a fallback template explanation is shown instead of blocking the flow.
- **AC-10:** "Save Proposal" produces a retrievable proposal containing every field in Section 16, referencing the same site and plot used in the session.
- **AC-11:** No screen in the flow displays a blank/broken state without an explanatory empty/error message.

---

## 25. PRODUCT RISKS

| Risk | Impact | Mitigation | Fallback |
|---|---|---|---|
| External geospatial API failure (OSM/DEM/etc.) | Map or metrics fail to load | Cache/pre-fetch demo-town data ahead of time | Use pre-baked static dataset for Kopargaon |
| AI API failure or latency | AI Proposal Review blocked | Set reasonable timeout; retry once | Deterministic template-based explanation generated from structured metrics |
| Incomplete geospatial data for some metrics | Missing/inaccurate site metrics | Clearly label proxy/estimated/simulated values | Show "Not available" instead of fabricating values |
| Incorrect demo assumptions (e.g., unrealistic scores) | Demo credibility undermined | Validate demo dataset spread before presentation (Section 20) | Adjust demo dataset values pre-event |
| 3D performance issues (large scenes, slow devices) | 3D planner lags or fails to load | Keep model count/poly-count low; test on demo hardware ahead of time | Show 2D plot summary with a static 3D preview image if live rendering fails |
| Large datasets slowing the map | Slow pan/zoom, degraded UX | Limit demo dataset size to what's needed (Section 20) | Reduce candidate site count for the live demo |
| Scope creep (adding unrelated features) | Missed deadline, diluted core story | Enforce Non-Goals (Section 5) and MVP scope (Section 22) strictly | Defer to Nice-to-Have backlog |
| AI hallucination (inventing facts) | Loss of trust, incorrect guidance | Enforce guardrails (Section 15) at prompt and validation level | Fallback template explanation with only supplied metrics |
| Misinterpretation of proxy data as fact | Misleading decisions | Consistent data-source labeling across all screens (Section 8, 19) | Add persistent "Proxy/Estimated" badges wherever relevant |
| Backend/API downtime during demo | Entire flow blocked | Run a local/offline-capable demo build if possible | Pre-recorded fallback screen capture as last resort |

---

## 26. DEMO FALLBACK STRATEGY

- **If live geospatial data fails:** Switch to a pre-baked static Kopargaon dataset that mirrors the live data structure exactly, so no screen changes are needed.
- **If the AI API fails:** Use a deterministic, template-generated explanation built directly from the structured site metrics already computed by the system (same guardrails as Section 15 apply to the template).
- **If a 3D asset fails to load:** Show a placeholder marker/footprint in the 3D scene with a note "3D model unavailable — conceptual placement only," and still allow the user to proceed to AI Review and Save Proposal.
- **If the backend fails entirely:** Fall back to a local/offline demo build using cached/static data for the full FIND→DECIDE flow.
- **If a specific map layer fails:** Disable only that layer with a "Layer unavailable" note; all other layers and the core flow remain functional.

In every fallback case, the goal is that the demo can still narrate the complete FIND → SCREEN → MEASURE → VISUALIZE → EXPLAIN → DECIDE story, even if some data is substituted with clearly labeled static/demo values.

---

## 27. TRACEABILITY MATRIX

| Master Brief Requirement | PRD Requirement | Module | Priority |
|---|---|---|---|
| Objective 01 — Identify Opportunity | PRD-G-01, PRD-FR-003, PRD-FR-004, PRD-FR-005 | Site Intelligence, Opportunity Scoring, Ranked Sites | P0 |
| Objective 02 — Screen Risk & Conflicts | PRD-G-02, PRD-FR-006, PRD-RC-001 to PRD-RC-005 | Risk & Conflict Screening | P0 |
| Objective 03 — Turn a Site into a Proposal | PRD-G-03, PRD-FR-007 to PRD-FR-012 | Site Selection, Plot Drawing/Area, Infrastructure Selection, 3D Planning | P0 |
| Objective 04 — Explain & Justify the Decision | PRD-G-04, PRD-FR-013, PRD-FR-014 | AI Planning Assistant, AI Proposal Review | P0 |
| Section 3 — Problem Statement (potential ≠ suitability) | PRD-RC-005 | Risk & Conflict Screening | P0 |
| Section 13/14 — Site Intelligence Engine & Scoring | PRD-FR-003, PRD-FR-004, Section 8, Section 9 | Site Intelligence, Opportunity Scoring | P0 |
| Section 15 — Risk & Conflict Screening | PRD-FR-006, Section 10 | Risk & Conflict | P0 |
| Section 16 — Ranked Site Results | PRD-FR-005 | Ranked Candidate Sites | P0 |
| Section 17 — 2D GIS Map | PRD-FR-002, Section 11 | 2D Map | P0 |
| Section 18 — Location Selection (no manual re-entry) | PRD-FR-007, PRD-SP-001 | Site Selection, Site Planning | P0 |
| Section 19/20 — Plot Drawing & Area Calculation | PRD-FR-008, PRD-FR-009, Section 13 | Plot Measurement | P0 |
| Section 21 — Infrastructure Selection | PRD-FR-010 | Infrastructure Selection | P0 |
| Section 22–25 — 3D Planning & Modeling & Interactions | PRD-FR-011, PRD-FR-012, Section 14 | 3D Site Planning | P0 |
| Section 26–28 — AI Planning Assistant & Guardrails | PRD-FR-013, Section 15 | AI Planning Assistant | P0 |
| Section 29–30 — Proposal Workspace & Decision-Ready Proposal | PRD-FR-014 to PRD-FR-017, Section 16 | Proposal | P0 |
| Section 31 — Core UI Screens | Section 17 (Screens 1–8) | All UI Screens | P0 |
| Section 32 — Frontend Design Language | PRD-UX-009 | UX | P1 |
| Section 40 — MVP Scope | Section 22 (Must Have) | All Modules | P0 |
| Section 41 — Nice-to-Have | Section 22 (Nice to Have) | All Modules | P1/P2 |
| Section 42 — Out of Scope | Section 5, Section 22 (Out of Scope) | N/A | N/A |
| Section 43 — Anti-Overclaiming Rules | PRD-AI-007, PRD-AI-008, PRD-AI-010, PRD-PM-008 | AI Assistant, Plot Measurement | P0 |
| Section 55 — Critical Product Rules (Rules 1–10) | Section 5 (Non-Goals), PRD-SP-001, PRD-PR-010, PRD-NFR-009 | Cross-cutting | P0 |
| Section 56–57 — Core UX Copy & Terminology | PRD-UX-004, PRD-AI-009, PRD-AI-010 | UI/UX | P0 |

---

## 28. PRD COMPLETENESS CHECK

- [x] Problem
- [x] Users
- [x] Goals
- [x] Non-goals
- [x] FIND
- [x] SCREEN
- [x] MEASURE
- [x] VISUALIZE
- [x] EXPLAIN
- [x] DECIDE
- [x] Site Intelligence
- [x] Opportunity Scoring
- [x] Risk Screening
- [x] 2D Map
- [x] Plot Measurement
- [x] 3D Planning
- [x] AI Planning Assistant
- [x] Proposal
- [x] Demo Flow
- [x] MVP Scope
- [x] Acceptance Criteria
- [x] Risks
- [x] Traceability

**Status:** PRD complete. Per instructions, the TRD and implementation plan are NOT generated in this document and should be requested as a separate, subsequent deliverable.
