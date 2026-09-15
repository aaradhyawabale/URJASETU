# UrjaSetu — OpenStreetMap (OSM) Integration Architecture

## Overview

UrjaSetu integrates six local OpenStreetMap (OSM) datasets covering the Nashik Municipal Corporation study area. The OSM integration provides authoritative spatial evidence for road accessibility, commercial POI activity density, building footprints, land-use zoning, parking facilities, and existing EV charging infrastructure.

---

## 1. Datasets & Provenance

* **Source**: OpenStreetMap (Overpass Turbo extract)
* **Coverage**: Nashik Urban Study Extent (19.90°N, 73.70°E to 20.10°N, 73.95°E)
* **CRS**: `EPSG:4326` (WGS84)
* **Attribution**: `© OpenStreetMap contributors`

| Layer | File Path | Feature Count | Geometry | Initial Visibility |
|---|---|---|---|---|
| Roads | `data/osm/nashik_roads.geojson` | 13,904 | LineString | Visible (Zoom-optimized) |
| Buildings | `data/osm/nashik_buildings.geojson` | 49,871 | Polygon | Toggled on demand (Zoom >= 14) |
| POIs | `data/osm/nashik_pois.geojson` | 1,079 | Point | Visible |
| Parking | `data/osm/nashik_parking.geojson` | 29 | Point | Visible |
| EV Stations | `data/osm/nashik_ev_pois.geojson` | 29 | Point | Visible |
| Land Use | `data/osm/nashik_landuse.geojson` | 645 | Polygon | Toggled on demand |

---

## 2. Architecture & Data Flow

```
Local OSM Datasets (data/osm/ & public/data/osm/)
       ↓
Express REST API (GET /api/v1/gis/osm/:layer)
       ↓
Frontend Async Service (src/gis/services/osmService.ts)
       ↓
Leaflet 2D GIS Canvas (src/gis/components/LeafletMap.tsx)
       ↓
Layer Control Toolbar (src/pages/SiteIntelligence.tsx)
       ↓
Turf.js Spatial Analysis (src/gis/utils/osmGisUtils.ts)
```

---

## 3. Performance Optimizations

1. **Lazy Loading**: Datasets are fetched asynchronously on-demand when layers are toggled ON.
2. **In-Memory Caching**: Parsed GeoJSON feature collections are cached both on the backend Express controller and frontend client memory.
3. **Canvas Rendering**: Leaflet `preferCanvas: true` renderer handles polyline and polygon layers smoothly without DOM bloat.
4. **Zoom Thresholding**:
   - `Buildings` (49.8k polygons): Loaded and rendered when enabled by user.
   - `Roads` (13.9k lines): Major arterials and highways styled distinctly at low zoom levels; residential streets styled lightly at macro scale.

---

## 4. Backend GIS API Endpoints

* `GET /api/v1/gis/osm/metadata` -> Returns metadata JSON for all 6 OSM layers.
* `GET /api/v1/gis/osm/:layer` -> Returns GeoJSON FeatureCollection for specified layer (`roads`, `buildings`, `pois`, `landuse`, `parking`, `ev`).
* `POST /api/v1/gis/indicators` -> Accepts `{ latitude, longitude }` and returns nearest EV charger distance and POI density within 500m radius.

---

## 5. Reusable Spatial Utilities (`src/gis/utils/osmGisUtils.ts`)

* `getDistanceToNearestRoad(lat, lng, roadsGeoJson)`: Returns geodesic distance to nearest road in meters.
* `getNearestEVCharger(lat, lng, evGeoJson)`: Returns distance to nearest EV station in meters with charger metadata.
* `getNearbyPOICount(lat, lng, radiusMeters, poisGeoJson)`: Returns count of commercial POIs within target radius.
* `getPOIDensity(lat, lng, radiusMeters, poisGeoJson)`: Returns POI density per km².

---

## 6. Updating / Replacing Datasets

To update the Nashik OSM datasets:
1. Replace GeoJSON files in `data/osm/raw/`.
2. Sync updated files into `public/data/osm/`.
3. Update feature counts and metadata in `data/osm/metadata.json` and `docs/DATA_SOURCES.md`.
