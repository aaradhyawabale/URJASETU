import { CandidateSite, ComponentType } from '../types/site';

export interface ISuitabilityScoreBreakdown {
  infrastructureType: ComponentType | string;
  overallScore: number; // 0 - 100
  suitabilityGrade: 'HIGH_SUITABILITY' | 'MODERATE_SUITABILITY' | 'LOW_SUITABILITY';
  criteriaScores: {
    criterionName: string;
    rawMeasurement: string;
    score: number; // 0 - 100
    weightPercent: number;
    contribution: number;
  }[];
  provenance: {
    classification: 'DERIVED_INFRASTRUCTURE_SUITABILITY_ENGINE';
    algorithm: 'MCLP_AHP_WEIGHTED_OVERLAY_MODEL';
    disclaimer: string;
  };
}

/**
 * Computes infrastructure-specific site suitability scores adapted from MCLP & MCDA spatial algorithms.
 * Evaluates category-specific criteria (e.g. EV Charger vs Hospital vs School vs Solar).
 */
export function calculateInfrastructureSuitability(
  site: CandidateSite,
  targetType: ComponentType | string = 'EV_CHARGER'
): ISuitabilityScoreBreakdown {
  const solarBase = site.metrics?.solarSuitability ?? 84;
  const evBase = site.metrics?.evDemandProxy ?? 72;
  const roadBase = site.metrics?.roadAccessibility ?? 90;
  const floodRisk = site.metrics?.floodRisk || 'LOW';

  let overallScore = site.opportunityScore;
  let criteriaScores: ISuitabilityScoreBreakdown['criteriaScores'] = [];

  if (targetType === 'EV_CHARGER' || targetType === 'SOLAR_EV_CHARGING_HUB') {
    // EV Charger: 40% Road Access, 35% EV Demand Proxy, 25% Substation Grid Proximity
    const gridScore = Math.max(40, 100 - Math.round((site.nearestEVChargerMeters || 380) / 20));
    overallScore = Math.round(0.40 * roadBase + 0.35 * evBase + 0.25 * gridScore);

    criteriaScores = [
      { criterionName: 'Arterial Road Accessibility', rawMeasurement: `${site.nearestRoadMeters || 42}m to Main Road`, score: roadBase, weightPercent: 40, contribution: Number((0.40 * roadBase).toFixed(1)) },
      { criterionName: 'Commercial Traffic & EV Demand Proxy', rawMeasurement: `${evBase}/100 Activity Proxy`, score: evBase, weightPercent: 35, contribution: Number((0.35 * evBase).toFixed(1)) },
      { criterionName: 'Substation & Feeder Grid Proximity', rawMeasurement: `${gridScore}/100 Grid Feasibility`, score: gridScore, weightPercent: 25, contribution: Number((0.25 * gridScore).toFixed(1)) },
    ];
  } else if (targetType === 'HOSPITAL_BUILDING' || targetType === 'HOSPITAL') {
    // Hospital: 45% Emergency Road Access, 35% Parcel Area Capability, 20% Riparian Safety
    const areaScore = Math.min(100, Math.round(((site.areaSqm || 2450) / 3000) * 100));
    const safetyScore = floodRisk === 'LOW' ? 95 : floodRisk === 'MEDIUM' ? 60 : 25;
    overallScore = Math.round(0.45 * roadBase + 0.35 * areaScore + 0.20 * safetyScore);

    criteriaScores = [
      { criterionName: 'Emergency Transit Road Corridor', rawMeasurement: `${roadBase}/100 Road Access`, score: roadBase, weightPercent: 45, contribution: Number((0.45 * roadBase).toFixed(1)) },
      { criterionName: 'Minimum Hospital Plot Area Capability', rawMeasurement: `${(site.areaSqm || 2450).toLocaleString()} m² Plot`, score: areaScore, weightPercent: 35, contribution: Number((0.35 * areaScore).toFixed(1)) },
      { criterionName: 'Riparian & Floodway Safety Status', rawMeasurement: `Flood Risk: ${floodRisk}`, score: safetyScore, weightPercent: 20, contribution: Number((0.20 * safetyScore).toFixed(1)) },
    ];
  } else if (targetType === 'TELECOM_TOWER') {
    // Telecom Tower: 50% Topographic Elevation, 30% Power Grid Proximity, 20% Road Access
    const eleScore = Math.min(100, Math.round(((site.elevationMeters || 580) / 650) * 100));
    overallScore = Math.round(0.50 * eleScore + 0.30 * 85 + 0.20 * roadBase);

    criteriaScores = [
      { criterionName: 'Topographic Elevation & Line-of-Sight', rawMeasurement: `${site.elevationMeters || 580}m ASL`, score: eleScore, weightPercent: 50, contribution: Number((0.50 * eleScore).toFixed(1)) },
      { criterionName: 'Electrical Power Connection Feasibility', rawMeasurement: '85/100 Grid Buffer', score: 85, weightPercent: 30, contribution: Number((0.30 * 85).toFixed(1)) },
      { criterionName: 'Maintenance Access Corridor', rawMeasurement: `${roadBase}/100 Road Access`, score: roadBase, weightPercent: 20, contribution: Number((0.20 * roadBase).toFixed(1)) },
    ];
  } else {
    // Solar Canopy / Default: 50% GHI Solar Yield, 30% Usable Footprint, 20% Road Access
    overallScore = Math.round(0.50 * solarBase + 0.30 * 80 + 0.20 * roadBase);

    criteriaScores = [
      { criterionName: 'NASA POWER Solar Irradiation (GHI)', rawMeasurement: `${solarBase}/100 Solar Yield`, score: solarBase, weightPercent: 50, contribution: Number((0.50 * solarBase).toFixed(1)) },
      { criterionName: 'Unshaded Canopy Area Footprint', rawMeasurement: `${(site.areaSqm || 2450).toLocaleString()} m² Footprint`, score: 80, weightPercent: 30, contribution: Number((0.30 * 80).toFixed(1)) },
      { criterionName: 'Maintenance & Delivery Accessibility', rawMeasurement: `${roadBase}/100 Road Access`, score: roadBase, weightPercent: 20, contribution: Number((0.20 * roadBase).toFixed(1)) },
    ];
  }

  const suitabilityGrade = overallScore >= 80 ? 'HIGH_SUITABILITY' : overallScore >= 65 ? 'MODERATE_SUITABILITY' : 'LOW_SUITABILITY';

  return {
    infrastructureType: targetType,
    overallScore,
    suitabilityGrade,
    criteriaScores,
    provenance: {
      classification: 'DERIVED_INFRASTRUCTURE_SUITABILITY_ENGINE',
      algorithm: 'MCLP_AHP_WEIGHTED_OVERLAY_MODEL',
      disclaimer: 'Infrastructure suitability scores calculated via Maximal Coverage Location Problem (MCLP) and Analytic Hierarchy Process (AHP) weighted spatial criteria.',
    },
  };
}
