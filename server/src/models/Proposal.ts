import mongoose, { Schema, Document } from 'mongoose';
import { Proposal, ProposalEnum, RegionsEnum } from '@by-trail/shared';

// Extend Shared Type: sender becomes ObjectId
export interface ProposalDocument extends Omit<Proposal, '_id'> {
  sender: mongoose.Types.ObjectId;
}

const proposalSchema = new Schema<ProposalDocument>({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: {
    type: String,
    enum: Object.values(ProposalEnum),
    required: true,
  },
  subjectName: { type: String, required: true },
  description: { type: String, required: true },
  region: { type: String, enum: Object.values(RegionsEnum), required: true },
  locality: { type: String, required: true },
  submissionDate: { type: Date, default: Date.now },
});

// Unique index to prevent duplicates
proposalSchema.index(
  { sender: 1, type: 1, subjectName: 1, region: 1, locality: 1 },
  { unique: true }
);

export const ProposalModel = mongoose.model<ProposalDocument>(
  'Proposal',
  proposalSchema
);
