/**
 * UrjaSetu Siting Model Configuration & Scientific Rationale Registry
 * 
 * Centralized repository for:
 * 1. Source-backed engineering guidance (IRC / MRTP / BIS standards)
 * 2. UrjaSetu project modeling thresholds & screening assumptions
 * 3. Final scoring coefficients & normalization formulas
 */

export interface IScoringFactorDoc {
  factorId: string;
  name: string;
  inputUnit: string;
  normalizationFormula: string;
  weightPercent: number;
  outputRange: string; // e.g. "0 - 100"
  classification: 'ENGINEERING_GUIDANCE' | 'PROJECT_MODELING_THRESHOLD' | 'SCORING_ASSUMPTION';
  sourceCitation: string;
  rationale: string;
}

export interface IScoringConfig {
  version: string;
  lastUpdated: string;
  slopeModel: {
    sourceGuidance: {
      ircRulingGradientPercent: number; // 3.3% to 5.0% (IRC:73-1980 Plain/Rolling terrain)
      ircLimitingGradientPercent: number; // 5.0% (IRC:86-1983 Urban arterial roads)
      citation: string;
    };
    projectThresholds: {
      exclusionSlopePercent: number; // 15.0% project screening threshold for heavy EV turn-around & capex
      label: string;
      classification: 'PROJECT_SCREENING_ASSUMPTION';
    };
    scoringTiers: Array<{
      maxSlope: number;
      score: number;
      label: string;
      classification: 'SCORING_ASSUMPTION';
      description: string;
    }>;
  };
  solarModel: {
    sourceGuidance: {
      datasetResolution: string; // 0.5° x 0.5° NASA POWER climatology (~50km)
      datasetNature: string; // 30-year regional solar climatology mean
      limitations: string;
    };
    projectThresholds: {
      benchmarkGhiKwhM2Day: number; // 6.0 kWh/m²/day benchmark peak GHI for Western India
    };
  };
  riparianBufferModel: {
    sourceGuidance: {
      blueLineSetbackMeters: number; // 30m MRTP Act 1966 & NMC DCPR 2017 blue line setback
      citation: string;
      legalClassification: 'CONSERVATIVE_PROJECT_SCREENING_BUFFER';
    };
  };
  factors: Record<string, IScoringFactorDoc>;
}

