import { ICandidateSite, CandidateService } from './candidateService.js';
import { SCORING_CONFIG } from '../config/scoringConfig.js';

export interface IMcdaWeightProfile {
  solarPhotovoltaicWeight: number; // e.g. 25
  roadAccessWeight: number; // e.g. 25
  evInfrastructureGapWeight: number; // e.g. 20
  terrainSlopeWeight: number; // e.g. 15
  parkingAccessibilityWeight: number; // e.g. 15
}

export interface ISensitivityScenarioResult {
  scenarioName: string;
  weights: IMcdaWeightProfile;
  weightClassification: 'PROJECT_MODELING_ASSUMPTION';
  recalculatedCandidates: Array<{
    id: string;
    code: string;
    name: string;
    originalRank: number;
    recalculatedRank: number;
    rankDelta: number; // recalculatedRank - originalRank
    originalScore: number;
    recalculatedScore: number;
    scoreDelta: number;
    status: ICandidateSite['status'];
    isRetained: boolean;
  }>;
  disclaimer: string;
}

export interface ISensitivityMatrixResult {
  baseScenario: ISensitivityScenarioResult;
  scenarios: ISensitivityScenarioResult[];
  matrixClassification: 'MODEL_OUTPUT_SENSITIVITY_ANALYSIS';
  disclaimer: string;
}

export class SensitivityService {
  public static normalizeWeights(weights: IMcdaWeightProfile): IMcdaWeightProfile {
    const total =
      weights.solarPhotovoltaicWeight +
      weights.roadAccessWeight +
      weights.evInfrastructureGapWeight +
      weights.terrainSlopeWeight +
      weights.parkingAccessibilityWeight;

    if (total === 0) {
      return {
        solarPhotovoltaicWeight: 25,
        roadAccessWeight: 25,
        evInfrastructureGapWeight: 20,
        terrainSlopeWeight: 15,
        parkingAccessibilityWeight: 15,
      };
    }

    return {
      solarPhotovoltaicWeight: Math.round((weights.solarPhotovoltaicWeight / total) * 100),
      roadAccessWeight: Math.round((weights.roadAccessWeight / total) * 100),
      evInfrastructureGapWeight: Math.round((weights.evInfrastructureGapWeight / total) * 100),
      terrainSlopeWeight: Math.round((weights.terrainSlopeWeight / total) * 100),
      parkingAccessibilityWeight: Math.round((weights.parkingAccessibilityWeight / total) * 100),
    };
  }

