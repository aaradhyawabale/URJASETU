import { isDbConnected } from '../config/db.js';
import { TownModel } from '../models/Town.js';
import { SiteModel } from '../models/Site.js';
import { ProposalModel } from '../models/Proposal.js';
import { NASHIK_SEED_SITES, NASHIK_SEED_PROPOSALS } from './seedData.js';

export const seedDatabase = async (): Promise<void> => {
  if (!isDbConnected()) {
    console.log('[Seed] Database not connected. Active fallback will serve in-memory seed data.');
    return;
  }

  try {
    // 1. Seed Town (Nashik)
    await TownModel.findOneAndUpdate(
      { name: 'Nashik', state: 'Maharashtra' },
      {
        name: 'Nashik',
        state: 'Maharashtra',
        country: 'India',
        centerLat: 19.9975,
        centerLon: 73.7898,
        bounds: {
          type: 'Polygon',
          coordinates: [
            [
              [73.70, 19.90],
              [73.85, 19.90],
              [73.85, 20.05],
              [73.70, 20.05],
              [73.70, 19.90],
            ],
          ],
        },
      },
      { upsert: true, new: true }
    );

    // 2. Seed Candidate Sites
    for (const site of NASHIK_SEED_SITES) {
      await SiteModel.findOneAndUpdate(
        { id: site.id },
        site,
        { upsert: true, new: true }
      );
    }

    // 3. Seed Proposals
    for (const proposal of NASHIK_SEED_PROPOSALS) {
      await ProposalModel.findOneAndUpdate(
        { id: proposal.id },
        proposal,
        { upsert: true, new: true }
      );
    }

    console.log('[Seed] Database populated/synchronized with Nashik master datasets successfully.');
  } catch (error) {
    console.error('[Seed] Error seeding database:', (error as Error).message);
  }
};
