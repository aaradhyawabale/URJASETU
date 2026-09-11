import { Request, Response } from 'express';
import { ProposalService } from '../services/proposalService.js';

export const getAllProposals = (_req: Request, res: Response) => {
  const proposals = ProposalService.getAllProposals();
  res.status(200).json({
    success: true,
    count: proposals.length,
    data: proposals,
  });
};

export const getProposalById = (req: Request, res: Response) => {
  const { id } = req.params;
  const proposal = ProposalService.getProposalById(id);

  if (!proposal) {
    return res.status(404).json({
      success: false,
      error: { code: 'PROPOSAL_NOT_FOUND', message: `Proposal '${id}' not found.` },
    });
  }

  return res.status(200).json({
    success: true,
    data: proposal,
  });
};

export const createProposal = (req: Request, res: Response) => {
  const newProposal = ProposalService.createProposal(req.body);
  res.status(201).json({
    success: true,
    data: newProposal,
  });
};

export const updateProposal = (req: Request, res: Response) => {
  const { id } = req.params;
  const updated = ProposalService.updateProposal(id, req.body);

  if (!updated) {
    return res.status(404).json({
      success: false,
      error: { code: 'PROPOSAL_NOT_FOUND', message: `Proposal '${id}' not found.` },
    });
  }

  return res.status(200).json({
    success: true,
    data: updated,
  });
};

export const deleteProposal = (req: Request, res: Response) => {
  const { id } = req.params;
  const deleted = ProposalService.deleteProposal(id);

  if (!deleted) {
    return res.status(404).json({
      success: false,
      error: { code: 'PROPOSAL_NOT_FOUND', message: `Proposal '${id}' not found.` },
    });
  }

  return res.status(200).json({
    success: true,
    message: `Proposal '${id}' deleted successfully.`,
  });
};
