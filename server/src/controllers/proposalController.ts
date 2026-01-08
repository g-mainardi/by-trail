import type { Request, Response } from 'express';
import { Proposal } from '../models/models.ts';

interface ProposalRequest extends Request {
  body: {
    email: string;
    type: string;
    name: string;
    description: string;
    locality: string;
  };
}

// POST /api/users/proposal
// Handle proposal submission
export const sendProposal = async (req: ProposalRequest, res: Response) => {
  try {
    const { email, type, name, description, locality } = req.body;

    // Basic Validation
    if (!email || !type || !name || !description || !locality) {
      return res
        .status(400)
        .json({ message: 'Please fill in all required fields' });
    }

    // Check if the proposal already exists
    const existingProposal = await Proposal.findOne({ email, type, name });
    if (existingProposal) {
      return res.status(400).json({
        message:
          'You have already submitted a proposal of this type with this name',
      });
    }

    // Create new proposal with specific schema fields
    const newProposal = new Proposal({
      email,
      type,
      name,
      description,
      locality,
    });

    // Save to database
    const savedProposal = await newProposal.save();
    if (!savedProposal) {
      return res
        .status(500)
        .json({ message: 'Error saving proposal to database' });
    }
    res.status(201).json({ message: 'Proposal registered successfully!' });
  } catch (error) {
    console.error('Proposal Sending Error:', error);
    res.status(500).json({ message: 'Server error during Proposal Sending' });
  }
};
