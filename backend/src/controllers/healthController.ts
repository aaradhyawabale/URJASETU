import { Request, Response } from 'express';
import { getDbStatus } from '../config/db.js';
import { STUDY_AREA } from '../config/studyArea.js';
import { TownModel } from '../models/Town.js';
import { SiteModel } from '../models/Site.js';
import { PUNE_SEED_SITES } from '../seed/seedData.js';

export const getHealth = async (_req: Request, res: Response) => {
  const dbInfo = getDbStatus();
  const isDb = dbInfo.connected;

  let townCount = 1;
  let siteCount = PUNE_SEED_SITES.length;

  if (isDb) {
    try {
      townCount = await TownModel.countDocuments();
      siteCount = await SiteModel.countDocuments();
    } catch {
      // ignore
    }
  }

  res.status(200).json({
    status: 'ok',
    service: 'urjasetu-api',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    demoCity: STUDY_AREA.fullCityName,
    dataMode: isDb ? 'db' : 'in-memory-seed',
    storeCounts: {
      towns: townCount,
      sites: siteCount,
    },
    activeTown: {
      name: STUDY_AREA.cityName,
      authority: STUDY_AREA.authority,
      state: STUDY_AREA.stateName,
      country: STUDY_AREA.countryName,
      ulbCode: STUDY_AREA.ulbCode,
      center: [STUDY_AREA.centerLat, STUDY_AREA.centerLon],
      bounds: STUDY_AREA.bounds,
    },
    database: dbInfo.state,
    databaseConnected: dbInfo.connected,
    ...(dbInfo.host ? { databaseHost: dbInfo.host } : {}),
  });
};
