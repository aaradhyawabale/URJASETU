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

export async function getSiteById(siteId: string): Promise<{ site: CandidateSite; isFallback: boolean }> {
  const result = await fetchApi<CandidateSite>(`/sites/${siteId}`);
  if (result.isFallback || !result.data) {
    const fallbackSite = NASHIK_DEMO_SITES.find((s) => s.id === siteId || s.code === siteId) || NASHIK_DEMO_SITES[0];
    return { site: fallbackSite, isFallback: true };
  }
  return { site: result.data, isFallback: false };
}
