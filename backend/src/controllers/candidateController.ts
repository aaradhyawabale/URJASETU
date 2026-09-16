import { Request, Response } from 'express';
import { CandidateService, ICandidateGenerationParams } from '../services/candidateService.js';

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
