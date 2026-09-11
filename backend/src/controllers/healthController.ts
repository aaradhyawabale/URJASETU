import { Request, Response } from 'express';

export const getHealth = (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    service: 'urjasetu-api',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    demoCity: 'Nashik, Maharashtra, India',
  });
};
