# URJASETU — PROJECT STRUCTURE & ARCHITECTURE DOCUMENTATION

## 1. Project Overview
**UrjaSetu** is an AI-assisted Geospatial Intelligence and Decision-Support Platform designed for Indian Municipal Bodies (Urban Local Bodies - ULBs) to streamline Solar-EV Charging Hub site selection and preliminary infrastructure planning.

- **Primary Demo City:** Nashik, Maharashtra, India
- **Primary Infrastructure:** Solar-EV Charging Hub
- **Framework:** React 18 + Vite + TypeScript + Tailwind CSS
- **Routing:** React Router v6 (Single Page Application)
- **Geospatial & 3D:** Leaflet 2D GIS, Turf.js client-side area calculation, CesiumJS 3D conceptual site planner

---

## 2. Directory Structure

```
stitch_urjasetu_geospatial_planning_platform/
├── index.html                                   # Application HTML entry point & font links
├── package.json                                 # Dependencies & scripts
├── vite.config.ts                               # Vite bundler configuration
├── tsconfig.json                                # TypeScript compiler configuration
├── tailwind.config.js                           # Light Municipal Design System tokens
├── postcss.config.js                            # PostCSS configuration
│
├── src/
│   ├── main.tsx                                 # Application entry mounting AppRoutes
│   ├── index.css                                # Global CSS & Tailwind imports
│   ├── app/
│   │   └── routes.tsx                           # Unified React Router v6 navigation
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppShell.tsx                     # Shared Sidebar + Header layout wrapper
│   │   │   ├── Sidebar.tsx                      # Unified navigation bar linking all 9 screens
│   │   │   └── Header.tsx                       # Top bar with Nashik ULB context & workflow steps
│   │   └── ui/
│   │       ├── StatusBadge.tsx                  # Recommended / Review / Disqualified status badges
│   │       └── ScoreBadge.tsx                   # Opportunity score / 100 badge
│   ├── data/
│   │   └── nashikDemoData.ts                    # Structured candidate sites & proposal seeds
│   ├── types/
│   │   └── site.ts                              # TypeScript definitions (Site, Metrics, Proposal)
│   └── pages/
│       ├── OverviewDashboard.tsx                # Screen 1: Municipal Siting Dashboard
│       ├── SiteIntelligence.tsx                 # Screen 2: 2D GIS Map & Screening
│       ├── RankedSites.tsx                      # Screen 3: Ranked Site Results & Comparison
│       ├── SitePlanningWorkspace.tsx            # Screen 4: Plot Boundary & Turf.js Measurement
│       ├── ThreeDSitePlanner.tsx                # Screen 5: CesiumJS 3D Conceptual Planner
│       ├── AIProposalReview.tsx                 # Screen 6: Gemini AI Technical Review
│       ├── ProposalWorkspace.tsx                # Screen 7: Decision Package Workspace
│       ├── SavedProposals.tsx                   # Screen 8: Municipal Proposal Library
│       └── DataAnalysisLayers.tsx               # Screen 9: Data & Analysis Spatial Catalog
│
├── PROJECT_STRUCTURE.md                         # This architecture documentation file
└── SCREEN_MAP.md                                # Complete 9-screen mapping specification
```

---

## 3. Light Municipal Design System
Extracted directly from approved Stitch designs and `municipal_spatial_intelligence/DESIGN.md`:

- **Primary Colors:**
  - `Surface`: White (`#ffffff`)
  - `App Background`: Off-White (`#f8fafc`)
  - `Text Primary`: Charcoal (`#0f172a`)
  - `Text Secondary`: Slate (`#475569`)
  - `Brand Primary Accent`: Emerald Green (`#059669`)
  - `Status Recommended`: Emerald (`#059669` / bg: `#ecfdf5`)
  - `Status Review`: Amber (`#d97706` / bg: `#fffbeb`)
  - `Status Disqualified`: Crimson (`#dc2626` / bg: `#fef2f2`)
- **Typography:** Inter (Weights: 400, 500, 600, 700)
- **Icons:** Material Symbols Outlined
