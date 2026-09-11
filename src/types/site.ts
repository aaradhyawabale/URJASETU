export type SiteStatus = 'RECOMMENDED' | 'UNDER_REVIEW' | 'SCREENING' | 'DISQUALIFIED';

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
  code: string; // e.g. NASHIK-SITE-01
  city: string; // Nashik
  cityName?: string;
  ward: string;
  wardName?: string;
  zone?: string;
  zoneName?: string;
  opportunityScore: number; // 0 - 100
  status: SiteStatus;
  lat: number;
  latitude?: number;
  lng: number;
  longitude?: number;
  areaSqm: number;
  metrics: SiteMetrics;
  description: string;
  address: string;
  tags: string[];
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
}
