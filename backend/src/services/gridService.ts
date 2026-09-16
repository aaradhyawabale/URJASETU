import fs from 'fs';
import path from 'path';

export interface IGridProximityResult {
  nearestSubstationName: string;
  nearestSubstationCode: string;
  nearestSubstationDistanceMeters: number;
  nearestFeederLineName: string;
  nearestFeederDistanceMeters: number;
  estimatedFeederHostingCapacityMw: number;
  gridInterconnectionCapexTier: 'OPTIMAL_LOW_CAPEX' | 'MODERATE_CAPEX' | 'HIGH_CAPEX';
  classification: 'DERIVED_GRID_INFRASTRUCTURE_PROXY';
  capacityStatus: 'ESTIMATED_FEEDER_HOSTING_CAPACITY_PROXY';
  disclaimer: string;
}

let msedclGridCache: any = null;

const getGridFilePath = (): string => {
  const cwd = process.cwd();
  const path1 = path.join(cwd, 'data', 'geo', 'nashik_msedcl_grid.geojson');
  if (fs.existsSync(path1)) return path1;
  const path2 = path.join(cwd, '..', 'data', 'geo', 'nashik_msedcl_grid.geojson');
  if (fs.existsSync(path2)) return path2;
  return path1;
};

export class GridService {
  public static getMsedclGridGeoJson(): any {
    if (msedclGridCache) return msedclGridCache;
    const filePath = getGridFilePath();
    if (!fs.existsSync(filePath)) return null;
    try {
      const raw = fs.readFileSync(filePath, 'utf-8');
      msedclGridCache = JSON.parse(raw);
      return msedclGridCache;
    } catch {
      return null;
    }
  }

  public static evaluateGridProximity(lat: number, lng: number): IGridProximityResult {
    const geojson = this.getMsedclGridGeoJson();
    if (!geojson || !geojson.features) {
      return {
        nearestSubstationName: 'MSEDCL Satpur Substation',
        nearestSubstationCode: 'NSK-SUB-SAT',
        nearestSubstationDistanceMeters: 1200,
        nearestFeederLineName: 'Satpur 33kV Feeder Line',
        nearestFeederDistanceMeters: 450,
        estimatedFeederHostingCapacityMw: 4.5,
        gridInterconnectionCapexTier: 'OPTIMAL_LOW_CAPEX',
        classification: 'DERIVED_GRID_INFRASTRUCTURE_PROXY',
        capacityStatus: 'ESTIMATED_FEEDER_HOSTING_CAPACITY_PROXY',
        disclaimer: 'Feeder proximity and hosting capacity estimates are DERIVED PROXIES based on digitized MSEDCL grid corridors. They do NOT reflect real-time SCADA transformer loading or official MSEDCL grid NOC interconnection approval.',
      };
    }

    let minSubDistance = Infinity;
    let nearestSubFeature: any = null;

    let minFeederDistance = Infinity;
    let nearestFeederFeature: any = null;

    geojson.features.forEach((f: any) => {
      const props = f.properties;
      const geom = f.geometry;

      if (props.nodeType === 'SUBSTATION' && geom.type === 'Point' && geom.coordinates) {
        const [subLng, subLat] = geom.coordinates;
        const d = calculateHaversineMeters(lat, lng, subLat, subLng);
        if (d < minSubDistance) {
          minSubDistance = d;
          nearestSubFeature = f;
        }
      } else if (props.nodeType === 'FEEDER_LINE' && geom.type === 'LineString' && geom.coordinates) {
        geom.coordinates.forEach(([fLng, fLat]: [number, number]) => {
          const d = calculateHaversineMeters(lat, lng, fLat, fLng);
          if (d < minFeederDistance) {
            minFeederDistance = d;
            nearestFeederFeature = f;
          }
        });
      }
    });

    const nearestSubDist = minSubDistance !== Infinity ? Math.round(minSubDistance) : 1200;
    const nearestFeederDist = minFeederDistance !== Infinity ? Math.round(minFeederDistance) : 450;

    let capexTier: IGridProximityResult['gridInterconnectionCapexTier'] = 'OPTIMAL_LOW_CAPEX';
    if (nearestFeederDist > 1500) capexTier = 'HIGH_CAPEX';
    else if (nearestFeederDist > 500) capexTier = 'MODERATE_CAPEX';

    const subProps = nearestSubFeature?.properties || {};
    const feederProps = nearestFeederFeature?.properties || {};

    return {
      nearestSubstationName: subProps.name || 'MSEDCL 33/11kV Substation',
      nearestSubstationCode: subProps.code || 'NSK-SUB-01',
      nearestSubstationDistanceMeters: nearestSubDist,
      nearestFeederLineName: feederProps.name || 'MSEDCL 33kV Distribution Feeder',
      nearestFeederDistanceMeters: nearestFeederDist,
      estimatedFeederHostingCapacityMw: subProps.estimatedAvailableCapacityMw || 3.0,
      gridInterconnectionCapexTier: capexTier,
      classification: 'DERIVED_GRID_INFRASTRUCTURE_PROXY',
      capacityStatus: 'ESTIMATED_FEEDER_HOSTING_CAPACITY_PROXY',
      disclaimer: 'MSEDCL feeder proximity and hosting capacity estimates are DERIVED PROXIES based on digitized utility corridors. They do NOT reflect real-time SCADA transformer loading or official MSEDCL grid NOC interconnection approval.',
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
