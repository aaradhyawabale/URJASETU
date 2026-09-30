import { isDbConnected } from '../config/db.js';
import { TownModel } from '../models/Town.js';
import { SiteModel } from '../models/Site.js';
import { ProposalModel } from '../models/Proposal.js';
import { PUNE_SEED_SITES, PUNE_SEED_PROPOSALS } from './seedData.js';
import { STUDY_AREA } from '../config/studyArea.js';

export const seedDatabase = async (): Promise<void> => {
  if (!isDbConnected()) {
    console.log(`[Seed] Database not connected. Active fallback will serve in-memory seed data for ${STUDY_AREA.cityName}.`);
    return;
  }

  try {
    // Audit for any non-Pune Town documents in DB
    const nonPuneTowns = await TownModel.find({ name: { $ne: STUDY_AREA.cityName } }).lean();
    if (nonPuneTowns && nonPuneTowns.length > 0) {
      console.warn(`[Seed Warning] Found ${nonPuneTowns.length} non-${STUDY_AREA.cityName} town record(s) in DB (${nonPuneTowns.map((t) => t.name).join(', ')}). Run scripts/report-stale-towns.ts to inspect.`);
    }

    // 1. Explicitly Seed/Update Town by name 'Pune'
    await TownModel.findOneAndUpdate(
      { name: STUDY_AREA.cityName, state: STUDY_AREA.stateName },
      {
        name: STUDY_AREA.cityName,
        state: STUDY_AREA.stateName,
        country: STUDY_AREA.countryName,
        centerLat: STUDY_AREA.centerLat,
        centerLon: STUDY_AREA.centerLon,
        bounds: {
          type: 'Polygon',
          coordinates: [
            [
              [STUDY_AREA.bounds.minLng, STUDY_AREA.bounds.minLat],
              [STUDY_AREA.bounds.maxLng, STUDY_AREA.bounds.minLat],
              [STUDY_AREA.bounds.maxLng, STUDY_AREA.bounds.maxLat],
              [STUDY_AREA.bounds.minLng, STUDY_AREA.bounds.maxLat],
              [STUDY_AREA.bounds.minLng, STUDY_AREA.bounds.minLat],
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

    console.log(`[Seed] Database synchronized with ${STUDY_AREA.cityName} master datasets successfully.`);
  } catch (error) {
    console.error('[Seed] Error seeding database:', (error as Error).message);
  }
};
