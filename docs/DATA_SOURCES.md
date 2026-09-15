# UrjaSetu — Data Sources & Provenance Catalog

## 1. OpenStreetMap (OSM) Dataset

* **Source**: OpenStreetMap (OSM)
* **Geographic Coverage**: Nashik Urban Study Extent, Maharashtra, India
  * Bounding Box: South 19.90°N, West 73.70°E, North 20.10°N, East 73.95°E
* **Extraction Method**: Overpass API / Overpass Turbo
* **Extraction Date**: 2026-09-15
* **Coordinate Reference System (CRS)**: WGS84 / `EPSG:4326`
* **Attribution**: © OpenStreetMap contributors

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

## 2. Municipal Utility & Raster Data Proxies

* **MSEDCL Substation Grid Feeders**: 33kV utility feeder polylines digitized for Nashik industrial zones.
* **Godavari River Basin Floodways**: Open DEM (30m resolution) elevation slope screening vectors for riparian flood screening.
