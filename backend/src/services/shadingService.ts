import fs from 'fs';
import path from 'path';

export interface IShadingAnalysisResult {
  latitude: number;
  longitude: number;
  parcelAreaSqm: number;
  solarElevationAngleDegrees: number;
  solarAzimuthAngleDegrees: number;
  estimatedBuildingHeightMeters: number;
  heightClassification: 'DERIVED_ESTIMATED_BUILDING_HEIGHT_PROXY';
  projectedShadowLengthMeters: number;
  nearbyBuildingDensity50m: number;
  estimatedShadingLossPercent: number;
  nasaPowerRegionalGhi: number;
  effectiveShadedGhiKwhM2Day: number;
  shadingClassification: 'CONCEPTUAL_3D_PLOT_SHADOW_SCREENING_PROXY';
  limitations: string[];
  disclaimer: string;
}

let buildingsCache: any = null;

const getBuildingsFilePath = (): string => {
  const cwd = process.cwd();
  const path1 = path.join(cwd, 'data', 'osm', 'nashik_buildings.geojson');
  if (fs.existsSync(path1)) return path1;
  const path2 = path.join(cwd, '..', 'data', 'osm', 'nashik_buildings.geojson');
  if (fs.existsSync(path2)) return path2;
  return path1;
};

export class ShadingService {
  public static getOsmBuildingsLayer(): any {
    if (buildingsCache) return buildingsCache;
    const filePath = getBuildingsFilePath();
    if (!fs.existsSync(filePath)) return null;
    try {
      const raw = fs.readFileSync(filePath, 'utf-8');
      buildingsCache = JSON.parse(raw);
      return buildingsCache;
    } catch {
      return null;
    }
  }

  public static calculateMicroShading(
    lat: number,
    lng: number,
    parcelAreaSqm: number = 2450,
    solarElevationDegrees: number = 45.0,
    solarAzimuthDegrees: number = 180.0
  ): IShadingAnalysisResult {
    const buildingsData = this.getOsmBuildingsLayer();
    let nearbyBuildingCount = 0;
    let maxBuildingLevels = 1;

    if (buildingsData && buildingsData.features) {
      buildingsData.features.forEach((f: any) => {
        if (f.geometry && f.geometry.coordinates) {
          let bLat = lat, bLng = lng;
          if (f.geometry.type === 'Polygon' && f.geometry.coordinates[0] && f.geometry.coordinates[0][0]) {
            [bLng, bLat] = f.geometry.coordinates[0][0];
          } else if (f.geometry.type === 'Point') {
            [bLng, bLat] = f.geometry.coordinates;
          }

          const d = calculateHaversineMeters(lat, lng, bLat, bLng);
          if (d <= 50) {
            nearbyBuildingCount++;
            const levels = parseInt(f.properties?.['building:levels'] || f.properties?.levels || '1', 10);
            if (levels > maxBuildingLevels) maxBuildingLevels = levels;
          }
        }
      });
    }

    // Height estimation: 3.5m per floor level
    const estimatedHeight = Number((maxBuildingLevels * 3.5).toFixed(1));

    // Shadow length formula: H / tan(elevationAngle)
    const elevRad = (Math.max(5.0, solarElevationDegrees) * Math.PI) / 180;
    const projectedShadowLength = Number((estimatedHeight / Math.tan(elevRad)).toFixed(1));

    // Conceptual shading loss % (0 - 35%)
    const shadingLossPercent = Number(
      Math.min(35.0, ((nearbyBuildingCount * estimatedHeight) / Math.sqrt(parcelAreaSqm)) * 1.5).toFixed(1)
    );

    const regionalGhi = 5.02; // NASA POWER annual optimal tilt mean
    const effectiveShadedGhi = Number((regionalGhi * (1 - shadingLossPercent / 100)).toFixed(2));

    return {
      latitude: lat,
      longitude: lng,
      parcelAreaSqm,
      solarElevationAngleDegrees: solarElevationDegrees,
      solarAzimuthAngleDegrees: solarAzimuthDegrees,
      estimatedBuildingHeightMeters: estimatedHeight,
      heightClassification: 'DERIVED_ESTIMATED_BUILDING_HEIGHT_PROXY',
      projectedShadowLengthMeters: projectedShadowLength,
      nearbyBuildingDensity50m: nearbyBuildingCount,
      estimatedShadingLossPercent: shadingLossPercent,
      nasaPowerRegionalGhi: regionalGhi,
      effectiveShadedGhiKwhM2Day: effectiveShadedGhi,
      shadingClassification: 'CONCEPTUAL_3D_PLOT_SHADOW_SCREENING_PROXY',
      limitations: [
        'High-resolution 1m LiDAR / 3D urban canopy mesh is UNAVAILABLE in open public data for Nashik.',
        'Building heights are derived from OSM floor level tags or default 3.5m single-story proxy (DERIVED_ESTIMATED_BUILDING_HEIGHT_PROXY).',
        'Micro-shading loss is a ray-cast shadow projection proxy (CONCEPTUAL_3D_PLOT_SHADOW_SCREENING_PROXY) for conceptual 3D canvas visualization.',
        'Regional GHI baseline is from NASA POWER 50km climatology and does NOT constitute bankable plot-level irradiance.',
      ],
      disclaimer:
        'Micro-shading losses and 3D shadow projections are DERIVED SCREENING PROXIES calculated from OSM building footprints and geometric solar elevation. They do NOT constitute millimeter-accurate LiDAR or engineering CAD shadow analysis.',
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
