import { GridService } from '../services/gridService.js';

async function runGridServiceTests() {
  console.log('--- Starting GridService & MSEDCL Feeder Proximity Unit Tests ---');

  // Test 1: GeoJSON dataset loading
  const geojson = GridService.getMsedclGridGeoJson();
  if (!geojson || !geojson.features) {
    throw new Error('FAILED Test 1: Failed to load nashik_msedcl_grid.geojson');
  }
  if (geojson.features.length !== 12) {
    throw new Error(`FAILED Test 1: Expected 12 features (6 substations + 6 feeders), got ${geojson.features.length}`);
  }
  console.log(`✅ Test 1 PASSED: Loaded MSEDCL GeoJSON with ${geojson.features.length} grid infrastructure features.`);

  // Test 2: Grid proximity calculation for Satpur coordinate (19.97°N, 73.74°E)
  const satpurGrid = GridService.evaluateGridProximity(19.97, 73.74);
  if (!satpurGrid.nearestSubstationName.includes('Satpur')) {
    throw new Error(`FAILED Test 2: Expected Satpur substation, got ${satpurGrid.nearestSubstationName}`);
  }
  if (satpurGrid.classification !== 'DERIVED_GRID_INFRASTRUCTURE_PROXY') {
    throw new Error(`FAILED Test 2: Classification must be DERIVED_GRID_INFRASTRUCTURE_PROXY, got ${satpurGrid.classification}`);
  }
  if (satpurGrid.capacityStatus !== 'ESTIMATED_FEEDER_HOSTING_CAPACITY_PROXY') {
    throw new Error(`FAILED Test 2: Capacity status must be ESTIMATED_FEEDER_HOSTING_CAPACITY_PROXY, got ${satpurGrid.capacityStatus}`);
  }
  if (satpurGrid.gridInterconnectionCapexTier !== 'OPTIMAL_LOW_CAPEX') {
    throw new Error(`FAILED Test 2: Expected OPTIMAL_LOW_CAPEX for 0m feeder distance, got ${satpurGrid.gridInterconnectionCapexTier}`);
  }

  console.log('✅ Test 2 PASSED: Satpur grid evaluation correctly evaluated substation & 33kV feeder proximity:');
  console.log(`   - Nearest Substation: ${satpurGrid.nearestSubstationName} (${satpurGrid.nearestSubstationDistanceMeters}m)`);
  console.log(`   - Nearest Feeder: ${satpurGrid.nearestFeederLineName} (${satpurGrid.nearestFeederDistanceMeters}m)`);
  console.log(`   - Hosting Capacity Proxy: ${satpurGrid.estimatedFeederHostingCapacityMw} MW`);
  console.log(`   - Interconnection Capex Tier: ${satpurGrid.gridInterconnectionCapexTier}`);
  console.log(`   - Provenance Classification: ${satpurGrid.classification}`);

  console.log('\n✅ ALL GRID SERVICE UNIT TESTS PASSED CLEANLY!\n');
}

runGridServiceTests().catch((err) => {
  console.error('❌ GRID SERVICE TEST FAILED:', err);
  process.exit(1);
});
