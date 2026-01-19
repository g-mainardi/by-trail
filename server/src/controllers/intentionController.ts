import type { Response } from 'express';
import mongoose from 'mongoose';
import { Reservation } from 'src/models/models.js';
import { AuthRequest } from 'src/types/server_only.js';

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
      await new Reservation({
        user: userId,
        bivouac: bivouacId,
        reservedPlaces: people,
        reservationDate: new Date(date),
      }).save();
      return res.status(201).json({ message: 'Intention created' });
    }
  } catch (error) {
    console.error('Error creating intention:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteIntention = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const { intentionId } = req.body;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized: User ID missing' });
  }
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: 'Invalid user ID format' });
  }
  if (!mongoose.Types.ObjectId.isValid(intentionId)) {
    return res.status(400).json({ error: 'Invalid intention ID format' });
  }

  try {
    const res = await Reservation.findOne({
      _id: intentionId,
    }).exec();

    await Reservation.deleteMany({
      _id: intentionId,
    }).exec();
  } catch (error) {
    console.error('Error deleting intention:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }

  return res.status(200).json({ message: 'Intention deleted' });
};

export const fetchUserIntentions = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized: User ID missing' });
  }
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: 'Invalid user ID format' });
  }

  try {
    const intentions = await Reservation.find({ user: userId }).exec();
    return res.status(200).json({ intentions });
  } catch (error) {
    console.error('Error fetching intentions:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const fetchAnonymousBivouacIntentions = async (
  req: AuthRequest,
  res: Response
) => {
  const { bivouacId } = req.query;

  if (!bivouacId || !mongoose.Types.ObjectId.isValid(bivouacId as string)) {
    return res.status(400).json({ error: 'Invalid bivouacId' });
  }

  try {
    const intentions = await Reservation.find({
      bivouac: bivouacId,
    });

    return res.status(200).json({
      intentions: intentions.map((i) => ({
        date: i.reservationDate,
        people: i.reservedPlaces,
      })),
    });
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};
