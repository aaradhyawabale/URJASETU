# URJASETU — DATA SOURCES & GIS PROVENANCE SPECIFICATION

## 1. Datasets & Provenance Registry

| Dataset Name | Category | Source Provider | Data Type | Coverage / Scope | Classification | Limitations |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Nashik Candidate Sites** | Candidate Sites | UrjaSetu Scoring Engine | Vector Point | NMC Wards 1 to 30 | Precomputed Demo | Precomputed demo candidate points derived from ULB parcel seeds. |
| **Global Horizontal Irradiance (GHI)** | Solar Irradiance | NREL / SolarGIS Proxy | Raster Heatmap | Godavari Basin | Estimated Proxy | Micro-shading from urban structures requires site survey. |
| **Activity-Based EV Demand Proxy** | EV Demand Proxy | OSM POI Density & MSRTC Routes | Vector Point | Trimbak & MIDC Satpur | Estimated Proxy | Traffic volume estimated from POI density; live telemetry deferred. |
| **Digital Elevation Model (DEM)** | Flood Screening | Open DEM (30m Resolution) | Vector Polygon | Riverbank Floodways | Precomputed | DEM screening model; does not replace hydraulic flood studies. |
| **MSEDCL 33kV Feeder Grid** | Infrastructure | MSEDCL DISCOM Overlay | Vector Polyline | Substation Feeder Axis | Precomputed | Feeder line geometry digitized from municipal utility overlays. |
| **Arterial Road Corridors** | Accessibility | OpenStreetMap Contributors | Vector Polyline | NH-848 & Trimbak Road | ODbL / Open Data | Road width filtered for >= 12m municipal corridors. |

---

## 2. Data Honesty & Transparency Rule
All GIS overlays, candidate site metrics, and plot area computations are clearly identified in the UI as:
- **Precomputed Demo Dataset** (Nashik Seed Dataset)
- **Estimated available plot area based on the drawn boundary** (Turf.js calculation)

No simulated or demo dataset is represented as live, legally binding cadastral data.
