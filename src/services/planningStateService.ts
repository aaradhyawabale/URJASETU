import { CandidateSite, IPlacedComponent, PlanningDesign } from '../types/site';

const MEMORY_STORE: Record<string, PlanningDesign> = {};

export const DEFAULT_COMPONENTS: IPlacedComponent[] = [
  {
    id: 'comp-solar-01',
    type: 'SOLAR_CANOPY',
    name: 'Solar Carport Array A',
    xMeters: -10,
    yMeters: 6,
    widthMeters: 15,
    lengthMeters: 8,
    rotationDegrees: 0,
    specs: { capacityKwp: 24, moduleCount: 60 },
  },
  {
    id: 'comp-ev-01',
    type: 'EV_CHARGER',
    name: 'DC Fast Charger Bay 1',
    xMeters: 10,
    yMeters: -6,
    widthMeters: 4,
    lengthMeters: 2,
    rotationDegrees: 0,
    specs: { ports: 2, powerKw: 120 },
  },
  {
    id: 'comp-bess-01',
    type: 'BESS_CONTAINER',
    name: 'BESS Storage Unit 1',
    xMeters: 12,
    yMeters: 8,
    widthMeters: 6,
    lengthMeters: 2.5,
    rotationDegrees: 0,
    specs: { capacityKwh: 250 },
  },
  {
    id: 'comp-trans-01',
    type: 'TRANSFORMER',
    name: 'Interconnect Kiosk',
    xMeters: -12,
    yMeters: -8,
    widthMeters: 3,
    lengthMeters: 3,
    rotationDegrees: 0,
    specs: { ratingKva: 500 },
  },
];

export function getPlanningDesign(
  siteId: string,
  site?: CandidateSite | null,
  initialAcquiredArea?: number | null
): PlanningDesign {
  if (MEMORY_STORE[siteId]) {
    return MEMORY_STORE[siteId];
  }

  try {
    const raw = localStorage.getItem(`urjasetu_design_${siteId}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.siteId === siteId) {
        MEMORY_STORE[siteId] = parsed;
        return parsed;
      }
    }
  } catch (err) {
    console.warn('[PlanningStateService] localStorage read error:', err);
  }

  const newDesign: PlanningDesign = {
    siteId,
    plotGeometry: null,
    plotAreaSqm: initialAcquiredArea || site?.areaSqm || 2450,
    infrastructureType: 'SOLAR_EV_CHARGING_HUB',
    components: [...DEFAULT_COMPONENTS],
    provenance: {
      plotGeometry: 'DERIVED_CANDIDATE_PLOT_GEOMETRY',
      components: 'CANONICAL_PLANNING_STATE',
    },
    updatedAt: new Date().toISOString(),
  };

  savePlanningDesign(newDesign);
  return newDesign;
}

export function savePlanningDesign(design: PlanningDesign): void {
  const updated = {
    ...design,
    updatedAt: new Date().toISOString(),
  };
  MEMORY_STORE[design.siteId] = updated;

  try {
    localStorage.setItem(`urjasetu_design_${design.siteId}`, JSON.stringify(updated));
  } catch (err) {
    console.warn('[PlanningStateService] localStorage write error:', err);
  }
}

export function clearPlanningDesign(siteId: string): void {
  delete MEMORY_STORE[siteId];
  try {
    localStorage.removeItem(`urjasetu_design_${siteId}`);
  } catch (err) {
    console.warn('[PlanningStateService] localStorage remove error:', err);
  }
}
