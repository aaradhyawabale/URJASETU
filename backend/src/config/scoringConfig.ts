/**
 * UrjaSetu Siting Model Configuration & Scientific Rationale Registry
 * 
 * Centralized repository for:
 * 1. Source-backed engineering constraints (IRC / BIS / MRTP Act standards)
 * 2. UrjaSetu project modeling assumptions (weightings, normalization bounds)
 * 3. Final scoring coefficients
 */

export interface IScoringConfig {
  version: string;
  lastUpdated: string;
  slopeModel: {
    sourceConstraints: {
      maxAllowableSlopePercent: number; // 15% IRC:73-1980 urban road & heavy vehicle turning limit
      rationale: string;
      citation: string;
    };
    modelingAssumptions: {
      tiers: Array<{
        maxSlope: number;
        score: number;
        label: string;
        description: string;
      }>;
    };
  };
  solarModel: {
    sourceConstraints: {
      datasetResolution: string; // 0.5° x 0.5° NASA POWER climatology (~50km)
      limitations: string;
    };
    modelingAssumptions: {
      benchmarkGhiKwhM2Day: number; // 6.0 kWh/m²/day benchmark peak GHI for Western India
    };
  };
  riparianBufferModel: {
    sourceConstraints: {
      blueLineSetbackMeters: number; // 30m MRTP Act 1966 blue line restriction
      citation: string;
    };
  };
}

export const SCORING_CONFIG: IScoringConfig = {
  version: '1.0.0',
  lastUpdated: '2026-09-16',
  slopeModel: {
    sourceConstraints: {
      maxAllowableSlopePercent: 15.0,
      rationale: 'Slope steepness exceeding 15% restricts heavy electric bus/truck turning maneuvers and structural foundation stability.',
      citation: 'Indian Roads Congress IRC:73-1980 (Geometric Design Standards for Rural Highways) & IRC:86-1983 (Geometric Design Standards for Urban Roads in Plains).',
    },
    modelingAssumptions: {
      tiers: [
        { maxSlope: 5.0, score: 100, label: 'FLAT_OPTIMAL', description: 'Flat terrain (slope ≤ 5%). Low civil earthworks capex.' },
        { maxSlope: 10.0, score: 75, label: 'MODERATE_SUITABLE', description: 'Moderate slope (5.0% < slope ≤ 10.0%). Requires standard terracing.' },
        { maxSlope: 15.0, score: 40, label: 'STEEP_RESTRICTED', description: 'Steep slope (10.0% < slope ≤ 15.0%). Elevated foundation & terracing capex.' },
        { maxSlope: Infinity, score: 0, label: 'EXCLUSION_ZONE', description: 'Excessive slope (> 15.0%). Disqualified per IRC/BIS guidelines.' },
      ],
    },
  },
  solarModel: {
    sourceConstraints: {
      datasetResolution: '0.5° x 0.5° Grid (~50km regional climatology)',
      limitations: 'Regional 30-year climatology. Does not measure plot-level micro-shading from surrounding trees or buildings.',
    },
    modelingAssumptions: {
      benchmarkGhiKwhM2Day: 6.0,
    },
  },
  riparianBufferModel: {
    sourceConstraints: {
      blueLineSetbackMeters: 30,
      citation: 'Maharashtra Regional and Town Planning Act (MRTP Act 1966) & NMC Development Control and Promotion Regulations (DCPR 2017).',
    },
  },
};
