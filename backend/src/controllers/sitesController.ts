import { Request, Response } from 'express';
import { NASHIK_SEED_SITES } from '../seed/seedData.js';
import { ScoringService } from '../services/scoringService.js';
import { RiskService } from '../services/riskService.js';

export const getAllSites = (req: Request, res: Response) => {
  const { status, town } = req.query;
  let sites = [...NASHIK_SEED_SITES];

  if (status) {
    sites = sites.filter((s) => s.status.toLowerCase() === (status as string).toLowerCase());
  }

  res.status(200).json({
    success: true,
    count: sites.length,
    data: sites,
  });
};

export const getRankedSites = (_req: Request, res: Response) => {
  const ranked = [...NASHIK_SEED_SITES].sort((a, b) => b.opportunityScore - a.opportunityScore);
  res.status(200).json({
    success: true,
    count: ranked.length,
    data: ranked,
  });
};

export const getSiteById = (req: Request, res: Response) => {
  const { siteId } = req.params;
  const site = NASHIK_SEED_SITES.find((s) => s.id === siteId || s.code === siteId);

  if (!site) {
    return res.status(404).json({
      success: false,
      error: { code: 'SITE_NOT_FOUND', message: `Site '${siteId}' not found.` },
    });
  }

  return res.status(200).json({
    success: true,
    data: site,
  });
};

export const getSiteScores = (req: Request, res: Response) => {
  const { siteId } = req.params;
  const site = NASHIK_SEED_SITES.find((s) => s.id === siteId || s.code === siteId);

  if (!site) {
    return res.status(404).json({
      success: false,
      error: { code: 'SITE_NOT_FOUND', message: `Site '${siteId}' not found.` },
    });
  }

  const breakdown = ScoringService.calculateScore(site.metrics);
  return res.status(200).json({
    success: true,
    data: {
      siteId: site.id,
      siteCode: site.code,
      ...breakdown,
    },
  });
};

export const getSiteRisk = (req: Request, res: Response) => {
  const { siteId } = req.params;
  const site = NASHIK_SEED_SITES.find((s) => s.id === siteId || s.code === siteId);

  if (!site) {
    return res.status(404).json({
      success: false,
      error: { code: 'SITE_NOT_FOUND', message: `Site '${siteId}' not found.` },
    });
  }

  const riskAssessment = RiskService.evaluateRisk(site.metrics);
  return res.status(200).json({
    success: true,
    data: {
      siteId: site.id,
      siteCode: site.code,
      ...riskAssessment,
    },
  });
};
