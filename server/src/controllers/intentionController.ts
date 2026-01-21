import type { Response } from 'express';
import mongoose from 'mongoose';
import { Bivouac, Intention } from 'src/models/models.js';
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
  ); // Wed Dec 31 2025 00:00:00 GMT+0000 (Coordinated Universal Time)

  const endOfDay = new Date(
    Date.UTC(
      targetDate.getUTCFullYear(),
      targetDate.getUTCMonth(),
      targetDate.getUTCDate(),
      23,
      59,
      59,
      999
    )
  ); // Wed Dec 31 2025 23:59:59 GMT+0000 (Coordinated Universal Time)

  const peers = await Intention.find({
    bivouac: bivouacId,
    intentionDate: { $gte: startOfDay, $lte: endOfDay },
    user: { $ne: currentUserId },
  }).select('user');

  if (peers.length === 0) return;

  const formattedDate = formatDateForDisplay(date);

  const notificationPromises = peers.map((peerId) => {
    return sendNotification(
      peerId.user.toString(),
      'bivouac_intention_users',
      'info',
      'New Hikers Arriving',
      `Someone else just planned to sleep at ${bivouacName} on ${formattedDate} with ${people} people.`
    );
  });

  await Promise.all(notificationPromises);
  console.log(`Notified ${peers.length} peers.`);
};

export const createIntention = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id!;
  const { bivouacId, date, people } = req.body; // date: YYYY-MM-DD
  if (!bivouacId || !mongoose.Types.ObjectId.isValid(bivouacId)) {
    return res.status(400).json({ error: 'Invalid bivouac ID format' });
  }

  const formattedDate = formatDateForDisplay(date); // DD January YYYY

  try {
    const targetBivouac = await Bivouac.findById(bivouacId);
    const bivouacName: string = targetBivouac?.name || 'the bivouac';

    const existingIntention = await Intention.findOne({
      user: userId,
      bivouac: bivouacId,
      intentionDate: new Date(date),
    }).exec();

    if (existingIntention) {
      // --- UPDATE EXISTING RESERVATION ---
      await Intention.findByIdAndUpdate(existingIntention._id, {
        $set: { reservedPlaces: people },
      }).exec();

      try {
        await sendNotification(
          userId,
          'bivouac_intention_update',
          'success',
          'Bivouac Intention Updated',
          `Your intention for ${bivouacName} on ${formattedDate} has been updated for ${people}.`
        );

        await notifyPeers(
          bivouacId,
          new Date(date),
          userId,
          people,
          bivouacName
        );
      } catch (notifyError) {
        console.error(
          'Intention updated, but peer notifications failed:',
          notifyError
        );
      }
      console.log('Intention already exists, updated reserved places.');
      return res.status(200).json({ message: 'Intention updated' });
    } else {
      // --- CREATE NEW RESERVATION ---
      await new Intention({
        user: userId,
        bivouac: bivouacId,
        reservedPlaces: people,
        intentionDate: new Date(date),
      }).save();

      try {
        await sendNotification(
          userId,
          'bivouac_intention',
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
      } catch (notifyError) {
        console.error(
          'Intention created, but peer notifications failed:',
          notifyError
        );
      }

      return res.status(201).json({ message: 'Intention created' });
    }
  } catch (error) {
    console.error('Error creating intention:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteIntention = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id!;
  const { intentionId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(intentionId)) {
    return res.status(400).json({ error: 'Invalid intention ID format' });
  }

  try {
    const intentionToDelete = await Intention.findOne({
      _id: intentionId,
      user: userId,
    }).populate('bivouac', 'name'); // populate to get name for the message

    if (!intentionToDelete) {
      return res.status(404).json({ error: 'Intention not found' });
    }

    const populatedBivouac = intentionToDelete.bivouac as unknown as {
      name: string;
    } | null;
    const bivName = populatedBivouac?.name || 'the bivouac';

    const formattedDate = formatDateForDisplay(intentionToDelete.intentionDate);

    await Intention.deleteOne({ _id: intentionId }).exec();

    try {
      await sendNotification(
        userId,
        'bivouac_intention_delete',
        'alert',
        'Bivouac Intention Cancelled',
        `Your intention for ${bivName} on ${formattedDate} has been cancelled.`
      );
    } catch (notifyError) {
      console.error(
        'Intention deleted, but cancellation notification failed:',
        notifyError
      );
    }

    return res.status(204).json();
  } catch (error) {
    console.error('Error deleting intention:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const fetchUserIntentions = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id!;

  try {
    const intentions = await Intention.find({ user: userId })
      .sort({ intentionDate: 1 })
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
  const { id } = req.params;
  console.log(
    `[FetchAnonymousBivouacIntentions] Received request for bivouacId: ${id}`
  );
  if (!id || !mongoose.Types.ObjectId.isValid(id as string)) {
    return res.status(400).json({ error: 'Invalid bivouacId' });
  }

  try {
    const intentions = await Intention.find({
      bivouac: id,
    });

    return res.status(200).json({
      intentions: intentions.map((i) => ({
        date: i.intentionDate,
        people: i.reservedPlaces,
      })),
    });
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};
