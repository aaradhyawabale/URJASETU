import { Router } from 'express';
import {
  getAllSites,
  getRankedSites,
  getSiteById,
  getSiteScores,
  getSiteRisk,
} from '../controllers/sitesController.js';

export const sitesRouter = Router();

sitesRouter.get('/sites', getAllSites);
sitesRouter.get('/sites/ranked', getRankedSites);
sitesRouter.get('/sites/:siteId', getSiteById);
sitesRouter.get('/sites/:siteId/scores', getSiteScores);
sitesRouter.get('/sites/:siteId/risk', getSiteRisk);
