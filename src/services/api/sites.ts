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
        solarSuitabilityScore: site.metrics.solarSuitability,
        evDemandProxyScore: site.metrics.evDemandProxy,
        roadAccessibilityScore: site.metrics.roadAccessibility,
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
        overallRiskLevel: site.metrics.floodRisk === 'HIGH' ? 'HIGH' : site.metrics.floodRisk === 'MEDIUM' ? 'MODERATE' : 'LOW',
        floodScreening: `Flood risk screening status: ${site.metrics.floodRisk}`,
        landConflictScreening: `Land conflict status: ${site.metrics.landConflict}`,
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
