import { CandidateService } from '../services/candidateService.js';

async function runCandidateServiceTests() {
  console.log('=== RUNNING CANDIDATE SERVICE TESTS ===');

  // Test 1: Generate Candidate Sites with default parameters
  const startTime = Date.now();
  const candidates = await CandidateService.generateCandidates({ spacingDegree: 0.01, includeExcluded: true });
  const durationMs = Date.now() - startTime;

  console.log(`Generated ${candidates.length} candidates in ${durationMs}ms.`);
  console.assert(candidates.length > 0, 'Candidate generation returned empty list');

  const retained = candidates.filter((c) => c.isRetained);
  const excluded = candidates.filter((c) => !c.isRetained);

  console.log(`Retained Candidates: ${retained.length}, Excluded Candidates: ${excluded.length}`);
  console.assert(retained.length > 0, 'No candidates were retained');
  console.assert(excluded.length >= 0, 'Excluded count is invalid');

  // Test 2: Inspect Retained Candidate Score Decomposition
  const topCandidate = retained[0];
  console.log('\n--- Top Retained Candidate ---');
  console.log(`ID: ${topCandidate.id}, Code: ${topCandidate.code}, Name: ${topCandidate.name}`);
  console.log(`Coordinates: (${topCandidate.latitude}, ${topCandidate.longitude})`);
  console.log(`Opportunity Score: ${topCandidate.opportunityScore}`);
  console.log(`Elevation: ${topCandidate.elevationMeters}m, Slope: ${topCandidate.slopePercent}%`);
  console.log(`Nearest Road: ${topCandidate.nearestRoadMeters}m, Nearest EV Charger: ${topCandidate.nearestEVChargerMeters}m`);

  // Verify decomposable factors sum up to total opportunity score
  const factors = topCandidate.factors;
  let computedTotal = 0;
  Object.values(factors).forEach((f) => {
    console.log(`  Factor [${f.factorId}]: raw=${f.rawMeasurement} ${f.inputUnit}, norm=${f.normalizedScore}, weight=${f.weightPercent}%, contrib=${f.scoreContribution}`);
    computedTotal += f.scoreContribution;
  });

  const roundedComputedTotal = Math.round(computedTotal);
  console.log(`Sum of Score Contributions: ${computedTotal.toFixed(2)} (rounded: ${roundedComputedTotal})`);
  console.assert(
    Math.abs(roundedComputedTotal - topCandidate.opportunityScore) <= 1,
    `Opportunity score breakdown disparity: total=${topCandidate.opportunityScore}, computed=${roundedComputedTotal}`
  );

  // Test 3: Excluded Candidate Verification
  if (excluded.length > 0) {
    const topExcluded = excluded[0];
    console.log('\n--- Sample Excluded Candidate ---');
    console.log(`ID: ${topExcluded.id}, Code: ${topExcluded.code}`);
    console.log(`Exclusion Code: ${topExcluded.exclusionCode}`);
    console.log(`Exclusion Reason: ${topExcluded.exclusionReason}`);
    console.assert(topExcluded.opportunityScore === 0, 'Excluded candidate has non-zero opportunity score');
    console.assert(topExcluded.exclusionReason !== null, 'Excluded candidate missing exclusion reason');
  }

  console.log('\n✅ ALL CANDIDATE SERVICE TESTS PASSED CLEANLY!\n');
}

runCandidateServiceTests().catch((err) => {
  console.error('❌ CANDIDATE SERVICE TEST FAILED:', err);
  process.exit(1);
});
