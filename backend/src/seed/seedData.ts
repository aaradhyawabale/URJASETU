export interface ISite {
  id: string;
  code: string;
  name: string;
  cityName: string;
  wardName: string;
  zoneName: string;
  opportunityScore: number;
  status: 'RECOMMENDED' | 'UNDER_REVIEW' | 'SCREENING' | 'DISQUALIFIED';
  latitude: number;
  longitude: number;
  areaSqm: number;
  metrics: {
    solarSuitability: number;
    evDemandProxy: number;
    roadAccessibility: number;
    floodRisk: 'LOW' | 'MEDIUM' | 'HIGH';
    landConflict: 'NONE' | 'MINOR' | 'HIGH';
  };
  description: string;
  address: string;
  tags: string[];
}

export interface IProposal {
  id: string;
  title: string;
  siteId: string;
  siteCode: string;
  cityName: string;
  opportunityScore: number;
  estimatedAreaSqm: number;
  infrastructureType: string;
  status: 'DRAFT' | 'READY_FOR_REVIEW' | 'APPROVED' | 'ARCHIVED';
  createdAt: string;
  updatedAt: string;
  aiSummary: string;
  author: string;
}

export const NASHIK_SEED_SITES: ISite[] = [
  {
    id: 'nashik-site-01',
    code: 'NASHIK-SITE-01',
    name: 'Govardhan Bus Depot Substation Parcel',
    cityName: 'Nashik',
    wardName: 'Ward 14 - Trimbak Road Axis',
    zoneName: 'Western Transit Corridor',
    opportunityScore: 84,
    status: 'RECOMMENDED',
    latitude: 19.9975,
    longitude: 73.7898,
    areaSqm: 2450,
    metrics: {
      solarSuitability: 88,
      evDemandProxy: 82,
      roadAccessibility: 91,
      floodRisk: 'LOW',
      landConflict: 'NONE',
    },
    description: 'Municipal transit depot plot adjacent to 33kV MSEDCL feeder line and high density Trimbak highway traffic corridor.',
    address: 'Plot 42B, Near MSRTC Govardhan Bus Stand, Trimbak Road, Nashik',
    tags: ['Municipal Land', 'Transit Hub', 'Feeder Adjacent', 'High EV Demand'],
  },
  {
    id: 'nashik-site-02',
    code: 'NASHIK-SITE-02',
    name: 'Satpur Industrial Area Cluster B',
    cityName: 'Nashik',
    wardName: 'Ward 8 - MIDC Satpur',
    zoneName: 'Satpur Industrial Estate',
    opportunityScore: 78,
    status: 'RECOMMENDED',
    latitude: 19.9882,
    longitude: 73.7421,
    areaSqm: 3100,
    metrics: {
      solarSuitability: 85,
      evDemandProxy: 79,
      roadAccessibility: 86,
      floodRisk: 'LOW',
      landConflict: 'NONE',
    },
    description: 'MIDC industrial open layout with optimal solar irradiation profile and commercial EV fleet demand.',
    address: 'P-14 MIDC Satpur Main Road, Industrial Estate, Nashik',
    tags: ['MIDC Land', 'Commercial Fleet', 'Clear Topography'],
  },
  {
    id: 'nashik-site-03',
    code: 'NASHIK-SITE-03',
    name: 'Ambad Commercial Ring Junction',
    cityName: 'Nashik',
    wardName: 'Ward 22 - Ambad Link Road',
    zoneName: 'Southern Bypass Belt',
    opportunityScore: 72,
    status: 'UNDER_REVIEW',
    latitude: 19.9450,
    longitude: 73.7610,
    areaSqm: 1850,
    metrics: {
      solarSuitability: 76,
      evDemandProxy: 84,
      roadAccessibility: 89,
      floodRisk: 'MEDIUM',
      landConflict: 'MINOR',
    },
    description: 'Strategic junction plot along Nashik-Mumbai bypass with high intercity transit EV demand.',
    address: 'Survey 108, Ambad Link Road Junction, Nashik',
    tags: ['Bypass Transit', 'High Traffic', 'Drainage Review Required'],
  },
  {
    id: 'nashik-site-04',
    code: 'NASHIK-SITE-04',
    name: 'Panchavati Municipal Market Buffer Plot',
    cityName: 'Nashik',
    wardName: 'Ward 3 - Panchavati',
    zoneName: 'Central Cultural Core',
    opportunityScore: 59,
    status: 'SCREENING',
    latitude: 20.0089,
    longitude: 73.7954,
    areaSqm: 1200,
    metrics: {
      solarSuitability: 62,
      evDemandProxy: 88,
      roadAccessibility: 71,
      floodRisk: 'HIGH',
      landConflict: 'HIGH',
    },
    description: 'High commercial demand but elevated river basin drainage buffer risk during monsoon.',
    address: 'Plot 12, Godavari Riverbank North, Panchavati, Nashik',
    tags: ['Flood Risk', 'Heritage Buffer Zone', 'Screening Active'],
  },
];

export const NASHIK_SEED_PROPOSALS: IProposal[] = [
  {
    id: 'prop-nashik-01',
    title: 'Govardhan 500kW Solar-EV Hub Project Proposal',
    siteId: 'nashik-site-01',
    siteCode: 'NASHIK-SITE-01',
    cityName: 'Nashik Municipal Corporation',
    opportunityScore: 84,
    estimatedAreaSqm: 2450,
    infrastructureType: 'SOLAR_EV_CHARGING_HUB',
    status: 'READY_FOR_REVIEW',
    createdAt: '2026-09-10',
    updatedAt: '2026-09-11',
    aiSummary: 'NASHIK-SITE-01 ranks highest in Municipal Ward 14 due to its 88/100 solar score, zero land conflicts, and immediate 33kV substation proximity on Trimbak Road.',
    author: 'NMC Planning Cell',
  },
  {
    id: 'prop-nashik-02',
    title: 'Satpur MIDC Commercial EV Fleet Hub',
    siteId: 'nashik-site-02',
    siteCode: 'NASHIK-SITE-02',
    cityName: 'Nashik Municipal Corporation',
    opportunityScore: 78,
    estimatedAreaSqm: 3100,
    infrastructureType: 'SOLAR_EV_CHARGING_HUB',
    status: 'DRAFT',
    createdAt: '2026-09-08',
    updatedAt: '2026-09-09',
    aiSummary: 'Satpur MIDC plot offers 3,100 m² clear parcel area suitable for multi-bay heavy vehicle EV fast chargers and canopy solar arrays.',
    author: 'Renewable Energy Taskforce',
  },
];
