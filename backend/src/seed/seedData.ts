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

export const PUNE_SEED_SITES: ISite[] = [
  {
    id: 'pune-site-01',
    code: 'PUNE-SITE-01',
    name: 'Shivajinagar Bus Depot Substation Parcel',
    cityName: 'Pune',
    wardName: 'Shivajinagar-Ghole Road Zone',
    zoneName: 'Central Commercial Axis',
    opportunityScore: 84,
    status: 'RECOMMENDED',
    latitude: 18.5285,
    longitude: 73.8520,
    areaSqm: 2450,
    metrics: {
      solarSuitability: 88,
      evDemandProxy: 82,
      roadAccessibility: 91,
      floodRisk: 'LOW',
      landConflict: 'NONE',
    },
    description: 'PMC transit depot plot adjacent to 132/33kV MSEDCL feeder line and high density JM Road / FC Road corridor.',
    address: 'Plot 42B, Near MSRTC Shivajinagar Terminal, Pune',
    tags: ['Municipal Land', 'Transit Hub', 'Feeder Adjacent', 'High EV Demand'],
  },
  {
    id: 'pune-site-02',
    code: 'PUNE-SITE-02',
    name: 'Aundh-Baner IT Corridor Cluster B',
    cityName: 'Pune',
    wardName: 'Aundh-Baner Zone',
    zoneName: 'Western Tech Belt',
    opportunityScore: 78,
    status: 'RECOMMENDED',
    latitude: 18.5600,
    longitude: 73.8070,
    areaSqm: 3100,
    metrics: {
      solarSuitability: 85,
      evDemandProxy: 79,
      roadAccessibility: 86,
      floodRisk: 'LOW',
      landConflict: 'NONE',
    },
    description: 'IT Corridor open layout with optimal solar irradiation profile and high commercial EV fleet demand.',
    address: 'P-14 Baner Main Road, Tech Park Belt, Aundh, Pune',
    tags: ['IT Belt', 'Commercial Fleet', 'Clear Topography'],
  },
  {
    id: 'pune-site-03',
    code: 'PUNE-SITE-03',
    name: 'Kharadi E-Space Park Buffer',
    cityName: 'Pune',
    wardName: 'Nagar Road-Vadgaon Sheri Zone',
    zoneName: 'Eastern Tech Corridor',
    opportunityScore: 72,
    status: 'UNDER_REVIEW',
    latitude: 18.5510,
    longitude: 73.9350,
    areaSqm: 1850,
    metrics: {
      solarSuitability: 76,
      evDemandProxy: 84,
      roadAccessibility: 89,
      floodRisk: 'MEDIUM',
      landConflict: 'MINOR',
    },
    description: 'Strategic junction plot along Pune-Ahmednagar highway with high intercity transit EV demand.',
    address: 'Survey 108, Kharadi IT Park Main Road, Pune',
    tags: ['Bypass Transit', 'High Traffic', 'Drainage Review Required'],
  },
  {
    id: 'pune-site-04',
    code: 'PUNE-SITE-04',
    name: 'Swargate Multilevel Parking Deck',
    cityName: 'Pune',
    wardName: 'Dhankawadi-Sahakarnagar Zone',
    zoneName: 'Southern Transit Node',
    opportunityScore: 59,
    status: 'SCREENING',
    latitude: 18.5015,
    longitude: 73.8580,
    areaSqm: 1200,
    metrics: {
      solarSuitability: 62,
      evDemandProxy: 88,
      roadAccessibility: 71,
      floodRisk: 'HIGH',
      landConflict: 'HIGH',
    },
    description: 'High commercial demand but elevated Mula-Mutha river basin drainage buffer risk during monsoon.',
    address: 'Plot 12, Swargate Terminal South, Pune',
    tags: ['Flood Risk', 'Transit Node', 'Screening Active'],
  },
];

export const PUNE_SEED_PROPOSALS: IProposal[] = [
  {
    id: 'prop-pune-01',
    title: 'Shivajinagar 500kW Solar-EV Hub Project Proposal',
    siteId: 'pune-site-01',
    siteCode: 'PUNE-SITE-01',
    cityName: 'Pune Municipal Corporation',
    opportunityScore: 84,
    estimatedAreaSqm: 2450,
    infrastructureType: 'SOLAR_EV_CHARGING_HUB',
    status: 'READY_FOR_REVIEW',
    createdAt: '2026-09-10',
    updatedAt: '2026-09-11',
    aiSummary: 'PUNE-SITE-01 ranks highest in Shivajinagar-Ghole Road Zone due to its 88/100 solar score, zero land conflicts, and immediate 132/33kV EHV substation proximity on JM Road.',
    author: 'PMC Planning Cell',
  },
  {
    id: 'prop-pune-02',
    title: 'Aundh Commercial EV Fleet Hub',
    siteId: 'pune-site-02',
    siteCode: 'PUNE-SITE-02',
    cityName: 'Pune Municipal Corporation',
    opportunityScore: 78,
    estimatedAreaSqm: 3100,
    infrastructureType: 'SOLAR_EV_CHARGING_HUB',
    status: 'DRAFT',
    createdAt: '2026-09-08',
    updatedAt: '2026-09-09',
    aiSummary: 'Aundh Baner plot offers 3,100 m² clear parcel area suitable for multi-bay heavy vehicle EV fast chargers and canopy solar arrays.',
    author: 'Renewable Energy Taskforce',
  },
];
