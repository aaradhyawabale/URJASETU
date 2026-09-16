import { Router } from 'express';
import {
  getOsmLayer,
  getOsmMetadata,
  getSpatialIndicators,
  getSolarClimatology,
  getElevationAnalysis,
  getHydrologicalAnalysis,
  getMsedclGridAnalysis,
} from '../controllers/gisController.js';
import {
  getCandidates,
  getCandidateById,
  generateCandidates,
  getAdministrativeDivisions,
  getDivisionAggregation,
} from '../controllers/candidateController.js';

export const gisRouter = Router();

gisRouter.get('/gis/osm/metadata', getOsmMetadata);
gisRouter.get('/gis/osm/:layer', getOsmLayer);
gisRouter.get('/gis/solar/climatology', getSolarClimatology);
gisRouter.get('/gis/elevation', getElevationAnalysis);
gisRouter.get('/gis/hydrology', getHydrologicalAnalysis);
gisRouter.get('/gis/grid', getMsedclGridAnalysis);
gisRouter.get('/gis/wards', getAdministrativeDivisions);
gisRouter.get('/gis/wards/aggregation', getDivisionAggregation);
gisRouter.post('/gis/indicators', getSpatialIndicators);

// Candidate Sites & Suitability Engine Routes
gisRouter.get('/gis/candidates', getCandidates);
gisRouter.get('/gis/candidates/:candidateId', getCandidateById);
gisRouter.post('/gis/candidates/generate', generateCandidates);



