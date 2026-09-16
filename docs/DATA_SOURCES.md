# UrjaSetu — Data Sources & Provenance Catalog

## 1. OpenStreetMap (OSM) Vector Datasets

* **Source**: OpenStreetMap (OSM)
* **Geographic Coverage**: Nashik Urban Study Extent, Maharashtra, India
  * Bounding Box: South 19.90°N, West 73.70°E, North 20.10°N, East 73.95°E
* **Extraction Method**: Overpass API / Overpass Turbo
* **Extraction Date**: 2026-09-15
* **Coordinate Reference System (CRS)**: WGS84 / `EPSG:4326`
* **Attribution**: © OpenStreetMap contributors
* **Classification**: **`OPEN`**

### Layer Summary & Feature Counts

| Layer Name | File Path | Feature Count | Geometry Type | Purpose & Application |
|---|---|---|---|---|
| **Roads Network** | `data/osm/nashik_roads.geojson` | 13,904 | LineString | Road accessibility rating, highway proximity, corridor analysis |
| **Building Footprints** | `data/osm/nashik_buildings.geojson` | 49,871 | Polygon / MultiPolygon | Urban structural density, rooftop solar suitability, setback verification |
| **Activity POIs** | `data/osm/nashik_pois.geojson` | 1,079 | Point | Commercial POI density, activity proxies for EV demand |
| **Land Use Zones** | `data/osm/nashik_landuse.geojson` | 645 | Polygon | Zoning context, land conflict screening (industrial, residential, commercial) |
| **Parking Facilities** | `data/osm/nashik_parking.geojson` | 29 | Point | Public parking co-location screening for EV fast charging hubs |
| **Existing EV Stations** | `data/osm/nashik_ev_pois.geojson` | 29 | Point | Existing EV charger locations for gap analysis & distance calculations |

### Limitations
OSM coverage is community-generated and may be incomplete or outdated in rapidly expanding suburban corridors. It must NOT be treated as authoritative cadastral land ownership, legal zoning, or utility interconnection records.

---

## 2. Solar Resource Climatology (NASA POWER API)

* **Source**: NASA Prediction Of Worldwide Energy Resources (POWER) Project / NASA Langley Research Center
* **API Endpoint**: `https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=SI_EF_TILTED_SURFACE,ALLSKY_KT,T2M,PRECTOTCORR&community=RE&longitude=73.7898&latitude=19.9975&format=JSON`
* **Dataset Type**: Point Climatology (JSON)
* **Geographic Coverage**: Nashik Regional Climatology Grid, Maharashtra, India (`19.9975°N, 73.7898°E`)
* **Spatial Resolution**: 0.5° × 0.5° Grid (~50 km regional grid cell)
* **Dataset Nature**: 30-year NASA POWER regional solar climatology mean
* **Native CRS**: WGS84 (`EPSG:4326`)
* **License & Attribution**: Public Domain / NASA Open Data Policy (`NASA POWER Project`)
* **Acquisition Method**: Live HTTP REST API call with cached local fallback (`backend/src/services/climateService.ts`)
* **Classification**: **`OPEN`**
* **Validated Measurements for Nashik**:
  * Global Horizontal Irradiance (GHI): **4.80 kWh/m²/day** (Annual Mean)
  * Optimal Tilt Solar Surface Irradiance: **5.02 kWh/m²/day** (Annual Mean)
  * Optimal PV Panel Tilt Angle: **20.0° South**
  * Clearness Index (`ALLSKY_KT`): **0.55** (Annual Mean), Peak **0.68** (April)
* **Limitations**:
  * Regional climatology mean. Does NOT measure plot-level micro-shading from adjacent trees, utility poles, or buildings.

---

## 3. Terrain Elevation & Slope Analysis (Copernicus DEM 30m)

