import { ISite } from '../seed/seedData.js';

export interface IScoreBreakdown {
  opportunityScore: number;
  solarSuitabilityScore: number;
  evDemandProxyScore: number;
  roadAccessibilityScore: number;
  riskPenalty: number;
  formula: string;
}

export class ScoringService {
  /**
   * Computes deterministic Opportunity Score based on approved multi-criteria formula:
   * Opportunity Score = 0.40 * Solar + 0.35 * EV_Demand + 0.25 * Road_Access - Risk_Penalty
   */
  public static calculateScore(metrics: ISite['metrics']): IScoreBreakdown {
    const solarWeight = 0.40;
    const evWeight = 0.35;
    const roadWeight = 0.25;

    let riskPenalty = 0;
    if (metrics.floodRisk === 'HIGH') riskPenalty += 20;
    if (metrics.floodRisk === 'MEDIUM') riskPenalty += 5;
    if (metrics.landConflict === 'HIGH') riskPenalty += 15;
    if (metrics.landConflict === 'MINOR') riskPenalty += 5;

    const rawScore = 
      (metrics.solarSuitability * solarWeight) +
      (metrics.evDemandProxy * evWeight) +
      (metrics.roadAccessibility * roadWeight);

    const opportunityScore = Math.max(0, Math.min(100, Math.round(rawScore - riskPenalty)));

    return {
      opportunityScore,
      solarSuitabilityScore: metrics.solarSuitability,
      evDemandProxyScore: metrics.evDemandProxy,
      roadAccessibilityScore: metrics.roadAccessibility,
      riskPenalty,
      formula: '0.40 * Solar + 0.35 * EV_Demand + 0.25 * Road_Access - Risk_Penalty',
    };
  }
}
