import mongoose, { Schema, Document } from 'mongoose';

export interface ITownDocument extends Document {
  name: string;
  state: string;
  country: string;
  centerLat: number;
  centerLon: number;
  bounds?: Record<string, any>;
  createdAt: Date;
}

const TownSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, default: 'India' },
    centerLat: { type: Number, required: true },
    centerLon: { type: Number, required: true },
    bounds: { type: Schema.Types.Mixed },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

TownSchema.index({ name: 1, state: 1 }, { unique: true });

export const TownModel = mongoose.model<ITownDocument>('Town', TownSchema);
