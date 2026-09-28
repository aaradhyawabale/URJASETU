import { WardService } from '../services/wardService.js';
import { CandidateService } from '../services/candidateService.js';

async function runWardServiceTests() {
  console.log('--- Starting WardService & Division Aggregation Unit Tests ---');

  // Test 1: Load GeoJSON dataset
  const geojson = WardService.getAdministrativeDivisionsGeoJson();
  if (!geojson || !geojson.features) {
    throw new Error('FAILED Test 1: Failed to load pune_administrative_wards.geojson');
  }
  if (geojson.features.length !== 6) {
    throw new Error(`FAILED Test 1: Expected 6 administrative divisions, got ${geojson.features.length}`);
  }
  console.log(`✅ Test 1 PASSED: Loaded GeoJSON with ${geojson.features.length} PMC Administrative Divisions.`);

  // Test 2: Point-in-Polygon spatial lookup
  // Test Shivajinagar coordinate (18.5285°N, 73.8520°E)
  const shivajiDivision = WardService.getDivisionForCoordinate(18.5285, 73.8520);
  if (!shivajiDivision || !shivajiDivision.divisionName.includes('Shivajinagar')) {
    throw new Error(`FAILED Test 2: Expected Shivajinagar-Ghole Road Zone, got ${shivajiDivision?.divisionName}`);
  }
  if (shivajiDivision.classification !== 'DERIVED_PMC_ADMINISTRATIVE_ZONES') {
    throw new Error(`FAILED Test 2: Classification must be DERIVED_PMC_ADMINISTRATIVE_ZONES, got ${shivajiDivision?.classification}`);
  }
  if (shivajiDivision.population2021 === undefined || shivajiDivision.population2021 === null) {
    throw new Error(`FAILED Test 2: Population 2021 missing, got ${shivajiDivision?.population2021}`);
  }
  console.log(`✅ Test 2 PASSED: Point-in-polygon lookup correctly identified Shivajinagar-Ghole Road Zone with provenance classification DERIVED_PMC_ADMINISTRATIVE_ZONES.`);

  // Test 3: Division Aggregation metrics
  const candidates = await CandidateService.generateCandidates({ includeExcluded: true });
  const aggregations = WardService.aggregateSitesByDivision(candidates);

  if (aggregations.length !== 6) {
    throw new Error(`FAILED Test 3: Expected aggregation for 6 divisions, got ${aggregations.length}`);
  }

  const shivajiAgg = aggregations.find((a) => a.divisionName.includes('Shivajinagar'));
  if (!shivajiAgg) {
    throw new Error('FAILED Test 3: Shivajinagar aggregation summary missing');
  }

  if (shivajiAgg.metricClassification !== 'AGGREGATE_MODEL_OUTPUT') {
    throw new Error(`FAILED Test 3: Metric classification must be AGGREGATE_MODEL_OUTPUT, got ${shivajiAgg.metricClassification}`);
  }
  if (shivajiAgg.revenueStatus !== 'NOT_MODELED') {
    throw new Error(`FAILED Test 3: Revenue status must be NOT_MODELED, got ${shivajiAgg.revenueStatus}`);
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
