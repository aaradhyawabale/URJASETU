import fs from 'fs';
import path from 'path';
import { SCORING_CONFIG } from '../config/scoringConfig.js';
import { ElevationService } from './elevationService.js';
import { ClimateService } from './climateService.js';

export interface IFactorDecomposition {
  factorId: string;
  name: string;
  rawMeasurement: number;
  inputUnit: string;
  normalizedScore: number; // 0 - 100
  weightPercent: number; // e.g. 25
  scoreContribution: number; // normalizedScore * (weightPercent / 100)
  classification: string;
  sourceCitation: string;
  rationale: string;
  limitation?: string;
}

export interface ICandidateSite {
  id: string;
  code: string;
  name: string;
  status: 'HIGH_SUITABILITY' | 'MODERATE_SUITABILITY' | 'LOW_SUITABILITY' | 'EXCLUDED';
  isRetained: boolean;
  exclusionReason: string | null;
  exclusionCode: 'EXCESSIVE_SLOPE' | 'RIVER_SETBACK_EXCLUSION' | 'BUILDING_FOOTPRINT_OVERLAP' | 'OUTSIDE_STUDY_AREA' | null;
  latitude: number;
  longitude: number;
  opportunityScore: number; // 0 - 100
  elevationMeters: number;
  slopePercent: number;
  nearestRoadMeters: number;
  nearestEVChargerMeters: number;
  nearestParkingMeters: number;
  nearbyPoiCount500m: number;
  factors: Record<string, IFactorDecomposition>;
  provenance: {
    datasetName: string;
    solarSource: string;
    elevationSource: string;
    osmSource: string;
    generationMethod: string;
    candidateSpacing: string;
  };
  limitations: string[];
}

export interface ICandidateGenerationParams {
  spacingDegree?: number; // Default 0.0075 (~830m grid)
  minLat?: number;
  maxLat?: number;
  minLng?: number;
  maxLng?: number;
  maxCandidates?: number;
  minScore?: number;
  includeExcluded?: boolean;
}

// In-memory cache for parsed GeoJSON layers
let layerCache: Record<string, any> = {};

const getOsmDir = (): string => {
  const cwd = process.cwd();
  const path1 = path.join(cwd, 'data', 'osm');
  if (fs.existsSync(path1)) return path1;
  const path2 = path.join(cwd, '..', 'data', 'osm');
  if (fs.existsSync(path2)) return path2;
  return path1;
};

const loadGeoJsonLayer = (layerName: string): any | null => {
  if (layerCache[layerName]) return layerCache[layerName];

  const osmDir = getOsmDir();
  const layerMap: Record<string, string> = {
    roads: path.join(osmDir, 'nashik_roads.geojson'),
    buildings: path.join(osmDir, 'nashik_buildings.geojson'),
    pois: path.join(osmDir, 'nashik_pois.geojson'),
    landuse: path.join(osmDir, 'nashik_landuse.geojson'),
    parking: path.join(osmDir, 'nashik_parking.geojson'),
    ev: path.join(osmDir, 'nashik_ev_pois.geojson'),
  };

  const filePath = layerMap[layerName.toLowerCase()];
  if (!filePath || !fs.existsSync(filePath)) return null;

  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const parsed = JSON.parse(raw);
    layerCache[layerName] = parsed;
    return parsed;
  } catch {
    return null;
  }
};

export class CandidateService {
  private static studyAreaBounds = {
    minLat: 19.90,
    maxLat: 20.10,
    minLng: 73.70,
    maxLng: 73.95,
  };

