import { Router } from 'express';
import {
  getOsmLayer,
  getOsmMetadata,
  getSpatialIndicators,
  getSolarClimatology,
  getElevationAnalysis,
} from '../controllers/gisController.js';
import {
  getCandidates,
  getCandidateById,
  generateCandidates,
} from '../controllers/candidateController.js';

export const gisRouter = Router();

gisRouter.get('/gis/osm/metadata', getOsmMetadata);
gisRouter.get('/gis/osm/:layer', getOsmLayer);
gisRouter.get('/gis/solar/climatology', getSolarClimatology);
gisRouter.get('/gis/elevation', getElevationAnalysis);
gisRouter.post('/gis/indicators', getSpatialIndicators);

// Candidate Sites & Suitability Engine Routes
gisRouter.get('/gis/candidates', getCandidates);
gisRouter.get('/gis/candidates/:candidateId', getCandidateById);
gisRouter.post('/gis/candidates/generate', generateCandidates);

