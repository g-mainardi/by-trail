import type { Request, Response } from 'express';
import { Proposal } from '../models/models.js';

interface ProposalRequest extends Request {
  body: {
    senderEmail: string;
    type: string;
    subjectName: string;
    description: string;
    locality: string;
  };
}

// POST /api/proposal
export const sendProposal = async (req: ProposalRequest, res: Response) => {
  try {
    const { senderEmail, type, subjectName, description, locality } = req.body;

    if (!senderEmail) {
      return res.status(401).json({
        message: 'Unauthorized: Authentication required (missing email)',
      });
    }

    if (!type || !subjectName || !description || !locality) {
      return res
        .status(400)
        .json({ message: 'Please fill in all required fields' });
    }

    const existingProposal = await Proposal.findOne({
      senderEmail,
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
      senderEmail,
      type,
      subjectName,
      description,
      locality,
    });

    await newProposal.save();
    res.status(201).json({ message: 'Proposal registered successfully!' });
  } catch (error) {
    console.error('Proposal Sending Error:', error);
    res.status(500).json({ message: 'Server error during Proposal Sending' });
  }
};
