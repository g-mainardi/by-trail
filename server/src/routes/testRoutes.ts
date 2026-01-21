import express, { Response } from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { sendNotification } from '../utils/notificationHelper.js';
import { AuthRequest } from '../types/server_only.js';
import { Intention } from '../models/models.js';
import { getForecast } from '../utils/weatherHelper.js';

const router = express.Router();

router.use(protect);

router.post('/realtime-weather', async (req, res) => {
  // Remember to change the path
  try {
    console.log('Manual Test Triggered');
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

    const intentions = await Intention.find({
      intentionDate: { $gte: startOfDay, $lte: endOfDay },
    }).populate('bivouac');

    console.log(`Found ${intentions.length} intentions`);

    for (const r of intentions) {
      const biv = r.bivouac as any;

      if (!biv || !biv.coords) {
        console.warn(
          `Skipping intention ${r._id}: Bivouac not found or invalid.`
        );
        continue;
      }

      const lat = biv.coords.latitude;
      const lng = biv.coords.longitude;

      const weather = await getForecast(lat, lng, targetDate);

      if (weather) {
        const message = `Forecast for ${biv.name} on ${r.intentionDate}: ${weather.description}, Min Temp: ${weather.minTemp}°C, Max Temp: ${weather.maxTemp}°C.\n
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
        console.log('Notification sent!');
      } else {
        console.log('Failed to fetch weather');
      }
    }

    res.json({ message: 'Test run complete', found: intentions.length });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.post(
  '/realtime-intention',
  async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user?.id!;

    await sendNotification(
      userId,
      'bivouac_intention',
      'success',
      'Real-time Test!',
      'You have confirmed your intention to stay overnight at the [BIVOUAC_NAME] on [DATE], reserving [NUMBER_OF_BEDS] places.'
    );

    res.json({ message: 'Test notification sent successfully.' });
  }
);

export default router;
