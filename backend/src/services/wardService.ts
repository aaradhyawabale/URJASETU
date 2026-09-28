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
  const path1 = path.join(cwd, 'data', 'geo', 'pune_administrative_wards.geojson');
  if (fs.existsSync(path1)) return path1;
  const path2 = path.join(cwd, '..', 'data', 'geo', 'pune_administrative_wards.geojson');
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
            divisionId: feature.properties.divisionId || feature.properties.ward_id,
            divisionCode: feature.properties.divisionCode || feature.properties.ward_id,
            divisionName: feature.properties.divisionName || feature.properties.ward_name,
            marathiName: feature.properties.marathiName || feature.properties.ward_name,
            ulbCode: 'PMC',
            population2021: String(feature.properties.population_proxy || '300000'),
            ulbRevenueCategory: 'PROJECT_MODELING_ASSUMPTION',
            revenueCalculationStatus: 'NOT_MODELED',
            classification: 'DERIVED_PMC_ADMINISTRATIVE_ZONES',
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

    // Area estimates per division in sq km (approximate bounding area for PMC 6 zones)
    const divisionAreaSqKm: Record<string, number> = {
      PMC_ZONE_01: 45.0, // Aundh - Baner
      PMC_ZONE_02: 30.0, // Shivajinagar - Ghole Road
      PMC_ZONE_03: 38.0, // Yerwada - Kalas - Dhanori
      PMC_ZONE_04: 55.0, // Nagar Road - Vadgaon Sheri
      PMC_ZONE_05: 65.0, // Kondhwa - Wanwadi - Hadapsar
      PMC_ZONE_06: 50.0, // Dhankawadi - Sahakarnagar - Karvenagar
    };

    return geojson.features.map((feature: any) => {
      const divProps = feature.properties;
      const divId = divProps.divisionId || divProps.ward_id;
      const area = divisionAreaSqKm[divId] || 40.0;

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
      const aggregateModeledSolarCapacityMwp = Number((retainedCount * 0.50).toFixed(2));
      const aggregateModeledEvChargerPorts = retainedCount * 4;

      const sumScore = retainedCandidates.reduce((acc, c) => acc + (c.opportunityScore || 0), 0);
      const meanOpportunityScore = retainedCount > 0 ? Math.round(sumScore / retainedCount) : 0;

      return {
        divisionId: divId,
        divisionCode: divProps.divisionCode || divId,
        divisionName: divProps.divisionName || divProps.ward_name,
        ulbCode: 'PMC',
        classification: 'DERIVED_PMC_ADMINISTRATIVE_ZONES',
        totalCandidates,
        retainedCandidates: retainedCount,
        candidatesPerKm2,
        aggregateModeledSolarCapacityMwp,
        aggregateModeledEvChargerPorts,
        meanOpportunityScore,
        populationStatus: 'MODELLED_PROXY',
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
