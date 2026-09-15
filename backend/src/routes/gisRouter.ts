import { Router } from 'express';
import { getOsmLayer, getOsmMetadata, getSpatialIndicators } from '../controllers/gisController.js';

export const gisRouter = Router();

gisRouter.get('/gis/osm/metadata', getOsmMetadata);
gisRouter.get('/gis/osm/:layer', getOsmLayer);
gisRouter.post('/gis/indicators', getSpatialIndicators);
