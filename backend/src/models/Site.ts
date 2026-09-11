import mongoose, { Schema, Document } from 'mongoose';
import { ISite } from '../seed/seedData.js';

export interface ISiteDocument extends Omit<ISite, 'id'>, Document {
  id: string;
}

const SiteSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    cityName: { type: String, required: true },
    wardName: { type: String, required: true },
    zoneName: { type: String, required: true },
    opportunityScore: { type: Number, required: true },
    status: {
      type: String,
      enum: ['RECOMMENDED', 'UNDER_REVIEW', 'SCREENING', 'DISQUALIFIED'],
      required: true,
    },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    areaSqm: { type: Number, required: true },
    metrics: {
      solarSuitability: { type: Number, required: true },
      evDemandProxy: { type: Number, required: true },
      roadAccessibility: { type: Number, required: true },
      floodRisk: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'], required: true },
      landConflict: { type: String, enum: ['NONE', 'MINOR', 'HIGH'], required: true },
    },
    description: { type: String, default: '' },
    address: { type: String, default: '' },
    tags: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

SiteSchema.index({ opportunityScore: -1 });

export const SiteModel = mongoose.model<ISiteDocument>('Site', SiteSchema);
