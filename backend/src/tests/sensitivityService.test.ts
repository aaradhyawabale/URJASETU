import { SensitivityService } from '../services/sensitivityService.js';
import { CandidateService } from '../services/candidateService.js';

async function runSensitivityServiceTests() {
  console.log('--- Starting SensitivityService & MCDA Sensitivity Matrix Unit Tests ---');

  // Test 1: Weight normalization
  const rawWeights = {
    solarPhotovoltaicWeight: 40,
    roadAccessWeight: 20,
    evInfrastructureGapWeight: 20,
    terrainSlopeWeight: 10,
    parkingAccessibilityWeight: 10,
  };
  const normalized = SensitivityService.normalizeWeights(rawWeights);
  const sumNorm =
    normalized.solarPhotovoltaicWeight +
    normalized.roadAccessWeight +
    normalized.evInfrastructureGapWeight +
    normalized.terrainSlopeWeight +
    normalized.parkingAccessibilityWeight;

  if (sumNorm !== 100) {
    throw new Error(`FAILED Test 1: Weight sum must be 100%, got ${sumNorm}%`);
  }
  console.log('✅ Test 1 PASSED: Weight normalization successfully scaled weights to 100%.');

  // Test 2: Recalculate scores and sensitivity matrix
  const candidates = await CandidateService.generateCandidates({ includeExcluded: true });
  const sensitivityMatrix = SensitivityService.generateSensitivityMatrix(candidates);

  if (!sensitivityMatrix.baseScenario || sensitivityMatrix.scenarios.length !== 3) {
    throw new Error(`FAILED Test 2: Expected 3 sensitivity scenarios, got ${sensitivityMatrix.scenarios.length}`);
  }

  const baseTop = sensitivityMatrix.baseScenario.recalculatedCandidates[0];
  const solarTop = sensitivityMatrix.scenarios[0].recalculatedCandidates[0];

  console.log('✅ Test 2 PASSED: Sensitivity matrix generated cleanly across 4 scenarios:');
  console.log(`   - Baseline Top Site: ${baseTop.code} (Score: ${baseTop.recalculatedScore})`);
  console.log(`   - Solar Priority Top Site: ${solarTop.code} (Score: ${solarTop.recalculatedScore})`);
  console.log(`   - Matrix Classification: ${sensitivityMatrix.matrixClassification}`);

  console.log('\n✅ ALL SENSITIVITY SERVICE UNIT TESTS PASSED CLEANLY!\n');
}

runSensitivityServiceTests().catch((err) => {
  console.error('❌ SENSITIVITY SERVICE TEST FAILED:', err);
  process.exit(1);
});