* **Source**: Copernicus Space Component / ESA Copernicus DEM GLO-30 & SRTM 1-ArcSecond Grid
* **API Endpoint / Grid Reference**: OpenTopography / Copernicus DEM 30m Reference Grid Nodes
* **Dataset Type**: Raster GeoTIFF Grid Nodes
* **Geographic Coverage**: Nashik Urban Extent (`19.90°N, 73.70°E` to `20.10°N, 73.95°E`)
* **Spatial Resolution**: 1 arc-second (~30 meters)
* **Native CRS**: WGS84 (`EPSG:4326`) / EGM96 Vertical Datum
* **License & Attribution**: Open Access Data / Copernicus Sentinel License / Public Domain
* **Methodology**: Inverse Distance Weighted (IDW) spatial interpolation from Copernicus DEM 30m reference nodes for Nashik municipal wards (`backend/src/services/elevationService.ts`).
* **Classification**: **`OPEN`** (Raw DEM Grid Nodes), **`DERIVED`** (IDW Interpolated Elevation & Slope Calculation)
* **Validated Measurements for Nashik**:
  * Elevation Range: **540m MSL** (Godavari River Basin) to **720m MSL** (Satpur Ridge)
  * Govardhan Site Slope: **2.5%** (`FLAT_OPTIMAL`, Slope ≤ 5.0%)
* **Source-Backed Engineering Rationale**:
  * Slope steepness > 15.0% restricts heavy electric bus/truck turning maneuvers and structural foundation stability per **Indian Roads Congress IRC:73-1980 & IRC:86-1983** urban road geometric design standards.

---

## 4. Environmental & Waterway Setback Screening

* **Source**: Maharashtra Regional and Town Planning Act (MRTP Act 1966) & NMC DCPR 2017 Regulations
* **Dataset Type**: Vector Buffer Exclusion Zone
* **Methodology**: 30-meter Blue Line setback exclusion buffer generated along Godavari river banks and natural drainage channels.
* **Classification**: **`DERIVED`**

---

## 5. Administrative Divisions (NMC 6 Divisional Offices)

* **Official Publisher**: Nashik Municipal Corporation (NMC - Nashik Mahanagarpalika)
* **Dataset Reference**: `data/geo/nashik_administrative_wards.geojson` (6 Polygons)
* **Official Structure**: 6 Administrative Divisions / Zones (Panchavati, Nashik East, Nashik West, CIDCO, Satpur, Nashik Road) as published by NMC Divisional Offices (`https://nashikcorporation.in/`).
* **Geometry Provenance**: Digitized vector polygons covering Nashik urban study area extent (`19.90°N, 73.70°E` to `20.10°N, 73.95°E`).
* **Classification**: **`DERIVED_NMC_ADMINISTRATIVE_ZONES`**
* **Data Honesty Rules & Provenance Constraints**:
  * **Population**: Marked **`UNKNOWN`** due to postponed 2021 Indian Census.
  * **Revenue Category**: Marked **`PROJECT_MODELING_ASSUMPTION`**.
  * **Municipal Annual Revenue**: Set to **`NOT_MODELED`** / **`UNKNOWN`** (Municipal land lease and license fees depend on site-specific public tenders and auctions).
---

## 6. Electrical Grid Infrastructure & Substation Feeder Capacity (MSEDCL)

* **Official DISCOM Publisher**: Maharashtra State Electricity Distribution Company Limited (MSEDCL / Mahavitaran), Nashik Urban Circle
* **Dataset Reference**: `data/geo/nashik_msedcl_grid.geojson` (12 Features: 6 Substation Points + 6 Feeder LineStrings)
* **Voltage Levels**: 33kV Subtransmission Corridors & 33/11kV Distribution Substations (Satpur, Panchavati, Govardhan, Nashik Road, CIDCO Ambad, Dwarka)
* **Classification**: **`DERIVED_GRID_INFRASTRUCTURE_PROXY`**
* **Feeder Capacity Status**: **`ESTIMATED_FEEDER_HOSTING_CAPACITY_PROXY`**
* **Limitations & Disclaimers**:
  * Feeder proximity measurements compute geodesic distance to digitized 33kV corridor lines.
  * Available hosting capacity figures are preliminary non-SCADA planning estimates and do NOT constitute formal MSEDCL grid NOC interconnection approval or real-time transformer loading telemetry.


