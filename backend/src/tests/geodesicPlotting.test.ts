import * as turf from '@turf/turf';

// Helper functions for testing geodesic calculations
function calculatePolygonAreaSqm(coordinates: number[][][]): number {
  try {
    const poly = turf.polygon(coordinates);
    const area = turf.area(poly);
    return Math.round(area);
  } catch {
    return 0;
  }
}

function isValidPolygonRing(ring: number[][]): boolean {
  if (!ring || ring.length < 4) return false;
  const first = ring[0];
  const last = ring[ring.length - 1];
  return first[0] === last[0] && first[1] === last[1];
}

function calculatePlotCapacityMetrics(areaSqm: number, ghiKwhM2Day: number = 5.02) {
  const safeArea = Math.max(500, areaSqm);
  const usableCanopyAreaSqm = Math.round(safeArea * 0.60);
  const solarCapacityKwp = Math.round(usableCanopyAreaSqm * 0.20);
  const annualGenerationMwh = Number(((solarCapacityKwp * ghiKwhM2Day * 365 * 0.80) / 1000).toFixed(1));
  const evChargerPorts = Math.max(2, Math.min(32, Math.floor(safeArea / 250) * 2));
  const bessCapacityKwh = Math.round(solarCapacityKwp * 0.50);
  const estimatedCapexInr = (solarCapacityKwp * 45000) + (evChargerPorts * 800000) + (bessCapacityKwh * 18000);

  return {
    areaSqm: safeArea,
    usableCanopyAreaSqm,
    solarCapacityKwp,
    annualGenerationMwh,
    evChargerPorts,
    bessCapacityKwh,
    estimatedCapexInr,
  };
}

console.log('=== RUNNING URJASETU 2D GEODESIC PLOTTING TEST SUITE ===');

// Test 1: Standard ~50m x ~50m plot in Nashik (19.9975°N, 73.7898°E)
const stdSquareRing: number[][] = [
  [73.78956, 19.99772],
  [73.79004, 19.99772],
  [73.79004, 19.99728],
  [73.78956, 19.99728],
  [73.78956, 19.99772],
];

const stdArea = calculatePolygonAreaSqm([stdSquareRing]);
if (stdArea > 2000 && stdArea < 3000) {
  console.log(`✅ Test 1 PASSED: Standard plot geodesic area calculated as ${stdArea} m² (~2,450 m² target).`);
} else {
  console.error(`❌ Test 1 FAILED: Unexpected area ${stdArea} m²`);
  process.exit(1);
}

// Test 2: Tiny plot (~10m x ~10m = ~100 m²)
const tinySquareRing: number[][] = [
  [73.78975, 19.99755],
  [73.78985, 19.99755],
  [73.78985, 19.99745],
  [73.78975, 19.99745],
  [73.78975, 19.99755],
];
const tinyArea = calculatePolygonAreaSqm([tinySquareRing]);
if (tinyArea >= 80 && tinyArea <= 130) {
  console.log(`✅ Test 2 PASSED: Tiny plot geodesic area calculated as ${tinyArea} m².`);
} else {
  console.error(`❌ Test 2 FAILED: Unexpected tiny area ${tinyArea} m²`);
  process.exit(1);
}

// Test 3: Large plot (~200m x ~200m)
const largeSquareRing: number[][] = [
  [73.7889, 19.9984],
  [73.7907, 19.9984],
  [73.7907, 19.9966],
  [73.7889, 19.9966],
  [73.7889, 19.9984],
];
const largeArea = calculatePolygonAreaSqm([largeSquareRing]);
if (largeArea > 35000 && largeArea < 50000) {
  console.log(`✅ Test 3 PASSED: Large plot geodesic area calculated as ${largeArea} m².`);
} else {
  console.error(`❌ Test 3 FAILED: Unexpected large area ${largeArea} m²`);
  process.exit(1);
}

// Test 4: Invalid / Unclosed Geometry Validation
const unclosedRing: number[][] = [
  [73.78956, 19.99772],
  [73.79004, 19.99772],
  [73.79004, 19.99728],
];
const isValid = isValidPolygonRing(unclosedRing);
if (!isValid) {
  console.log('✅ Test 4 PASSED: Unclosed polygon ring correctly identified as invalid.');
} else {
  console.error('❌ Test 4 FAILED: Unclosed polygon ring passed validation.');
  process.exit(1);
}

// Test 5: Capacity Metrics recalculation from drawn area
const stdMetrics = calculatePlotCapacityMetrics(stdArea);
if (stdMetrics.solarCapacityKwp > 0 && stdMetrics.evChargerPorts >= 2 && stdMetrics.estimatedCapexInr > 0) {
  console.log(`✅ Test 5 PASSED: Plot capacity metrics successfully calculated from ${stdArea} m² area:`);
  console.log(`   - Solar Capacity: ${stdMetrics.solarCapacityKwp} kWp`);
  console.log(`   - Annual Generation: ${stdMetrics.annualGenerationMwh} MWh/yr`);
  console.log(`   - EV Fast Charger Ports: ${stdMetrics.evChargerPorts} Ports`);
  console.log(`   - Capex Estimate: ₹${(stdMetrics.estimatedCapexInr / 100000).toFixed(2)} Lakhs`);
} else {
  console.error('❌ Test 5 FAILED: Invalid capacity metrics computed.');
  process.exit(1);
}

console.log('\n================================================================');
console.log('🎉 ALL 2D GEODESIC PLOTTING TESTS PASSED CLEANLY!');
console.log('================================================================\n');
