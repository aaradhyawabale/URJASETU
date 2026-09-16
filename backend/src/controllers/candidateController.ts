import { Request, Response } from 'express';
import { CandidateService, ICandidateGenerationParams } from '../services/candidateService.js';
import { WardService } from '../services/wardService.js';
import { SensitivityService } from '../services/sensitivityService.js';

export const getCandidates = async (req: Request, res: Response) => {
  try {
    const spacingDegree = req.query.spacing ? parseFloat(req.query.spacing as string) : undefined;
    const maxCandidates = req.query.maxCount ? parseInt(req.query.maxCount as string, 10) : undefined;
    const minScore = req.query.minScore ? parseFloat(req.query.minScore as string) : undefined;
    const includeExcluded = req.query.includeExcluded !== 'false';

    const params: ICandidateGenerationParams = {
      spacingDegree,
      maxCandidates,
      minScore,
      includeExcluded,
    };

    const startTime = Date.now();
    const candidates = await CandidateService.generateCandidates(params);
    const executionTimeMs = Date.now() - startTime;

    const retainedCount = candidates.filter((c) => c.isRetained).length;
    const excludedCount = candidates.filter((c) => !c.isRetained).length;

    return res.status(200).json({
      success: true,
      count: candidates.length,
      summary: {
        retainedCandidates: retainedCount,
        excludedCandidates: excludedCount,
        executionTimeMs,
      },
      data: candidates,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: {
        code: 'CANDIDATE_GENERATION_FAILED',
        message: (err as Error).message,
      },
    });
  }
};

export const getCandidateById = async (req: Request, res: Response) => {
  try {
    const { candidateId } = req.params;
    const candidates = await CandidateService.generateCandidates({ includeExcluded: true });
    const candidate = candidates.find((c) => c.id === candidateId || c.code === candidateId);

    if (!candidate) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'CANDIDATE_NOT_FOUND',
          message: `Candidate site '${candidateId}' not found.`,
        },
      });
    }

    return res.status(200).json({
      success: true,
      data: candidate,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: {
        code: 'CANDIDATE_FETCH_FAILED',
        message: (err as Error).message,
      },
    });
  }
};

export const generateCandidates = async (req: Request, res: Response) => {
  try {
    const { spacingDegree, maxCandidates, minScore, includeExcluded } = req.body;

    const params: ICandidateGenerationParams = {
      spacingDegree: typeof spacingDegree === 'number' ? spacingDegree : undefined,
      maxCandidates: typeof maxCandidates === 'number' ? maxCandidates : undefined,
      minScore: typeof minScore === 'number' ? minScore : undefined,
      includeExcluded: typeof includeExcluded === 'boolean' ? includeExcluded : true,
    };

    const startTime = Date.now();
    const candidates = await CandidateService.generateCandidates(params);
    const executionTimeMs = Date.now() - startTime;

    return res.status(200).json({
      success: true,
      count: candidates.length,
      executionTimeMs,
      data: candidates,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: {
        code: 'CANDIDATE_GENERATION_FAILED',
        message: (err as Error).message,
      },
    });
  }
};

export const getAdministrativeDivisions = async (_req: Request, res: Response) => {
  try {
    const geojson = WardService.getAdministrativeDivisionsGeoJson();
    if (!geojson) {
      return res.status(404).json({
        success: false,
        error: { code: 'GEOJSON_NOT_FOUND', message: 'Administrative division GeoJSON dataset not found.' },
      });
    }
    return res.status(200).json(geojson);
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: { code: 'WARD_FETCH_FAILED', message: (err as Error).message },
    });
  }
};

export const getDivisionAggregation = async (_req: Request, res: Response) => {
  try {
    const candidates = await CandidateService.generateCandidates({ includeExcluded: true });
    const aggregation = WardService.aggregateSitesByDivision(candidates);
    return res.status(200).json({
      success: true,
      count: aggregation.length,
      metricClassification: 'AGGREGATE_MODEL_OUTPUT',
      revenueStatus: 'NOT_MODELED',
      disclaimer: 'Spatial aggregation metrics are aggregate MODEL OUTPUTS derived from UrjaSetu candidate grid evaluation. They do NOT represent official municipal revenue forecasts, approved utility interconnection capacities, or statutory zoning limits.',
      data: aggregation,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: { code: 'AGGREGATION_FAILED', message: (err as Error).message },
    });
  }
};

export const recalculateMcdaScores = async (req: Request, res: Response) => {
  try {
    const { weights, scenarioName } = req.body;
    const candidates = await CandidateService.generateCandidates({ includeExcluded: true });
    const result = SensitivityService.recalculateScores(candidates, weights || {}, scenarioName || 'Custom Weights');
    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: { code: 'MCDA_RECALCULATION_FAILED', message: (err as Error).message },
    });
  }
};

export const getMcdaSensitivityMatrix = async (_req: Request, res: Response) => {
  try {
    const candidates = await CandidateService.generateCandidates({ includeExcluded: true });
    const matrix = SensitivityService.generateSensitivityMatrix(candidates);
    return res.status(200).json({
      success: true,
      data: matrix,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: { code: 'SENSITIVITY_MATRIX_FAILED', message: (err as Error).message },
    });
  }
};


