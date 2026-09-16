export type SiteStatus =
  | 'RECOMMENDED'
  | 'UNDER_REVIEW'
  | 'SCREENING'
  | 'DISQUALIFIED'
  | 'HIGH_SUITABILITY'
  | 'MODERATE_SUITABILITY'
  | 'LOW_SUITABILITY'
  | 'EXCLUDED';

export type InfrastructureType = 
  | 'SOLAR_EV_CHARGING_HUB'
  | 'STANDALONE_EV_STATION'
  | 'ROOFTOP_SOLAR_ONLY'
  | 'BATTERY_STORAGE_SYSTEM';

export interface SiteMetrics {
  solarSuitability: number; // 0 - 100
  evDemandProxy: number; // 0 - 100
  roadAccessibility: number; // 0 - 100
  floodRisk: 'LOW' | 'MEDIUM' | 'HIGH';
  landConflict: 'NONE' | 'MINOR' | 'HIGH';
}

export interface CandidateSite {
  id: string;
  name: string;
  code: string; // e.g. NASHIK-SITE-01 or NSK-CND-001
  city?: string; // Nashik
  cityName?: string;
  ward?: string;
  wardName?: string;
  zone?: string;
  zoneName?: string;
  opportunityScore: number; // 0 - 100
  status: SiteStatus;
  lat?: number;
  latitude?: number;
  lng?: number;
  longitude?: number;
  areaSqm?: number;
  metrics?: SiteMetrics;
  description?: string;
  address?: string;
  tags?: string[];

  // Dynamic Candidate GIS Engine Fields
  isRetained?: boolean;
  exclusionReason?: string | null;
  exclusionCode?: 'EXCESSIVE_SLOPE' | 'RIVER_SETBACK_EXCLUSION' | 'BUILDING_FOOTPRINT_OVERLAP' | 'OUTSIDE_STUDY_AREA' | null;
  elevationMeters?: number;
  slopePercent?: number;
  nearestRoadMeters?: number;
  nearestEVChargerMeters?: number;
  nearestParkingMeters?: number;
  nearbyPoiCount500m?: number;
  landCoverCategory?: string;
  factors?: Record<string, {
    factorId: string;
    name: string;
    rawMeasurement: number;
    inputUnit: string;
    normalizedScore: number;
    weightPercent: number;
    scoreContribution: number;
    classification: string;
    sourceCitation: string;
    rationale: string;
    limitation?: string;
  }>;
  provenance?: {
    datasetName: string;
    solarSource: string;
    elevationSource: string;
    osmSource: string;
    generationMethod: string;
    candidateSpacing: string;
  };
  limitations?: string[];

  // Administrative Division Fields
  divisionId?: string;
  divisionName?: string;
  divisionCode?: string;
  divisionClassification?: 'DERIVED_NMC_ADMINISTRATIVE_ZONES';
}

export interface IDivisionSummary {
  divisionId: string;
  divisionCode: string;
  divisionName: string;
  ulbCode: string;
  classification: string;
  totalCandidates: number;
  retainedCandidates: number;
  candidatesPerKm2: number;
  aggregateModeledSolarCapacityMwp: number;
  aggregateModeledEvChargerPorts: number;
  meanOpportunityScore: number;
  populationStatus: string;
  revenueStatus: string;
  metricClassification: 'AGGREGATE_MODEL_OUTPUT';
  disclaimer: string;
}

export interface Proposal {
  id: string;
  title: string;
  siteId: string;
  siteCode: string;
  cityName: string;
  opportunityScore: number;
  estimatedAreaSqm: number;
  infrastructureType: InfrastructureType;
  status: 'DRAFT' | 'READY_FOR_REVIEW' | 'APPROVED' | 'ARCHIVED';
  createdAt: string;
  updatedAt: string;
  aiSummary?: string;
  author: string;
  plotGeometry?: any;
}