export const SCORING_CONFIG: IScoringConfig = {
  version: '1.1.0',
  lastUpdated: '2026-09-16',
  slopeModel: {
    sourceGuidance: {
      ircRulingGradientPercent: 5.0,
      ircLimitingGradientPercent: 5.0,
      citation: 'Indian Roads Congress IRC:73-1980 (Geometric Design Standards for Rural Highways, Table 7: Plain/Rolling Terrain Ruling Gradient 3.3%-5.0%) & IRC:86-1983 (Geometric Design Standards for Urban Roads in Plains, Section 6: Arterial Road Limiting Gradient 5.0%).',
    },
    projectThresholds: {
      exclusionSlopePercent: 15.0,
      label: 'PROJECT_SCREENING_EXCLUSION',
      classification: 'PROJECT_SCREENING_ASSUMPTION',
    },
    scoringTiers: [
      {
        maxSlope: 5.0,
        score: 100,
        label: 'FLAT_OPTIMAL',
        classification: 'SCORING_ASSUMPTION',
        description: 'Flat terrain (slope ≤ 5.0%). Complies with IRC urban arterial ruling gradient (≤ 5.0%). Low civil earthworks capex.',
      },
      {
        maxSlope: 10.0,
        score: 75,
        label: 'MODERATE_SUITABLE',
        classification: 'SCORING_ASSUMPTION',
        description: 'Moderate slope (5.0% < slope ≤ 10.0%). Exceeds IRC ruling gradient; requires standard terracing earthworks.',
      },
      {
        maxSlope: 15.0,
        score: 40,
        label: 'STEEP_RESTRICTED',
        classification: 'SCORING_ASSUMPTION',
        description: 'Steep slope (10.0% < slope ≤ 15.0%). Elevated foundation capex and access ramp grading required.',
      },
      {
        maxSlope: Infinity,
        score: 0,
        label: 'PROJECT_SCREENING_EXCLUSION',
        classification: 'SCORING_ASSUMPTION',
        description: 'Excessive slope (> 15.0%). Project screening threshold exclusion zone due to heavy vehicle turning limits & high civil capex.',
      },
    ],
  },
  solarModel: {
    sourceGuidance: {
      datasetResolution: '0.5° x 0.5° Grid (~50km regional climatology)',
      datasetNature: '30-year NASA POWER regional solar climatology mean',
      limitations: 'Regional 30-year climatology mean. Does NOT measure plot-level micro-shading from adjacent trees, utility poles, or structures.',
    },
    projectThresholds: {
      benchmarkGhiKwhM2Day: 6.0,
    },
  },
  riparianBufferModel: {
    sourceGuidance: {
      blueLineSetbackMeters: 30,
      citation: 'Maharashtra Regional and Town Planning Act (MRTP Act 1966) & Nashik Municipal Corporation DCPR 2017 (Rule 11.2: Prohibited 30m Flood Margin / Blue Line along Godavari Riverbed).',
      legalClassification: 'CONSERVATIVE_PROJECT_SCREENING_BUFFER',
    },
  },
  factors: {
    solarPhotovoltaic: {
      factorId: 'solarPhotovoltaic',
      name: 'Solar Photovoltaic Factor',
      inputUnit: 'kWh/m²/day (Optimal Tilt GHI)',
      normalizationFormula: 'score = min(100, (GHI / 6.0) * 100)',
      weightPercent: 35,
      outputRange: '0 - 100',
      classification: 'SCORING_ASSUMPTION',
      sourceCitation: 'NASA POWER Project Climatology & NREL Solar Utility Benchmark (6.0 kWh/m²/day peak).',
      rationale: 'Measures annual average GHI potential for co-located rooftop & canopy solar generation.',
    },
    roadAccess: {
      factorId: 'roadAccess',
      name: 'Road Access & Connectivity Factor',
      inputUnit: 'meters to nearest highway/arterial',
      normalizationFormula: 'score = max(0, 100 - (distanceMeters / 20))',
      weightPercent: 25,
      outputRange: '0 - 100',
      classification: 'PROJECT_MODELING_THRESHOLD',
      sourceCitation: 'IRC:86-1983 Urban Road Hierarchy & OSM Road Corridor Network.',
      rationale: 'Heavy passenger and commercial EV fast charging hubs require immediate access to 12m+ arterial roads.',
    },
    evDemandProxy: {
      factorId: 'evDemandProxy',
      name: 'EV Demand Proxy Factor',
      inputUnit: 'POI count within 500m radius',
      normalizationFormula: 'score = min(100, poiCount * 8)',
      weightPercent: 25,
      outputRange: '0 - 100',
      classification: 'PROJECT_MODELING_THRESHOLD',
      sourceCitation: 'OpenStreetMap Commercial POI Density & MSRTC Bus Depot Proximity.',
      rationale: 'Activity proxy derived from commercial POI concentration and transit hubs.',
    },
    terrainSlope: {
      factorId: 'terrainSlope',
      name: 'Terrain Slope Factor',
      inputUnit: 'percent incline (%)',
      normalizationFormula: 'score = tierLookup(slopePercent)',
      weightPercent: 15,
      outputRange: '0 - 100',
      classification: 'ENGINEERING_GUIDANCE',
      sourceCitation: 'Copernicus DEM 30m Elevation Grid & IRC:73-1980 Table 7.',
      rationale: 'Evaluates civil engineering capex and vehicle access safety based on slope gradient.',
    },
  },
};