  public static recalculateScores(
    candidates: ICandidateSite[],
    weights: IMcdaWeightProfile,
    scenarioName: string = 'Custom Weights'
  ): ISensitivityScenarioResult {
    const normWeights = this.normalizeWeights(weights);

    // Sort base candidates by original opportunityScore to assign baseline rank
    const baseSorted = [...candidates].sort((a, b) => {
      if (a.isRetained && !b.isRetained) return -1;
      if (!a.isRetained && b.isRetained) return 1;
      return b.opportunityScore - a.opportunityScore;
    });

    const originalRanks: Record<string, number> = {};
    baseSorted.forEach((c, idx) => {
      originalRanks[c.id] = idx + 1;
    });

    // Recalculate opportunity score per candidate using custom weight profile
    const recalculatedList = candidates.map((c) => {
      if (!c.isRetained || !c.factors) {
        return {
          id: c.id,
          code: c.code,
          name: c.name,
          originalRank: originalRanks[c.id] || 999,
          recalculatedRank: 999,
          rankDelta: 0,
          originalScore: c.opportunityScore,
          recalculatedScore: 0,
          scoreDelta: -c.opportunityScore,
          status: c.status,
          isRetained: c.isRetained,
        };
      }

      const solarNorm = c.factors.solarPhotovoltaic?.normalizedScore ?? 84;
      const roadNorm = c.factors.roadAccess?.normalizedScore ?? 50;
      const evGapNorm = c.factors.evInfrastructureGap?.normalizedScore ?? 50;
      const terrainNorm = c.factors.terrainSlope?.normalizedScore ?? 100;
      const parkingNorm = c.factors.parkingAccessibility?.normalizedScore ?? 50;

      const newScore = Math.round(
        (solarNorm * normWeights.solarPhotovoltaicWeight) / 100 +
          (roadNorm * normWeights.roadAccessWeight) / 100 +
          (evGapNorm * normWeights.evInfrastructureGapWeight) / 100 +
          (terrainNorm * normWeights.terrainSlopeWeight) / 100 +
          (parkingNorm * normWeights.parkingAccessibilityWeight) / 100
      );

      let newStatus: ICandidateSite['status'] = 'LOW_SUITABILITY';
      if (newScore >= 75) newStatus = 'HIGH_SUITABILITY';
      else if (newScore >= 55) newStatus = 'MODERATE_SUITABILITY';

      return {
        id: c.id,
        code: c.code,
        name: c.name,
        originalRank: originalRanks[c.id] || 999,
        recalculatedRank: 0,
        rankDelta: 0,
        originalScore: c.opportunityScore,
        recalculatedScore: newScore,
        scoreDelta: newScore - c.opportunityScore,
        status: newStatus,
        isRetained: true,
      };
    });

    // Sort by recalculated score to determine new rank
    const sortedRecalc = [...recalculatedList].sort((a, b) => {
      if (a.isRetained && !b.isRetained) return -1;
      if (!a.isRetained && b.isRetained) return 1;
      return b.recalculatedScore - a.originalScore;
    });

    sortedRecalc.forEach((item, idx) => {
      item.recalculatedRank = idx + 1;
      item.rankDelta = item.originalRank - item.recalculatedRank; // positive = moved up in rank
    });

    return {
      scenarioName,
      weights: normWeights,
      weightClassification: 'PROJECT_MODELING_ASSUMPTION',
      recalculatedCandidates: sortedRecalc,
      disclaimer:
        'MCDA factor weights and suitability scores are PROJECT_MODELING_ASSUMPTIONS. They represent decision-support trade-offs for preliminary site screening and are NOT scientifically validated ground-truth site rankings.',
    };
  }

  public static generateSensitivityMatrix(candidates: ICandidateSite[]): ISensitivityMatrixResult {
    const baseWeights: IMcdaWeightProfile = {
      solarPhotovoltaicWeight: SCORING_CONFIG.factors.solarPhotovoltaic.weightPercent,
      roadAccessWeight: SCORING_CONFIG.factors.roadAccess.weightPercent,
      evInfrastructureGapWeight: SCORING_CONFIG.factors.evInfrastructureGap.weightPercent,
      terrainSlopeWeight: SCORING_CONFIG.factors.terrainSlope.weightPercent,
      parkingAccessibilityWeight: SCORING_CONFIG.factors.parkingAccessibility.weightPercent,
    };

    const baseScenario = this.recalculateScores(candidates, baseWeights, 'Baseline Model (Balanced)');

    const solarPriorityScenario = this.recalculateScores(
      candidates,
      { solarPhotovoltaicWeight: 45, roadAccessWeight: 20, evInfrastructureGapWeight: 15, terrainSlopeWeight: 10, parkingAccessibilityWeight: 10 },
      'Solar Generation Priority'
    );

    const transitDemandScenario = this.recalculateScores(
      candidates,
      { solarPhotovoltaicWeight: 15, roadAccessWeight: 20, evInfrastructureGapWeight: 45, terrainSlopeWeight: 10, parkingAccessibilityWeight: 10 },
      'EV Transit & Demand Priority'
    );

    const lowSlopeScenario = this.recalculateScores(
      candidates,
      { solarPhotovoltaicWeight: 20, roadAccessWeight: 20, evInfrastructureGapWeight: 15, terrainSlopeWeight: 35, parkingAccessibilityWeight: 10 },
      'Flat Terrain & Minimal Capex Priority'
    );

    return {
      baseScenario,
      scenarios: [solarPriorityScenario, transitDemandScenario, lowSlopeScenario],
      matrixClassification: 'MODEL_OUTPUT_SENSITIVITY_ANALYSIS',
      disclaimer:
        'Sensitivity matrix evaluates ranking stability across 4 MCDA weighting scenarios. Weights are PROJECT_MODELING_ASSUMPTIONS and do NOT constitute ground-truth site validation.',
    };
  }
}
