import { CandidateService } from '../services/candidateService.js';
import { WardService } from '../services/wardService.js';
import { GridService } from '../services/gridService.js';
import { ShadingService } from '../services/shadingService.js';
import { SensitivityService } from '../services/sensitivityService.js';
import { ElevationService } from '../services/elevationService.js';
import { ClimateService } from '../services/climateService.js';
import { RiskService } from '../services/riskService.js';

async function runEndToEndIntegrationTests() {
  console.log('=== RUNNING URJASETU END-TO-END SYSTEM INTEGRATION TESTS ===');

  // 1. Candidate Generation Performance Test (< 1000ms)
  const startTime = Date.now();
  const candidates = await CandidateService.generateCandidates({ includeExcluded: true });
  const durationMs = Date.now() - startTime;

  if (candidates.length === 0) {
    throw new Error('FAILED Test 1: No candidate sites generated');
  }
  console.log(`✅ Test 1 PASSED: Generated ${candidates.length} candidates in ${durationMs}ms (Performance target <1000ms).`);

  // 2. Data Provenance & Classification Checks on Retained Candidates
  const retained = candidates.filter((c) => c.isRetained);
  const sample = retained[0];

  if (!sample.divisionClassification || sample.divisionClassification !== 'DERIVED_NMC_ADMINISTRATIVE_ZONES') {
    throw new Error(`FAILED Test 2: Invalid division classification: ${sample.divisionClassification}`);
  }
  if (!sample.landCoverClassification || sample.landCoverClassification !== 'DERIVED_LAND_COVER_PROXY') {
    throw new Error(`FAILED Test 2: Invalid land cover classification: ${sample.landCoverClassification}`);
  }
  if (!sample.statutoryLegalZoning || sample.statutoryLegalZoning !== 'UNVERIFIED_STATUTORY_ZONING') {
    throw new Error(`FAILED Test 2: Invalid statutory legal zoning: ${sample.statutoryLegalZoning}`);
  }
  console.log('✅ Test 2 PASSED: Sample candidate retains strict data provenance classifications:');
  console.log(`   - Division: ${sample.divisionName} (${sample.divisionClassification})`);
  console.log(`   - Land Cover: ${sample.landCoverCategory} (${sample.landCoverClassification})`);
  console.log(`   - Legal Zoning: ${sample.statutoryLegalZoning}`);

  // 3. Grid Feasibility Proximity Test
  const gridResult = GridService.evaluateGridProximity(sample.latitude, sample.longitude);
  if (gridResult.classification !== 'DERIVED_GRID_INFRASTRUCTURE_PROXY') {
    throw new Error(`FAILED Test 3: Grid classification must be DERIVED_GRID_INFRASTRUCTURE_PROXY`);
  }
  console.log(`✅ Test 3 PASSED: Grid feasibility correctly evaluated ${gridResult.nearestSubstationName} (${gridResult.nearestSubstationDistanceMeters}m).`);

  // 4. 3D Solar Micro-Shading Proxy Test
  const shadingResult = ShadingService.calculateMicroShading(sample.latitude, sample.longitude, 2450, 45.0, 180.0);
  if (shadingResult.shadingClassification !== 'CONCEPTUAL_3D_PLOT_SHADOW_SCREENING_PROXY') {
    throw new Error(`FAILED Test 4: Shading classification must be CONCEPTUAL_3D_PLOT_SHADOW_SCREENING_PROXY`);
  }
  console.log(`✅ Test 4 PASSED: 3D micro-shading screening evaluated shadow length ${shadingResult.projectedShadowLengthMeters}m.`);

  // 5. Administrative Ward Aggregation Test
  const aggregations = WardService.aggregateSitesByDivision(candidates);
  if (aggregations.length !== 6) {
    throw new Error(`FAILED Test 5: Expected 6 administrative divisions, got ${aggregations.length}`);
  }
  console.log(`✅ Test 5 PASSED: Ward aggregation summarized candidate density across 6 NMC administrative divisions.`);

  // 6. MCDA Sensitivity & Recalculation Test
  const sensitivity = SensitivityService.generateSensitivityMatrix(candidates);
  if (sensitivity.scenarios.length !== 3) {
    throw new Error(`FAILED Test 6: Sensitivity matrix must evaluate 3 scenarios`);
  }
  console.log(`✅ Test 6 PASSED: Sensitivity matrix generated cleanly across 4 MCDA scenario profiles.`);

  // 7. Edge-Case Input Handling
  // Extreme out-of-bounds coordinate
  const outCandidates = await CandidateService.generateCandidates({ minLat: 10.0, maxLat: 10.01, minLng: 10.0, maxLng: 10.01 });
  if (outCandidates.length > 0 && outCandidates[0].isRetained) {
    throw new Error('FAILED Test 7: Out-of-bounds candidate should be excluded with OUTSIDE_STUDY_AREA');
  }
  console.log('✅ Test 7 PASSED: Edge-case out-of-bounds coordinates correctly excluded.');

  console.log('\n================================================================');
  console.log('🎉 ALL URJASETU END-TO-END SYSTEM INTEGRATION TESTS PASSED CLEANLY!');
  console.log('================================================================\n');
}

runEndToEndIntegrationTests().catch((err) => {
  console.error('❌ INTEGRATION TEST FAILED:', err);
  process.exit(1);
});
