import { Feature, Polygon, Point, LineString, FeatureCollection } from 'geojson';

export type GISLayerCategory = 
  | 'CANDIDATE_SITES'
  | 'SOLAR_IRRADIANCE'
  | 'EV_DEMAND_PROXY'
  | 'ROAD_NETWORK'
  | 'FLOOD_SCREENING'
  | 'LAND_USE_CONFLICT'
  | 'GRID_INFRASTRUCTURE';

export interface GISLayerMetadata {
  id: string;
  name: string;
  category: GISLayerCategory;
  source: string;
  type: 'Vector Point' | 'Vector Polyline' | 'Vector Polygon' | 'Raster Heatmap';
  status: 'Active Demo' | 'Precomputed' | 'Estimated Proxy';
  description: string;
  coverage: string;
  limitations: string;
  isFallback: boolean;
  defaultVisible: boolean;
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
  name: string;
  type: 'arterial' | 'highway' | 'local';
}>;

export type FloodRiskFeature = Feature<Polygon, {
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  zoneName: string;
}>;

export type SubstationFeederFeature = Feature<LineString, {
  lineName: string;
  voltageKv: number;
}>;

export interface NashikSpatialDataset {
  candidateSites: FeatureCollection<Point>;
  riverways: FeatureCollection<LineString>;
  roads: FeatureCollection<LineString>;
  feeders: FeatureCollection<LineString>;
  floodZones: FeatureCollection<Polygon>;
}
