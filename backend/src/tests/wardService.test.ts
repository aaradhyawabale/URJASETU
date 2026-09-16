import { WardService } from '../services/wardService.js';
import { CandidateService } from '../services/candidateService.js';

async function runWardServiceTests() {
  console.log('--- Starting WardService & Division Aggregation Unit Tests ---');

  // Test 1: Load GeoJSON dataset
  const geojson = WardService.getAdministrativeDivisionsGeoJson();
  if (!geojson || !geojson.features) {
    throw new Error('FAILED Test 1: Failed to load nashik_administrative_wards.geojson');
  }
  if (geojson.features.length !== 6) {
    throw new Error(`FAILED Test 1: Expected 6 administrative divisions, got ${geojson.features.length}`);
  }
  console.log(`✅ Test 1 PASSED: Loaded GeoJSON with ${geojson.features.length} NMC Administrative Divisions.`);

  // Test 2: Point-in-Polygon spatial lookup
  // Test Panchavati coordinate (20.02°N, 73.82°E)
  const panchavatiDivision = WardService.getDivisionForCoordinate(20.02, 73.82);
  if (!panchavatiDivision || panchavatiDivision.divisionId !== 'nmc_div_01') {
    throw new Error(`FAILED Test 2: Expected Panchavati Division (nmc_div_01), got ${panchavatiDivision?.divisionName}`);
  }
  if (panchavatiDivision.classification !== 'DERIVED_NMC_ADMINISTRATIVE_ZONES') {
    throw new Error(`FAILED Test 2: Classification must be DERIVED_NMC_ADMINISTRATIVE_ZONES, got ${panchavatiDivision?.classification}`);
  }
  if (panchavatiDivision.population2021 !== 'UNKNOWN') {
    throw new Error(`FAILED Test 2: Population 2021 must be UNKNOWN, got ${panchavatiDivision?.population2021}`);
  }
  console.log(`✅ Test 2 PASSED: Point-in-polygon lookup correctly identified Panchavati Division with provenance classification DERIVED_NMC_ADMINISTRATIVE_ZONES.`);

  // Test 3: Division Aggregation metrics
  const candidates = await CandidateService.generateCandidates({ includeExcluded: true });
  const aggregations = WardService.aggregateSitesByDivision(candidates);

  if (aggregations.length !== 6) {
    throw new Error(`FAILED Test 3: Expected aggregation for 6 divisions, got ${aggregations.length}`);
  }

  const panchavatiAgg = aggregations.find((a) => a.divisionId === 'nmc_div_01');
  if (!panchavatiAgg) {
    throw new Error('FAILED Test 3: Panchavati aggregation summary missing');
  }

  if (panchavatiAgg.metricClassification !== 'AGGREGATE_MODEL_OUTPUT') {
    throw new Error(`FAILED Test 3: Metric classification must be AGGREGATE_MODEL_OUTPUT, got ${panchavatiAgg.metricClassification}`);
  }
  if (panchavatiAgg.revenueStatus !== 'NOT_MODELED') {
    throw new Error(`FAILED Test 3: Revenue status must be NOT_MODELED, got ${panchavatiAgg.revenueStatus}`);
  }

  console.log('✅ Test 3 PASSED: Spatial model aggregation correctly produced AGGREGATE_MODEL_OUTPUT summaries for 6 divisions:');
  aggregations.forEach((a) => {
    console.log(`   - ${a.divisionName} (${a.divisionCode}): ${a.retainedCandidates}/${a.totalCandidates} retained sites (${a.candidatesPerKm2} sites/km²), ${a.aggregateModeledSolarCapacityMwp} MWp solar, ${a.aggregateModeledEvChargerPorts} EV ports, Mean Score: ${a.meanOpportunityScore}`);
  });

  console.log('\n✅ ALL WARD SERVICE & DIVISION AGGREGATION TESTS PASSED CLEANLY!\n');
}

runWardServiceTests().catch((err) => {
  console.error('❌ WARD SERVICE TEST FAILED:', err);
  process.exit(1);
});
