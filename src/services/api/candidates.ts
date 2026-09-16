import { fetchApi } from './client.js';

export interface IFactorDecomposition {
  factorId: string;
  name: string;
  rawMeasurement: number;
  inputUnit: string;
  normalizedScore: number;
  weightPercent: number;
  scoreContribution: number;
  classification: string;
  sourceCitation: string;
  rationale: string;
  limitation?: string;
}

export interface ICandidateSite {
  id: string;
  code: string;
  name: string;
  status: 'HIGH_SUITABILITY' | 'MODERATE_SUITABILITY' | 'LOW_SUITABILITY' | 'EXCLUDED';
  isRetained: boolean;
  exclusionReason: string | null;
  exclusionCode: 'EXCESSIVE_SLOPE' | 'RIVER_SETBACK_EXCLUSION' | 'BUILDING_FOOTPRINT_OVERLAP' | 'OUTSIDE_STUDY_AREA' | null;
  latitude: number;
  longitude: number;
  opportunityScore: number;
  elevationMeters: number;
  slopePercent: number;
  nearestRoadMeters: number;
  nearestEVChargerMeters: number;
  nearestParkingMeters: number;
  nearbyPoiCount500m: number;
  factors: Record<string, IFactorDecomposition>;
  provenance: {
    datasetName: string;
    solarSource: string;
    elevationSource: string;
    osmSource: string;
    generationMethod: string;
    candidateSpacing: string;
  };
  limitations: string[];
}

export async function fetchCandidates(options?: {
  spacing?: number;
  maxCount?: number;
  minScore?: number;
  includeExcluded?: boolean;
}): Promise<ICandidateSite[]> {
  const queryParams = new URLSearchParams();
  if (options?.spacing) queryParams.append('spacing', options.spacing.toString());
  if (options?.maxCount) queryParams.append('maxCount', options.maxCount.toString());
  if (options?.minScore) queryParams.append('minScore', options.minScore.toString());
  if (options?.includeExcluded !== undefined) queryParams.append('includeExcluded', options.includeExcluded.toString());

  const url = `/gis/candidates?${queryParams.toString()}`;
  const response = await fetchApi<ICandidateSite[]>(url);
  return response.data || [];
}

export async function fetchCandidateById(candidateId: string): Promise<ICandidateSite | null> {
  const response = await fetchApi<ICandidateSite>(`/gis/candidates/${candidateId}`);
  return response.data;
}
