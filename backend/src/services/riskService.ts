import { ElevationService } from './elevationService.js';

export interface IHydrologicalRiskAssessment {
  latitude: number;
  longitude: number;
  distanceToRiverMeters: number;
  elevationMeters: number;
  floodRiskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL_SETBACK_EXCLUSION';
  overallRiskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'DISQUALIFIED';
  classification: 'FLOOD_HAZARD_SCREENING_PROXY';
  hydrologicalDistanceClassification: 'DERIVED_HYDROLOGICAL_DISTANCE_PROXY';
  provenance: {
    riverDataset: string;
    elevationDataset: string;
    citation: string;
  };
  disclaimer: string;
  verificationsRequired: string[];
}

// Key riverbed coordinates along Mula-Mutha river corridor in Pune
const MULA_MUTHA_RIVERBED_POINTS: Array<[number, number]> = [
  [73.8200, 18.5250],
  [73.8400, 18.5280],
  [73.8500, 18.5300],
  [73.8700, 18.5350],
  [73.8800, 18.5400],
  [73.9000, 18.5450],
  [73.9200, 18.5500],
];

export class RiskService {
  public static evaluateHydrologicalRisk(lat: number, lng: number): IHydrologicalRiskAssessment {
    // 1. Geodesic distance to nearest riverbed point
    let minDistanceMeters = Infinity;
    MULA_MUTHA_RIVERBED_POINTS.forEach(([rLng, rLat]) => {
      const d = calculateHaversineMeters(lat, lng, rLat, rLng);
      if (d < minDistanceMeters) minDistanceMeters = d;
    });

    const distanceToRiverMeters = Math.round(minDistanceMeters);

    // 2. Elevation analysis
    const terrain = ElevationService.evaluateTerrain(lat, lng);

    // 3. Flood Risk Classification
    let floodRiskLevel: IHydrologicalRiskAssessment['floodRiskLevel'] = 'LOW';
    let overallRiskLevel: IHydrologicalRiskAssessment['overallRiskLevel'] = 'LOW';

    if (distanceToRiverMeters <= 30) {
      floodRiskLevel = 'CRITICAL_SETBACK_EXCLUSION';
      overallRiskLevel = 'DISQUALIFIED';
    } else if (distanceToRiverMeters <= 150) {
      floodRiskLevel = 'HIGH';
      overallRiskLevel = 'HIGH';
    } else if (distanceToRiverMeters <= 500) {
      floodRiskLevel = 'MEDIUM';
      overallRiskLevel = 'MODERATE';
    }

    const verificationsRequired: string[] = [
      'Maharashtra Water Resources Department (WRD) official flood line map verification',
      'Pune Municipal Corporation (PMC) 30m Blue Line flood margin setback check (MRTP Act 1966)',
    ];

    if (floodRiskLevel === 'HIGH' || floodRiskLevel === 'CRITICAL_SETBACK_EXCLUSION') {
      verificationsRequired.push('Detailed 50-year HEC-RAS hydrologic basin inundation study required');
    }

    return {
      latitude: lat,
      longitude: lng,
      distanceToRiverMeters,
      elevationMeters: terrain.elevationMeters,
      floodRiskLevel,
      overallRiskLevel,
      classification: 'FLOOD_HAZARD_SCREENING_PROXY',
      hydrologicalDistanceClassification: 'DERIVED_HYDROLOGICAL_DISTANCE_PROXY',
      provenance: {
        riverDataset: 'Mula-Mutha Riverbed Spatial Corridor Extract (OSM & PMC DCPR 2017)',
        elevationDataset: 'Copernicus DEM GLO-30 DSM (560m mean grid)',
        citation: 'MRTP Act 1966 & PMC DCPR 2017 Rule 11.2 (30m Prohibited Flood Margin)',
      },
      disclaimer: 'This is a preliminary flood hazard screening proxy based on riverbed spatial proximity and surface elevation. It is NOT an official statutory flood hazard map issued by the Maharashtra Water Resources Department (WRD) or Pune Municipal Corporation.',
      verificationsRequired,
    };
  }

  // Legacy fallback compatibility
  public static evaluateRisk(metrics: any): any {
    const floodRisk = metrics?.floodRisk || 'LOW';
    const landConflict = metrics?.landConflict || 'NONE';

    return {
      overallRiskLevel: floodRisk === 'HIGH' || landConflict === 'HIGH' ? 'HIGH' : floodRisk === 'MEDIUM' ? 'MODERATE' : 'LOW',
      floodScreening: `Flood risk screening status: ${floodRisk}`,
      landConflictScreening: `Land conflict status: ${landConflict}`,
      verificationsRequired: [
        'ULB Revenue & Cadastral land-use title verification required',
        'MSEDCL 33kV Substation feeder grid interconnect capacity check',
      ],
    };
  }
}

function calculateHaversineMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
