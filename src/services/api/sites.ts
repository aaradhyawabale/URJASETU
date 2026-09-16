import { fetchApi } from './client';
import { CandidateSite } from '../../types/site';
import { NASHIK_DEMO_SITES } from '../../data/nashikDemoData';

export async function getSites(): Promise<{ sites: CandidateSite[]; isFallback: boolean }> {
  const result = await fetchApi<CandidateSite[]>('/sites');
  if (result.isFallback || !result.data) {
    return { sites: NASHIK_DEMO_SITES, isFallback: true };
  }
  return { sites: result.data, isFallback: false };
}

export async function getRankedSites(): Promise<{ sites: CandidateSite[]; isFallback: boolean }> {
  const result = await fetchApi<CandidateSite[]>('/sites/ranked');
  if (result.isFallback || !result.data) {
    const ranked = [...NASHIK_DEMO_SITES].sort((a, b) => b.opportunityScore - a.opportunityScore);
    return { sites: ranked, isFallback: true };
  }
  return { sites: result.data, isFallback: false };
}

export async function getSiteById(siteId: string): Promise<{ site: CandidateSite; isFallback: boolean }> {
  const result = await fetchApi<CandidateSite>(`/sites/${siteId}`);
  if (result.isFallback || !result.data) {
    const fallbackSite = NASHIK_DEMO_SITES.find((s) => s.id === siteId || s.code === siteId) || NASHIK_DEMO_SITES[0];
    return { site: fallbackSite, isFallback: true };
  }
  return { site: result.data, isFallback: false };
}

export async function getSiteScores(siteId: string): Promise<{ scores: any; isFallback: boolean }> {
  const result = await fetchApi<any>(`/sites/${siteId}/scores`);
  if (result.isFallback || !result.data) {
    const site = NASHIK_DEMO_SITES.find((s) => s.id === siteId || s.code === siteId) || NASHIK_DEMO_SITES[0];
    return {
      scores: {
        siteId: site.id,
        opportunityScore: site.opportunityScore,
        solarSuitabilityScore: site.metrics?.solarSuitability ?? 84,
        evDemandProxyScore: site.metrics?.evDemandProxy ?? 72,
        roadAccessibilityScore: site.metrics?.roadAccessibility ?? 90,
        formula: '0.40 * Solar + 0.35 * EV_Demand + 0.25 * Road_Access - Risk_Penalty',
      },
      isFallback: true,
    };
  }
  return { scores: result.data, isFallback: false };
}

export async function getSiteRisk(siteId: string): Promise<{ risk: any; isFallback: boolean }> {
  const result = await fetchApi<any>(`/sites/${siteId}/risk`);
  if (result.isFallback || !result.data) {
    const site = NASHIK_DEMO_SITES.find((s) => s.id === siteId || s.code === siteId) || NASHIK_DEMO_SITES[0];
    return {
      risk: {
        siteId: site.id,
        overallRiskLevel: site.metrics?.floodRisk === 'HIGH' ? 'HIGH' : site.metrics?.floodRisk === 'MEDIUM' ? 'MODERATE' : 'LOW',
        floodScreening: `Flood risk screening status: ${site.metrics?.floodRisk || 'LOW'}`,
        landConflictScreening: `Land conflict status: ${site.metrics?.landConflict || 'NONE'}`,
        verificationsRequired: [
          'ULB Revenue & Cadastral land-use title verification required',
          'MSEDCL 33kV Substation feeder grid interconnect capacity check',
        ],
      },
      isFallback: true,
    };
  }
  return { risk: result.data, isFallback: false };
}

export interface IDivisionSummary {
  divisionId: string;
  divisionCode: string;
  divisionName: string;
  retainedCandidates: number;
  candidatesPerKm2: number;
  aggregateModeledSolarCapacityMwp: number;
  aggregateModeledEvChargerPorts: number;
  meanOpportunityScore: number;
  classification: string;
}

export async function getDivisionAggregations(): Promise<{ aggregations: IDivisionSummary[]; isFallback: boolean }> {
  const result = await fetchApi<IDivisionSummary[]>('/gis/wards/aggregation');
  if (result.isFallback || !result.data) {
    const seedAggregations: IDivisionSummary[] = [
      {
        divisionId: 'nmc_div_01',
        divisionCode: 'NMC-DIV-01',
        divisionName: 'Panchavati Division',
        retainedCandidates: 4,
        candidatesPerKm2: 0.07,
        aggregateModeledSolarCapacityMwp: 2.0,
        aggregateModeledEvChargerPorts: 16,
        meanOpportunityScore: 82,
        classification: 'DERIVED_NMC_ADMINISTRATIVE_ZONES',
      },
      {
        divisionId: 'nmc_div_02',
        divisionCode: 'NMC-DIV-02',
        divisionName: 'Nashik East Division',
        retainedCandidates: 3,
        candidatesPerKm2: 0.09,
        aggregateModeledSolarCapacityMwp: 1.5,
        aggregateModeledEvChargerPorts: 12,
        meanOpportunityScore: 79,
        classification: 'DERIVED_NMC_ADMINISTRATIVE_ZONES',
      },
      {
        divisionId: 'nmc_div_03',
        divisionCode: 'NMC-DIV-03',
        divisionName: 'Nashik West Division',
        retainedCandidates: 2,
        candidatesPerKm2: 0.13,
        aggregateModeledSolarCapacityMwp: 1.0,
        aggregateModeledEvChargerPorts: 8,
        meanOpportunityScore: 76,
        classification: 'DERIVED_NMC_ADMINISTRATIVE_ZONES',
      },
      {
        divisionId: 'nmc_div_04',
        divisionCode: 'NMC-DIV-04',
        divisionName: 'CIDCO Division',
        retainedCandidates: 5,
        candidatesPerKm2: 0.14,
        aggregateModeledSolarCapacityMwp: 2.5,
        aggregateModeledEvChargerPorts: 20,
        meanOpportunityScore: 85,
        classification: 'DERIVED_NMC_ADMINISTRATIVE_ZONES',
      },
      {
        divisionId: 'nmc_div_05',
        divisionCode: 'NMC-DIV-05',
        divisionName: 'Satpur Division',
        retainedCandidates: 6,
        candidatesPerKm2: 0.13,
        aggregateModeledSolarCapacityMwp: 3.0,
        aggregateModeledEvChargerPorts: 24,
        meanOpportunityScore: 81,
        classification: 'DERIVED_NMC_ADMINISTRATIVE_ZONES',
      },
      {
        divisionId: 'nmc_div_06',
        divisionCode: 'NMC-DIV-06',
        divisionName: 'Nashik Road Division',
        retainedCandidates: 3,
        candidatesPerKm2: 0.08,
        aggregateModeledSolarCapacityMwp: 1.5,
        aggregateModeledEvChargerPorts: 12,
        meanOpportunityScore: 74,
        classification: 'DERIVED_NMC_ADMINISTRATIVE_ZONES',
      },
    ];
    return { aggregations: seedAggregations, isFallback: true };
  }
  return { aggregations: result.data, isFallback: false };
}
