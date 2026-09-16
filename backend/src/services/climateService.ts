import fs from 'fs';
import path from 'path';

export interface ISolarClimatology {
  source: string;
  url: string;
  acquisitionDate: string;
  classification: 'OPEN';
  region: string;
  latitude: number;
  longitude: number;
  units: {
    ghi: string;
    temperature: string;
    precipitation: string;
  };
  metrics: {
    annualGhiHorizontal: number; // kWh/m²/day
    annualGhiOptimalTilt: number; // kWh/m²/day
    optimalTiltAngleDegrees: number;
    clearnessIndexAnnual: number;
    annualMeanTemperatureCelsius: number;
    annualMeanPrecipitationMmPerDay: number;
    monthlyGhiHorizontal: Record<string, number>;
  };
}

// Authoritative NASA POWER Solar & Climate Dataset for Nashik (lat: 19.9975, lon: 73.7898)
const NASHIK_SOLAR_CLIMATOLOGY: ISolarClimatology = {
  source: 'NASA Prediction Of Worldwide Energy Resources (POWER) Project',
  url: 'https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=SI_EF_TILTED_SURFACE,ALLSKY_KT,T2M,PRECTOTCORR&community=RE&longitude=73.7898&latitude=19.9975&format=JSON',
  acquisitionDate: '2026-09-16',
  classification: 'OPEN',
  region: 'Nashik, Maharashtra, India',
  latitude: 19.9975,
  longitude: 73.7898,
  units: {
    ghi: 'kWh/m²/day',
    temperature: '°C',
    precipitation: 'mm/day',
  },
  metrics: {
    annualGhiHorizontal: 4.8,
    annualGhiOptimalTilt: 5.02,
    optimalTiltAngleDegrees: 20.0,
    clearnessIndexAnnual: 0.55,
    annualMeanTemperatureCelsius: 24.43,
    annualMeanPrecipitationMmPerDay: 4.49,
    monthlyGhiHorizontal: {
      JAN: 4.75,
      FEB: 5.54,
      MAR: 6.32,
      APR: 6.87,
      MAY: 6.87,
      JUN: 4.18,
      JUL: 2.59,
      AUG: 2.64,
      SEP: 3.76,
      OCT: 4.9,
      NOV: 4.72,
      DEC: 4.45,
    },
  },
};

export class ClimateService {
  public static async getNashikSolarClimatology(): Promise<ISolarClimatology> {
    // Attempt live fetch with 3s timeout, fall back to cached NASA dataset
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      const url = NASHIK_SOLAR_CLIMATOLOGY.url;
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = (await res.json()) as any;
        if (data && data.properties && data.properties.parameter) {
          const params = data.properties.parameter;
          const tilted = params.SI_EF_TILTED_SURFACE || {};
          const horiz = tilted.SI_TILTED_AVG_HORIZONTAL || {};
          const opt = tilted.SI_TILTED_AVG_OPTIMAL || {};

          return {
            source: 'NASA POWER Project (Live API)',
            url,
            acquisitionDate: new Date().toISOString().split('T')[0],
            classification: 'OPEN',
            region: 'Nashik, Maharashtra, India',
            latitude: 19.9975,
            longitude: 73.7898,
            units: {
              ghi: 'kWh/m²/day',
              temperature: '°C',
              precipitation: 'mm/day',
            },
            metrics: {
              annualGhiHorizontal: horiz.ANN || 4.8,
              annualGhiOptimalTilt: opt.ANN || 5.02,
              optimalTiltAngleDegrees: 20.0,
              clearnessIndexAnnual: params.ALLSKY_KT?.ANN || 0.55,
              annualMeanTemperatureCelsius: params.T2M?.ANN || 24.43,
              annualMeanPrecipitationMmPerDay: params.PRECTOTCORR?.ANN || 4.49,
              monthlyGhiHorizontal: {
                JAN: horiz.JAN || 4.75,
                FEB: horiz.FEB || 5.54,
                MAR: horiz.MAR || 6.32,
                APR: horiz.APR || 6.87,
                MAY: horiz.MAY || 6.87,
                JUN: horiz.JUN || 4.18,
                JUL: horiz.JUL || 2.59,
                AUG: horiz.AUG || 2.64,
                SEP: horiz.SEP || 3.76,
                OCT: horiz.OCT || 4.9,
                NOV: horiz.NOV || 4.72,
                DEC: horiz.DEC || 4.45,
              },
            },
          };
        }
      }
    } catch (err) {
      console.warn('[ClimateService] Live NASA API query timed out or failed. Using cached NASA POWER climatology:', (err as Error).message);
    }

    return NASHIK_SOLAR_CLIMATOLOGY;
  }
}
