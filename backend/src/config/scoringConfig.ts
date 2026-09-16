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
  planningHeuristics: {
    canopyUsableAreaRatio: { value: number; unit: string; classification: 'PLANNING_HEURISTIC'; limitation: string };
    solarPvDensityKwpPerM2: { value: number; unit: string; classification: 'PLANNING_HEURISTIC'; limitation: string };
    solarPerformanceRatio: { value: number; unit: string; classification: 'PLANNING_HEURISTIC'; limitation: string };
    evChargerDensityAreaM2PerPort: { value: number; unit: string; classification: 'PLANNING_HEURISTIC'; limitation: string };
    bessStorageRatioHours: { value: number; unit: string; classification: 'PLANNING_HEURISTIC'; limitation: string };
    unitCapexSolarKwpInr: { value: number; unit: string; classification: 'PROJECT_MODELING_ASSUMPTION'; limitation: string };
    unitCapexEvPortInr: { value: number; unit: string; classification: 'PROJECT_MODELING_ASSUMPTION'; limitation: string };
    unitCapexBessKwhInr: { value: number; unit: string; classification: 'PROJECT_MODELING_ASSUMPTION'; limitation: string };
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
  planningHeuristics: {
    canopyUsableAreaRatio: {
      value: 0.60,
      unit: 'ratio',
      classification: 'PLANNING_HEURISTIC',
      limitation: 'Assumes 60% usable parcel footprint for solar canopy coverage. Subject to site-specific setbacks and driveway geometry.',
    },
    solarPvDensityKwpPerM2: {
      value: 0.20,
      unit: 'kWp/m²',
      classification: 'PLANNING_HEURISTIC',
      limitation: 'Assumes 200W/m² standard PV module panel efficiency. Does not model specific PV module tilt angle or tracker mechanics.',
    },
    solarPerformanceRatio: {
      value: 0.80,
      unit: 'ratio',
      classification: 'PLANNING_HEURISTIC',
      limitation: 'Assumes 80% system performance ratio accounting for temperature derating, inverter losses, and dust soiling. Not a bankable yield prediction.',
    },
    evChargerDensityAreaM2PerPort: {
      value: 250,
      unit: 'm²/port',
      classification: 'PLANNING_HEURISTIC',
      limitation: 'Spatial planning rule of thumb (2 ports per 250 m² area). Does NOT measure EV vehicle traffic or electrical grid capacity.',
    },
    bessStorageRatioHours: {
      value: 0.50,
      unit: 'hours',
      classification: 'PLANNING_HEURISTIC',
      limitation: 'Preliminary BESS sizing rule (0.50 hours storage per solar kWp). Not a detailed electrical power flow design.',
    },
    unitCapexSolarKwpInr: {
      value: 45000,
      unit: '₹/kWp',
      classification: 'PROJECT_MODELING_ASSUMPTION',
      limitation: 'Preliminary planning estimate (₹45,000/kWp). Excludes grid interconnection upgrades, land acquisition, GST, and legal fees.',
    },
    unitCapexEvPortInr: {
      value: 800000,
      unit: '₹/port',
      classification: 'PROJECT_MODELING_ASSUMPTION',
      limitation: 'Preliminary planning estimate (₹800,000/port DC fast charger). Excludes transformer substation upgrades and civil trenching.',
    },
    unitCapexBessKwhInr: {
      value: 18000,
      unit: '₹/kWh',
      classification: 'PROJECT_MODELING_ASSUMPTION',
      limitation: 'Preliminary planning estimate (₹18,000/kWh BESS enclosure). Excludes HVAC thermal management and fire suppression system add-ons.',
    },
  },
  factors: {
    solarPhotovoltaic: {
      factorId: 'solarPhotovoltaic',
      name: 'Solar Photovoltaic Regional Baseline Factor',
      inputUnit: 'kWh/m²/day (Optimal Tilt GHI)',
      normalizationFormula: 'score = min(100, (GHI / 6.0) * 100)',
      weightPercent: 25,
      outputRange: '0 - 100',
      classification: 'SCORING_ASSUMPTION',
      sourceCitation: 'NASA POWER Project Climatology & NREL Solar Utility Benchmark (6.0 kWh/m²/day peak).',
      rationale: 'Regional 50km NASA POWER climatology baseline for solar generation potential. Does NOT measure plot-level rooftop micro-shading.',
    },
    roadAccess: {
      factorId: 'roadAccess',
      name: 'Road Access & Connectivity Factor',
      inputUnit: 'meters to nearest OSM road geometry',
      normalizationFormula: 'score = max(0, 100 - (distanceMeters / 25))',
      weightPercent: 25,
      outputRange: '0 - 100',
      classification: 'PROJECT_MODELING_THRESHOLD',
      sourceCitation: 'IRC:86-1983 Urban Road Hierarchy & OSM Road Network.',
      rationale: 'Measures spatial proximity to nearest public road corridor for EV vehicle entry/egress.',
    },
    evInfrastructureGap: {
      factorId: 'evInfrastructureGap',
      name: 'EV Infrastructure Gap Proxy Factor',
      inputUnit: 'meters to nearest existing EV charging station',
      normalizationFormula: 'score = min(100, (nearestEVChargerMeters / 50))',
      weightPercent: 20,
      outputRange: '0 - 100',
      classification: 'PROJECT_MODELING_THRESHOLD',
      sourceCitation: 'OpenStreetMap EV Charging POIs.',
      rationale: 'Spatial proxy measuring unserved infrastructure coverage. Larger distance to existing chargers indicates higher unserved gap. Does NOT directly measure EV vehicle traffic or energy demand.',
    },
    terrainSlope: {
      factorId: 'terrainSlope',
      name: 'Terrain Slope Factor',
      inputUnit: 'percent incline (%)',
      normalizationFormula: 'score = tierLookup(slopePercent)',
      weightPercent: 15,
      outputRange: '0 - 100',
      classification: 'ENGINEERING_GUIDANCE',
      sourceCitation: 'Copernicus DEM GLO-30 DSM sampled grid & IRC:73-1980 Table 7.',
      rationale: 'Evaluates civil earthworks capex and heavy vehicle maneuverability safety based on terrain slope gradient.',
    },
    parkingAccessibility: {
      factorId: 'parkingAccessibility',
      name: 'Parking & Multimodal Transit Accessibility Factor',
      inputUnit: 'meters to nearest OSM public parking lot',
      normalizationFormula: 'score = max(0, 100 - (nearestParkingMeters / 30))',
      weightPercent: 15,
      outputRange: '0 - 100',
      classification: 'PROJECT_MODELING_THRESHOLD',
      sourceCitation: 'OpenStreetMap Parking Lots & Public Transport Nodes.',
      rationale: 'Measures proximity to designated public parking facilities and transit nodes for multi-modal EV charging hub co-location.',
    },
  },
};
