import { GridService } from '../services/gridService.js';

async function runGridServiceTests() {
  console.log('--- Starting GridService & MSEDCL Feeder Proximity Unit Tests ---');

  // Test 1: GeoJSON dataset loading
  const geojson = GridService.getMsedclGridGeoJson();
  if (!geojson || !geojson.features) {
    throw new Error('FAILED Test 1: Failed to load pune_msedcl_grid.geojson');
  }
  if (geojson.features.length !== 6) {
    throw new Error(`FAILED Test 1: Expected 6 features (6 substations), got ${geojson.features.length}`);
  }
  console.log(`✅ Test 1 PASSED: Loaded MSEDCL GeoJSON with ${geojson.features.length} grid infrastructure features.`);

  // Test 2: Grid proximity calculation for Shivajinagar coordinate (18.5285°N, 73.8520°E)
  const shivajiGrid = GridService.evaluateGridProximity(18.5285, 73.8520);
  if (!shivajiGrid.nearestSubstationName.includes('Shivajinagar')) {
    throw new Error(`FAILED Test 2: Expected Shivajinagar substation, got ${shivajiGrid.nearestSubstationName}`);
  }
  if (shivajiGrid.classification !== 'DERIVED_GRID_INFRASTRUCTURE_PROXY') {
    throw new Error(`FAILED Test 2: Classification must be DERIVED_GRID_INFRASTRUCTURE_PROXY, got ${shivajiGrid.classification}`);
  }
  if (shivajiGrid.capacityStatus !== 'ESTIMATED_FEEDER_HOSTING_CAPACITY_PROXY') {
    throw new Error(`FAILED Test 2: Capacity status must be ESTIMATED_FEEDER_HOSTING_CAPACITY_PROXY, got ${shivajiGrid.capacityStatus}`);
  }
  if (shivajiGrid.gridInterconnectionCapexTier !== 'OPTIMAL_LOW_CAPEX') {
    throw new Error(`FAILED Test 2: Expected OPTIMAL_LOW_CAPEX for 0m feeder distance, got ${shivajiGrid.gridInterconnectionCapexTier}`);
  }

  console.log('✅ Test 2 PASSED: Shivajinagar grid evaluation correctly evaluated substation & feeder proximity:');
  console.log(`   - Nearest Substation: ${shivajiGrid.nearestSubstationName} (${shivajiGrid.nearestSubstationDistanceMeters}m)`);
  console.log(`   - Nearest Feeder: ${shivajiGrid.nearestFeederLineName} (${shivajiGrid.nearestFeederDistanceMeters}m)`);
  console.log(`   - Hosting Capacity Proxy: ${shivajiGrid.estimatedFeederHostingCapacityMw} MW`);
  console.log(`   - Interconnection Capex Tier: ${shivajiGrid.gridInterconnectionCapexTier}`);
  console.log(`   - Provenance Classification: ${shivajiGrid.classification}`);

  console.log('\n✅ ALL GRID SERVICE UNIT TESTS PASSED CLEANLY!\n');
}

runGridServiceTests().catch((err) => {
  console.error('❌ GRID SERVICE TEST FAILED:', err);
  process.exit(1);
});
