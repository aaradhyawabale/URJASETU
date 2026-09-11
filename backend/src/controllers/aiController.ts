import { Request, Response } from 'express';
import { AIService, IAIReviewPayload } from '../services/aiService.js';
import { NASHIK_SEED_SITES } from '../seed/seedData.js';

export const postAIReview = async (req: Request, res: Response) => {
  const { siteId } = req.body;
  const site = NASHIK_SEED_SITES.find((s) => s.id === siteId || s.code === siteId) || NASHIK_SEED_SITES[0];

  const payload: IAIReviewPayload = {
    siteCode: site.code,
    siteName: site.name,
    opportunityScore: site.opportunityScore,
    solarSuitability: site.metrics.solarSuitability,
    evDemandProxy: site.metrics.evDemandProxy,
    roadAccessibility: site.metrics.roadAccessibility,
    floodRisk: site.metrics.floodRisk,
    landConflict: site.metrics.landConflict,
    estimatedAreaSqm: req.body.estimatedAreaSqm || site.areaSqm,
    infrastructureType: req.body.infrastructureType || 'SOLAR_EV_CHARGING_HUB',
  };

  const review = await AIService.generateReview(payload);

  return res.status(200).json({
    success: true,
    data: review,
  });
};
