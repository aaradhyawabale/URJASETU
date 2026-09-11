import { ISite } from '../seed/seedData.js';

export interface IRiskAssessment {
  overallRiskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'DISQUALIFIED';
  floodScreening: string;
  landConflictScreening: string;
  verificationsRequired: string[];
}

export class RiskService {
  public static evaluateRisk(metrics: ISite['metrics']): IRiskAssessment {
    const verificationsRequired: string[] = [];

    if (metrics.floodRisk === 'HIGH') {
      verificationsRequired.push('Detailed 50-year DEM hydrologic riverbank floodway study required');
    }
    if (metrics.landConflict === 'HIGH' || metrics.landConflict === 'MINOR') {
      verificationsRequired.push('ULB Revenue & Cadastral land-use title verification required');
    }
    verificationsRequired.push('MSEDCL 33kV Substation feeder grid interconnect capacity check');

    let overallRiskLevel: IRiskAssessment['overallRiskLevel'] = 'LOW';
    if (metrics.floodRisk === 'HIGH' || metrics.landConflict === 'HIGH') {
      overallRiskLevel = 'HIGH';
    } else if (metrics.floodRisk === 'MEDIUM' || metrics.landConflict === 'MINOR') {
      overallRiskLevel = 'MODERATE';
    }

    return {
      overallRiskLevel,
      floodScreening: `Flood risk screening status: ${metrics.floodRisk}`,
      landConflictScreening: `Land conflict status: ${metrics.landConflict}`,
      verificationsRequired,
    };
  }
}