  public static async generateCandidates(params?: ICandidateGenerationParams): Promise<ICandidateSite[]> {
    const spacing = params?.spacingDegree || 0.0075; // ~830m grid spacing
    const minLat = params?.minLat || this.studyAreaBounds.minLat;
    const maxLat = params?.maxLat || this.studyAreaBounds.maxLat;
    const minLng = params?.minLng || this.studyAreaBounds.minLng;
    const maxLng = params?.maxLng || this.studyAreaBounds.maxLng;

    // Load spatial layers once
    const roadsData = loadGeoJsonLayer('roads');
    const buildingsData = loadGeoJsonLayer('buildings');
    const evData = loadGeoJsonLayer('ev');
    const parkingData = loadGeoJsonLayer('parking');
    const poisData = loadGeoJsonLayer('pois');

    // Extract point arrays for fast distance querying
    const roadPoints: Array<[number, number]> = [];
    if (roadsData && roadsData.features) {
      roadsData.features.forEach((f: any) => {
        if (f.geometry && f.geometry.type === 'LineString') {
          f.geometry.coordinates.forEach((pt: [number, number]) => roadPoints.push(pt));
        } else if (f.geometry && f.geometry.type === 'Point') {
          roadPoints.push(f.geometry.coordinates as [number, number]);
        }
      });
    }

    const evPoints: Array<[number, number]> = [];
    if (evData && evData.features) {
      evData.features.forEach((f: any) => {
        if (f.geometry && f.geometry.coordinates) evPoints.push(f.geometry.coordinates as [number, number]);
      });
    }

    const parkingPoints: Array<[number, number]> = [];
    if (parkingData && parkingData.features) {
      parkingData.features.forEach((f: any) => {
        if (f.geometry && f.geometry.coordinates) {
          if (f.geometry.type === 'Point') parkingPoints.push(f.geometry.coordinates as [number, number]);
          else if (f.geometry.type === 'Polygon' && f.geometry.coordinates[0]) {
            parkingPoints.push(f.geometry.coordinates[0][0] as [number, number]);
          }
        }
      });
    }

    const poiPoints: Array<[number, number]> = [];
    if (poisData && poisData.features) {
      poisData.features.forEach((f: any) => {
        if (f.geometry && f.geometry.coordinates) poiPoints.push(f.geometry.coordinates as [number, number]);
      });
    }

    // Load Solar Climatology
    const solarClimatology = await ClimateService.getNashikSolarClimatology();
    const annualGhi = solarClimatology.metrics.annualGhiOptimalTilt; // 5.02 kWh/m²/day

    const candidates: ICandidateSite[] = [];
    let candidateIndex = 1;

    for (let lat = minLat; lat <= maxLat; lat += spacing) {
      for (let lng = minLng; lng <= maxLng; lng += spacing) {
        const roundedLat = Number(lat.toFixed(4));
        const roundedLng = Number(lng.toFixed(4));

        // Evaluate Terrain Slope & Elevation
        const terrain = ElevationService.evaluateTerrain(roundedLat, roundedLng);

        // Calculate Spatial Distances
        const nearestRoadMeters = findMinHaversineDistance(roundedLat, roundedLng, roadPoints) ?? 150;
        const nearestEVChargerMeters = findMinHaversineDistance(roundedLat, roundedLng, evPoints) ?? 1200;
        const nearestParkingMeters = findMinHaversineDistance(roundedLat, roundedLng, parkingPoints) ?? 450;
        const nearbyPoiCount500m = countPointsWithinRadius(roundedLat, roundedLng, poiPoints, 500);

        // Evaluate Hard Constraints
        let exclusionReason: string | null = null;
        let exclusionCode: ICandidateSite['exclusionCode'] = null;

        if (roundedLat < this.studyAreaBounds.minLat || roundedLat > this.studyAreaBounds.maxLat ||
            roundedLng < this.studyAreaBounds.minLng || roundedLng > this.studyAreaBounds.maxLng) {
          exclusionCode = 'OUTSIDE_STUDY_AREA';
          exclusionReason = 'Coordinate is outside the Nashik study area extent (19.90°N - 20.10°N, 73.70°E - 73.95°E).';
        } else if (terrain.slopePercent > 15.0) {
          exclusionCode = 'EXCESSIVE_SLOPE';
          exclusionReason = `Terrain slope (${terrain.slopePercent}%) exceeds project screening exclusion threshold of 15.0%. Excluded due to heavy vehicle maneuverability limits and excessive earthworks capex.`;
        } else if (isWithinRiparianBuffer(roundedLat, roundedLng)) {
          exclusionCode = 'RIVER_SETBACK_EXCLUSION';
          exclusionReason = 'Candidate location is within the prohibited 30m Godavari River Blue Line flood margin buffer (MRTP Act 1966 & NMC DCPR 2017 Rule 11.2).';
        } else if (isInsideBuildingFootprint(roundedLat, roundedLng, buildingsData)) {
          exclusionCode = 'BUILDING_FOOTPRINT_OVERLAP';
          exclusionReason = 'Candidate location falls directly inside an existing OSM building structure footprint.';
        }

        const isRetained = exclusionCode === null;

        // Factor Calculations
        // 1. Solar Photovoltaic Baseline Factor (25%)
        const solarNormalized = Math.min(100, Math.round((annualGhi / SCORING_CONFIG.solarModel.projectThresholds.benchmarkGhiKwhM2Day) * 100)); // (5.02 / 6.0) * 100 = 84
        const solarWeight = SCORING_CONFIG.factors.solarPhotovoltaic.weightPercent;
        const solarContrib = Number(((solarNormalized * solarWeight) / 100).toFixed(2));

        // 2. Road Access Factor (25%)
        const roadNormalized = Math.max(0, Math.min(100, Math.round(100 - (nearestRoadMeters / 25))));
        const roadWeight = SCORING_CONFIG.factors.roadAccess.weightPercent;
        const roadContrib = Number(((roadNormalized * roadWeight) / 100).toFixed(2));

        // 3. EV Infrastructure Gap Proxy Factor (20%)
        const evGapNormalized = Math.min(100, Math.round(nearestEVChargerMeters / 50));
        const evGapWeight = SCORING_CONFIG.factors.evInfrastructureGap.weightPercent;
        const evGapContrib = Number(((evGapNormalized * evGapWeight) / 100).toFixed(2));

        // 4. Terrain Slope Factor (15%)
        const terrainNormalized = terrain.terrainScore;
        const terrainWeight = SCORING_CONFIG.factors.terrainSlope.weightPercent;
        const terrainContrib = Number(((terrainNormalized * terrainWeight) / 100).toFixed(2));

        // 5. Parking & Transit Accessibility Factor (15%)
        const parkingNormalized = Math.max(0, Math.min(100, Math.round(100 - (nearestParkingMeters / 30))));
        const parkingWeight = SCORING_CONFIG.factors.parkingAccessibility.weightPercent;
        const parkingContrib = Number(((parkingNormalized * parkingWeight) / 100).toFixed(2));

        // Aggregate Opportunity Score
        const totalOpportunityScore = isRetained
          ? Math.round(solarContrib + roadContrib + evGapContrib + terrainContrib + parkingContrib)
          : 0;

        let status: ICandidateSite['status'] = 'EXCLUDED';
        if (isRetained) {
          if (totalOpportunityScore >= 75) status = 'HIGH_SUITABILITY';
          else if (totalOpportunityScore >= 55) status = 'MODERATE_SUITABILITY';
          else status = 'LOW_SUITABILITY';
        }

        const candidateCode = `NSK-CND-${String(candidateIndex).padStart(3, '0')}`;
        const candidateName = `Candidate Site ${candidateCode} (${roundedLat.toFixed(3)}, ${roundedLng.toFixed(3)})`;

        candidates.push({
          id: `cnd_${candidateIndex}`,
          code: candidateCode,
          name: candidateName,
          status,
          isRetained,
          exclusionReason,
          exclusionCode,
          latitude: roundedLat,
          longitude: roundedLng,
          opportunityScore: totalOpportunityScore,
          elevationMeters: terrain.elevationMeters,
          slopePercent: terrain.slopePercent,
          nearestRoadMeters,
          nearestEVChargerMeters,
          nearestParkingMeters,
          nearbyPoiCount500m,
          factors: {
            solarPhotovoltaic: {
              factorId: 'solarPhotovoltaic',
              name: SCORING_CONFIG.factors.solarPhotovoltaic.name,
              rawMeasurement: annualGhi,
              inputUnit: SCORING_CONFIG.factors.solarPhotovoltaic.inputUnit,
              normalizedScore: solarNormalized,
              weightPercent: solarWeight,
              scoreContribution: solarContrib,
              classification: SCORING_CONFIG.factors.solarPhotovoltaic.classification,
              sourceCitation: SCORING_CONFIG.factors.solarPhotovoltaic.sourceCitation,
              rationale: SCORING_CONFIG.factors.solarPhotovoltaic.rationale,
              limitation: SCORING_CONFIG.solarModel.sourceGuidance.limitations,
            },
            roadAccess: {
              factorId: 'roadAccess',
              name: SCORING_CONFIG.factors.roadAccess.name,
              rawMeasurement: nearestRoadMeters,
              inputUnit: SCORING_CONFIG.factors.roadAccess.inputUnit,
              normalizedScore: roadNormalized,
              weightPercent: roadWeight,
              scoreContribution: roadContrib,
              classification: SCORING_CONFIG.factors.roadAccess.classification,
              sourceCitation: SCORING_CONFIG.factors.roadAccess.sourceCitation,
              rationale: SCORING_CONFIG.factors.roadAccess.rationale,
            },
            evInfrastructureGap: {
              factorId: 'evInfrastructureGap',
              name: SCORING_CONFIG.factors.evInfrastructureGap.name,
              rawMeasurement: nearestEVChargerMeters,
              inputUnit: SCORING_CONFIG.factors.evInfrastructureGap.inputUnit,
              normalizedScore: evGapNormalized,
              weightPercent: evGapWeight,
              scoreContribution: evGapContrib,
              classification: SCORING_CONFIG.factors.evInfrastructureGap.classification,
              sourceCitation: SCORING_CONFIG.factors.evInfrastructureGap.sourceCitation,
              rationale: SCORING_CONFIG.factors.evInfrastructureGap.rationale,
              limitation: 'Spatial proxy measuring distance to existing EV chargers. Does NOT measure real-time vehicle traffic or electrical grid capacity.',
            },
            terrainSlope: {
              factorId: 'terrainSlope',
              name: SCORING_CONFIG.factors.terrainSlope.name,
              rawMeasurement: terrain.slopePercent,
              inputUnit: SCORING_CONFIG.factors.terrainSlope.inputUnit,
              normalizedScore: terrainNormalized,
              weightPercent: terrainWeight,
              scoreContribution: terrainContrib,
              classification: SCORING_CONFIG.factors.terrainSlope.classification,
              sourceCitation: SCORING_CONFIG.factors.terrainSlope.sourceCitation,
              rationale: SCORING_CONFIG.factors.terrainSlope.rationale,
            },
            parkingAccessibility: {
              factorId: 'parkingAccessibility',
              name: SCORING_CONFIG.factors.parkingAccessibility.name,
              rawMeasurement: nearestParkingMeters,
              inputUnit: SCORING_CONFIG.factors.parkingAccessibility.inputUnit,
              normalizedScore: parkingNormalized,
              weightPercent: parkingWeight,
              scoreContribution: parkingContrib,
              classification: SCORING_CONFIG.factors.parkingAccessibility.classification,
              sourceCitation: SCORING_CONFIG.factors.parkingAccessibility.sourceCitation,
              rationale: SCORING_CONFIG.factors.parkingAccessibility.rationale,
            },
          },
          provenance: {
            datasetName: 'Nashik Multi-Criteria Spatial Candidate Grid',
            solarSource: 'NASA POWER 30-Year Solar Climatology (0.5° Grid)',
            elevationSource: 'Copernicus DEM GLO-30 DSM (546-Cell Grid Extract)',
            osmSource: 'OpenStreetMap Nashik Spatial Extracted Layers',
            generationMethod: `Regular spatial grid sampling at ${spacing}° (~${Math.round(spacing * 111000)}m spacing)`,
            candidateSpacing: `${spacing}°`,
          },
          limitations: [
            'NASA POWER solar irradiation is a 50km regional climatology mean and does not account for plot-level shading.',
            'EV infrastructure gap is a distance-based proxy for unserved coverage and does not measure actual EV traffic demand.',
            'Terrain slope is evaluated from Copernicus DEM GLO-30 Digital Surface Model (DSM) at 0.01° grid resolution.',
            'Land acquisition feasibility, parcel ownership, and electrical grid connection capacity require secondary field verification.',
          ],
        });

        candidateIndex++;
      }
    }

    // Sort candidates: Retained candidates first (by highest opportunity score), then Excluded candidates
    let filtered = candidates;
    if (params?.includeExcluded === false) {
      filtered = candidates.filter((c) => c.isRetained);
    }

    filtered.sort((a, b) => {
      if (a.isRetained && !b.isRetained) return -1;
      if (!a.isRetained && b.isRetained) return 1;
      return b.opportunityScore - a.opportunityScore;
    });

    if (params?.minScore !== undefined) {
      filtered = filtered.filter((c) => !c.isRetained || c.opportunityScore >= params.minScore!);
    }

    if (params?.maxCandidates && params.maxCandidates > 0) {
      filtered = filtered.slice(0, params.maxCandidates);
    }

    return filtered;
  }
}

