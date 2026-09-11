import { NashikSpatialDataset } from '../types/gis';

export const NASHIK_GEOJSON_DATASET: NashikSpatialDataset = {
  candidateSites: {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [73.7898, 19.9975], // [lng, lat]
        },
        properties: {
          id: 'nashik-site-01',
          code: 'NASHIK-SITE-01',
          name: 'Govardhan Bus Depot Substation Parcel',
          opportunityScore: 84,
          status: 'RECOMMENDED',
          solarSuitability: 88,
          evDemandProxy: 82,
          roadAccessibility: 91,
          floodRisk: 'LOW',
          landConflict: 'NONE',
          areaSqm: 2450,
        },
      },
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [73.7421, 19.9882],
        },
        properties: {
          id: 'nashik-site-02',
          code: 'NASHIK-SITE-02',
          name: 'Satpur Industrial Area Cluster B',
          opportunityScore: 78,
          status: 'RECOMMENDED',
          solarSuitability: 85,
          evDemandProxy: 79,
          roadAccessibility: 86,
          floodRisk: 'LOW',
          landConflict: 'NONE',
          areaSqm: 3100,
        },
      },
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [73.7610, 19.9450],
        },
        properties: {
          id: 'nashik-site-03',
          code: 'NASHIK-SITE-03',
          name: 'Ambad Commercial Ring Junction',
          opportunityScore: 72,
          status: 'UNDER_REVIEW',
          solarSuitability: 76,
          evDemandProxy: 84,
          roadAccessibility: 89,
          floodRisk: 'MEDIUM',
          landConflict: 'MINOR',
          areaSqm: 1850,
        },
      },
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [73.7954, 20.0089],
        },
        properties: {
          id: 'nashik-site-04',
          code: 'NASHIK-SITE-04',
          name: 'Panchavati Municipal Market Buffer Plot',
          opportunityScore: 59,
          status: 'SCREENING',
          solarSuitability: 62,
          evDemandProxy: 88,
          roadAccessibility: 71,
          floodRisk: 'HIGH',
          landConflict: 'HIGH',
          areaSqm: 1200,
        },
      },
    ],
  },
  riverways: {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [
            [73.7200, 19.9900],
            [73.7500, 19.9950],
            [73.7800, 20.0020],
            [73.8100, 20.0080],
          ],
        },
        properties: {},
      },
    ],
  },
  roads: {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [
            [73.7400, 19.9800],
            [73.7898, 19.9975],
            [73.8200, 20.0100],
          ],
        },
        properties: { name: 'Trimbak Road Axis', type: 'arterial' },
      },
    ],
  },
  feeders: {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [
            [73.7800, 19.9900],
            [73.7898, 19.9975],
            [73.8000, 20.0050],
          ],
        },
        properties: { lineName: '33kV Govardhan Feeder', voltageKv: 33 },
      },
    ],
  },
  floodZones: {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [73.7900, 20.0050],
              [73.8000, 20.0050],
              [73.8000, 20.0120],
              [73.7900, 20.0120],
              [73.7900, 20.0050],
            ],
          ],
        },
        properties: { riskLevel: 'HIGH', zoneName: 'Panchavati Riparian Basin' },
      },
    ],
  },
};
