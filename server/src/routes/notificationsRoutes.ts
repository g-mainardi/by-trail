import express, { Response } from 'express';
import {
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
} from '../controllers/notificationsController.js';
import { protect } from '../middleware/authMiddleware.js';
import { sendNotification } from '../utils/notificationHelper.js';
import { AuthRequest } from '../types/server_only.js';
import { Reservation } from '../models/models.js';
import { getForecast } from 'src/utils/weatherHelper.js';

const router = express.Router();

router.use(protect);

router.post('/test-weather-now', async (req, res) => {
  try {
    console.log('🧪 Manual Test Triggered');
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 1);

    const startOfDay = new Date(
      Date.UTC(
        targetDate.getUTCFullYear(),
        targetDate.getUTCMonth(),
        targetDate.getUTCDate(),
        0,
        0,
        0
      )
    );
    const endOfDay = new Date(
      Date.UTC(
        targetDate.getUTCFullYear(),
        targetDate.getUTCMonth(),
        targetDate.getUTCDate(),
        23,
        59,
        59
      )
    );

    const reservations = await Reservation.find({
      reservationDate: { $gte: startOfDay, $lte: endOfDay },
    }).populate('bivouac');

    console.log(`Found ${reservations.length} reservations`);

    for (const r of reservations) {
      const biv = r.bivouac as any;

      if (!biv || !biv.coords) {
        console.warn(
          `Skipping reservation ${r._id}: Bivouac not found or invalid.`
        );
        continue;
      }

      const lat = biv.coords.latitude;
      const lng = biv.coords.longitude;

      const weather = await getForecast(lat, lng, targetDate);

      if (weather) {
        const message = `Forecast: ${weather.description}, Min Temp: ${weather.minTemp}°C, Max Temp: ${weather.maxTemp}°C.\n
                    Precipitation: ${weather.precipitationSum}mm over ${weather.precipitationHours} hours. Max Wind Speed: ${weather.maxWindSpeed} km/h.\n
                    Sunrise: ${new Date(weather.sunrise).toLocaleTimeString()}, Sunset: ${new Date(weather?.sunset).toLocaleTimeString()}.`;

        await sendNotification(
          r.user.toString(),
          'weather_alert',
          'info',
          'Test Weather Notification',
          message,
          { weatherData: weather }
        );
        console.log('✅ Notification sent!');
      } else {
        console.log('❌ Failed to fetch weather');
      }
    }

    res.json({ message: 'Test run complete', found: reservations.length });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.post(
  '/test-realtime-reservation',
  async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user?.id!;

    await sendNotification(
      userId,
      'bivouac_reservation',
      'success',
      'Real-time Test!',
      'You have confirmed your intention to stay overnight at the [BIVOUAC_NAME] on [DATE], reserving [NUMBER_OF_BEDS] places.'
    );

    res.json({ message: 'Test notification sent successfully.' });
  }
);
router.get('/', fetchNotifications);
router.patch('/:id/read', markNotificationRead);
router.patch('/read-all', markAllNotificationsRead);
router.delete('/:id', deleteNotification);

export default router;