function findMinHaversineDistance(lat: number, lng: number, points: Array<[number, number]>): number | null {
  if (!points || points.length === 0) return null;
  let minDistance = Infinity;

  // Sample points if point list is very large for computational efficiency
  const step = points.length > 2000 ? Math.ceil(points.length / 1000) : 1;
  for (let i = 0; i < points.length; i += step) {
    const [pLng, pLat] = points[i];
    const d = calculateHaversineMeters(lat, lng, pLat, pLng);
    if (d < minDistance) minDistance = d;
  }

  return minDistance !== Infinity ? Math.round(minDistance) : null;
}

function countPointsWithinRadius(lat: number, lng: number, points: Array<[number, number]>, radiusMeters: number): number {
  if (!points || points.length === 0) return 0;
  let count = 0;
  points.forEach(([pLng, pLat]) => {
    const d = calculateHaversineMeters(lat, lng, pLat, pLng);
    if (d <= radiusMeters) count++;
  });
  return count;
}

function isWithinRiparianBuffer(lat: number, lng: number): boolean {
  // Conservative screening buffer along Godavari riverbed (approx 19.99°N to 20.01°N, 73.76°E to 73.82°E)
  if (lat >= 19.992 && lat <= 20.005 && lng >= 73.765 && lng <= 73.815) {
    const riverCenterLat = 19.998;
    const distanceToRiverCenter = calculateHaversineMeters(lat, lng, riverCenterLat, lng);
    return distanceToRiverCenter <= 30; // 30m Blue Line buffer
  }
  return false;
}

function isInsideBuildingFootprint(lat: number, lng: number, buildingsData: any): boolean {
  if (!buildingsData || !buildingsData.features) return false;
  // Bounding box check for performance
  for (const f of buildingsData.features) {
    if (f.geometry && f.geometry.type === 'Polygon' && f.geometry.coordinates[0]) {
      const ring = f.geometry.coordinates[0];
      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
      ring.forEach(([pLng, pLat]: [number, number]) => {
        if (pLng < minX) minX = pLng;
        if (pLng > maxX) maxX = pLng;
        if (pLat < minY) minY = pLat;
        if (pLat > maxY) maxY = pLat;
      });

      if (lng >= minX && lng <= maxX && lat >= minY && lat <= maxY) {
        return true;
      }
    }
  }
  return false;
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
