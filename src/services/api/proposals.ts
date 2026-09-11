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

export async function getProposalById(id: string): Promise<{ proposal: Proposal; isFallback: boolean }> {
  const result = await fetchApi<Proposal>(`/proposals/${id}`);
  if (result.isFallback || !result.data) {
    const fallback = NASHIK_DEMO_PROPOSALS.find((p) => p.id === id) || NASHIK_DEMO_PROPOSALS[0];
    return { proposal: fallback, isFallback: true };
  }
  return { proposal: result.data, isFallback: false };
}

export async function createProposal(payload: Partial<Proposal>): Promise<{ proposal: Proposal; isFallback: boolean }> {
  const result = await fetchApi<Proposal>('/proposals', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  if (result.isFallback || !result.data) {
    const mockCreated: Proposal = {
      id: `prop-${Date.now()}`,
      title: payload.title || 'Untitled Proposal',
      siteId: payload.siteId || 'nashik-site-01',
      siteCode: payload.siteCode || 'NASHIK-SITE-01',
      cityName: 'Nashik Municipal Corporation',
      opportunityScore: payload.opportunityScore || 84,
      estimatedAreaSqm: payload.estimatedAreaSqm || 2450,
      infrastructureType: payload.infrastructureType || 'SOLAR_EV_CHARGING_HUB',
      status: 'READY_FOR_REVIEW',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      aiSummary: payload.aiSummary || 'Generated proposal summary.',
      author: 'NMC Planning Cell',
    };
    return { proposal: mockCreated, isFallback: true };
  }

  return { proposal: result.data, isFallback: false };
}

export async function updateProposal(id: string, payload: Partial<Proposal>): Promise<{ proposal: Proposal; isFallback: boolean }> {
  const result = await fetchApi<Proposal>(`/proposals/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });

  if (result.isFallback || !result.data) {
    const fallback = NASHIK_DEMO_PROPOSALS.find((p) => p.id === id) || NASHIK_DEMO_PROPOSALS[0];
    const updated = { ...fallback, ...payload, updatedAt: new Date().toISOString().split('T')[0] };
    return { proposal: updated, isFallback: true };
  }

  return { proposal: result.data, isFallback: false };
}

export async function deleteProposal(id: string): Promise<{ success: boolean; isFallback: boolean }> {
  const result = await fetchApi<{ success: boolean }>(`/proposals/${id}`, {
    method: 'DELETE',
  });

  if (result.isFallback) {
    return { success: true, isFallback: true };
  }

  return { success: true, isFallback: false };
}
