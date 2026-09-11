# URJASETU — SCREEN MAPPING & WORKFLOW SPECIFICATION

This document maps all 9 Google Stitch screens to their clean, semantic React page components and application routes.

---

## Screen Mapping Table

| Screen Number | Intended Product Function | Original Stitch Folder | React Component File | Route |
| :--- | :--- | :--- | :--- | :--- |
| **Screen 1** | Overview / Municipal Dashboard | `overview_municipal_dashboard_urjasetu_nashik_light` | `OverviewDashboard.tsx` | `/` or `/dashboard` |
| **Screen 2** | Site Intelligence / 2D GIS Map | `site_intelligence_2d_gis_map_urjasetu_light` | `SiteIntelligence.tsx` | `/sites` |
| **Screen 3** | Ranked Site Results / Site Comparison | `ranked_site_results_urjasetu_nashik` | `RankedSites.tsx` | `/sites/ranked` |
| **Screen 4** | Site Planning Workspace | `site_planning_workspace_urjasetu_nashik` | `SitePlanningWorkspace.tsx` | `/planning/:siteId` |
| **Screen 5** | 3D Site Planner | `3d_site_planner_urjasetu_nashik` | `ThreeDSitePlanner.tsx` | `/planning/:siteId/3d` |
| **Screen 6** | AI Proposal Review | `ai_proposal_review_urjasetu_nashik` | `AIProposalReview.tsx` | `/proposals/:id/review` |
| **Screen 7** | Proposal Workspace | `proposal_workspace_urjasetu_nashik` | `ProposalWorkspace.tsx` | `/proposals/:id` |
| **Screen 8** | Saved Proposals / Proposal Library | `saved_proposals_urjasetu_nashik` | `SavedProposals.tsx` | `/proposals` |
| **Screen 9** | Data & Analysis Layers | `data_analysis_layers_urjasetu_nashik` | `DataAnalysisLayers.tsx` | `/data-layers` |

---

## Core Product Workflow Connection

```
Screen 1: Overview Dashboard
  │
  ▼
Screen 2: Site Intelligence (2D GIS Map & Screening)
  │
  ▼
Screen 3: Ranked Site Results (Site Comparison Matrix)
  │
  ▼
Screen 4: Site Planning Workspace (Plot Drawing & Turf.js Area)
  │
  ▼
Screen 5: 3D Site Planner (CesiumJS Conceptual Layout)
  │
  ▼
Screen 6: AI Proposal Review (Gemini AI Technical Analysis)
  │
  ▼
Screen 7: Proposal Workspace (Decision Package Editing)
  │
  ▼
Screen 8: Saved Proposals (Municipal Library Archive)
```
*(Screen 9: Data & Analysis Layers is accessible at any time from the primary sidebar navigation).*
