import { fetchApi } from './client';
import { Proposal } from '../../types/site';
import { NASHIK_DEMO_PROPOSALS } from '../../data/nashikDemoData';

export async function getProposals(): Promise<{ proposals: Proposal[]; isFallback: boolean }> {
  const result = await fetchApi<Proposal[]>('/proposals');
  if (result.isFallback || !result.data) {
    return { proposals: NASHIK_DEMO_PROPOSALS, isFallback: true };
  }
  return { proposals: result.data, isFallback: false };
}
