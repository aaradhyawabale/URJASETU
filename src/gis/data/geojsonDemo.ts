import { PuneSpatialDataset } from '../types/gis';

export const PUNE_GEOJSON_DATASET: PuneSpatialDataset = {
  candidateSites: {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [73.8078, 18.5582], // [lng, lat]
        },
        properties: {
          id: 'pune-site-01',
          code: 'PUNE-SITE-01',
          name: 'Aundh ITI Road Substation Parcel',
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
          coordinates: [73.8512, 18.5304],
        },
        properties: {
          id: 'pune-site-02',
          code: 'PUNE-SITE-02',
          name: 'Shivajinagar Bus Hub Open Parcel',
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
          coordinates: [73.9521, 18.5512],
        },
        properties: {
          id: 'pune-site-03',
          code: 'PUNE-SITE-03',
          name: 'Kharadi EON IT Park Junction Parcel',
          opportunityScore: 88,
          status: 'RECOMMENDED',
          solarSuitability: 90,
          evDemandProxy: 92,
          roadAccessibility: 89,
          floodRisk: 'LOW',
          landConflict: 'NONE',
          areaSqm: 3600,
        },
      },
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [73.8182, 18.5074],
        },
        properties: {
          id: 'pune-site-04',
          code: 'PUNE-SITE-04',
          name: 'Kothrud Karve Road Commercial Buffer',
          opportunityScore: 59,
          status: 'SCREENING',
          solarSuitability: 62,
          evDemandProxy: 88,
          roadAccessibility: 71,
          floodRisk: 'MEDIUM',
          landConflict: 'HIGH',
          areaSqm: 1850,
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
            [73.8200, 18.5250],
            [73.8500, 18.5300],
            [73.8800, 18.5400],
            [73.9200, 18.5500],
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
            [73.8000, 18.5200],
            [73.8420, 18.5220],
            [73.8800, 18.5350],
          ],
        },
        properties: { name: 'FC Road / JM Road Axis', type: 'arterial' },
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
            [73.8400, 18.5250],
            [73.8512, 18.5304],
            [73.8600, 18.5380],
          ],
        },
        properties: { lineName: '33kV Shivajinagar Feeder', voltageKv: 33 },
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
              [73.8450, 18.5280],
              [73.8550, 18.5280],
              [73.8550, 18.5340],
              [73.8450, 18.5340],
              [73.8450, 18.5280],
            ],
          ],
        },
        properties: { riskLevel: 'HIGH', zoneName: 'Mula-Mutha Riparian Basin' },
      },
    ],
  },
};

export const NASHIK_GEOJSON_DATASET = PUNE_GEOJSON_DATASET;
