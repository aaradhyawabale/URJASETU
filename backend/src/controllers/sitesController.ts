import { Request, Response } from 'express';
import { NASHIK_SEED_SITES, ISite } from '../seed/seedData.js';
import { isDbConnected } from '../config/db.js';
import { SiteModel } from '../models/Site.js';
import { ScoringService } from '../services/scoringService.js';
import { RiskService } from '../services/riskService.js';

const fetchAllSites = async (): Promise<ISite[]> => {
  if (isDbConnected()) {
    try {
      const dbSites = await SiteModel.find().lean();
      if (dbSites && dbSites.length > 0) {
        return dbSites.map((s) => ({
          id: s.id,
          code: s.code,
          name: s.name,
          cityName: s.cityName,
          wardName: s.wardName,
          zoneName: s.zoneName,
          opportunityScore: s.opportunityScore,
          status: s.status as ISite['status'],
          latitude: s.latitude,
          longitude: s.longitude,
          areaSqm: s.areaSqm,
          metrics: s.metrics,
          description: s.description || '',
          address: s.address || '',
          tags: s.tags || [],
        }));
      }
    } catch (err) {
      console.warn('[sitesController] DB query failed, falling back to seed sites:', (err as Error).message);
    }
  }
  return NASHIK_SEED_SITES;
};

const fetchSiteById = async (siteId: string): Promise<ISite | undefined> => {
  const sites = await fetchAllSites();
  return sites.find((s) => s.id === siteId || s.code === siteId);
};

export const getAllSites = async (req: Request, res: Response) => {
  const { status } = req.query;
  let sites = await fetchAllSites();

  if (status) {
    sites = sites.filter((s) => s.status.toLowerCase() === (status as string).toLowerCase());
  }

  res.status(200).json({
    success: true,
    count: sites.length,
    data: sites,
  });
};

export const getRankedSites = async (_req: Request, res: Response) => {
  const sites = await fetchAllSites();
  const ranked = [...sites].sort((a, b) => b.opportunityScore - a.opportunityScore);
  res.status(200).json({
    success: true,
    count: ranked.length,
    data: ranked,
  });
};

export const getSiteById = async (req: Request, res: Response) => {
  const { siteId } = req.params;
  const site = await fetchSiteById(siteId);

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

export const getSiteScores = async (req: Request, res: Response) => {
  const { siteId } = req.params;
  const site = await fetchSiteById(siteId);

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

export const getSiteRisk = async (req: Request, res: Response) => {
  const { siteId } = req.params;
  const site = await fetchSiteById(siteId);

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
