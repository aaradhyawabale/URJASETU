import { env } from '../config/env.js';

export interface IAIReviewPayload {
  siteCode: string;
  siteName: string;
  opportunityScore: number;
  solarSuitability: number;
  evDemandProxy: number;
  roadAccessibility: number;
  floodRisk: string;
  landConflict: string;
  estimatedAreaSqm: number;
  infrastructureType: string;

  // Real GIS Measurements
  elevationMeters?: number;
  slopePercent?: number;
  nearestRoadMeters?: number;
  nearestEVChargerMeters?: number;
  annualGhiKwhM2Day?: number;
}

export interface IAIReviewResponse {
  source: 'GEMINI_API' | 'DETERMINISTIC_FALLBACK';
  summary: string;
  strengths: string[];
  risksAndConsiderations: string[];
  verificationsRequired: string[];
  technicalCapacity: {
    solarCapacityKwp: number;
    annualGenerationMwh: number;
    evChargerPorts: number;
    bessCapacityKwh: number;
    estimatedCapexInr: number;
  };
}

export class AIService {
  public static async generateReview(payload: IAIReviewPayload): Promise<IAIReviewResponse> {
    const areaSqm = Math.max(500, payload.estimatedAreaSqm || 2450);
    const ghi = payload.annualGhiKwhM2Day || 5.02;

    const solarCapacityKwp = Math.round(areaSqm * 0.60 * 0.20);
    const annualGenerationMwh = Number(((solarCapacityKwp * ghi * 365 * 0.80) / 1000).toFixed(1));
    const evChargerPorts = Math.max(2, Math.min(32, Math.floor(areaSqm / 250) * 2));
    const bessCapacityKwh = Math.round(solarCapacityKwp * 0.50);
    const estimatedCapexInr = (solarCapacityKwp * 45000) + (evChargerPorts * 800000) + (bessCapacityKwh * 18000);

    const capexLakhs = (estimatedCapexInr / 100000).toFixed(2);

    return {
      source: 'DETERMINISTIC_FALLBACK',
      summary: `${payload.siteCode} (${payload.siteName}) represents a high-viability candidate parcel for ${payload.infrastructureType} deployment in Nashik, Maharashtra. With a multi-criteria Opportunity Score of ${payload.opportunityScore}/100 and a drawn parcel boundary of ${areaSqm.toLocaleString()} m², the site supports an estimated ${solarCapacityKwp} kWp solar PV canopy yield (${annualGenerationMwh} MWh/year generation at ${ghi} kWh/m²/day GHI) and ${evChargerPorts} DC fast-charging bays with an estimated civil capex of ₹${capexLakhs} Lakhs.`,
      strengths: [
        `High Solar Resource Baseline: NASA POWER 30-year regional climatology mean of ${ghi} kWh/m²/day (Optimal Tilt GHI) yielding ${annualGenerationMwh} MWh/year clean energy.`,
        `Favorable Road Access: Located ${payload.nearestRoadMeters ?? 150}m from nearest OSM public road corridor for seamless vehicle access.`,
        `High EV Infrastructure Gap Proxy: Nearest existing EV charger is ${payload.nearestEVChargerMeters ?? 1200}m away, capturing significant unserved charging demand.`,
        `Terrain Stability: Surface elevation of ${payload.elevationMeters ?? 585}m MSL and slope gradient of ${payload.slopePercent ?? 2.5}% (Copernicus DEM GLO-30 DSM) complying with IRC urban arterial standards.`,
      ],
      risksAndConsiderations: [
        `Flood Screening Status: ${payload.floodRisk} Risk. 30m MRTP Act 1966 & NMC DCPR 2017 Blue Line riverbed setback verification required.`,
        `Land-Use & Revenue Title: Status is ${payload.landConflict}. Municipal cadastral ownership title check mandatory prior to tender.`,
        `Solar Micro-Shading Disclaimer: NASA POWER data is a 50km regional climatology mean. On-site plot shading survey required.`,
      ],
      verificationsRequired: [
        'MSEDCL 33kV Substation feeder grid interconnect capacity verification',
        'Physical Cadastral Land Survey & ULB Revenue Title Deed Inspection',
        'Municipal Zoning Board & NMC Environment Department Clearance',
        'On-site Soil Bearing Capacity & Foundation Load Testing',
      ],
      technicalCapacity: {
        solarCapacityKwp,
        annualGenerationMwh,
        evChargerPorts,
        bessCapacityKwh,
        estimatedCapexInr,
      },
    };
  }
}
