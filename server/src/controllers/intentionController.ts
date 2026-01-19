import type { Response } from 'express';
import mongoose from 'mongoose';
import { Bivouac, Reservation } from 'src/models/models.js';
import { AuthRequest } from 'src/types/server_only.js';
import { sendNotification } from 'src/utils/notificationHelper.js';

const formatDateForDisplay = (dateInput: Date | string): string => {
  const dateObj = new Date(dateInput);

  return dateObj.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
};

const notifyPeers = async (
  bivouacId: string,
  date: Date | string,
  currentUserId: string,
  people: number,
  bivouacName: string
) => {
  try {
    const targetDate = new Date(date);

    // We use Date.UTC to ensure we are building a timestamp based on the date components, independent of server timezone
    const startOfDay = new Date(
      Date.UTC(
        targetDate.getUTCFullYear(),
        targetDate.getUTCMonth(),
        targetDate.getUTCDate(),
        0,
        0,
        0,
        0
      )
    );

    const endOfDay = new Date(
      Date.UTC(
        targetDate.getFullYear(),
        targetDate.getMonth(),
        targetDate.getUTCDate(),
        23,
        59,
        59,
        999
      )
    );

    console.log(
      `[NotifyPeers] Searching between: ${startOfDay.toISOString()} and ${endOfDay.toISOString()}`
    );

    const peers = await Reservation.find({
      bivouac: bivouacId,
      reservationDate: { $gte: startOfDay, $lte: endOfDay },
      user: { $ne: currentUserId },
    }).select('user');

    if (peers.length === 0) return;

    const formattedDate = formatDateForDisplay(date);

    const notificationPromises = peers.map((peerId) => {
      return sendNotification(
        peerId.user.toString(),
        'bivouac_reservation_users',
        'info',
        'New Hikers Arriving',
        `Someone else just planned to sleep at ${bivouacName} on ${formattedDate} with ${people} people.`
      );
    });

    await Promise.all(notificationPromises);
    console.log(`Notified ${peers.length} peers.`);
  } catch (error) {
    console.error('Error in notifyPeers:', error);
  }
};

export const createIntention = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const { bivouacId, date, people } = req.body;
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: 'Invalid user ID format' });
  }

  const formattedDate = formatDateForDisplay(date);

  try {
    const targetBivouac = await Bivouac.findById(bivouacId);
    const bivouacName = targetBivouac ? targetBivouac.name : 'the bivouac';

    const existingReservation = await Reservation.findOne({
      user: userId,
      bivouac: bivouacId,
      reservationDate: new Date(date),
    }).exec();

    if (existingReservation) {
      // --- UPDATE EXISTING RESERVATION ---
      try {
        await Reservation.findByIdAndUpdate(existingReservation._id, {
          $set: { reservedPlaces: people },
        }).exec();

        await sendNotification(
          userId,
          'bivouac_reservation_update',
          'success',
          'Bivouac Intention Updated',
          `Your intention for ${bivouacName} on ${formattedDate} has been updated for ${people}.`
        );

        await notifyPeers(
          bivouacId,
          new Date(date),
          userId,
          people,
          bivouacName!
        );
      } catch (updateError) {
        console.error('Error updating intention:', updateError);
        return res.status(500).json({ error: 'Internal server error' });
      }
      console.log('Intention already exists, updated reserved places.');
      return res.status(200).json({ message: 'Intention updated' });
    } else {
      // --- CREATE NEW RESERVATION ---
      await new Reservation({
        user: userId,
        bivouac: bivouacId,
        reservedPlaces: people,
        reservationDate: new Date(date),
      }).save();

      await sendNotification(
        userId,
        'bivouac_reservation',
        'success',
        'Bivouac Intention Created',
        `Your intention for ${bivouacName} on ${formattedDate} has been recorded for ${people}.`
      );

      await notifyPeers(
        bivouacId,
        new Date(date),
        userId,
        people,
        bivouacName!
      );

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
    return res.status(401).json({ error: 'Unauthorized' });
  }
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: 'Invalid user ID format' });
  }
  if (!mongoose.Types.ObjectId.isValid(intentionId)) {
    return res.status(400).json({ error: 'Invalid intention ID format' });
  }

  try {
    const reservationToDelete = await Reservation.findOne({
      _id: intentionId,
      user: userId,
    }).populate('bivouac', 'name'); // populate to get name for the message

    if (!reservationToDelete) {
      return res.status(404).json({ error: 'Intention not found' });
    }
    const bivName = (reservationToDelete.bivouac as any)?.name || 'the bivouac';
    const formattedDate = formatDateForDisplay(
      reservationToDelete.reservationDate
    );

    await Reservation.deleteOne({ _id: intentionId }).exec();

    await sendNotification(
      userId,
      'bivouac_reservation_delete',
      'alert',
      'Bivouac Intention Cancelled',
      `Your intention for ${bivName} on ${formattedDate} has been cancelled.`
    );
  } catch (error) {
    console.error('Error deleting intention:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }

  return res.status(200).json({ message: 'Intention deleted' });
};

export const fetchUserIntentions = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: 'Invalid user ID format' });
  }

  try {
    const intentions = await Reservation.find({ user: userId })
      .sort({ reservationDate: 1 })
      .exec();
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
