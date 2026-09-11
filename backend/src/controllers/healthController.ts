import { Request, Response } from 'express';
import { getDbStatus } from '../config/db.js';

export const getHealth = (_req: Request, res: Response) => {
  const dbInfo = getDbStatus();

  res.status(200).json({
    status: 'ok',
    service: 'urjasetu-api',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    demoCity: 'Nashik, Maharashtra, India',
    database: dbInfo.state,
    databaseConnected: dbInfo.connected,
    ...(dbInfo.host ? { databaseHost: dbInfo.host } : {}),
  });
};
