import type { Response } from 'express';
import type { AuthRequest } from './userController.ts';

export const createIntention = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const { bivouacId, date, people } = req.body;
  console.log(
    `User ${userId} intends to book bivouac ${bivouacId} on ${date} for ${people} people.`
  );
  res.status(201).json({ message: 'Intention created' });
};

export const deleteIntentions = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const { bivouacId, date, people } = req.body;
  console.log(
    `User ${userId} cancels intention to book bivouac ${bivouacId} on ${date} for ${people} people.`
  );
  res.status(200).json({ message: 'Intention deleted' });
};

export const fetchIntentions = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const { bivouacId } = req.body;
  if (bivouacId) {
    // Fetch intentions for a specific bivouac
  } else {
    // Fetch all intentions for the user
  }
  console.log(`User ${userId} intends to book bivouac ${bivouacId}.`);
  res.status(200).json({ intentions: [] });
};
