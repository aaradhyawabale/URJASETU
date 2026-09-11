import { Request, Response } from 'express';
import { ProposalService } from '../services/proposalService.js';

export const getAllProposals = async (_req: Request, res: Response) => {
  const proposals = await ProposalService.getAllProposals();
  res.status(200).json({
    success: true,
    count: proposals.length,
    data: proposals,
  });
};

export const getProposalById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const proposal = await ProposalService.getProposalById(id);

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

export const createProposal = async (req: Request, res: Response) => {
  const newProposal = await ProposalService.createProposal(req.body);
  res.status(201).json({
    success: true,
    data: newProposal,
  });
};

export const updateProposal = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updated = await ProposalService.updateProposal(id, req.body);

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

export const deleteProposal = async (req: Request, res: Response) => {
  const { id } = req.params;
  const deleted = await ProposalService.deleteProposal(id);

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
