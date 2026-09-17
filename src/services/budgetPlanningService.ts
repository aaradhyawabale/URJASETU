export interface IBudgetScenario {
  id: string;
  name: string;
  description: string;
  budgetLimitInr: number;
  totalEstimatedCapexInr: number;
  remainingBudgetInr: number;
  infrastructureItems: {
    type: string;
    name: string;
    quantity: number;
    unitCostInr: number;
    subtotalInr: number;
  }[];
  provenance: {
    classification: 'PRELIMINARY_PLANNING_BUDGET_ESTIMATE';
    disclaimer: string;
  };
}

/**
 * Generates budget-aware infrastructure planning scenarios based on entered budget constraint (e.g. ₹20 Lakhs).
 */
export function generateBudgetScenarios(
  budgetInr: number = 2000000,
  plotAreaSqm: number = 2450
): IBudgetScenario[] {
  const safeBudget = Math.max(500000, budgetInr);

  // Scenario 1: EV & Solar Focus
  const solarKwp = 24;
  const evPorts = 2;
  const solarCost = solarKwp * 45000;
  const evCost = evPorts * 800000;
  const totalScen1 = solarCost + evCost;

  const scenario1: IBudgetScenario = {
    id: 'scen-budget-01',
    name: 'Scenario A: Solar & Fast EV Charging Core',
    description: 'Prioritizes dual DC fast chargers co-located with a 24 kWp solar carport canopy.',
    budgetLimitInr: safeBudget,
    totalEstimatedCapexInr: totalScen1,
    remainingBudgetInr: safeBudget - totalScen1,
    infrastructureItems: [
      { type: 'SOLAR_CANOPY', name: '24 kWp Solar Canopy', quantity: 1, unitCostInr: 45000 * 24, subtotalInr: solarCost },
      { type: 'EV_CHARGER', name: '120kW Dual DC Fast Charger', quantity: 1, unitCostInr: 800000, subtotalInr: evCost },
    ],
    provenance: {
      classification: 'PRELIMINARY_PLANNING_BUDGET_ESTIMATE',
      disclaimer: 'Preliminary planning estimate based on ₹45k/kWp solar and ₹800k/EV charger. Excludes DISCOM grid feeder upgrade fees.',
    },
  };

  // Scenario 2: Public Hygiene & EV Micro-Hub
  const evPorts2 = 2;
  const toiletCost = 350000;
  const greenParkCost = 150000;
  const totalScen2 = (evPorts2 * 800000) + toiletCost + greenParkCost;

  const scenario2: IBudgetScenario = {
    id: 'scen-budget-02',
    name: 'Scenario B: Civic Mobility & Hygiene Kiosk',
    description: 'Combines dual EV charger bay with a municipal public hygiene kiosk and green tree belt.',
    budgetLimitInr: safeBudget,
    totalEstimatedCapexInr: totalScen2,
    remainingBudgetInr: safeBudget - totalScen2,
    infrastructureItems: [
      { type: 'EV_CHARGER', name: '120kW Dual DC Fast Charger', quantity: 1, unitCostInr: 800000, subtotalInr: evPorts2 * 800000 },
      { type: 'PUBLIC_TOILET', name: 'Municipal Hygiene Kiosk', quantity: 1, unitCostInr: 350000, subtotalInr: toiletCost },
      { type: 'GREEN_PARK', name: 'Urban Tree Belt & Park Base', quantity: 1, unitCostInr: 150000, subtotalInr: greenParkCost },
    ],
    provenance: {
      classification: 'PRELIMINARY_PLANNING_BUDGET_ESTIMATE',
      disclaimer: 'Preliminary planning estimate. Statutory municipal tender and civil work estimates required.',
    },
  };

  return [scenario1, scenario2];
}
