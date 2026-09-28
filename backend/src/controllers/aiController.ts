import { Request, Response } from 'express';
import { AIService, IAIReviewPayload } from '../services/aiService.js';
import { PUNE_SEED_SITES } from '../seed/seedData.js';
import { GridService } from '../services/gridService.js';
import { WardService } from '../services/wardService.js';

export const postAIReview = async (req: Request, res: Response) => {
  const { siteId } = req.body;
  const site = PUNE_SEED_SITES.find((s) => s.id === siteId || s.code === siteId) || PUNE_SEED_SITES[0];

  const lat = site.latitude || 18.5252;
  const lng = site.longitude || 73.8850;

  const gridInfo = GridService.evaluateGridProximity(lat, lng);
  const wardInfo = WardService.getDivisionForCoordinate(lat, lng);

  const payload: IAIReviewPayload = {
    siteCode: site.code,
    siteName: site.name,
    opportunityScore: site.opportunityScore,
    solarSuitability: site.metrics?.solarSuitability || 84,
    evDemandProxy: site.metrics?.evDemandProxy || 72,
    roadAccessibility: site.metrics?.roadAccessibility || 90,
    floodRisk: site.metrics?.floodRisk || 'LOW',
    landConflict: site.metrics?.landConflict || 'NONE',
    estimatedAreaSqm: req.body.estimatedAreaSqm || site.areaSqm || 2450,
    infrastructureType: req.body.infrastructureType || 'SOLAR_EV_CHARGING_HUB',
    placedComponents: req.body.placedComponents || [],

    divisionName: wardInfo?.divisionName || 'Shivajinagar-Ghole Road Zone',
    elevationMeters: 560,
    slopePercent: 2.5,
    nearestRoadMeters: 150,
    nearestEVChargerMeters: 1200,
    nearestSubstationName: gridInfo.nearestSubstationName,
    nearestSubstationDistanceMeters: gridInfo.nearestSubstationDistanceMeters,
    annualGhiKwhM2Day: 5.12,
    estimatedShadingLossPercent: 0.2,
  };

  const review = await AIService.generateReview(payload);

  return res.status(200).json({
    success: true,
    data: review,
  });
};
