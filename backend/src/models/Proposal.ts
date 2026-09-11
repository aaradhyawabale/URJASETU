import mongoose, { Schema, Document } from 'mongoose';
import { IProposal } from '../seed/seedData.js';

export interface IProposalDocument extends Omit<IProposal, 'id'>, Document {
  id: string;
  plotGeometry?: Record<string, any>;
}

const ProposalSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    siteId: { type: String, required: true },
    siteCode: { type: String, required: true },
    cityName: { type: String, required: true },
    opportunityScore: { type: Number, required: true },
    estimatedAreaSqm: { type: Number, required: true },
    infrastructureType: { type: String, required: true },
    status: {
      type: String,
      enum: ['DRAFT', 'READY_FOR_REVIEW', 'APPROVED', 'ARCHIVED'],
      default: 'DRAFT',
    },
    createdAt: { type: String, required: true },
    updatedAt: { type: String, required: true },
    aiSummary: { type: String, default: '' },
    author: { type: String, default: 'ULB Planning Cell' },
    plotGeometry: { type: Schema.Types.Mixed },
  },
  {
    timestamps: true,
  }
);

export const ProposalModel = mongoose.model<IProposalDocument>('Proposal', ProposalSchema);
