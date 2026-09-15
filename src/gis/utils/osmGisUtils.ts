import { FeatureCollection, Point, LineString, Polygon } from 'geojson';
import * as turf from '@turf/turf';

/**
 * Calculates distance in meters from a given coordinate to the nearest road in an OSM roads collection.
 */
export function getDistanceToNearestRoad(
  lat: number,
  lng: number,
  roadsGeoJson: FeatureCollection<LineString>
): { distanceMeters: number; roadName?: string } {
  if (!roadsGeoJson || !roadsGeoJson.features || roadsGeoJson.features.length === 0) {
    return { distanceMeters: -1 };
  }

  const pt = turf.point([lng, lat]);
  let minDistanceMeters = Infinity;
  let nearestRoadName = 'Unassigned Road';

  roadsGeoJson.features.forEach((road) => {
    if (road.geometry && road.geometry.type === 'LineString') {
      const distanceKm = turf.pointToLineDistance(pt, road, { units: 'kilometers' });
      const distanceM = distanceKm * 1000;
      if (distanceM < minDistanceMeters) {
        minDistanceMeters = distanceM;
        nearestRoadName = road.properties?.name || road.properties?.ref || 'Unassigned Road';
      }
    }
  });

  return {
    distanceMeters: Math.round(minDistanceMeters),
    roadName: nearestRoadName,
  };
}

/**
 * Finds the nearest existing EV charging station to a target coordinate.
 */
export function getNearestEVCharger(
  lat: number,
  lng: number,
  evGeoJson: FeatureCollection<Point>
): { distanceMeters: number; name?: string; operator?: string } {
  if (!evGeoJson || !evGeoJson.features || evGeoJson.features.length === 0) {
    return { distanceMeters: -1 };
  }

  const pt = turf.point([lng, lat]);
  let minDistanceMeters = Infinity;
  let nearestName = 'EV Charger';
  let nearestOperator = 'Not available';

  evGeoJson.features.forEach((charger) => {
    if (charger.geometry && charger.geometry.type === 'Point') {
      const distanceKm = turf.distance(pt, charger, { units: 'kilometers' });
      const distanceM = distanceKm * 1000;
      if (distanceM < minDistanceMeters) {
        minDistanceMeters = distanceM;
        nearestName = charger.properties?.name || 'EV Charger';
        nearestOperator = charger.properties?.operator || 'Not available';
      }
    }
  });

  return {
    distanceMeters: Math.round(minDistanceMeters),
    name: nearestName,
    operator: nearestOperator,
  };
}

/**
 * Counts commercial and amenity POIs within a specified radius in meters.
 */
export function getNearbyPOICount(
  lat: number,
  lng: number,
  radiusMeters: number,
  poisGeoJson: FeatureCollection<Point>
): number {
  if (!poisGeoJson || !poisGeoJson.features || poisGeoJson.features.length === 0) {
    return 0;
  }

  const pt = turf.point([lng, lat]);
  const radiusKm = radiusMeters / 1000;
  let count = 0;

  poisGeoJson.features.forEach((poi) => {
    if (poi.geometry && poi.geometry.type === 'Point') {
      const distanceKm = turf.distance(pt, poi, { units: 'kilometers' });
      if (distanceKm <= radiusKm) {
        count++;
      }
    }
  });

  return count;
}

/**
 * Calculates spatial density (POIs per sq. km) around a given point.
 */
export function getPOIDensity(
  lat: number,
  lng: number,
  radiusMeters: number,
  poisGeoJson: FeatureCollection<Point>
): number {
  const count = getNearbyPOICount(lat, lng, radiusMeters, poisGeoJson);
  const areaSqKm = Math.PI * Math.pow(radiusMeters / 1000, 2);
  return Number((count / areaSqKm).toFixed(2));
}
