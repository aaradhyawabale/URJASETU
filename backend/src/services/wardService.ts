import fs from 'fs';
import path from 'path';

export interface INmcDivision {
  divisionId: string;
  divisionCode: string;
  divisionName: string;
  marathiName: string;
  ulbCode: string;
  population2021: string; // 'UNKNOWN'
  ulbRevenueCategory: string; // 'PROJECT_MODELING_ASSUMPTION'
  revenueCalculationStatus: string; // 'NOT_MODELED'
  classification: string; // 'DERIVED_NMC_ADMINISTRATIVE_ZONES'
  keyLandmarks: string[];
}

export interface IDivisionAggregationSummary {
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

let divisionLayerCache: any = null;

const getGeoJsonFilePath = (): string => {
  const cwd = process.cwd();
  const path1 = path.join(cwd, 'data', 'geo', 'nashik_administrative_wards.geojson');
  if (fs.existsSync(path1)) return path1;
  const path2 = path.join(cwd, '..', 'data', 'geo', 'nashik_administrative_wards.geojson');
  if (fs.existsSync(path2)) return path2;
  return path1;
};

export class WardService {
  public static getAdministrativeDivisionsGeoJson(): any {
    if (divisionLayerCache) return divisionLayerCache;
    const filePath = getGeoJsonFilePath();
    if (!fs.existsSync(filePath)) return null;
    try {
      const raw = fs.readFileSync(filePath, 'utf-8');
      divisionLayerCache = JSON.parse(raw);
      return divisionLayerCache;
    } catch {
      return null;
    }
  }

  public static getDivisionForCoordinate(lat: number, lng: number): INmcDivision | null {
    const geojson = this.getAdministrativeDivisionsGeoJson();
    if (!geojson || !geojson.features) return null;

    for (const feature of geojson.features) {
      if (feature.geometry && feature.geometry.type === 'Polygon' && feature.geometry.coordinates[0]) {
        const ring = feature.geometry.coordinates[0]; // array of [lng, lat]
        if (isPointInRing([lng, lat], ring)) {
          return {
            divisionId: feature.properties.divisionId,
            divisionCode: feature.properties.divisionCode,
            divisionName: feature.properties.divisionName,
            marathiName: feature.properties.marathiName || feature.properties.divisionName,
            ulbCode: feature.properties.ulbCode || 'NMC',
            population2021: feature.properties.population2021 || 'UNKNOWN',
            ulbRevenueCategory: feature.properties.ulbRevenueCategory || 'PROJECT_MODELING_ASSUMPTION',
            revenueCalculationStatus: feature.properties.revenueCalculationStatus || 'NOT_MODELED',
            classification: 'DERIVED_NMC_ADMINISTRATIVE_ZONES',
            keyLandmarks: feature.properties.keyLandmarks || [],
          };
        }
      }
    }
    return null;
  }

  public static aggregateSitesByDivision(candidates: any[]): IDivisionAggregationSummary[] {
    const geojson = this.getAdministrativeDivisionsGeoJson();
    if (!geojson || !geojson.features) return [];

    // Area estimates per division in sq km (approximate bounding area)
    const divisionAreaSqKm: Record<string, number> = {
      nmc_div_01: 54.0, // Panchavati
      nmc_div_02: 32.0, // Nashik East
      nmc_div_03: 15.0, // Nashik West
      nmc_div_04: 35.0, // CIDCO
      nmc_div_05: 45.0, // Satpur
      nmc_div_06: 40.0, // Nashik Road
    };

    return geojson.features.map((feature: any) => {
      const divProps = feature.properties;
      const divId = divProps.divisionId;
      const area = divisionAreaSqKm[divId] || 30.0;

      // Filter candidates falling within this division
      const divCandidates = candidates.filter((c) => {
        if (c.divisionId) return c.divisionId === divId;
        const div = this.getDivisionForCoordinate(c.latitude, c.longitude);
        return div && div.divisionId === divId;
      });

      const totalCandidates = divCandidates.length;
      const retainedCandidates = divCandidates.filter((c) => c.isRetained);
      const retainedCount = retainedCandidates.length;

      const candidatesPerKm2 = Number((retainedCount / area).toFixed(2));

      // Calculate aggregate modeled solar capacity (MWp) & EV chargers (ports)
      // Assuming planning heuristic: ~500 kWp per site (0.5 MWp) & 4 chargers per retained site
      const aggregateModeledSolarCapacityMwp = Number((retainedCount * 0.50).toFixed(2));
      const aggregateModeledEvChargerPorts = retainedCount * 4;

      const sumScore = retainedCandidates.reduce((acc, c) => acc + (c.opportunityScore || 0), 0);
      const meanOpportunityScore = retainedCount > 0 ? Math.round(sumScore / retainedCount) : 0;

      return {
        divisionId: divId,
        divisionCode: divProps.divisionCode,
        divisionName: divProps.divisionName,
        ulbCode: 'NMC',
        classification: 'DERIVED_NMC_ADMINISTRATIVE_ZONES',
        totalCandidates,
        retainedCandidates: retainedCount,
        candidatesPerKm2,
        aggregateModeledSolarCapacityMwp,
        aggregateModeledEvChargerPorts,
        meanOpportunityScore,
        populationStatus: 'UNKNOWN',
        revenueStatus: 'NOT_MODELED',
        metricClassification: 'AGGREGATE_MODEL_OUTPUT',
        disclaimer: 'Spatial aggregation metrics are aggregate MODEL OUTPUTS derived from UrjaSetu candidate grid evaluation. They do NOT represent official municipal revenue forecasts, approved utility interconnection capacities, or statutory zoning limits.',
      };
    });
  }
}

function isPointInRing(point: [number, number], ring: number[][]): boolean {
  const x = point[0], y = point[1];
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i][0], yi = ring[i][1];
    const xj = ring[j][0], yj = ring[j][1];

    const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}
