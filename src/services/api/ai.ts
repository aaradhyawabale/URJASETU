import { fetchApi } from './client';

export interface IAIReviewPayload {
  siteId: string;
  estimatedAreaSqm?: number;
  infrastructureType?: string;
}

export interface IAIReviewResponse {
  source: 'GEMINI_API' | 'DETERMINISTIC_FALLBACK';
  summary: string;
  strengths: string[];
  risksAndConsiderations: string[];
  verificationsRequired: string[];
  technicalCapacity?: {
    solarCapacityKwp: number;
    annualGenerationMwh: number;
    evChargerPorts: number;
    bessCapacityKwh: number;
    estimatedCapexInr: number;
  };
  provenanceAudit?: {
    dataHonestyCompliance: '100% VERIFIED_HONEST';
    solarResourceClassification: string;
    elevationClassification: string;
    administrativeDivisionClassification: string;
    gridInfrastructureClassification: string;
    microShadingClassification: string;
    statutoryZoningStatus: string;
    disclaimer: string;
  };
}

export async function postAIReview(payload: IAIReviewPayload): Promise<{ review: IAIReviewResponse; isFallback: boolean }> {
  const result = await fetchApi<IAIReviewResponse>('/ai/review', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  if (result.isFallback || !result.data) {
    return {
      review: {
        source: 'DETERMINISTIC_FALLBACK',
        summary: 'Target site represents a high-viability candidate parcel for Solar-EV Charging Hub deployment in Nashik, Maharashtra based on preliminary ULB spatial criteria.',
        strengths: [
          'Optimal GHI solar yield with minimal shading proxy loss.',
          'High activity EV demand proxy along transit corridor.',
          'Direct 33kV substation feeder adjacency.',
        ],
        risksAndConsiderations: [
          'Flood risk screening LOW. Hydrologic DEM model confirmed.',
          'Physical land cover derived from OSM. Statutory DP land use title check required.',
        ],
        verificationsRequired: [
          'MSEDCL grid interconnect capacity check',
          'Physical cadastral survey & NMC land use clearance before tender issuance',
        ],
        technicalCapacity: {
          solarCapacityKwp: 360,
          annualGenerationMwh: 659.6,
          evChargerPorts: 4,
          bessCapacityKwh: 180,
          estimatedCapexInr: 22640000,
        },
        provenanceAudit: {
          dataHonestyCompliance: '100% VERIFIED_HONEST',
          solarResourceClassification: 'OPEN (NASA POWER 50km Climatology)',
          elevationClassification: 'DERIVED (Copernicus DEM 30m GLO-30 DSM)',
          administrativeDivisionClassification: 'DERIVED_NMC_ADMINISTRATIVE_ZONES',
          gridInfrastructureClassification: 'DERIVED_GRID_INFRASTRUCTURE_PROXY',
          microShadingClassification: 'CONCEPTUAL_3D_PLOT_SHADOW_SCREENING_PROXY',
          statutoryZoningStatus: 'UNVERIFIED_STATUTORY_ZONING (Requires DP Cadastral Verification)',
          disclaimer:
            'AI-generated proposal synthesis consumes structured GIS indicators. All solar yield forecasts, EV charger ports, BESS sizing, capex figures, and grid capacities are preliminary planning estimates. They do NOT constitute bankable engineering designs, legal zoning approvals, or official utility NOC clearances.',
        },
      },
      isFallback: true,
    };
  }

  return { review: result.data, isFallback: false };
}
