import { IProposal, NASHIK_SEED_PROPOSALS } from '../seed/seedData.js';

let proposalsStore: IProposal[] = [...NASHIK_SEED_PROPOSALS];

export class ProposalService {
  public static getAllProposals(): IProposal[] {
    return proposalsStore;
  }

  public static getProposalById(id: string): IProposal | undefined {
    return proposalsStore.find((p) => p.id === id);
  }

  public static createProposal(data: Partial<IProposal>): IProposal {
    const newProposal: IProposal = {
      id: `prop-${Date.now()}`,
      title: data.title || 'Untitled Solar-EV Proposal',
      siteId: data.siteId || 'nashik-site-01',
      siteCode: data.siteCode || 'NASHIK-SITE-01',
      cityName: data.cityName || 'Nashik Municipal Corporation',
      opportunityScore: data.opportunityScore || 80,
      estimatedAreaSqm: data.estimatedAreaSqm || 2450,
      infrastructureType: data.infrastructureType || 'SOLAR_EV_CHARGING_HUB',
      status: 'READY_FOR_REVIEW',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      aiSummary: data.aiSummary || 'Generated municipal siting proposal.',
      author: data.author || 'ULB Planning Cell',
    };

    proposalsStore.unshift(newProposal);
    return newProposal;
  }

  public static updateProposal(id: string, updates: Partial<IProposal>): IProposal | undefined {
    const index = proposalsStore.findIndex((p) => p.id === id);
    if (index === -1) return undefined;

    proposalsStore[index] = {
      ...proposalsStore[index],
      ...updates,
      updatedAt: new Date().toISOString().split('T')[0],
    };

    return proposalsStore[index];
  }

  public static deleteProposal(id: string): boolean {
    const initialLength = proposalsStore.length;
    proposalsStore = proposalsStore.filter((p) => p.id !== id);
    return proposalsStore.length < initialLength;
  }
}
