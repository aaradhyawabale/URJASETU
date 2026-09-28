import { isDbConnected } from '../config/db.js';
import { TownModel } from '../models/Town.js';
import { SiteModel } from '../models/Site.js';
import { ProposalModel } from '../models/Proposal.js';
import { PUNE_SEED_SITES, PUNE_SEED_PROPOSALS } from './seedData.js';

export const seedDatabase = async (): Promise<void> => {
  if (!isDbConnected()) {
    console.log('[Seed] Database not connected. Active fallback will serve in-memory seed data.');
    return;
  }

  try {
    // 1. Seed Town (Pune)
    await TownModel.findOneAndUpdate(
      { name: 'Pune', state: 'Maharashtra' },
      {
        name: 'Pune',
        state: 'Maharashtra',
        country: 'India',
        centerLat: 18.5252,
        centerLon: 73.8850,
        bounds: {
          type: 'Polygon',
          coordinates: [
            [
              [73.74985, 18.42950],
              [74.02021, 18.42950],
              [74.02021, 18.62087],
              [73.74985, 18.62087],
              [73.74985, 18.42950],
            ],
          ],
        },
      },
      { upsert: true, new: true }
    );

    // 2. Seed Candidate Sites
    for (const site of PUNE_SEED_SITES) {
      await SiteModel.findOneAndUpdate(
        { id: site.id },
        site,
        { upsert: true, new: true }
      );
    }

    // 3. Seed Proposals
    for (const proposal of PUNE_SEED_PROPOSALS) {
      await ProposalModel.findOneAndUpdate(
        { id: proposal.id },
        proposal,
        { upsert: true, new: true }
      );
    }

    console.log('[Seed] Database populated/synchronized with Pune master datasets successfully.');
  } catch (error) {
    console.error('[Seed] Error seeding database:', (error as Error).message);
  }
};
