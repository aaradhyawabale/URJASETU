import { ShadingService } from '../services/shadingService.js';

async function runShadingServiceTests() {
  console.log('--- Starting ShadingService & 3D Micro-Shading Screening Unit Tests ---');

  // Test 1: Load OSM Buildings layer
  const buildingsData = ShadingService.getOsmBuildingsLayer();
  if (!buildingsData || !buildingsData.features) {
    throw new Error('FAILED Test 1: Failed to load OSM buildings dataset');
  }
  console.log(`✅ Test 1 PASSED: Loaded OSM buildings layer with ${buildingsData.features.length} footprint polygons.`);

  // Test 2: Calculate Micro-Shading Proxy for Nashik CBD coordinate (19.9975°N, 73.7898°E)
  const shadingResult = ShadingService.calculateMicroShading(19.9975, 73.7898, 2450, 45.0, 180.0);

  if (shadingResult.heightClassification !== 'DERIVED_ESTIMATED_BUILDING_HEIGHT_PROXY') {
    throw new Error(`FAILED Test 2: Height classification must be DERIVED_ESTIMATED_BUILDING_HEIGHT_PROXY, got ${shadingResult.heightClassification}`);
  }
  if (shadingResult.shadingClassification !== 'CONCEPTUAL_3D_PLOT_SHADOW_SCREENING_PROXY') {
    throw new Error(`FAILED Test 2: Shading classification must be CONCEPTUAL_3D_PLOT_SHADOW_SCREENING_PROXY, got ${shadingResult.shadingClassification}`);
  }
  if (shadingResult.effectiveShadedGhiKwhM2Day > 5.02) {
    throw new Error(`FAILED Test 2: Effective shaded GHI (${shadingResult.effectiveShadedGhiKwhM2Day}) cannot exceed NASA POWER baseline (5.02)`);
  }

  console.log('✅ Test 2 PASSED: Micro-shading screening calculation correctly evaluated 3D shadow parameters:');
  console.log(`   - Estimated Building Height Proxy: ${shadingResult.estimatedBuildingHeightMeters}m`);
  console.log(`   - Projected Shadow Length: ${shadingResult.projectedShadowLengthMeters}m`);
  console.log(`   - Estimated Shading Loss: ${shadingResult.estimatedShadingLossPercent}%`);
  console.log(`   - Regional GHI Baseline: ${shadingResult.nasaPowerRegionalGhi} kWh/m²/day`);
  console.log(`   - Effective Micro-Shaded GHI: ${shadingResult.effectiveShadedGhiKwhM2Day} kWh/m²/day`);
  console.log(`   - Provenance Classification: ${shadingResult.shadingClassification}`);

  console.log('\n✅ ALL SHADING SERVICE UNIT TESTS PASSED CLEANLY!\n');
}

runShadingServiceTests().catch((err) => {
  console.error('❌ SHADING SERVICE TEST FAILED:', err);
  process.exit(1);
});
