import { Feature, Polygon, Point, LineString, FeatureCollection } from 'geojson';

export type GISLayerCategory = 
  | 'CANDIDATE_SITES'
  | 'SOLAR_IRRADIANCE'
  | 'EV_DEMAND_PROXY'
  | 'ROAD_NETWORK'
  | 'FLOOD_SCREENING'
  | 'LAND_USE_CONFLICT'
  | 'GRID_INFRASTRUCTURE'
  | 'OSM_ROADS'
  | 'OSM_BUILDINGS'
  | 'OSM_POIS'
  | 'OSM_PARKING'
  | 'OSM_EV_CHARGING'
  | 'OSM_LANDUSE';

export interface GISLayerMetadata {
  id: string;
  name: string;
  category: GISLayerCategory;
  source: string;
  type: 'Vector Point' | 'Vector Polyline' | 'Vector Polygon' | 'Raster Heatmap';
  status: 'Active Demo' | 'Precomputed' | 'Estimated Proxy' | 'Authoritative OSM';
  description: string;
  coverage: string;
  limitations: string;
  isFallback: boolean;
  defaultVisible: boolean;
  featureCount?: number;
  minZoom?: number;
  maxZoom?: number;
}

export type CandidateSiteFeature = Feature<Point, {
  id: string;
  code: string;
  name: string;
  opportunityScore: number;
  status: 'RECOMMENDED' | 'UNDER_REVIEW' | 'SCREENING' | 'DISQUALIFIED';
  solarSuitability: number;
  evDemandProxy: number;
  roadAccessibility: number;
  floodRisk: 'LOW' | 'MEDIUM' | 'HIGH';
  landConflict: 'NONE' | 'MINOR' | 'HIGH';
  areaSqm: number;
}>;

export type RoadFeature = Feature<LineString, {
  name?: string;
  highway?: string;
  oneway?: string;
  ref?: string;
}>;

export type BuildingFeature = Feature<Polygon, {
  name?: string;
  building?: string;
  type?: string;
  amenity?: string;
}>;

export type PoiFeature = Feature<Point, {
  name?: string;
  amenity?: string;
  building?: string;
}>;

export type EvChargerFeature = Feature<Point, {
  name?: string;
  operator?: string;
  amenity?: string;
}>;

export type ParkingFeature = Feature<Point, {
  name?: string;
  parking?: string;
  amenity?: string;
}>;

export type LanduseFeature = Feature<Polygon, {
  name?: string;
  landuse?: string;
  type?: string;
}>;

export interface NashikSpatialDataset {
  candidateSites: FeatureCollection<Point>;
  riverways: FeatureCollection<LineString>;
  roads: FeatureCollection<LineString>;
  feeders: FeatureCollection<LineString>;
  floodZones: FeatureCollection<Polygon>;
}
