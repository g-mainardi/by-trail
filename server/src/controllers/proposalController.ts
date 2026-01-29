import type { Response } from 'express';
import { ProposalModel as Proposal } from '../models/Proposal.js';
import type { ProposalRequest } from '../types/server_only.js';

// POST /api/proposal
export const sendProposal = async (req: ProposalRequest, res: Response) => {
  try {
    const sender = req.user?._id!;
    const { type, subjectName, description, region, locality } = req.body;

    if (!type || !subjectName || !description || !region || !locality) {
      return res
        .status(400)
        .json({ message: 'Please fill in all required fields' });
    }

    const existingProposal = await Proposal.findOne({
      sender,
      type,
      subjectName,
      locality,
    });
    if (existingProposal) {
      return res.status(400).json({
        message: `You have already submitted a ${type} proposal with subject '${subjectName}' in '${locality}'`,
      });
    }

    const newProposal = new Proposal({
      sender,
      type,
      subjectName,
      description,
      region,
      locality,
    });

    await newProposal.save();
    res.status(201).json({ message: 'Proposal registered successfully!' });
  } catch (error) {
    console.error('Proposal Sending Error:', error);
    res.status(500).json({ message: 'Server error during Proposal Sending' });
  }
};
