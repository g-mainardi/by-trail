import type { Response } from 'express';
import mongoose from 'mongoose';
import { Reservation } from 'src/models/models.js';
import type { AuthRequest } from './userController.ts';

export const createIntention = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const { bivouacId, date, people } = req.body;
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized: User ID missing' });
  }
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: 'Invalid user ID format' });
  }

  try {
    const existingReservation = await Reservation.findOne({
      user: userId,
      bivouac: bivouacId,
      reservationDate: new Date(date),
    }).exec();
    if (existingReservation) {
      // update entry
      try {
        await Reservation.updateMany(
          { _id: existingReservation._id },
          { $set: { reservedPlaces: people } }
        ).exec();
      } catch (updateError) {
        console.error('Error updating intention:', updateError);
        return res.status(500).json({ error: 'Internal server error' });
      }
      console.log('Intention already exists, updated reserved places.');
      return res.status(200).json({ message: 'Intention updated' });
    } else {
      const newReservation = new Reservation({
        user: userId,
        bivouac: bivouacId,
        reservedPlaces: people,
        reservationDate: new Date(date),
      });
      await newReservation.save();

      return res.status(201).json({ message: 'Intention created' });
    }
  } catch (error) {
    console.error('Error creating intention:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteIntentions = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const { bivouacId, date, people } = req.body;
  console.log(
    `User ${userId} cancels intention to book bivouac ${bivouacId} on ${date} for ${people} people.`
  );
  res.status(200).json({ message: 'Intention deleted' });
};

export const fetchUserBivouacIntentions = async (
  req: AuthRequest,
  res: Response
) => {
  const userId = req.user?.id;
  const { bivouacId } = req.params;
  console.log(bivouacId);
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized: User ID missing' });
  }
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: 'Invalid user ID format' });
  }

  if (bivouacId) {
    if (!mongoose.Types.ObjectId.isValid(bivouacId)) {
      return res.status(400).json({ error: 'Invalid bivouac ID format' });
    }
    // Fetch intentions for the specific bivouac
    try {
      const intentions = await Reservation.find({
        user: userId,
        bivouac: bivouacId,
      });
      return res.status(200).json({ intentions: intentions });
    } catch (error) {
      console.error('Error fetching intentions:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    // Fetch all intentions created by the user
    try {
      const intentions = await Reservation.find({ user: userId });
      return res.status(200).json({ intentions: intentions });
    } catch (error) {
      console.error('Error fetching intentions:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
};

export const fetchBivouacIntentions = async (
  req: AuthRequest,
  res: Response
) => {};
