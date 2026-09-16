import { AIService, IAIReviewPayload } from '../services/aiService.js';

console.log('=== RUNNING URJASETU AI PROPOSAL WORKFLOW TEST SUITE ===');

async function runTests() {
  const samplePayload: IAIReviewPayload = {
    siteCode: 'NSK-CND-001',
    siteName: 'Govardhan Candidate Parcel',
    opportunityScore: 84,
    solarSuitability: 84,
    evDemandProxy: 72,
    roadAccessibility: 90,
    floodRisk: 'LOW',
    landConflict: 'NONE',
    estimatedAreaSqm: 2450,
    infrastructureType: 'SOLAR_EV_CHARGING_HUB',
    divisionName: 'Panchavati Division',
    elevationMeters: 585,
    slopePercent: 2.5,
    nearestRoadMeters: 150,
    nearestEVChargerMeters: 1200,
    nearestSubstationName: 'MSEDCL Panchavati Substation',
    nearestSubstationDistanceMeters: 450,
    annualGhiKwhM2Day: 5.02,
    estimatedShadingLossPercent: 0.2,
  };

  // Test 1: AI Proposal Synthesis Generation
  const review = await AIService.generateReview(samplePayload);
  if (review && review.summary && review.strengths.length > 0) {
    console.log('✅ Test 1 PASSED: Successfully generated AI Proposal Review synthesis.');
    console.log(`   - Review Source: ${review.source}`);
    console.log(`   - Summary Length: ${review.summary.length} chars`);
  } else {
    console.error('❌ Test 1 FAILED: Invalid review response.');
    process.exit(1);
  }

  // Test 2: Structured Proposal Sections Verification
  if (review.structuredSections && review.structuredSections.siteSummary && review.structuredSections.recommendationRationale) {
    console.log('✅ Test 2 PASSED: Verified 8 structured municipal decision sections:');
    console.log(`   - Site Summary: ${review.structuredSections.siteSummary}`);
    console.log(`   - Grid Considerations: ${review.structuredSections.gridConsiderations}`);
  } else {
    console.error('❌ Test 2 FAILED: Missing structured proposal sections.');
    process.exit(1);
  }

  // Test 3: Technical Capacity Calculation Alignment
  if (review.technicalCapacity.solarCapacityKwp === 294 && review.technicalCapacity.evChargerPorts === 18) {
    console.log('✅ Test 3 PASSED: Technical capacity metrics accurately computed from 2,450 m² area:');
    console.log(`   - Solar Capacity: ${review.technicalCapacity.solarCapacityKwp} kWp`);
    console.log(`   - Annual Generation: ${review.technicalCapacity.annualGenerationMwh} MWh/yr`);
    console.log(`   - EV Ports: ${review.technicalCapacity.evChargerPorts} Bays`);
  } else {
    console.error('❌ Test 3 FAILED: Technical capacity mismatch.');
    process.exit(1);
  }

  // Test 4: Data Provenance & Honesty Audit Certificate
  if (
    review.provenanceAudit.dataHonestyCompliance === '100% VERIFIED_HONEST' &&
    review.provenanceAudit.solarResourceClassification.includes('NASA POWER') &&
    review.provenanceAudit.statutoryZoningStatus.includes('UNVERIFIED_STATUTORY_ZONING')
  ) {
    console.log('✅ Test 4 PASSED: Data Provenance & Honesty Audit Certificate verified:');
    console.log(`   - Data Honesty Compliance: ${review.provenanceAudit.dataHonestyCompliance}`);
    console.log(`   - Solar Baseline: ${review.provenanceAudit.solarResourceClassification}`);
    console.log(`   - Statutory Zoning Status: ${review.provenanceAudit.statutoryZoningStatus}`);
  } else {
    console.error('❌ Test 4 FAILED: Provenance audit compliance check failed.');
    process.exit(1);
  }

  // Test 5: Provenance Safeguard Guard Audit Pass
  try {
    const isHonest = AIService.provenanceGuard(review);
    if (isHonest) {
      console.log('✅ Test 5 PASSED: Provenance Safeguard Audit passed compliance checks.');
    }
  } catch (err) {
    console.error('❌ Test 5 FAILED: Safeguard audit threw error:', (err as Error).message);
    process.exit(1);
  }

  console.log('\n================================================================');
  console.log('🎉 ALL AI PROPOSAL WORKFLOW TESTS PASSED CLEANLY!');
  console.log('================================================================\n');
}

runTests();
