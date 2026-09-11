import { IProposal, NASHIK_SEED_PROPOSALS } from '../seed/seedData.js';
import { isDbConnected } from '../config/db.js';
import { ProposalModel } from '../models/Proposal.js';

let inMemoryProposalsStore: IProposal[] = [...NASHIK_SEED_PROPOSALS];

export class ProposalService {
  public static async getAllProposals(): Promise<IProposal[]> {
    if (isDbConnected()) {
      try {
        const proposals = await ProposalModel.find().lean();
        return proposals.map((p) => ({
          id: p.id,
          title: p.title,
          siteId: p.siteId,
          siteCode: p.siteCode,
          cityName: p.cityName,
          opportunityScore: p.opportunityScore,
          estimatedAreaSqm: p.estimatedAreaSqm,
          infrastructureType: p.infrastructureType,
          status: p.status as IProposal['status'],
          createdAt: p.createdAt,
          updatedAt: p.updatedAt,
          aiSummary: p.aiSummary,
          author: p.author,
          ...(p.plotGeometry ? { plotGeometry: p.plotGeometry } : {}),
        }));
      } catch (err) {
        console.warn('[ProposalService] DB query failed, using in-memory fallback store:', (err as Error).message);
      }
    }
    return inMemoryProposalsStore;
  }

  public static async getProposalById(id: string): Promise<IProposal | undefined> {
    if (isDbConnected()) {
      try {
        const proposal = await ProposalModel.findOne({ id }).lean();
        if (proposal) {
          return {
            id: proposal.id,
            title: proposal.title,
            siteId: proposal.siteId,
            siteCode: proposal.siteCode,
            cityName: proposal.cityName,
            opportunityScore: proposal.opportunityScore,
            estimatedAreaSqm: proposal.estimatedAreaSqm,
            infrastructureType: proposal.infrastructureType,
            status: proposal.status as IProposal['status'],
            createdAt: proposal.createdAt,
            updatedAt: proposal.updatedAt,
            aiSummary: proposal.aiSummary,
            author: proposal.author,
            ...(proposal.plotGeometry ? { plotGeometry: proposal.plotGeometry } : {}),
          };
        }
      } catch (err) {
        console.warn('[ProposalService] DB query failed, using in-memory fallback:', (err as Error).message);
      }
    }
    return inMemoryProposalsStore.find((p) => p.id === id);
  }

  public static async createProposal(data: Partial<IProposal> & { plotGeometry?: any }): Promise<IProposal> {
    const today = new Date().toISOString().split('T')[0];
    const newProposal: IProposal & { plotGeometry?: any } = {
      id: `prop-${Date.now()}`,
      title: data.title || 'Untitled Solar-EV Proposal',
      siteId: data.siteId || 'nashik-site-01',
      siteCode: data.siteCode || 'NASHIK-SITE-01',
      cityName: data.cityName || 'Nashik Municipal Corporation',
      opportunityScore: data.opportunityScore || 80,
      estimatedAreaSqm: data.estimatedAreaSqm || 2450,
      infrastructureType: data.infrastructureType || 'SOLAR_EV_CHARGING_HUB',
      status: (data.status as IProposal['status']) || 'READY_FOR_REVIEW',
      createdAt: today,
      updatedAt: today,
      aiSummary: data.aiSummary || 'Generated municipal siting proposal for Nashik.',
      author: data.author || 'ULB Planning Cell',
      ...(data.plotGeometry ? { plotGeometry: data.plotGeometry } : {}),
    };

    if (isDbConnected()) {
      try {
        await ProposalModel.create(newProposal);
      } catch (err) {
        console.warn('[ProposalService] Failed to persist proposal to DB, saved to in-memory store:', (err as Error).message);
      }
    }

    inMemoryProposalsStore.unshift(newProposal);
    return newProposal;
  }

  public static async updateProposal(id: string, updates: Partial<IProposal>): Promise<IProposal | undefined> {
    const today = new Date().toISOString().split('T')[0];

    if (isDbConnected()) {
      try {
        const updated = await ProposalModel.findOneAndUpdate(
          { id },
          { ...updates, updatedAt: today },
          { new: true }
        ).lean();

        if (updated) {
          // Also update in-memory cache
          const index = inMemoryProposalsStore.findIndex((p) => p.id === id);
          const mapped: IProposal = {
            id: updated.id,
            title: updated.title,
            siteId: updated.siteId,
            siteCode: updated.siteCode,
            cityName: updated.cityName,
            opportunityScore: updated.opportunityScore,
            estimatedAreaSqm: updated.estimatedAreaSqm,
            infrastructureType: updated.infrastructureType,
            status: updated.status as IProposal['status'],
            createdAt: updated.createdAt,
            updatedAt: updated.updatedAt,
            aiSummary: updated.aiSummary,
            author: updated.author,
          };
          if (index !== -1) {
            inMemoryProposalsStore[index] = mapped;
          } else {
            inMemoryProposalsStore.unshift(mapped);
          }
          return mapped;
        }
      } catch (err) {
        console.warn('[ProposalService] Failed to update proposal in DB:', (err as Error).message);
      }
    }

    const index = inMemoryProposalsStore.findIndex((p) => p.id === id);
    if (index === -1) return undefined;

    inMemoryProposalsStore[index] = {
      ...inMemoryProposalsStore[index],
      ...updates,
      updatedAt: today,
    };

    return inMemoryProposalsStore[index];
  }

  public static async deleteProposal(id: string): Promise<boolean> {
    let dbSuccess = false;
    if (isDbConnected()) {
      try {
        const result = await ProposalModel.deleteOne({ id });
        dbSuccess = result.deletedCount > 0;
      } catch (err) {
        console.warn('[ProposalService] Failed to delete proposal from DB:', (err as Error).message);
      }
    }

    const initialLength = inMemoryProposalsStore.length;
    inMemoryProposalsStore = inMemoryProposalsStore.filter((p) => p.id !== id);
    const memSuccess = inMemoryProposalsStore.length < initialLength;

    return dbSuccess || memSuccess;
  }
}
