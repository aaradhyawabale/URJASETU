import { Request, Response } from 'express';
import { getDbStatus } from '../config/db.js';
import { CITY_CONFIG } from '../config/cityConfig.js';

export const getHealth = (_req: Request, res: Response) => {
  const dbInfo = getDbStatus();

  res.status(200).json({
    status: 'ok',
    service: 'urjasetu-api',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    demoCity: CITY_CONFIG.fullCityName,
    activeTown: {
      name: CITY_CONFIG.cityName,
      state: CITY_CONFIG.stateName,
      country: CITY_CONFIG.countryName,
      ulb: CITY_CONFIG.ulbName,
      ulbCode: CITY_CONFIG.ulbCode,
      center: [CITY_CONFIG.centerLat, CITY_CONFIG.centerLon],
      bounds: CITY_CONFIG.bounds,
    },
    database: dbInfo.state,
    databaseConnected: dbInfo.connected,
    ...(dbInfo.host ? { databaseHost: dbInfo.host } : {}),
  });
};
