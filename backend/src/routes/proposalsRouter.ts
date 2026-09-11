import { Router } from 'express';
import {
  getAllProposals,
  getProposalById,
  createProposal,
  updateProposal,
  deleteProposal,
} from '../controllers/proposalsController.js';

export const proposalsRouter = Router();

proposalsRouter.get('/proposals', getAllProposals);
proposalsRouter.get('/proposals/:id', getProposalById);
proposalsRouter.post('/proposals', createProposal);
proposalsRouter.put('/proposals/:id', updateProposal);
proposalsRouter.delete('/proposals/:id', deleteProposal);
